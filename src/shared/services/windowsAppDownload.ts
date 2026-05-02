const WINDOWS_APP_DOWNLOAD_URL = 'https://hoctap-cap-01.vercel.app/desktop-updates/HocHungKhoi_Desktopapp-Win.exe';

export function openWindowsAppDownload(preferNewTab = true): void {
  if (preferNewTab) {
    const popup = window.open(WINDOWS_APP_DOWNLOAD_URL, '_blank', 'noopener,noreferrer');
    if (popup) {
      return;
    }
  }

  window.location.assign(WINDOWS_APP_DOWNLOAD_URL);
}
