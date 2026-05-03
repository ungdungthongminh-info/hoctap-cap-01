import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activateCap01License } from '../../../shared/services/cap01License';

export function LicenseActivationPage() {
  const navigate = useNavigate();
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const normalizedKey = useMemo(() => licenseKey.trim().toUpperCase(), [licenseKey]);

  const onActivate = async () => {
    if (!normalizedKey) {
      setMessage({ type: 'error', text: 'Vui lòng nhập license key' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const cache = await activateCap01License(normalizedKey);
      setMessage({
        type: 'success',
        text: `Kích hoạt thành công. Offline đến ${new Date(cache.offlineValidUntil).toLocaleString('vi-VN')}`,
      });
      setTimeout(() => navigate('/license/status'), 900);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Không kết nối được server',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <h1 className="text-2xl font-bold mb-1">Kích hoạt bản quyền</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
          Nhập mã bản quyền từ Web Tổng để kích hoạt gói đã mua.
        </p>
      </div>

      <div className="card space-y-3">
        <label className="text-sm font-semibold" htmlFor="license-key-input">License key</label>
        <input
          id="license-key-input"
          className="w-full px-3 py-2 rounded-lg border"
          style={{ borderColor: '#CBD5E1' }}
          value={licenseKey}
          onChange={(event) => setLicenseKey(event.target.value.toUpperCase())}
          placeholder="VD: HHK-XXXX-XXXX"
          autoComplete="off"
          spellCheck={false}
        />

        {message && (
          <div
            className="text-sm rounded-lg px-3 py-2"
            style={{
              background: message.type === 'success' ? '#DCFCE7' : '#FEF2F2',
              color: message.type === 'success' ? '#166534' : '#B91C1C',
            }}
          >
            {message.text}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void onActivate()}
            disabled={loading}
          >
            {loading ? 'Đang kích hoạt...' : 'Kích hoạt'}
          </button>
          <button
            type="button"
            className="btn"
            style={{ background: 'var(--color-surface)' }}
            onClick={() => navigate('/pricing')}
          >
            Xem bảng giá
          </button>
          <button
            type="button"
            className="btn"
            style={{ background: 'var(--color-surface)' }}
            onClick={() => navigate('/license/status')}
          >
            Xem trạng thái gói
          </button>
          <button
            type="button"
            className="btn"
            style={{ background: 'var(--color-surface)' }}
            onClick={() => navigate('/home')}
          >
            Vào học Free
          </button>
        </div>
      </div>
    </div>
  );
}
