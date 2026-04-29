import { useCallback, useEffect, useMemo, useState } from 'react';
import { BellRing, Download, RefreshCw, X } from 'lucide-react';
import {
  checkAppUpdate,
  clearDismissedUpdateVersion,
  dismissUpdateVersion,
  getAppUpdateDownloadUrl,
  shouldShowUpdateBanner,
  type AppUpdateCheckResult,
} from '../services/appUpdate';

function openDownloadOrReload(result: AppUpdateCheckResult | null): void {
  if (!result) return;
  const downloadUrl = getAppUpdateDownloadUrl(result);
  if (downloadUrl) {
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    return;
  }
  window.location.reload();
}

export function AppUpdateBanner() {
  const [result, setResult] = useState<AppUpdateCheckResult | null>(null);
  const [checking, setChecking] = useState(false);

  const runCheck = useCallback(async () => {
    setChecking(true);
    try {
      const next = await checkAppUpdate();
      setResult(next);
      if (next.state === 'up-to-date') {
        clearDismissedUpdateVersion();
      }
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void runCheck();

    const intervalId = window.setInterval(() => { void runCheck(); }, 15 * 60_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void runCheck();
      }
    };
    window.addEventListener('focus', onVisible);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', onVisible);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [runCheck]);

  const show = useMemo(() => shouldShowUpdateBanner(result), [result]);
  if (!show || !result) return null;

  const latest = result.latestVersion || 'mới hơn';
  const isRequired = result.state === 'update-required';
  const title = isRequired
    ? `Cần cập nhật ứng dụng lên bản ${latest}`
    : `Đã có bản cập nhật ${latest}`;
  const description = result.message || 'Bản mới chứa sửa lỗi và cải thiện ổn định cho người dùng gói thời gian.';

  return (
    <div className="app-update-banner" role="status" aria-live="polite">
      <div className="app-update-banner__icon-wrap">
        <BellRing size={16} />
      </div>
      <div className="app-update-banner__body">
        <div className="app-update-banner__title">{title}</div>
        <div className="app-update-banner__meta">
          Bạn đang dùng <strong>{result.currentVersion}</strong>. {description}
        </div>
      </div>
      <div className="app-update-banner__actions">
        <button
          className="app-update-banner__btn app-update-banner__btn--primary"
          onClick={() => openDownloadOrReload(result)}
        >
          <Download size={14} />
          Cập nhật ngay
        </button>
        <button
          className="app-update-banner__btn app-update-banner__btn--ghost"
          onClick={() => void runCheck()}
          disabled={checking}
        >
          <RefreshCw size={14} className={checking ? 'spin' : ''} />
          Kiểm tra lại
        </button>
        {!isRequired && (
          <button
            className="app-update-banner__btn app-update-banner__btn--close"
            onClick={() => dismissUpdateVersion(latest)}
            title="Ẩn thông báo bản này"
            aria-label="Ẩn thông báo bản này"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

