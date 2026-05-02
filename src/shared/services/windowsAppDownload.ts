const WINDOWS_APP_RELEASES_BASE_URL = 'https://github.com/ungdungthongminh-info/hoctap-cap-01/releases';

function normalizeReleaseVersion(version?: string | null): string {
  const normalized = String(version || '').trim().replace(/^v/i, '');
  return normalized.replace(/[^0-9.]/g, '');
}

export function getWindowsAppDownloadUrl(version?: string | null): string {
  const normalizedVersion = normalizeReleaseVersion(version);
  if (normalizedVersion) {
    return `${WINDOWS_APP_RELEASES_BASE_URL}/tag/v${normalizedVersion}`;
  }
  return `${WINDOWS_APP_RELEASES_BASE_URL}/latest`;
}

export function openWindowsAppDownload(version?: string | null): void {
  window.location.assign(getWindowsAppDownloadUrl(version));
}
