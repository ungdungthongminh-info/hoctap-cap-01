import { type MouseEvent } from 'react';

const ZALO_URL = 'https://zalo.me/9892964685';

export function ZaloSupportWidget() {
  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="zalo-support-widget" role="dialog" aria-label="Hỗ trợ mua key">
      <div className="zalo-support-widget__headline">Hỗ trợ mua key</div>
      <p className="zalo-support-widget__text">
        Cần mua hoặc kích hoạt key? Nhắn Zalo để được hỗ trợ nhanh.
      </p>
      <a
        className="zalo-support-widget__button"
        href={ZALO_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleLinkClick}
      >
        Nhắn Zalo ngay
      </a>
    </div>
  );
}
