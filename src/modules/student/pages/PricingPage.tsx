/**
 * PricingPage — Trang điều hướng gói học & kích hoạt (đã rút gọn)
 * - Chỉ giữ điều hướng đến trang mua gói hoặc kích hoạt key
 */
import { useNavigate } from 'react-router-dom';
import { Unlock, ExternalLink } from 'lucide-react';
import { SUPPORT_PHONE_TEL, SUPPORT_ZALO_URL } from '../../../shared/constants/support';

// ==================== CONSTANTS ====================
const WEB_TOTAL_SITE_URL = 'https://hochungkhoi.site';

// ==================== COMPONENT ====================
export function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 p-4">
      <div className="card">
        <h1 className="text-2xl font-bold mb-1">Gói học & kích hoạt</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
          Để mua gói mới, vui lòng truy cập web Học Chung Khối.
          Nếu đã có mã kích hoạt, hãy nhập mã tại trang Kích hoạt.
        </p>
      </div>

      <div className="card space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/license/activate')}
          >
            <Unlock size={16} /> Kích hoạt mã
          </button>
          <a
            href={WEB_TOTAL_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ background: 'var(--color-surface)' }}
          >
            <ExternalLink size={16} /> Mua gói học
          </a>
        </div>

        {/* Support Section */}
        <div className="pt-3 mt-3 border-t" style={{ borderColor: 'var(--color-border, #E5E7EB)' }}>
          <p className="text-sm mb-2" style={{ color: 'var(--color-text-light)' }}>
            Cần hỗ trợ kích hoạt? Liên hệ chúng tôi.
          </p>
          <div className="flex gap-2">
            <a
              href={SUPPORT_PHONE_TEL}
              className="btn btn-primary text-sm"
            >
              Gọi hỗ trợ
            </a>
            <a
              href={SUPPORT_ZALO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn text-sm"
              style={{ background: 'var(--color-surface)' }}
            >
              Chat Zalo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
