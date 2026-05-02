const WINDOWS_APP_RELEASES_BASE_URL = 'https://github.com/ungdungthongminh-info/hoctap-cap-01/releases';
const WINDOWS_APP_ASSET_NAME = 'HocHungKhoi_Desktopapp-Win.exe';

function normalizeReleaseVersion(version?: string | null): string {
  const normalized = String(version || '').trim().replace(/^v/i, '');
  return normalized.replace(/[^0-9.]/g, '');
}

export function getWindowsAppDownloadUrl(version?: string | null): string {
  const normalizedVersion = normalizeReleaseVersion(version);
  if (normalizedVersion) {
    return `${WINDOWS_APP_RELEASES_BASE_URL}/download/v${normalizedVersion}/${WINDOWS_APP_ASSET_NAME}`;
  }
  return `${WINDOWS_APP_RELEASES_BASE_URL}/latest/download/${WINDOWS_APP_ASSET_NAME}`;
}

export function openWindowsAppDownload(version?: string | null): void {
  window.location.assign(getWindowsAppDownloadUrl(version));
}
