const WINDOWS_APP_DOWNLOAD_URL = 'https://github.com/ungdungthongminh-info/hoctap-cap-01/releases/latest/download/HocHungKhoi_Desktopapp-Win.exe';

export function openWindowsAppDownload(): void {
  window.location.assign(WINDOWS_APP_DOWNLOAD_URL);
}
