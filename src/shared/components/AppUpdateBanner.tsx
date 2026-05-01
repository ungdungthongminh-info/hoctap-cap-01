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
import {
  checkDesktopUpdaterNow,
  downloadDesktopUpdateNow,
  ensureDesktopUpdaterInitialized,
  getDesktopUpdaterState,
  installDesktopUpdateNow,
  subscribeDesktopUpdater,
  type DesktopUpdaterState,
} from '../services/desktopUpdater';

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
  const [checkingWeb, setCheckingWeb] = useState(false);
  const [desktopState, setDesktopState] = useState<DesktopUpdaterState>(getDesktopUpdaterState());
  const [runningDesktopAction, setRunningDesktopAction] = useState(false);
  const [dismissedDesktopPhase, setDismissedDesktopPhase] = useState<string>('');

  const runWebCheck = useCallback(async () => {
    setCheckingWeb(true);
    try {
      const next = await checkAppUpdate();
      setResult(next);
      if (next.state === 'up-to-date') {
        clearDismissedUpdateVersion();
      }
    } finally {
      setCheckingWeb(false);
    }
  }, []);

  const runDesktopCheck = useCallback(async () => {
    try {
      await checkDesktopUpdaterNow();
    } catch {
      // Desktop auto-update errors are already pushed through updater state channel.
    }
  }, []);

  useEffect(() => {
    void runWebCheck();
    void ensureDesktopUpdaterInitialized();

    const unsubscribeDesktop = subscribeDesktopUpdater(() => {
      setDesktopState(getDesktopUpdaterState());
    });

    const intervalId = window.setInterval(() => { void runWebCheck(); }, 15 * 60_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void runWebCheck();
        void runDesktopCheck();
      }
    };
    window.addEventListener('focus', onVisible);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', onVisible);
      document.removeEventListener('visibilitychange', onVisible);
      unsubscribeDesktop();
    };
  }, [runDesktopCheck, runWebCheck]);

  useEffect(() => {
    if (dismissedDesktopPhase && dismissedDesktopPhase !== desktopState.phase) {
      setDismissedDesktopPhase('');
    }
  }, [desktopState.phase, dismissedDesktopPhase]);

  const showWeb = useMemo(() => shouldShowUpdateBanner(result), [result]);
  const desktopShowable = desktopState.isSupported
    && ['available', 'downloading', 'downloaded', 'error'].includes(desktopState.phase)
    && dismissedDesktopPhase !== desktopState.phase;

  const show = desktopShowable || showWeb;
  if (!show) return null;

  const mode: 'desktop' | 'web' = desktopShowable ? 'desktop' : 'web';

  const latest = result?.latestVersion || 'moi hon';
  const isRequired = result?.state === 'update-required';

  const title = mode === 'desktop'
    ? desktopState.phase === 'downloaded'
      ? `Desktop update ${desktopState.latestVersion || latest} da san sang`
      : desktopState.phase === 'downloading'
        ? `Dang tu tai desktop update ${desktopState.latestVersion || latest}`
        : desktopState.phase === 'available'
          ? `Da co desktop update ${desktopState.latestVersion || latest}`
          : 'Auto-update desktop gap loi'
    : isRequired
      ? `Can cap nhat ung dung len ban ${latest}`
      : `Da co ban cap nhat ${latest}`;

  const description = mode === 'desktop'
    ? (desktopState.message || 'Desktop app dang xu ly cap nhat nen.')
    : (result?.message || 'Ban moi chua sua loi va cai thien do on dinh cho nguoi dung goi thoi gian.');

  const progressText = mode === 'desktop' && desktopState.phase === 'downloading'
    ? `Tien do tai nen: ${Math.round(desktopState.percent)}%`
    : '';

  const canHide = mode === 'desktop'
    ? desktopState.phase !== 'downloaded'
    : !isRequired;

  const handlePrimaryAction = async () => {
    if (mode === 'desktop') {
      setRunningDesktopAction(true);
      try {
        if (desktopState.phase === 'downloaded') {
          await installDesktopUpdateNow();
          return;
        }
        if (desktopState.phase === 'available') {
          await downloadDesktopUpdateNow();
          return;
        }
        await runDesktopCheck();
      } finally {
        setRunningDesktopAction(false);
      }
      return;
    }

    openDownloadOrReload(result);
  };

  const primaryLabel = mode === 'desktop'
    ? desktopState.phase === 'downloaded'
      ? 'Cai dat & khoi dong lai'
      : desktopState.phase === 'available'
        ? 'Tai ngay'
        : desktopState.phase === 'downloading'
          ? 'Dang tai nen...'
          : 'Thu lai auto-update'
    : 'Cap nhat ngay';

  const primaryDisabled = mode === 'desktop'
    ? runningDesktopAction || desktopState.phase === 'downloading'
    : false;

  const hintText = mode === 'desktop'
    ? 'Desktop app se uu tien auto-update nen. Neu that bai, ban van co the tai full bo cai tu Web Tong.'
    : 'Neu dang dung desktop va da bat auto-update, ung dung se tu tai nen trong nhung lan mo tiep theo.';

  return (
    <div className="app-update-banner" role="status" aria-live="polite">
      <div className="app-update-banner__icon-wrap">
        <BellRing size={16} />
      </div>
      <div className="app-update-banner__body">
        <div className="app-update-banner__title">{title}</div>
        <div className="app-update-banner__meta">
          Ban dang dung <strong>{result?.currentVersion || desktopState.currentVersion}</strong>. {description}
          {progressText ? ` ${progressText}` : ''}
          {' '}{hintText}
        </div>
      </div>
      <div className="app-update-banner__actions">
        <button
          className="app-update-banner__btn app-update-banner__btn--primary"
          onClick={() => void handlePrimaryAction()}
          disabled={primaryDisabled}
        >
          <Download size={14} />
          {primaryLabel}
        </button>
        <button
          className="app-update-banner__btn app-update-banner__btn--ghost"
          onClick={() => {
            void runWebCheck();
            void runDesktopCheck();
          }}
          disabled={checkingWeb || runningDesktopAction}
        >
          <RefreshCw size={14} className={checkingWeb || runningDesktopAction ? 'spin' : ''} />
          Kiem tra lai
        </button>
        {canHide && (
          <button
            className="app-update-banner__btn app-update-banner__btn--close"
            onClick={() => {
              if (mode === 'desktop') {
                setDismissedDesktopPhase(desktopState.phase);
                return;
              }
              dismissUpdateVersion(latest);
            }}
            title="An thong bao ban nay"
            aria-label="An thong bao ban nay"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

