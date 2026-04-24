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

function resolveBackendApiBase() {
  const configuredBase = import.meta.env.VITE_BACKEND_API_BASE?.trim();
  if (configuredBase) {
    return configuredBase.replace(/\/+$/, '');
  }

  const productionBridgeBase = 'https://www.ungdungthongminh.shop/api/v1';

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port, origin } = window.location;

    // file:// = Electron app
    if (protocol === 'file:') {
      return 'http://localhost:5000/api/v1';
    }

    // Dev local/LAN: frontend có thể mở từ Vite, Web Tong local hoặc IP nội bộ.
    // Trong các case này, backend bridge luôn chạy riêng ở cổng 5000 trên cùng máy.
    if (isPrivateNetworkHostname(hostname) || isCommonDevPort(port)) {
      const backendHost = hostname || 'localhost';
      return `http://${backendHost}:5000/api/v1`;
    }

    if (protocol === 'http:' || protocol === 'https:') {
      if (/vercel\.app$/i.test(hostname) || /hoctap-cap-01/i.test(hostname)) {
        return productionBridgeBase;
      }
      if (/ungdungthongminh\.shop$/i.test(hostname)) {
        return `${origin.replace(/\/+$/, '')}/api/v1`;
      }
      return productionBridgeBase;
    }
  }

  return 'http://localhost:5000/api/v1';
}

export const BACKEND_API_BASE = resolveBackendApiBase();
const INTERNAL_BUILD = import.meta.env.VITE_INTERNAL_BUILD === 'true';
const BRIDGE_TOKEN_KEY = 'hhk_web_total_bridge_token';
const BRIDGE_CUSTOMER_KEY = 'hhk_web_total_customer';
const PENDING_CHECKOUT_KEY = 'hhk_web_total_pending_checkout';
const LICENSE_KEY = 'hhk_license';
const PLAN_KEY = 'hhk_plan';
const SUB_STATUS_KEY = 'hhk_sub_status';
const ACTIVATION_SOURCE_KEY = 'hhk_activation_source';
const PAID_LICENSE_PATTERN = /^HHK-(STANDARD|PREMIUM)-[A-Z0-9]{8}$/;

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
    expiresAt?: string | null;
    status?: string;
    licenseKey?: string;
    customerId?: string;
  };
}

export class BridgeLoginError extends Error {
  needsPassword?: boolean;

  constructor(message: string, options?: { needsPassword?: boolean }) {
    super(message);
    this.name = 'BridgeLoginError';
    this.needsPassword = options?.needsPassword;
  }
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
  const aid = appId || 'app-study-12';
  const res = await fetch(
    `${BACKEND_API_BASE}/ai-app/customers/${encodeURIComponent(customerId)}/licenses?appId=${encodeURIComponent(aid)}`,
    bridgeToken ? { headers: { Authorization: `Bearer ${bridgeToken}` } } : {}
  );
  const payload = await res.json().catch(() => ({}));

  let licenses: AppLicense[] = [];
  if (res.ok && payload?.success && Array.isArray(payload?.data?.licenses)) {
    licenses = payload.data.licenses as AppLicense[];
  }

  // Tổng hợp features từ tất cả license đang active
  const features = Array.from(
    new Set(
      licenses
        .filter(l => l.status === 'active')
        .flatMap(l => l.features ?? [])
    )
  );

  // Tính offlineUntil: lấy max offlineUntil từ grace các licenses
  let offlineMs = Date.now() + OFFLINE_GRACE_MS;
  for (const lic of licenses) {
    if (lic.grace?.offlineUntil) {
      const t = new Date(lic.grace.offlineUntil).getTime();
      if (t > offlineMs) offlineMs = t;
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
  deviceId?: string;
  deviceName?: string;
}): Promise<VerifyLicenseResult> {
  const bridgeToken = getBridgeToken();
  const res = await fetch(`${BACKEND_API_BASE}/ai-app/licenses/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(bridgeToken ? { Authorization: `Bearer ${bridgeToken}` } : {}),
    },
    body: JSON.stringify(params),
  });
  const rawText = await res.text().catch(() => '');
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
      || payload?.errorCode
      || payload?.message
      || payload?.data?.error
      || payload?.data?.message
      || '',
    ).trim();
    const rawLower = rawText.toLowerCase();
    const backendLower = backendError.toLowerCase();

    if (backendLower.includes('license invalid') || backendLower.includes('expired or revoked')) {
      throw new Error('Key không hợp lệ, đã hết hạn, hoặc đã bị thu hồi trên hệ thống cấp key (Web Tổng).');
    }

    if (
      rawLower.includes('page could not be found')
      || rawLower.includes('not_found sin1::')
      || rawLower.includes('"message":"not found"')
      || backendLower === 'not found'
    ) {
      throw new Error(
        `Đang gọi sai endpoint backend/bridge (base hiện tại: ${BACKEND_API_BASE}). `
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