const UPDATE_FEED_URL_KEY = 'hhk_update_feed_url';
const UPDATE_DISMISSED_VERSION_KEY = 'hhk_update_dismissed_version';

const FALLBACK_UPDATE_FEED_URL = 'https://www.ungdungthongminh.shop/app-update.json';

export interface AppUpdateManifest {
  appId?: string;
  channel?: string;
  latestVersion: string;
  minimumSupportedVersion?: string;
  publishedAt?: string;
  title?: string;
  notes?: string[];
  downloadUrl?: string;
  forceUpdate?: boolean;
}

export type AppUpdateState =
  | 'up-to-date'
  | 'update-available'
  | 'update-required'
  | 'feed-unavailable'
  | 'error';

export interface AppUpdateCheckResult {
  state: AppUpdateState;
  currentVersion: string;
  latestVersion?: string;
  minimumSupportedVersion?: string;
  sourceUrl?: string;
  checkedAt: string;
  message?: string;
  manifest?: AppUpdateManifest;
}

function normalizeUrl(value?: string | null): string {
  return String(value || '').trim();
}

function dedupeUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const raw of urls) {
    const value = normalizeUrl(raw);
    if (!value || seen.has(value)) continue;
    seen.add(value);
    output.push(value);
  }
  return output;
}

function parseVersion(version: string): number[] {
  return String(version || '')
    .trim()
    .replace(/^v/i, '')
    .split('.')
    .map((part) => Number(part.replace(/[^0-9]/g, '')))
    .map((value) => (Number.isFinite(value) ? value : 0));
}

function compareVersion(a: string, b: string): number {
  const av = parseVersion(a);
  const bv = parseVersion(b);
  const maxLength = Math.max(av.length, bv.length);
  for (let i = 0; i < maxLength; i += 1) {
    const ai = av[i] ?? 0;
    const bi = bv[i] ?? 0;
    if (ai > bi) return 1;
    if (ai < bi) return -1;
  }
  return 0;
}

export function getCurrentAppVersion(): string {
  if (typeof __APP_VERSION__ === 'string' && __APP_VERSION__.trim()) {
    return __APP_VERSION__.trim();
  }
  const envVersion = String(import.meta.env.VITE_APP_VERSION || '').trim();
  return envVersion || '0.1.0';
}

export function getUpdateFeedUrlOverride(): string {
  return normalizeUrl(localStorage.getItem(UPDATE_FEED_URL_KEY));
}

export function setUpdateFeedUrlOverride(url: string): void {
  const normalized = normalizeUrl(url);
  if (!normalized) {
    localStorage.removeItem(UPDATE_FEED_URL_KEY);
    return;
  }
  localStorage.setItem(UPDATE_FEED_URL_KEY, normalized);
}

export function getDismissedUpdateVersion(): string {
  return String(localStorage.getItem(UPDATE_DISMISSED_VERSION_KEY) || '').trim();
}

export function dismissUpdateVersion(version: string): void {
  const normalized = String(version || '').trim();
  if (!normalized) return;
  localStorage.setItem(UPDATE_DISMISSED_VERSION_KEY, normalized);
}

export function clearDismissedUpdateVersion(): void {
  localStorage.removeItem(UPDATE_DISMISSED_VERSION_KEY);
}

export function shouldShowUpdateBanner(result: AppUpdateCheckResult | null): boolean {
  if (!result) return false;
  if (result.state !== 'update-available' && result.state !== 'update-required') {
    return false;
  }
  const latestVersion = String(result.latestVersion || '').trim();
  if (!latestVersion) return false;
  if (result.state === 'update-required') return true;
  return getDismissedUpdateVersion() !== latestVersion;
}

function buildUpdateFeedCandidates(): string[] {
  const override = getUpdateFeedUrlOverride();
  const envUrl = normalizeUrl(import.meta.env.VITE_APP_UPDATE_URL);
  const urls: string[] = [];
  if (override) urls.push(override);
  if (envUrl) urls.push(envUrl);

  if (typeof window !== 'undefined') {
    const { protocol, origin } = window.location;
    if (protocol === 'http:' || protocol === 'https:') {
      urls.push(`${origin.replace(/\/+$/, '')}/app-update.json`);
    }
  }

  urls.push(FALLBACK_UPDATE_FEED_URL);
  return dedupeUrls(urls);
}

function isValidManifest(payload: any): payload is AppUpdateManifest {
  return Boolean(payload)
    && typeof payload === 'object'
    && typeof payload.latestVersion === 'string'
    && payload.latestVersion.trim().length > 0;
}

async function fetchManifestFromUrl(url: string): Promise<AppUpdateManifest> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const payload = await res.json();
    if (!isValidManifest(payload)) {
      throw new Error('Update manifest không hợp lệ');
    }
    return payload;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function checkAppUpdate(): Promise<AppUpdateCheckResult> {
  const currentVersion = getCurrentAppVersion();
  const checkedAt = new Date().toISOString();
  const candidates = buildUpdateFeedCandidates();
  let lastError = '';

  for (const url of candidates) {
    try {
      const manifest = await fetchManifestFromUrl(url);
      const latestVersion = String(manifest.latestVersion || '').trim();
      const minimumSupportedVersion = String(manifest.minimumSupportedVersion || '').trim();
      const compareLatest = compareVersion(latestVersion, currentVersion);
      const compareMinimum = minimumSupportedVersion
        ? compareVersion(minimumSupportedVersion, currentVersion)
        : -1;

      if (compareMinimum > 0 || manifest.forceUpdate) {
        return {
          state: 'update-required',
          currentVersion,
          latestVersion,
          minimumSupportedVersion: minimumSupportedVersion || undefined,
          sourceUrl: url,
          checkedAt,
          manifest,
          message: 'Phiên bản hiện tại đã cũ, cần cập nhật để tiếp tục dùng ổn định.',
        };
      }

      if (compareLatest > 0) {
        return {
          state: 'update-available',
          currentVersion,
          latestVersion,
          minimumSupportedVersion: minimumSupportedVersion || undefined,
          sourceUrl: url,
          checkedAt,
          manifest,
          message: 'Đã có bản mới với sửa lỗi/tính năng mới.',
        };
      }

      return {
        state: 'up-to-date',
        currentVersion,
        latestVersion,
        minimumSupportedVersion: minimumSupportedVersion || undefined,
        sourceUrl: url,
        checkedAt,
        manifest,
        message: 'Bạn đang dùng bản mới nhất.',
      };
    } catch (error: any) {
      lastError = String(error?.message || 'Không đọc được update manifest');
    }
  }

  if (!candidates.length) {
    return {
      state: 'feed-unavailable',
      currentVersion,
      checkedAt,
      message: 'Chưa cấu hình kênh cập nhật.',
    };
  }

  return {
    state: 'error',
    currentVersion,
    checkedAt,
    message: lastError || 'Không kiểm tra được phiên bản mới.',
  };
}

export function getAppUpdateDownloadUrl(result: AppUpdateCheckResult | null): string {
  return normalizeUrl(result?.manifest?.downloadUrl);
}

