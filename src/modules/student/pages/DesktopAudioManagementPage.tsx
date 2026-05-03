import { useEffect, useMemo, useState } from 'react';
import { Download, FolderOpen, RefreshCw, Trash2, Info } from 'lucide-react';

type PackStatus = 'not-installed' | 'downloading' | 'extracting' | 'ready' | 'partial' | 'downloaded' | 'error';

const GRADE_OPTIONS = [
  { grade: 0, label: 'Tien tieu hoc' },
  { grade: 1, label: 'Lop 1' },
  { grade: 2, label: 'Lop 2' },
  { grade: 3, label: 'Lop 3' },
  { grade: 4, label: 'Lop 4' },
  { grade: 5, label: 'Lop 5' },
];

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 MB';
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function toStatusLabel(status: PackStatus): string {
  switch (status) {
    case 'ready':
      return 'Day du - san sang dung offline';
    case 'partial':
      return 'Thieu mot phan - tai them tieng doc';
    case 'downloaded':
      return 'Co du lieu - day du tieng doc';
    case 'downloading':
      return 'Dang tai...';
    case 'extracting':
      return 'Dang giai nen...';
    case 'error':
      return 'Gap loi - khong the tai';
    default:
      return 'Chua tai';
  }
}

function toCoverageLabel(pack: any): string {
  const coverage = pack?.summary?.lessonCoverage;
  if (!coverage || Number(coverage.total || 0) <= 0) {
    return 'Chua co thong tin bai hoc da co tieng doc';
  }
  const available = Number(coverage.available || 0);
  const total = Number(coverage.total || 0);
  const ratio = Number(coverage.ratio || 0);
  return `${available}/${total} bai hoc da co tieng doc (${ratio}%)`;
}

function toStatusColor(status: PackStatus): string {
  switch (status) {
    case 'ready':
      return '#15803D';
    case 'partial':
      return '#B45309';
    case 'downloaded':
      return '#1D4ED8';
    case 'error':
      return '#B91C1C';
    case 'downloading':
    case 'extracting':
      return '#1D4ED8';
    default:
      return '#6B7280';
  }
}

export function DesktopAudioManagementPage() {
  const isDesktop = typeof window !== 'undefined' && Boolean(window.electronAPI?.audioPacks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalBytes, setTotalBytes] = useState(0);
  const [packs, setPacks] = useState<Record<number, any>>({});
  const [busyGrade, setBusyGrade] = useState<number | null>(null);
  const [progressByGrade, setProgressByGrade] = useState<Record<number, { phase: string; message: string; percent: number }>>({});

  const refresh = async () => {
    if (!window.electronAPI?.audioPacks) return;
    setLoading(true);
    setError('');
    try {
      const [, index] = await Promise.all([
        window.electronAPI.audioPacks.getStorageInfo(),
        window.electronAPI.audioPacks.list(),
      ]);
      setTotalBytes(Number(index.totalBytes || 0));
      const map: Record<number, any> = {};
      (index.packs || []).forEach((pack) => {
        map[Number(pack.grade)] = pack;
      });
      setPacks(map);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Khong tai duoc thong tin audio pack desktop.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isDesktop || !window.electronAPI?.audioPacks) {
      setLoading(false);
      return;
    }
    const unsubscribe = window.electronAPI.audioPacks.onProgress((payload) => {
      const totalBytesValue = Number(payload.totalBytes || 0);
      const downloaded = Number(payload.downloadedBytes || 0);
      const percent = totalBytesValue > 0 ? Math.min(100, Math.round(downloaded * 100 / totalBytesValue)) : 0;
      const grade = Number(payload.grade);
      setProgressByGrade((current) => ({
        ...current,
        [grade]: {
          phase: payload.phase,
          message: payload.message,
          percent,
        },
      }));
      if (payload.phase === 'done') {
        void refresh();
      }
    });

    void refresh();
    return unsubscribe;
  }, [isDesktop]);

  const installedCount = useMemo(
    () => Object.values(packs).filter((pack) => pack && pack.status !== 'error').length,
    [packs],
  );

  const totalCoverage = useMemo(() => {
    return GRADE_OPTIONS.reduce((acc, option) => {
      const coverage = packs[option.grade]?.summary?.lessonCoverage;
      acc.available += Number(coverage?.available || 0);
      acc.total += Number(coverage?.total || 0);
      return acc;
    }, { available: 0, total: 0 });
  }, [packs]);

  const isProcessing = busyGrade !== null;

  const downloadPack = async (grade: number) => {
    if (!window.electronAPI?.audioPacks) return;
    setError('');
    try {
      setBusyGrade(grade);
      const existing = packs[grade];
      const replace = existing && existing.status !== 'error';
      await window.electronAPI.audioPacks.download({ grade, replace });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : `Khong tai duoc goi lop ${grade}.`);
    } finally {
      setBusyGrade(null);
    }
  };

  const downloadAllPacks = async () => {
    if (!window.electronAPI?.audioPacks) return;
    setError('');
    try {
      for (const option of GRADE_OPTIONS) {
        setBusyGrade(option.grade);
        await window.electronAPI.audioPacks.download({ grade: option.grade, replace: true });
      }
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Khong tai duoc goi tieng doc day du.');
    } finally {
      setBusyGrade(null);
    }
  };

  const removePack = async (grade: number) => {
    if (!window.electronAPI?.audioPacks) return;
    if (!window.confirm(`Ban co chac muon xoa goi tieng doc lop ${GRADE_OPTIONS[grade]?.label || grade}?`)) {
      return;
    }
    setError('');
    try {
      setBusyGrade(grade);
      await window.electronAPI.audioPacks.remove({ grade });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : `Khong xoa duoc goi lop ${grade}.`);
    } finally {
      setBusyGrade(null);
    }
  };

  const removeAllPacks = async () => {
    if (!window.electronAPI?.audioPacks) return;
    if (!window.confirm('Ban co chac muon xoa tat ca goi tieng doc? Hanh dong nay khong the hoan tac.')) {
      return;
    }
    setError('');
    try {
      for (const option of GRADE_OPTIONS) {
        if (!packs[option.grade]) continue;
        setBusyGrade(option.grade);
        await window.electronAPI.audioPacks.remove({ grade: option.grade });
      }
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Khong xoa duoc goi tieng doc.');
    } finally {
      setBusyGrade(null);
    }
  };

  const verifyAllPacks = async () => {
    if (!window.electronAPI?.audioPacks) return;
    setError('');
    try {
      for (const option of GRADE_OPTIONS) {
        if (!packs[option.grade]) continue;
        setBusyGrade(option.grade);
        await window.electronAPI.audioPacks.verify({ grade: option.grade });
      }
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Khong kiem tra duoc goi tieng doc.');
    } finally {
      setBusyGrade(null);
    }
  };

  const openFolder = async (grade?: number) => {
    if (!window.electronAPI?.audioPacks) return;
    setError('');
    try {
      if (grade === undefined) {
        await window.electronAPI.audioPacks.openFolder({});
      } else {
        await window.electronAPI.audioPacks.openFolder({ grade });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Khong mo duoc thu muc.');
    }
  };

  if (!isDesktop) {
    return (
      <div className="p-4 rounded-lg" style={{ background: '#FEF2F2', color: '#B91C1C' }}>
        <div className="flex gap-2 items-start">
          <Info size={16} className="flex-shrink-0 mt-1" />
          <div>
            <strong>Tinh nang nay chi co san tren desktop app.</strong>
            <p className="mt-1 text-sm">Cai dat giong doc offline tren web dang trong tat ca trang Cai dat &gt; Giong doc.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card">
        <h1 className="text-2xl font-bold mb-1">Quan ly giong doc offline</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
          Tai cac goi tieng doc de su dung offline. Moi lop duoc luu rieng, khong ghi de nhau.
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid gap-3 md:grid-cols-4">
        <div className="card p-3">
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>So lop da tai</div>
          <div className="text-lg font-bold">{installedCount}/{GRADE_OPTIONS.length}</div>
        </div>
        <div className="card p-3">
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Tong dung luong</div>
          <div className="text-lg font-bold">{formatBytes(totalBytes)}</div>
        </div>
        <div className="card p-3">
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Bai hoc co tieng doc</div>
          <div className="text-lg font-bold">
            {totalCoverage.total > 0 ? `${totalCoverage.available}/${totalCoverage.total}` : '0/0'}
          </div>
        </div>
        <div className="card p-3">
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Thu muc</div>
          <button
            type="button"
            className="text-xs font-mono underline"
            onClick={() => void openFolder()}
            style={{ color: 'var(--color-primary)' }}
          >
            Mo
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-primary flex items-center gap-2"
            onClick={() => void downloadAllPacks()}
            disabled={isProcessing}
          >
            <Download size={16} />
            {isProcessing ? 'Dang xu ly...' : 'Tai tat ca cac lop'}
          </button>
          <button
            type="button"
            className="btn flex items-center gap-2"
            style={{ background: 'var(--color-surface)', color: 'var(--color-primary)' }}
            onClick={() => void verifyAllPacks()}
            disabled={isProcessing}
          >
            <RefreshCw size={16} />
            Kiem tra tat ca
          </button>
          <button
            type="button"
            className="btn flex items-center gap-2"
            style={{ background: '#FEF2F2', color: '#B91C1C' }}
            onClick={() => void removeAllPacks()}
            disabled={isProcessing}
          >
            <Trash2 size={16} />
            Xoa tat ca
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ background: '#FEF2F2', color: '#B91C1C' }}>
          <strong>Loi:</strong> {error}
        </div>
      )}

      {loading && (
        <div className="card text-center py-8">
          <div style={{ color: 'var(--color-text-light)' }}>Dang tai thong tin audio pack...</div>
        </div>
      )}

      {/* Grade Packs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GRADE_OPTIONS.map((option) => {
          const pack = packs[option.grade];
          const progress = progressByGrade[option.grade];
          const status = (progress?.phase === 'downloading' || progress?.phase === 'extracting')
            ? (progress.phase as PackStatus)
            : ((pack?.status || 'not-installed') as PackStatus);
          const isBusy = busyGrade === option.grade || status === 'downloading' || status === 'extracting';

          return (
            <div key={option.grade} className="card">
              <div className="mb-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold">{option.label}</h3>
                </div>
                <div className="text-sm font-semibold" style={{ color: toStatusColor(status) }}>
                  {toStatusLabel(status)}
                </div>
              </div>

              {pack && (
                <div className="mb-3 text-xs space-y-1" style={{ color: 'var(--color-text-light)' }}>
                  <div>File: {Number(pack?.summary?.fileCount || 0)} | MP3: {Number(pack?.summary?.mp3Count || 0)}</div>
                  <div>Dung luong: {formatBytes(Number(pack?.summary?.bytes || 0))}</div>
                  <div>{toCoverageLabel(pack)}</div>
                </div>
              )}

              {progress && (status === 'downloading' || status === 'extracting') && (
                <div className="mb-3">
                  <div className="text-xs font-bold mb-1">{progress.message}</div>
                  <div className="h-1.5 rounded-full" style={{ background: '#E2E8F0' }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${Math.max(4, progress.percent || 0)}%`,
                        background: 'var(--color-primary)',
                        transition: 'width 150ms ease',
                      }}
                    />
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
                    {progress.percent}%
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {status === 'not-installed' ? (
                  <button
                    type="button"
                    className="btn btn-primary flex items-center justify-center gap-2 flex-1"
                    onClick={() => void downloadPack(option.grade)}
                    disabled={isBusy}
                  >
                    <Download size={14} />
                    Tai {option.label}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary flex items-center justify-center gap-2 flex-1"
                      onClick={() => void downloadPack(option.grade)}
                      disabled={isBusy}
                    >
                      <Download size={14} />
                      Cap nhat
                    </button>
                    <button
                      type="button"
                      className="btn flex items-center justify-center gap-2 flex-1"
                      style={{ background: '#F8FAFC', color: '#334155' }}
                      onClick={() => void openFolder(option.grade)}
                      disabled={isBusy}
                    >
                      <FolderOpen size={14} />
                      Mo thu muc
                    </button>
                    <button
                      type="button"
                      className="btn flex items-center justify-center gap-2 flex-1"
                      style={{ background: '#FEF2F2', color: '#B91C1C' }}
                      onClick={() => void removePack(option.grade)}
                      disabled={isBusy}
                    >
                      <Trash2 size={14} />
                      Xoa
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="card" style={{ background: '#F0F9FF', borderColor: '#0EA5E9', borderWidth: 1 }}>
        <strong style={{ color: '#0EA5E9' }}>💡 Huong dan:</strong>
        <ul className="text-sm mt-2 space-y-1" style={{ color: 'var(--color-text-light)' }}>
          <li>• Moi lop duoc luu trong thu muc rieng (grade-0, grade-1, ...)</li>
          <li>• Khong ghi de nhau khi tai nhieu lop cung luc</li>
          <li>• Khi hoc bai lop X, app se uu tien dung audio offline cua lop do</li>
          <li>• Tao mo dung offline duoc, chi hoc online duoc neu khong tai audio</li>
        </ul>
      </div>
    </div>
  );
}
