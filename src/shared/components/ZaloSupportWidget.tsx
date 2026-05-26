import { useState, type MouseEvent } from 'react';
import { SUPPORT_ZALO_URL } from '../constants/support';

export function ZaloSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="zalo-support-floating-button"
        onClick={handleButtonClick}
        aria-label="Hỗ trợ mua key"
      >
        Hỗ trợ mua key
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="zalo-support-overlay" onClick={handleClose}>
          <div className="zalo-support-widget" onClick={(e) => e.stopPropagation()}>
            <div className="zalo-support-widget__headline">Hỗ trợ mua key</div>
            <p className="zalo-support-widget__text">
              Cần mua hoặc kích hoạt key? Nhắn Zalo để được hỗ trợ nhanh.
            </p>
            <a
              className="zalo-support-widget__button"
              href={SUPPORT_ZALO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
            >
              Nhắn Zalo ngay
            </a>
          </div>
        </div>
      )}
    </>
  );
}
