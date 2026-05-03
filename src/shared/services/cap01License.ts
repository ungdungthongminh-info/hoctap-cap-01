import { BACKEND_API_BASE } from './webTotalBridge';
import { getDeviceId } from '../utils/deviceFingerprint';

const APP_ID = 'hoctap-cap-01';
const CACHE_KEY = 'hhk_cap01_license_cache';
const LAST_VERIFY_KEY = 'hhk_cap01_last_verify_at';
const VERIFY_INTERVAL_MS = 24 * 60 * 60 * 1000;

const STORAGE_KEYS = {
  plan: 'hhk_plan',
  status: 'hhk_sub_status',
  expiry: 'hhk_sub_expiry',
  source: 'hhk_activation_source',
  license: 'hhk_license',
};

export interface Cap01Entitlement {
  appId: string;
  productId: string;
  plan: string;
  status: 'active' | string;
  allowedGrades: number[];
  features: {
    desktopOfflineTts: boolean;
    downloadByGrade: boolean;
    downloadAllGrades: boolean;
    aiTutor: boolean;
  };
  license: {
    deviceLimit: number;
    offlineGraceDays: number;
    expiresAt: string | null;
  };
}

export interface Cap01LicenseCache {
  licenseKey: string;
  deviceId: string;
  deviceName: string;
  appId: string;
  entitlement: Cap01Entitlement;
  lastVerifiedAt: string;
  offlineValidUntil: string;
}

interface LicenseVerifyResponse {
  success: boolean;
  status: string;
  entitlement?: Cap01Entitlement;
  offlineValidUntil?: string;
  serverTime?: string;
  error?: string;
}

function parseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeAllowedGrades(input: unknown): number[] {
  if (!Array.isArray(input)) return [1, 2];
  const normalized = input
    .map((value) => Number(value))
    .filter((value, index, arr) => Number.isInteger(value) && value >= 0 && value <= 12 && arr.indexOf(value) === index)
    .sort((a, b) => a - b);
  return normalized.length > 0 ? normalized : [1, 2];
}

function normalizeEntitlement(input: Cap01Entitlement): Cap01Entitlement {
  return {
    appId: APP_ID,
    productId: String(input?.productId || 'cap01_beta_year_299'),
    plan: String(input?.plan || 'beta_year_299'),
    status: String(input?.status || 'active'),
    allowedGrades: normalizeAllowedGrades(input?.allowedGrades),
    features: {
      desktopOfflineTts: Boolean(input?.features?.desktopOfflineTts),
      downloadByGrade: Boolean(input?.features?.downloadByGrade),
      downloadAllGrades: Boolean(input?.features?.downloadAllGrades),
      aiTutor: Boolean(input?.features?.aiTutor),
    },
    license: {
      deviceLimit: Number(input?.license?.deviceLimit || 1),
      offlineGraceDays: Number(input?.license?.offlineGraceDays || 7),
      expiresAt: input?.license?.expiresAt || null,
    },
  };
}

async function getDeviceInfo(): Promise<{ deviceId: string; deviceName: string; appVersion: string }> {
  const fallbackName = typeof navigator === 'undefined'
    ? 'desktop-app'
    : `${navigator.platform || 'desktop'}-${(navigator.userAgent || '').slice(0, 24)}`;

  if (typeof window !== 'undefined' && window.electronAPI?.license?.getDeviceInfo) {
    try {
      const info = await window.electronAPI.license.getDeviceInfo();
      return {
        deviceId: getDeviceId(),
        deviceName: String(info?.deviceName || fallbackName),
        appVersion: String(info?.appVersion || __APP_VERSION__ || '0.0.0'),
      };
    } catch {
      // fallback below
    }
  }

  return {
    deviceId: getDeviceId(),
    deviceName: fallbackName,
    appVersion: String(__APP_VERSION__ || '0.0.0'),
  };
}

async function readCacheFromDesktopStore(): Promise<Cap01LicenseCache | null> {
  if (typeof window === 'undefined' || !window.electronAPI?.license?.getCache) {
    return null;
  }
  try {
    const payload = await window.electronAPI.license.getCache();
    return payload && typeof payload === 'object' ? (payload as Cap01LicenseCache) : null;
  } catch {
    return null;
  }
}

async function writeCacheToDesktopStore(cache: Cap01LicenseCache | null): Promise<void> {
  if (typeof window === 'undefined' || !window.electronAPI?.license?.setCache) {
    return;
  }
  try {
    await window.electronAPI.license.setCache(cache);
  } catch {
    // ignore IO errors
  }
}

export async function readCap01LicenseCache(): Promise<Cap01LicenseCache | null> {
  const desktopCache = await readCacheFromDesktopStore();
  if (desktopCache) return desktopCache;
  return parseJson<Cap01LicenseCache>(localStorage.getItem(CACHE_KEY));
}

export async function writeCap01LicenseCache(cache: Cap01LicenseCache): Promise<void> {
  await writeCacheToDesktopStore(cache);
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  localStorage.setItem(LAST_VERIFY_KEY, cache.lastVerifiedAt);
}

export async function clearCap01LicenseCache(): Promise<void> {
  if (typeof window !== 'undefined' && window.electronAPI?.license?.clearCache) {
    await window.electronAPI.license.clearCache().catch(() => undefined);
  }
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(LAST_VERIFY_KEY);
}

function persistLocalPlanFromEntitlement(cache: Cap01LicenseCache): void {
  localStorage.setItem(STORAGE_KEYS.plan, 'standard');
  localStorage.setItem(STORAGE_KEYS.status, 'active');
  localStorage.setItem(STORAGE_KEYS.source, 'license_key');
  localStorage.setItem(STORAGE_KEYS.license, cache.licenseKey);
  if (cache.entitlement.license.expiresAt) {
    localStorage.setItem(STORAGE_KEYS.expiry, cache.entitlement.license.expiresAt);
  }
}

function clearLocalPaidState(): void {
  localStorage.setItem(STORAGE_KEYS.plan, 'free');
  localStorage.setItem(STORAGE_KEYS.status, 'inactive');
  localStorage.removeItem(STORAGE_KEYS.source);
  localStorage.removeItem(STORAGE_KEYS.license);
  localStorage.removeItem(STORAGE_KEYS.expiry);
}

function buildOfflineValidUntil(serverOfflineValidUntil: string | undefined, nowIso: string, graceDays: number): string {
  if (serverOfflineValidUntil) {
    const ms = new Date(serverOfflineValidUntil).getTime();
    if (Number.isFinite(ms) && ms > 0) {
      return new Date(ms).toISOString();
    }
  }

  const nowMs = new Date(nowIso).getTime();
  return new Date(nowMs + Math.max(1, graceDays) * 24 * 60 * 60 * 1000).toISOString();
}

async function postLicense(path: '/licenses/activate' | '/licenses/verify', licenseKey: string): Promise<LicenseVerifyResponse> {
  const info = await getDeviceInfo();
  const res = await fetch(`${BACKEND_API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      licenseKey,
      appId: APP_ID,
      deviceId: info.deviceId,
      deviceName: info.deviceName,
      appVersion: info.appVersion,
    }),
  });

  const payload = await res.json().catch(() => ({}));
  return {
    success: Boolean(payload?.success),
    status: String(payload?.status || ''),
    entitlement: payload?.entitlement,
    offlineValidUntil: payload?.offlineValidUntil,
    serverTime: payload?.serverTime,
    error: String(payload?.error || ''),
  };
}

function mapLicenseStatusError(status: string, fallback: string): string {
  switch (status) {
    case 'invalid':
      return 'Key không hợp lệ';
    case 'expired':
      return 'Key đã hết hạn';
    case 'device_limit_exceeded':
      return 'Key đã vượt số thiết bị cho phép';
    default:
      return fallback || 'Không kết nối được server';
  }
}

export async function activateCap01License(licenseKeyRaw: string): Promise<Cap01LicenseCache> {
  const licenseKey = String(licenseKeyRaw || '').trim().toUpperCase();
  if (!licenseKey) {
    throw new Error('Vui lòng nhập license key');
  }

  const response = await postLicense('/licenses/activate', licenseKey).catch(() => ({
    success: false,
    status: 'network_error',
    error: 'Không kết nối được server',
  } as LicenseVerifyResponse));

  if (!response.success || !response.entitlement) {
    throw new Error(mapLicenseStatusError(response.status, response.error || ''));
  }

  const info = await getDeviceInfo();
  const nowIso = response.serverTime || new Date().toISOString();
  const entitlement = normalizeEntitlement(response.entitlement);
  const cache: Cap01LicenseCache = {
    licenseKey,
    deviceId: info.deviceId,
    deviceName: info.deviceName,
    appId: APP_ID,
    entitlement,
    lastVerifiedAt: nowIso,
    offlineValidUntil: buildOfflineValidUntil(response.offlineValidUntil, nowIso, entitlement.license.offlineGraceDays),
  };

  await writeCap01LicenseCache(cache);
  persistLocalPlanFromEntitlement(cache);
  return cache;
}

export async function verifyCap01License(options: { force?: boolean } = {}): Promise<Cap01LicenseCache | null> {
  const cache = await readCap01LicenseCache();
  if (!cache) return null;

  const now = Date.now();
  const lastVerifiedMs = new Date(cache.lastVerifiedAt || 0).getTime();
  const shouldSkip = !options.force && Number.isFinite(lastVerifiedMs) && now - lastVerifiedMs < VERIFY_INTERVAL_MS;
    // Check both navigator.onLine AND localStorage desktop offline flag (for acceptance audit)
    let isOffline = false;
    if (typeof navigator !== 'undefined') {
      isOffline = navigator.onLine === false;
    }
    try {
      const desktopOfflineFlag = localStorage.getItem('hhk_desktop_offline_mode_active');
      if (desktopOfflineFlag === 'true') {
        isOffline = true;
      }
    } catch {}

  if (shouldSkip || isOffline) {
    return cache;
  }

  const response = await postLicense('/licenses/verify', cache.licenseKey).catch(() => ({
    success: false,
    status: 'network_error',
    error: 'Không kết nối được server',
  } as LicenseVerifyResponse));

  if (!response.success || !response.entitlement) {
    if (response.status === 'invalid' || response.status === 'expired' || response.status === 'device_limit_exceeded') {
      await clearCap01LicenseCache();
      clearLocalPaidState();
      return null;
    }
    return cache;
  }

  const nowIso = response.serverTime || new Date().toISOString();
  const entitlement = normalizeEntitlement(response.entitlement);
  const nextCache: Cap01LicenseCache = {
    ...cache,
    entitlement,
    lastVerifiedAt: nowIso,
    offlineValidUntil: buildOfflineValidUntil(response.offlineValidUntil, nowIso, entitlement.license.offlineGraceDays),
  };

  await writeCap01LicenseCache(nextCache);
  persistLocalPlanFromEntitlement(nextCache);
  return nextCache;
}

export async function clearCap01Activation(): Promise<void> {
  await clearCap01LicenseCache();
  clearLocalPaidState();
}

export async function canUseOfflineByGrace(): Promise<boolean> {
  const cache = await readCap01LicenseCache();
  if (!cache) return false;
  return new Date(cache.offlineValidUntil).getTime() > Date.now();
}

export function isDesktopOfflineTtsEnabled(cache: Cap01LicenseCache | null): boolean {
  return Boolean(cache?.entitlement?.features?.desktopOfflineTts);
}

export function resolveAllowedGrades(cache: Cap01LicenseCache | null): number[] {
  return normalizeAllowedGrades(cache?.entitlement?.allowedGrades || [1, 2]);
}
