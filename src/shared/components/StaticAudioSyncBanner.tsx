import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, DownloadCloud, RefreshCw, X } from 'lucide-react';
import {
  dismissStaticPackGlobalSyncStatus,
  getStaticPackGlobalSyncStatus,
  retryStaticPackAutoSync,
  subscribeStaticPackGlobalSyncStatus,
} from '../services/tts/staticAudioPack';

export function StaticAudioSyncBanner() {
  const [status, setStatus] = useState(getStaticPackGlobalSyncStatus());
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeStaticPackGlobalSyncStatus(() => {
      setStatus(getStaticPackGlobalSyncStatus());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (status.phase !== 'success') {
      return;
    }
    const timer = window.setTimeout(() => {
      dismissStaticPackGlobalSyncStatus();
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [status.phase, status.updatedAt]);

  const progressLabel = (() => {
    if (!status.progress) {
      return '';
    }
    if (status.progress.phase === 'manifest') {
      return status.progress.totalEntries > 0
        ? `Dang tai nguon audio pack: ${status.progress.processedEntries}/${status.progress.totalEntries}`
        : 'Dang doc thong tin goi audio...';
    }
    if (status.progress.phase === 'finalizing') {
      return 'Dang chot du lieu audio local...';
    }
    return `Tien do: ${status.progress.processedEntries}/${status.progress.totalEntries} | Moi: ${status.progress.downloadedEntries} | Bo qua: ${status.progress.skippedEntries} | Loi: ${status.progress.failedEntries}`;
  })();

  const runRetry = async () => {
    setRetrying(true);
    try {
      await retryStaticPackAutoSync();
    } finally {
      setRetrying(false);
    }
  };

  if (status.phase === 'idle' || !status.message) {
    return null;
  }

  const tone = status.phase === 'error'
    ? {
      bg: '#FEF2F2',
      border: '#FECACA',
      title: '#991B1B',
      text: '#7F1D1D',
      Icon: AlertTriangle,
    }
    : status.phase === 'success'
      ? {
        bg: '#ECFDF5',
        border: '#A7F3D0',
        title: '#065F46',
        text: '#065F46',
        Icon: CheckCircle2,
      }
      : {
        bg: '#EFF6FF',
        border: '#BFDBFE',
        title: '#1E3A8A',
        text: '#1E40AF',
        Icon: DownloadCloud,
      };

  return (
    <div style={{ position: 'fixed', top: 8, left: 8, right: 8, zIndex: 60, maxWidth: 'calc(100vw - 16px)', margin: '0 auto', pointerEvents: 'none' }}>
      <div
        className="p-3 rounded-xl"
        style={{
          background: tone.bg,
          border: `1px solid ${tone.border}`,
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
          pointerEvents: 'auto',
        }}
      >
        <div className="flex items-start gap-3">
          <tone.Icon size={18} style={{ color: tone.title, marginTop: 2, flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold" style={{ color: tone.title }}>{status.message}</div>
            {status.hint && (
              <div className="text-xs mt-1" style={{ color: tone.text }}>
                {status.hint}
              </div>
            )}
            {progressLabel && (
              <div className="text-xs mt-1" style={{ color: tone.text }}>
                {progressLabel}
              </div>
            )}
            {status.phase !== 'syncing' && (
              <div className="text-[11px] mt-2" style={{ color: tone.text }}>
                Luu y: ban web khong the dung chung IndexedDB giua Chrome/Edge. Neu muon dung chung audio cho toan may, nen dung ban desktop de luu vao thu muc co dinh tren o dia.
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {status.canRetry && (
              <button
                type="button"
                className="btn"
                style={{ background: '#FFFFFF', color: '#1F2937' }}
                onClick={() => void runRetry()}
                disabled={retrying}
              >
                <RefreshCw size={14} className={retrying ? 'animate-spin' : ''} />
                {retrying ? 'Dang thu lai...' : 'Thu lai'}
              </button>
            )}
            <button
              type="button"
              className="p-1 rounded"
              onClick={() => dismissStaticPackGlobalSyncStatus()}
              aria-label="An thong bao dong bo audio"
            >
              <X size={14} style={{ color: tone.text }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
