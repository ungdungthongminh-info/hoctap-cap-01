import { useEffect, useMemo, useState } from 'react';
import { Download, FolderOpen, RefreshCw, Trash2 } from 'lucide-react';
import {
  readCap01LicenseCache,
  resolveAllowedGrades,
  isDesktopOfflineTtsEnabled,
  type Cap01LicenseCache,
} from '../services/cap01License';

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
      return 'Da tai day du';
    case 'partial':
      return 'Tai thieu mot phan';
    case 'downloaded':
      return 'Da co goi tren may';
    case 'downloading':
      return 'Dang tai';
    case 'extracting':
      return 'Dang giai nen';
    case 'error':
      return 'Gap loi';
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

export function DesktopAudioPackPanel() {
  const isDesktop = typeof window !== 'undefined' && Boolean(window.electronAPI?.audioPacks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [storageRoot, setStorageRoot] = useState('');
  const [totalBytes, setTotalBytes] = useState(0);
  const [packs, setPacks] = useState<Record<number, any>>({});
  const [busyGrade, setBusyGrade] = useState<number | null>(null);
  const [progressByGrade, setProgressByGrade] = useState<Record<number, { phase: string; message: string; percent: number }>>({});
  const [licenseCache, setLicenseCache] = useState<Cap01LicenseCache | null>(null);

  const allowedGrades = useMemo(() => resolveAllowedGrades(licenseCache), [licenseCache]);
  const allowedGradeSet = useMemo(() => new Set(allowedGrades), [allowedGrades]);
  const canUseDesktopOffline = useMemo(() => isDesktopOfflineTtsEnabled(licenseCache), [licenseCache]);
  const allowedOptions = useMemo(
    () => GRADE_OPTIONS.filter((option) => allowedGradeSet.has(option.grade)),
    [allowedGradeSet],
  );

  const refresh = async () => {
    if (!window.electronAPI?.audioPacks) return;
    setLoading(true);
    setError('');
    try {
      const [storageInfo, index] = await Promise.all([
        window.electronAPI.audioPacks.getStorageInfo(),
        window.electronAPI.audioPacks.list(),
      ]);
      setStorageRoot(storageInfo.rootPath || '');
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

  useEffect(() => {
    void (async () => {
      const cache = await readCap01LicenseCache();
      setLicenseCache(cache);
    })();
  }, []);

  const installedCount = useMemo(
    () => allowedOptions.filter((option) => packs[option.grade] && packs[option.grade].status !== 'error').length,
    [allowedOptions, packs],
  );

  const totalCoverage = useMemo(() => {
    return allowedOptions.reduce((acc, option) => {
      const coverage = packs[option.grade]?.summary?.lessonCoverage;
      acc.available += Number(coverage?.available || 0);
      acc.total += Number(coverage?.total || 0);
      return acc;
    }, { available: 0, total: 0 });
  }, [allowedOptions, packs]);

  const isProcessingAll = busyGrade !== null;

  const downloadAllPacks = async () => {
    if (!window.electronAPI?.audioPacks) return;
    setError('');
    try {
      for (const option of GRADE_OPTIONS) {
        if (!allowedGradeSet.has(option.grade)) continue;
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

  const verifyAllPacks = async () => {
    if (!window.electronAPI?.audioPacks) return;
    setError('');
    try {
      for (const option of GRADE_OPTIONS) {
        if (!allowedGradeSet.has(option.grade)) continue;
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

  const removeAllPacks = async () => {
    if (!window.electronAPI?.audioPacks) return;
    setError('');
    try {
      for (const option of GRADE_OPTIONS) {
        if (!allowedGradeSet.has(option.grade)) continue;
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
    return null;
  }

  if (!canUseDesktopOffline) {
    return (
      <div className="card mb-4" style={{ background: '#FEF2F2', color: '#B91C1C' }}>
        Gói hiện tại chưa bật TTS offline desktop. Vui lòng kích hoạt key hợp lệ.
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-bold">Tieng doc da luu tren may</h3>
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
            Bam mot lan de tai day du tieng doc cho moi lop. Bang ben duoi cho biet lop nao da du.
          </div>
        </div>
        <button
          type="button"
          className="btn"
          style={{ background: 'var(--color-surface)', color: 'var(--color-primary)' }}
          onClick={() => openFolder()}
        >
          <FolderOpen size={14} />
          Mo thu muc goc
        </button>
      </div>

      <div className="grid gap-2 md:grid-cols-3 mb-3">
        <div className="p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>So lop da tai</div>
          <div className="text-sm font-bold">{installedCount}/{allowedOptions.length}</div>
        </div>
        <div className="p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Tong dung luong</div>
          <div className="text-sm font-bold">{formatBytes(totalBytes)}</div>
        </div>
        <div className="p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Thu muc luu</div>
          <div className="text-[11px] font-mono break-all">{storageRoot || 'Dang tai...'}</div>
        </div>
      </div>

      <div className="mb-3 p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <div className="text-sm font-bold">Tong bai hoc da co tieng doc</div>
        <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
          {totalCoverage.total > 0
            ? `${totalCoverage.available}/${totalCoverage.total} bai hoc da co tieng doc tren may nay.`
            : 'Chua co du lieu tieng doc da luu tren may.'}
        </div>
      </div>

      {error && (
        <div className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: '#FEF2F2', color: '#B91C1C' }}>
          {error}
        </div>
      )}

      <div className="flex gap-3 flex-wrap mb-3">
        <button
          type="button"
          className="btn btn-primary flex items-center gap-2"
          onClick={() => void downloadAllPacks()}
          disabled={isProcessingAll}
        >
          <Download size={16} />
          {isProcessingAll ? 'Dang tai goi day du...' : 'Tai goi tieng doc day du (moi lop)'}
        </button>
        <button
          type="button"
          className="btn flex items-center gap-2"
          style={{ background: 'var(--color-surface)', color: 'var(--color-primary)' }}
          onClick={() => void verifyAllPacks()}
          disabled={isProcessingAll}
        >
          <RefreshCw size={16} />
          Kiem tra lai
        </button>
        <button
          type="button"
          className="btn flex items-center gap-2"
          style={{ background: '#FEF2F2', color: '#B91C1C' }}
          onClick={() => void removeAllPacks()}
          disabled={isProcessingAll}
        >
          <Trash2 size={16} />
          Xoa goi da tai
        </button>
      </div>

      <div className="grid gap-3">
        {allowedOptions.map((option) => {
          const pack = packs[option.grade];
          const progress = progressByGrade[option.grade];
          const status = (progress?.phase === 'downloading' || progress?.phase === 'extracting')
            ? progress.phase
            : (pack?.status || 'not-installed');
          const isBusy = busyGrade === option.grade || status === 'downloading' || status === 'extracting';

          return (
            <div key={option.grade} className="p-3 rounded-xl" style={{ border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold">{option.label}</div>
                  <div className="text-xs font-bold" style={{ color: toStatusColor(status as PackStatus) }}>
                    {toStatusLabel(status as PackStatus)}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
                    File: {Number(pack?.summary?.fileCount || 0)} | MP3: {Number(pack?.summary?.mp3Count || 0)} | Dung luong: {formatBytes(Number(pack?.summary?.bytes || 0))}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                    Bai hoc da co tieng doc: {toCoverageLabel(pack)}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn"
                  style={{ background: '#F8FAFC', color: '#334155' }}
                  onClick={() => void openFolder(option.grade)}
                  disabled={isBusy || !pack}
                >
                  <FolderOpen size={14} />
                  Mo thu muc
                </button>
              </div>

              {progress && (status === 'downloading' || status === 'extracting') && (
                <div className="mt-2">
                  <div className="text-xs mb-1" style={{ color: 'var(--color-text-light)' }}>
                    {progress.message || (status === 'downloading' ? 'Dang tai...' : 'Dang giai nen...')}
                  </div>
                  <div className="h-2 rounded-full" style={{ background: '#E2E8F0' }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${Math.max(4, progress.percent || 0)}%`,
                        background: '#0EA5E9',
                        transition: 'width 150ms ease',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="text-xs mt-3" style={{ color: 'var(--color-text-light)' }}>
          Dang tai thong tin audio pack desktop...
        </div>
      )}
    </div>
  );
}
