// APP R2 (TTS/audio assets) — bucket: hhk-tts-audio
export const TTS_AUDIO_BASE_URL = 'https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev';

// WEB R2 (EXE installer / latest.yml / update artifacts) — bucket: ung-dung-thong-minh
export const DESKTOP_UPDATE_BASE_URL = 'https://pub-90b335e287f24c92bbd5856cb9f116d9.r2.dev/app-updates/app-study-12';

const WINDOWS_APP_ASSET_PREFIX = 'HocHungKhoi_Desktopapp-Win';
// Keep in sync with latestVersion in public/app-update.json
const CURRENT_RELEASE_VERSION = '0.1.2';

function normalizeReleaseVersion(version?: string | null): string {
  const normalized = String(version || '').trim().replace(/^v/i, '');
  return normalized.replace(/[^0-9.]/g, '');
}

export function getWindowsAppDownloadUrl(version?: string | null): string {
  const v = normalizeReleaseVersion(version) || CURRENT_RELEASE_VERSION;
  return `${DESKTOP_UPDATE_BASE_URL}/${WINDOWS_APP_ASSET_PREFIX}-${v}.exe`;
}

export function openWindowsAppDownload(version?: string | null): void {
  window.location.assign(getWindowsAppDownloadUrl(version));
}
