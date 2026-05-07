// APP R2 (TTS/audio assets) — bucket: hhk-tts-audio
export const TTS_AUDIO_BASE_URL = 'https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev';

// WEB R2 (EXE installer / latest.yml / update artifacts) — bucket: ung-dung-thong-minh
export const DESKTOP_UPDATE_BASE_URL = 'https://pub-90b335e287f24c92bbd5856cb9f116d9.r2.dev/app-updates/app-study-12';
const DESKTOP_UPDATE_YML_URL = `${DESKTOP_UPDATE_BASE_URL}/latest.yml`;

const WINDOWS_APP_ASSET_PREFIX = 'HocHungKhoi_Desktopapp-Win';
const WINDOWS_APP_STABLE_ASSET_NAME = `${WINDOWS_APP_ASSET_PREFIX}.exe`;
let lastDownloadTriggerAt = 0;

function normalizeReleaseVersion(version?: string | null): string {
  const normalized = String(version || '').trim().replace(/^v/i, '');
  return normalized.replace(/[^0-9.]/g, '');
}

function parseLatestVersionFromYml(raw: string): string {
  const match = String(raw || '').match(/^version:\s*(.+)$/m);
  return normalizeReleaseVersion(match?.[1] || '');
}

async function resolveLatestDesktopVersion(): Promise<string | null> {
  try {
    const response = await fetch(DESKTOP_UPDATE_YML_URL, { method: 'GET', cache: 'no-store' });
    if (!response.ok) return null;
    const raw = await response.text();
    const version = parseLatestVersionFromYml(raw);
    return version || null;
  } catch {
    return null;
  }
}

export function getWindowsAppDownloadUrl(version?: string | null): string {
  const v = normalizeReleaseVersion(version);
  if (!v) {
    return `${DESKTOP_UPDATE_BASE_URL}/${WINDOWS_APP_STABLE_ASSET_NAME}`;
  }
  return `${DESKTOP_UPDATE_BASE_URL}/${WINDOWS_APP_ASSET_PREFIX}-${v}.exe`;
}

export async function openWindowsAppDownload(version?: string | null): Promise<void> {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  if (now - lastDownloadTriggerAt < 1500) return;
  lastDownloadTriggerAt = now;

  let resolvedVersion = normalizeReleaseVersion(version);
  if (!resolvedVersion) {
    resolvedVersion = (await resolveLatestDesktopVersion()) || '';
  }

  const url = getWindowsAppDownloadUrl(resolvedVersion || undefined);

  // Use a single navigation path to avoid duplicate downloads in some browsers.
  window.location.assign(url);
}
