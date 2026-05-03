import { getDeviceId } from '../utils/deviceFingerprint';

function isPrivateNetworkHostname(hostname: string): boolean {
  if (!hostname) return false;
  if (['localhost', '127.0.0.1', '::1'].includes(hostname)) return true;
  if (/^10\./.test(hostname)) return true;
  if (/^192\.168\./.test(hostname)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) return true;
  return false;
}

function isCommonDevPort(port: string): boolean {
  return ['3000', '3900', '4173', '5173', '5174'].includes(port);
}

const PRODUCTION_BRIDGE_BASE = 'https://www.ungdungthongminh.shop/api/v1';

function normalizeApiBase(value?: string | null): string {
  return String(value || '').trim().replace(/\/+$/, '');
}

function isLikelyLocalBridgeBase(value?: string | null): boolean {
  const normalized = normalizeApiBase(value);
  if (!normalized) return false;

  try {
    const parsed = new URL(normalized);
    return isPrivateNetworkHostname(parsed.hostname) || isCommonDevPort(parsed.port) || parsed.port === '5000';
  } catch {
    return /localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\./i.test(normalized);
  }
}

function buildBackendApiBases(): string[] {
  const bases: string[] = [];
  const pushBase = (value?: string | null) => {
    const normalized = normalizeApiBase(value);
    if (normalized && !bases.includes(normalized)) {
      bases.push(normalized);
    }
  };

  const configuredBase = normalizeApiBase(import.meta.env.VITE_BACKEND_API_BASE);

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port, origin } = window.location;

    if (protocol === 'file:') {
      if (configuredBase && !isLikelyLocalBridgeBase(configuredBase)) {
        pushBase(configuredBase);
      }
      pushBase(PRODUCTION_BRIDGE_BASE);
      return bases;
    }

    if (configuredBase) {
      pushBase(configuredBase);
    }

    if (isPrivateNetworkHostname(hostname) || isCommonDevPort(port)) {
      const backendHost = hostname || 'localhost';
      pushBase(`http://${backendHost}:5000/api/v1`);
      pushBase(PRODUCTION_BRIDGE_BASE);
      return bases;
    }

    if (protocol === 'http:' || protocol === 'https:') {
      if (/ungdungthongminh\.shop$/i.test(hostname)) {
        pushBase(`${origin.replace(/\/+$/, '')}/api/v1`);
      }
      pushBase(PRODUCTION_BRIDGE_BASE);
      return bases;
    }
  }

  pushBase(configuredBase);
  pushBase(PRODUCTION_BRIDGE_BASE);
  return bases;
}

function resolveBackendApiBase() {
  return buildBackendApiBases()[0] || PRODUCTION_BRIDGE_BASE;
}

export const BACKEND_API_BASE = resolveBackendApiBase();
const BACKEND_API_BASE_CANDIDATES = buildBackendApiBases();
const INTERNAL_BUILD = import.meta.env.VITE_INTERNAL_BUILD === 'true';
const BRIDGE_TOKEN_KEY = 'hhk_web_total_bridge_token';
const BRIDGE_CUSTOMER_KEY = 'hhk_web_total_customer';
const PENDING_CHECKOUT_KEY = 'hhk_web_total_pending_checkout';
const LICENSE_KEY = 'hhk_license';
const PLAN_KEY = 'hhk_plan';
const SUB_EXPIRY_KEY = 'hhk_sub_expiry';
const SUB_BILLING_KEY = 'hhk_sub_billing_cycle';
const SUB_STATUS_KEY = 'hhk_sub_status';
const ACTIVATION_SOURCE_KEY = 'hhk_activation_source';
const PAID_LICENSE_PATTERN = /^HHK-(STANDARD|PREMIUM)-[A-Z0-9]{8}$/;

function getRuntimeClientProfile(): 'web' | 'desktop' {
  return (window as any)?.electronAPI?.db ? 'desktop' : 'web';
}

export function getStoredLicenseKey(): string {
  return String(localStorage.getItem(LICENSE_KEY) || '').trim().toUpperCase();
}

export interface WebTotalCustomer {
  id?: string;
  email?: string;
  fullName?: string;
}

export interface WebTotalCustomerSnapshot {
  customer?: WebTotalCustomer;
  entitlements?: Array<{
    id?: string;
    appId?: string;
    productId?: string;
    plan?: string;
    status?: string;
    startsAt?: string;
    expiresAt?: string | null;
    sourceOrderId?: string | null;
  }>;
  subscriptions?: Array<unknown>;
  wallet?: { balance?: number };
  ledger?: Array<unknown>;
  orders?: Array<unknown>;
}

export interface PendingCheckout {
  orderId: string;
  orderCode: string;
  planId: string;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  amount: number;
  createdAt: string;
}

export interface WebTotalOrderStatus {
  orderId: string;
  orderCode: string;
  status: string;
  paymentStatus: string;
  amount: number;
  paidAt?: string | null;
  productId?: string;
}

export interface PricingPlanCatalogEntry {
  id: string;
  name: string;
  prices: {
    monthly: number;
    yearly: number;
    lifetime: number;
  };
  source?: string;
}

export interface VerifyLicenseResult {
  ok: boolean;
  features: string[];
  grace?: { allowed: boolean; graceDays: number; offlineUntil?: string };
  license?: {
    planId?: string | null;
    productId?: string | null;
    planCode?: string | null;
    billingCycle?: string | null;
    activatedAt?: string | null;
    expiresAt?: string | null;
    status?: string;
    licenseKey?: string;
    customerId?: string;
  };
}

export interface LockStandardGradesResult {
  ok: boolean;
  lockedGrades: number[];
  requiredGradeCount: number;
}

export class BridgeLoginError extends Error {
  needsPassword?: boolean;

  constructor(message: string, options?: { needsPassword?: boolean }) {
    super(message);
    this.name = 'BridgeLoginError';
    this.needsPassword = options?.needsPassword;
  }
}

function isRetryableBridgeResponse(base: string, response: Response, rawText: string): boolean {
  if (base === PRODUCTION_BRIDGE_BASE) {
    return false;
  }

  const rawLower = String(rawText || '').toLowerCase();
  return response.status === 404
    || rawLower.includes('page could not be found')
    || rawLower.includes('not_found sin1::')
    || rawLower.includes('"message":"not found"');
}

async function fetchBridgeResponse(
  path: string,
  init?: RequestInit,
  options: { retryOnNotFound?: boolean } = {},
): Promise<{ response: Response; rawText: string; base: string }> {
  let lastFailure: Error | null = null;

  for (let index = 0; index < BACKEND_API_BASE_CANDIDATES.length; index += 1) {
    const base = BACKEND_API_BASE_CANDIDATES[index];
    try {
      const response = await fetch(`${base}${path}`, init);
      const rawText = await response.text().catch(() => '');
      if (options.retryOnNotFound && isRetryableBridgeResponse(base, response, rawText) && index < BACKEND_API_BASE_CANDIDATES.length - 1) {
        continue;
      }
      return { response, rawText, base };
    } catch (error) {
      lastFailure = error as Error;
      if (index < BACKEND_API_BASE_CANDIDATES.length - 1) {
        continue;
      }
    }
  }

  throw lastFailure ?? new Error('Không kết nối được backend bridge.');
}

function getNetworkErrorMessage() {
  return 'Không kết nối được cổng đăng nhập của ứng dụng. Lỗi này thường do backend bridge của app chưa chạy hoặc chưa publish, chưa phải lỗi tài khoản Web Tong.';
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

function hasLocalPaidActivation(): boolean {
  const planId = localStorage.getItem(PLAN_KEY) || 'free';
  if (planId === 'free') return false;

  const status = localStorage.getItem(SUB_STATUS_KEY);
  const activationSource = localStorage.getItem(ACTIVATION_SOURCE_KEY);
  const licenseKey = (localStorage.getItem(LICENSE_KEY) || '').toUpperCase();

  if (status !== 'active') return false;
  if (activationSource === 'license_key') return true;
  return PAID_LICENSE_PATTERN.test(licenseKey);
}

export function getBridgeToken(): string {
  return localStorage.getItem(BRIDGE_TOKEN_KEY) || '';
}

export function setBridgeToken(token: string): void {
  localStorage.setItem(BRIDGE_TOKEN_KEY, token);
}

export function getBridgeCustomer(): WebTotalCustomer | null {
  return readJson<WebTotalCustomer>(BRIDGE_CUSTOMER_KEY);
}

export function setBridgeCustomer(customer?: WebTotalCustomer): void {
  if (customer?.id) {
    localStorage.setItem(BRIDGE_CUSTOMER_KEY, JSON.stringify(customer));
    return;
  }
  localStorage.removeItem(BRIDGE_CUSTOMER_KEY);
}

export function clearBridgeToken(): void {
  localStorage.removeItem(BRIDGE_TOKEN_KEY);
  localStorage.removeItem(BRIDGE_CUSTOMER_KEY);
}

export async function loginWebTotalBridge(email: string, password: string): Promise<{ bridgeToken: string; customer?: WebTotalCustomer }> {
  let res: Response;

  try {
    res = await fetch(`${BACKEND_API_BASE}/auth/customer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new BridgeLoginError(getNetworkErrorMessage());
  }

  const payload = await res.json().catch(() => ({}));
  if (!res.ok || !payload?.success || !payload?.data?.bridgeToken) {
    throw new BridgeLoginError(payload?.error || 'Đăng nhập Web tổng thất bại.', {
      needsPassword: Boolean(payload?.needsPassword),
    });
  }
  setBridgeToken(payload.data.bridgeToken);
  setBridgeCustomer(payload.data.customer);
  return payload.data;
}

export async function getWebTotalMe(): Promise<WebTotalCustomerSnapshot> {
  const bridgeToken = getBridgeToken();
  if (!bridgeToken) throw new Error('Chưa có bridge token.');

  const res = await fetch(`${BACKEND_API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${bridgeToken}` },
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || !payload?.success) {
    throw new Error(payload?.error || 'Không lấy được auth/me.');
  }
  const snapshot = payload.data as WebTotalCustomerSnapshot;
  setBridgeCustomer(snapshot.customer);
  return snapshot;
}

export async function getWebTotalCustomerSnapshot(): Promise<WebTotalCustomerSnapshot> {
  const bridgeToken = getBridgeToken();
  if (!bridgeToken) throw new Error('Chưa có bridge token.');

  const res = await fetch(`${BACKEND_API_BASE}/customer/snapshot`, {
    headers: { Authorization: `Bearer ${bridgeToken}` },
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || !payload?.success) {
    throw new Error(payload?.error || 'Không lấy được customer snapshot.');
  }
  const snapshot = payload.data as WebTotalCustomerSnapshot;
  setBridgeCustomer(snapshot.customer);
  return snapshot;
}

export async function logoutWebTotalBridge(): Promise<void> {
  const bridgeToken = getBridgeToken();
  if (!bridgeToken) return;

  await fetch(`${BACKEND_API_BASE}/auth/customer/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${bridgeToken}` },
  }).catch(() => undefined);
  clearBridgeToken();
}

export function getPendingCheckout(): PendingCheckout | null {
  return readJson<PendingCheckout>(PENDING_CHECKOUT_KEY);
}

export function savePendingCheckout(pending: PendingCheckout): void {
  localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(pending));
}

export function clearPendingCheckout(): void {
  localStorage.removeItem(PENDING_CHECKOUT_KEY);
}

export async function getWebTotalOrderStatus(orderId: string): Promise<WebTotalOrderStatus> {
  const res = await fetch(`${BACKEND_API_BASE}/payments/web-total/orders/${encodeURIComponent(orderId)}/status`);
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || !payload?.success) {
    throw new Error(payload?.error || 'Không lấy được trạng thái đơn hàng từ Web tổng.');
  }
  return payload.data as WebTotalOrderStatus;
}

export async function fetchPricingPlans(): Promise<Record<string, PricingPlanCatalogEntry>> {
  const res = await fetch(`${BACKEND_API_BASE}/plans`);
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || !payload?.success || !payload?.data) {
    throw new Error(payload?.error || 'Không lấy được bảng giá.');
  }
  return payload.data as Record<string, PricingPlanCatalogEntry>;
}

// ─── License & Feature Gating ─────────────────────────────────────────────────

const LICENSE_CACHE_KEY = 'hhk_ai_app_license_cache';
/** Offline grace default: 7 ngày (tính từ lastVerifiedAt) */
const OFFLINE_GRACE_MS = 7 * 24 * 60 * 60 * 1000;

export interface AppLicense {
  id: string;
  appId: string;
  planCode?: string | null;
  billingCycle?: string | null;
  licenseKey: string;
  status: 'inactive' | 'active' | 'suspended' | 'expired' | 'revoked';
  activatedAt?: string | null;
  expiresAt?: string | null;
  deviceId?: string | null;
  lastVerifiedAt?: string | null;
  features?: string[];
  grace?: { allowed: boolean; graceDays: number; offlineUntil?: string };
}

export interface LicenseCache {
  customerId: string;
  licenses: AppLicense[];
  features: string[];          // union của tất cả active licenses
  cachedAt: string;            // ISO timestamp
  offlineUntil: string;        // ISO timestamp
}

function writeLicenseCache(cache: LicenseCache): void {
  try { localStorage.setItem(LICENSE_CACHE_KEY, JSON.stringify(cache)); } catch { /* quota */ }
}

export function readLicenseCache(): LicenseCache | null {
  return readJson<LicenseCache>(LICENSE_CACHE_KEY);
}

export function clearLicenseCache(): void {
  localStorage.removeItem(LICENSE_CACHE_KEY);
}

function simplifyText(input: string): string {
  return String(input || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function isLicenseInvalidOrRevokedError(message: string): boolean {
  const normalized = simplifyText(message);
  return normalized.includes('license invalid')
    || normalized.includes('expired or revoked')
    || normalized.includes('key khong hop le')
    || normalized.includes('da het han')
    || normalized.includes('bi thu hoi');
}

export function clearLocalPaidActivation(status: 'revoked' | 'expired' | 'inactive' = 'revoked'): void {
  localStorage.setItem(SUB_STATUS_KEY, status);
  localStorage.setItem(PLAN_KEY, 'free');
  localStorage.removeItem(ACTIVATION_SOURCE_KEY);
  localStorage.removeItem(SUB_EXPIRY_KEY);
  localStorage.removeItem(SUB_BILLING_KEY);
  localStorage.removeItem(LICENSE_KEY);
}

function syncLocalActivationFromServerLicenses(licenses: AppLicense[]): void {
  const now = Date.now();
  const activeLicenses = (licenses || []).filter((license) => {
    if (String(license?.status || '').toLowerCase() !== 'active') {
      return false;
    }
    if (!license?.expiresAt) {
      return true;
    }
    return new Date(license.expiresAt).getTime() > now;
  });

  if (activeLicenses.length > 0) {
    return;
  }

  // Server says user has no active license => clear local paid state immediately.
  clearLocalPaidActivation('revoked');
}

/** Kiểm tra cache còn hiệu lực trong offline grace không */
export function isCacheWithinGrace(): boolean {
  const cache = readLicenseCache();
  if (!cache) return false;
  return new Date(cache.offlineUntil).getTime() > Date.now();
}

/**
 * Lấy danh sách licenses từ backend proxy → Web tổng
 * Cache kết quả vào localStorage để dùng offline
 */
export async function fetchAndCacheLicenses(customerId: string, appId?: string): Promise<LicenseCache> {
  const bridgeToken = getBridgeToken();
  const aid = appId || 'hoctap-cap-01';
  let res: Response;
  let payload: any = {};

  try {
    const result = await fetchBridgeResponse(
      `/ai-app/customers/${encodeURIComponent(customerId)}/licenses?appId=${encodeURIComponent(aid)}`,
      bridgeToken ? { headers: { Authorization: `Bearer ${bridgeToken}` } } : {},
      { retryOnNotFound: true },
    );
    res = result.response;
    payload = result.rawText ? JSON.parse(result.rawText) : {};
  } catch {
    res = new Response(null, { status: 503, statusText: 'Bridge unavailable' });
    payload = {};
  }

  let licenses: AppLicense[] = [];
  let loadedFromServer = false;
  if (res.ok && payload?.success && Array.isArray(payload?.data?.licenses)) {
    licenses = payload.data.licenses as AppLicense[];
    loadedFromServer = true;
    syncLocalActivationFromServerLicenses(licenses);
  }

  // Tổng hợp features từ tất cả license đang active
  const features = Array.from(
    new Set(
      licenses
        .filter(l => l.status === 'active')
        .flatMap(l => l.features ?? [])
    )
  );

  // Tính offlineUntil: chỉ cấp grace khi license thật sự được phép grace.
  let offlineMs = Date.now();
  let hasAllowedGrace = false;
  for (const lic of licenses) {
    if (!lic.grace?.allowed || !lic.grace?.offlineUntil) {
      continue;
    }
    const t = new Date(lic.grace.offlineUntil).getTime();
    if (Number.isFinite(t) && t > offlineMs) {
      offlineMs = t;
      hasAllowedGrace = true;
    }
  }

  if (!hasAllowedGrace) {
    const hasActiveLicense = licenses.some((license) => String(license?.status || '').toLowerCase() === 'active');
    if (hasActiveLicense) {
      offlineMs = Date.now() + OFFLINE_GRACE_MS;
    }
  }

  if (!loadedFromServer) {
    // Preserve previous offlineUntil on network failure to avoid destructive fallback.
    const oldCache = readLicenseCache();
    if (oldCache?.offlineUntil) {
      const oldMs = new Date(oldCache.offlineUntil).getTime();
      if (Number.isFinite(oldMs) && oldMs > offlineMs) {
        offlineMs = oldMs;
      }
    }
  }

  const cache: LicenseCache = {
    customerId,
    licenses,
    features,
    cachedAt: new Date().toISOString(),
    offlineUntil: new Date(offlineMs).toISOString(),
  };

  writeLicenseCache(cache);
  return cache;
}

/**
 * Verify một license key cụ thể (dùng khi cần refresh sau khi quay lại từ checkout)
 */
export async function verifyLicenseKey(params: {
  licenseKey: string;
  appId?: string;
  customerId?: string;
  customerEmail?: string;
  deviceId?: string;
  deviceName?: string;
  clientProfile?: 'web' | 'desktop' | 'shared';
}): Promise<VerifyLicenseResult> {
  const bridgeToken = getBridgeToken();
  let result;

  try {
    result = await fetchBridgeResponse('/ai-app/licenses/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(bridgeToken ? { Authorization: `Bearer ${bridgeToken}` } : {}),
      },
      body: JSON.stringify(params),
    }, { retryOnNotFound: true });
  } catch {
    throw new Error(
      `Không kết nối được máy chủ kích hoạt của Web Tổng. App sẽ tự ưu tiên bridge production nếu build cũ còn giữ cấu hình sai, nhưng hiện vẫn không chạm được mạng. Base đang thử: ${BACKEND_API_BASE_CANDIDATES.join(' | ')}`,
    );
  }

  const res = result.response;
  const rawText = result.rawText;
  const resolvedBase = result.base;
  let payload: any = {};
  try {
    payload = rawText ? JSON.parse(rawText) : {};
  } catch {
    payload = {};
  }

  const isSuccess = Boolean(payload?.success ?? payload?.ok);
  const dataNode = (payload?.data && typeof payload.data === 'object') ? payload.data : payload;

  if (!res.ok || !isSuccess) {
    const backendError = String(
      payload?.error
      || payload?.message
      || payload?.errorCode
      || payload?.data?.error
      || payload?.data?.message
      || '',
    ).trim();
    const rawLower = rawText.toLowerCase();
    const backendLower = backendError.toLowerCase();

    if (backendLower.includes('license invalid') || backendLower.includes('expired or revoked')) {
      clearLocalPaidActivation('revoked');
      clearLicenseCache();
      throw new Error('Key không hợp lệ, đã hết hạn, hoặc đã bị thu hồi trên hệ thống cấp key (Web Tổng).');
    }

    if (
      backendLower.includes('đang được sử dụng trên một thiết bị khác')
      || backendLower.includes('dong app/web o thiet bi kia')
      || backendLower.includes('phien dang dung key nam tren mot thiet bi khac')
    ) {
      throw new Error('Key này đang được sử dụng trên một thiết bị khác. Vui lòng đóng app/web ở thiết bị kia rồi thử lại.');
    }

    if (
      rawLower.includes('page could not be found')
      || rawLower.includes('not_found sin1::')
      || rawLower.includes('"message":"not found"')
      || backendLower === 'not found'
    ) {
      throw new Error(
        `Đang gọi sai endpoint backend/bridge (base hiện tại: ${resolvedBase}). `
        + 'Web/mobile cần trỏ tới backend bridge có route /api/v1/ai-app/licenses/verify, không phải web tĩnh. '
        + 'Vui lòng cấu hình VITE_BACKEND_API_BASE đúng môi trường deploy và làm mới app để bỏ cache cũ.',
      );
    }

    const fallbackError = rawText && !payload?.success
      ? `License verify lỗi HTTP ${res.status}: ${rawText.slice(0, 180)}`
      : `License verify lỗi HTTP ${res.status}.`;
    throw new Error(backendError || fallbackError || 'License verify thất bại.');
  }
  return {
    ok: true,
    features: (dataNode?.features ?? []) as string[],
    grace: dataNode?.grace,
    license: dataNode?.license,
  };
}

export async function renewCurrentLicenseLease(appId = 'hoctap-cap-01'): Promise<VerifyLicenseResult | null> {
  const licenseKey = getStoredLicenseKey();
  if (!licenseKey) {
    return null;
  }

  const customerId = getBridgeCustomer()?.id ? String(getBridgeCustomer()!.id) : undefined;
  const deviceName = typeof navigator === 'undefined'
    ? null
    : `${navigator.platform} / ${navigator.userAgent.slice(0, 80)}`;

  return verifyLicenseKey({
    licenseKey,
    appId,
    ...(customerId ? { customerId } : {}),
    deviceId: getDeviceId(),
    ...(deviceName ? { deviceName } : {}),
    clientProfile: getRuntimeClientProfile(),
  });
}

export async function refreshCurrentLicenseState(appId = 'hoctap-cap-01'): Promise<{
  verified: boolean;
  downgraded: boolean;
  reason?: string;
}> {
  const licenseKey = getStoredLicenseKey();
  if (!licenseKey) {
    return { verified: false, downgraded: false };
  }

  const cache = readLicenseCache();
  const bridgeCustomer = getBridgeCustomer();
  const knownCustomerId = String(cache?.customerId || bridgeCustomer?.id || '').trim();
  const deviceName = typeof navigator === 'undefined'
    ? null
    : `${navigator.platform} / ${navigator.userAgent.slice(0, 80)}`;

  try {
    const verifyResult = await verifyLicenseKey({
      licenseKey,
      appId,
      ...(knownCustomerId ? { customerId: knownCustomerId } : {}),
      deviceId: getDeviceId(),
      ...(deviceName ? { deviceName } : {}),
      clientProfile: getRuntimeClientProfile(),
    });

    const resolvedCustomerId = String(verifyResult.license?.customerId || knownCustomerId || '').trim();
    if (resolvedCustomerId) {
      const existingCustomer = getBridgeCustomer();
      if (!existingCustomer?.id || String(existingCustomer.id).trim() !== resolvedCustomerId) {
        setBridgeCustomer({ ...(existingCustomer || {}), id: resolvedCustomerId });
      }
      await fetchAndCacheLicenses(resolvedCustomerId, appId);
    }

    return { verified: true, downgraded: false };
  } catch (error: any) {
    const message = String(error?.message || 'License verify failed');
    if (isLicenseInvalidOrRevokedError(message)) {
      clearLocalPaidActivation('revoked');
      clearLicenseCache();
      return { verified: false, downgraded: true, reason: message };
    }
    return { verified: false, downgraded: false, reason: message };
  }
}

export async function lockStandardGrades(params: {
  licenseKey: string;
  appId?: string;
  customerId?: string;
  selectedGrades: number[];
  requiredGradeCount: number;
  clientProfile?: 'web' | 'desktop' | 'shared';
}): Promise<LockStandardGradesResult> {
  const bridgeToken = getBridgeToken();
  let result;

  try {
    result = await fetchBridgeResponse('/ai-app/licenses/lock-standard-grades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(bridgeToken ? { Authorization: `Bearer ${bridgeToken}` } : {}),
      },
      body: JSON.stringify(params),
    }, { retryOnNotFound: true });
  } catch {
    throw new Error(
      `Không kết nối được endpoint khóa lớp của Web Tổng. Base đang thử: ${BACKEND_API_BASE_CANDIDATES.join(' | ')}. `
      + 'Nếu đây là bản desktop đóng gói, app đang không chạm được backend bridge production.',
    );
  }

  const res = result.response;
  const rawText = result.rawText;
  const resolvedBase = result.base;
  let payload: any = {};
  try {
    payload = rawText ? JSON.parse(rawText) : {};
  } catch {
    payload = {};
  }
  const isSuccess = Boolean(payload?.success ?? payload?.ok);
  const dataNode = (payload?.data && typeof payload.data === 'object') ? payload.data : payload;
  if (!res.ok || !isSuccess) {
    const backendError = String(
      payload?.error
      || payload?.message
      || payload?.errorCode
      || payload?.data?.error
      || payload?.data?.message
      || 'Khóa lớp theo key thất bại.'
    ).trim();
    const rawLower = rawText.toLowerCase();
    const backendLower = backendError.toLowerCase();

    if (
      rawLower.includes('page could not be found')
      || rawLower.includes('not_found sin1::')
      || rawLower.includes('"message":"not found"')
      || backendLower === 'not found'
    ) {
      throw new Error(
        `Đang gọi sai endpoint khóa lớp trên backend/bridge (base hiện tại: ${resolvedBase}). `
        + 'App cần trỏ tới backend có route /api/v1/ai-app/licenses/lock-standard-grades.',
      );
    }

    throw new Error(backendError || `Khóa lớp theo key thất bại (HTTP ${res.status}).`);
  }

  return {
    ok: true,
    lockedGrades: Array.isArray(dataNode?.lockedGrades) ? dataNode.lockedGrades : [],
    requiredGradeCount: Number(dataNode?.requiredGradeCount || 0),
  };
}

/**
 * Kiểm tra user có feature cụ thể không.
 * Ưu tiên cache online, fallback offline grace.
 * @param featureKey - ví dụ: "lesson.premium", "ai.voice"
 */
export function hasFeature(featureKey: string): boolean {
  if (INTERNAL_BUILD) return true;
  if (!hasLocalPaidActivation()) return false;
  const cache = readLicenseCache();
  if (!cache) return false;
  // Nếu quá grace period → chỉ cho feature cơ bản
  if (!isCacheWithinGrace()) return false;
  return cache.features.includes(featureKey);
}

/**
 * Kiểm tra user có ít nhất 1 license active không (bất kể feature)
 */
export function hasActiveLicense(): boolean {
  if (INTERNAL_BUILD) return true;
  if (!hasLocalPaidActivation()) return false;
  const cache = readLicenseCache();
  if (!cache || !isCacheWithinGrace()) return false;
  return cache.licenses.some(l => l.status === 'active');
}
