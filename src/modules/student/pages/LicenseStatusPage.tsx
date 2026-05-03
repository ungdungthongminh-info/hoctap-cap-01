import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  clearCap01Activation,
  readCap01LicenseCache,
  resolveAllowedGrades,
  verifyCap01License,
  type Cap01LicenseCache,
} from '../../../shared/services/cap01License';

function formatDate(value: string | null | undefined): string {
  if (!value) return 'N/A';
  const ms = new Date(value).getTime();
  if (!Number.isFinite(ms)) return 'N/A';
  return new Date(ms).toLocaleString('vi-VN');
}

export function LicenseStatusPage() {
  const navigate = useNavigate();
  const [cache, setCache] = useState<Cap01LicenseCache | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  const reload = async () => {
    const next = await readCap01LicenseCache();
    setCache(next);
  };

  useEffect(() => {
    void (async () => {
      setLoading(true);
      await reload();
      setLoading(false);
    })();
  }, []);

  const onVerify = async () => {
    setActionLoading(true);
    setMessage('');
    try {
      const next = await verifyCap01License({ force: true });
      setCache(next);
      setMessage(next ? 'Đã verify thành công.' : 'License không còn hợp lệ trên server.');
    } catch {
      setMessage('Không kết nối được server để verify.');
    } finally {
      setActionLoading(false);
    }
  };

  const onClear = async () => {
    setActionLoading(true);
    setMessage('');
    await clearCap01Activation();
    setCache(null);
    setActionLoading(false);
    setMessage('Đã xóa kích hoạt local.');
  };

  if (loading) {
    return <div className="card">Đang tải trạng thái bản quyền...</div>;
  }

  const isActive = Boolean(cache);
  const grades = resolveAllowedGrades(cache);
  const ttsEnabled = Boolean(cache?.entitlement?.features?.desktopOfflineTts);
  const downloadAllEnabled = Boolean(cache?.entitlement?.features?.downloadAllGrades);

  return (
    <div className="space-y-4">
      <div className="card">
        <h1 className="text-2xl font-bold mb-1">Tài khoản & Gói đang dùng</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
          Trạng thái xác minh bản quyền cho desktop offline.
        </p>
      </div>

      <div className="card space-y-2 text-sm">
        <div>Trạng thái: <strong>{isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt / Hết hạn'}</strong></div>
        <div>Gói: <strong>{cache?.entitlement?.plan || 'N/A'}</strong></div>
        <div>Ngày hết hạn: <strong>{formatDate(cache?.entitlement?.license?.expiresAt || null)}</strong></div>
        <div>Lớp được mở: <strong>{isActive ? grades.join(', ') : 'N/A'}</strong></div>
        <div>TTS offline: <strong>{ttsEnabled ? 'bật' : 'tắt'}</strong></div>
        <div>Tải tất cả lớp: <strong>{downloadAllEnabled ? 'bật' : 'tắt'}</strong></div>
        <div>Thiết bị hiện tại: <strong>{cache?.deviceName || 'N/A'}</strong></div>
        <div>Offline còn hiệu lực đến: <strong>{formatDate(cache?.offlineValidUntil || null)}</strong></div>
        <div>Lần verify gần nhất: <strong>{formatDate(cache?.lastVerifiedAt || null)}</strong></div>
      </div>

      {message && (
        <div className="card text-sm" style={{ color: '#1D4ED8' }}>
          {message}
        </div>
      )}

      <div className="card flex gap-2 flex-wrap">
        <button type="button" className="btn btn-primary" onClick={() => void onVerify()} disabled={actionLoading}>
          {actionLoading ? 'Đang verify...' : 'Verify lại'}
        </button>
        <button type="button" className="btn" onClick={() => void onClear()} disabled={actionLoading}>
          Đăng xuất / Xóa kích hoạt local
        </button>
        <button type="button" className="btn" onClick={() => navigate('/license/activate')}>
          Nhập key khác
        </button>
      </div>
    </div>
  );
}
