import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, RefreshCw, Smartphone, CheckCircle, BellRing, Link2 } from 'lucide-react';
import { playClick } from '../../../shared/utils/sounds';
import { MascotCharacter } from '../../../shared/components';
import { useToast } from '../../../shared/components/Toast';
import {
  checkAppUpdate,
  getAppUpdateDownloadUrl,
  getCurrentAppVersion,
  getUpdateFeedUrlOverride,
  setUpdateFeedUrlOverride,
  type AppUpdateCheckResult,
} from '../../../shared/services/appUpdate';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaSettingsPage() {
  const { showToast } = useToast();
  const [online, setOnline] = useState(navigator.onLine);
  const [swStatus, setSwStatus] = useState<'none' | 'installing' | 'active'>('none');
  const [cacheSize, setCacheSize] = useState<string | null>(null);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installState, setInstallState] = useState<'ready' | 'installed' | 'unavailable'>('unavailable');
  const [updateResult, setUpdateResult] = useState<AppUpdateCheckResult | null>(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateFeedUrlInput, setUpdateFeedUrlInput] = useState(() => getUpdateFeedUrlOverride());

  useEffect(() => {
    const onOn = () => setOnline(true);
    const onOff = () => setOnline(false);
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setInstallState('ready');
    };

    const onInstalled = () => {
      setInstallEvent(null);
      setInstallState('installed');
    };

    window.addEventListener('online', onOn);
    window.addEventListener('offline', onOff);
    window.addEventListener('beforeinstallprompt', onBeforeInstall as EventListener);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('online', onOn);
      window.removeEventListener('offline', onOff);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall as EventListener);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  useEffect(() => {
    const run = async () => {
      setCheckingUpdate(true);
      try {
        const result = await checkAppUpdate();
        setUpdateResult(result);
      } finally {
        setCheckingUpdate(false);
      }
    };
    void run();
  }, []);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isStandalone) {
      setInstallState('installed');
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.active) setSwStatus('active');
        else if (reg?.installing || reg?.waiting) setSwStatus('installing');
      });
    }
    // Estimate cache size
    if ('storage' in navigator && 'estimate' in (navigator as any).storage) {
      (navigator as any).storage.estimate().then((est: { usage?: number; quota?: number }) => {
        if (est.usage) setCacheSize((est.usage / 1024 / 1024).toFixed(1) + ' MB');
      });
    }
  }, []);

  const handleClearCache = async () => {
    playClick();
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      setCacheSize('0 MB');
    }
  };

  const handleUpdateSW = async () => {
    playClick();
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) await reg.update();
    }
  };

  const handleInstallApp = async () => {
    playClick();
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') {
      setInstallState('installed');
      setInstallEvent(null);
    }
  };

  const handleCheckUpdate = async () => {
    playClick();
    setCheckingUpdate(true);
    try {
      const result = await checkAppUpdate();
      setUpdateResult(result);
      if (result.state === 'up-to-date') {
        showToast('Đang ở bản mới nhất.', 'success');
      } else if (result.state === 'update-available' || result.state === 'update-required') {
        showToast('Đã tìm thấy bản cập nhật mới.', 'info');
      } else if (result.state === 'feed-unavailable') {
        showToast('Chưa cấu hình kênh cập nhật.', 'warning');
      } else if (result.state === 'error') {
        showToast(result.message || 'Không kiểm tra được bản mới.', 'error');
      }
    } catch {
      showToast('Không kiểm tra được bản cập nhật.', 'error');
    } finally {
      setCheckingUpdate(false);
    }
  };

  const handleSaveUpdateFeed = () => {
    playClick();
    setUpdateFeedUrlOverride(updateFeedUrlInput);
    showToast(updateFeedUrlInput.trim() ? 'Đã lưu URL kênh cập nhật.' : 'Đã trả về URL mặc định.', 'success');
  };

  const handleOpenUpdate = () => {
    playClick();
    const downloadUrl = getAppUpdateDownloadUrl(updateResult);
    if (downloadUrl) {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    window.location.reload();
  };

  const isElectron = !!(window as any).electronAPI;
  const currentVersion = getCurrentAppVersion();
  const updateStateLabel = updateResult?.state === 'up-to-date'
    ? 'Đang mới nhất'
    : updateResult?.state === 'update-required'
      ? 'Bắt buộc cập nhật'
      : updateResult?.state === 'update-available'
        ? 'Có bản mới'
        : updateResult?.state === 'feed-unavailable'
          ? 'Chưa có kênh cập nhật'
          : updateResult?.state === 'error'
            ? 'Lỗi kiểm tra'
            : 'Chưa kiểm tra';

  return (
    <div className="fade-in max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MascotCharacter size="sm" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            📲 Ngoại tuyến & cập nhật
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            PWA, offline và kiểm tra phiên bản mới
          </p>
        </div>
      </div>

      {/* Online status */}
      <div className="card mb-4 flex items-center gap-3">
        {online ? (
          <Wifi size={24} className="text-green-500" />
        ) : (
          <WifiOff size={24} className="text-red-500" />
        )}
        <div className="flex-1">
          <div className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
            {online ? 'Đang trực tuyến' : 'Đang ngoại tuyến'}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
            {online ? 'Kết nối mạng bình thường' : 'Ứng dụng vẫn hoạt động offline'}
          </div>
        </div>
        <div className="w-3 h-3 rounded-full" style={{ background: online ? '#10B981' : '#EF4444' }} />
      </div>

      {/* Platform */}
      <div className="card mb-4 flex items-center gap-3">
        <Smartphone size={24} style={{ color: 'var(--color-primary)' }} />
        <div className="flex-1">
          <div className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
            Nền tảng
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
            {isElectron ? '🖥️ Electron Desktop — offline đầy đủ' : '🌐 Trình duyệt Web — cài PWA để dùng offline'}
          </div>
        </div>
      </div>

      {/* App update */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-3">
          <BellRing size={20} style={{ color: 'var(--color-primary)' }} />
          <div className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>Cập nhật ứng dụng</div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--color-text-light)' }}>Bản hiện tại:</span>
            <span className="font-bold" style={{ color: 'var(--color-text)' }}>{currentVersion}</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--color-text-light)' }}>Trạng thái:</span>
            <span className="font-bold" style={{
              color: updateResult?.state === 'up-to-date'
                ? '#10B981'
                : updateResult?.state === 'update-available' || updateResult?.state === 'update-required'
                  ? '#D97706'
                  : '#6B7280',
            }}>
              {updateStateLabel}
            </span>
          </div>
          {updateResult?.latestVersion && (
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--color-text-light)' }}>Bản mới nhất:</span>
              <span className="font-bold" style={{ color: 'var(--color-text)' }}>{updateResult.latestVersion}</span>
            </div>
          )}
          {updateResult?.message && (
            <div className="rounded-lg px-3 py-2" style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
              {updateResult.message}
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <button className="btn btn-sm flex-1 flex items-center justify-center gap-1" onClick={handleCheckUpdate} disabled={checkingUpdate}>
            <RefreshCw size={14} className={checkingUpdate ? 'spin' : ''} /> {checkingUpdate ? 'Đang kiểm tra...' : 'Kiểm tra cập nhật'}
          </button>
          {(updateResult?.state === 'update-available' || updateResult?.state === 'update-required') && (
            <button className="btn btn-sm flex-1 flex items-center justify-center gap-1" onClick={handleOpenUpdate}>
              <Download size={14} /> Cập nhật ngay
            </button>
          )}
        </div>

        <div className="mt-3 rounded-xl p-3" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <label className="text-xs font-bold flex items-center gap-1 mb-2" style={{ color: 'var(--color-text)' }}>
            <Link2 size={13} /> URL kênh cập nhật (tùy chọn)
          </label>
          <input
            value={updateFeedUrlInput}
            onChange={(event) => setUpdateFeedUrlInput(event.target.value)}
            placeholder="https://.../app-update.json"
            className="w-full px-3 py-2 rounded-lg border text-xs"
          />
          <div className="flex gap-2 mt-2">
            <button className="btn btn-sm flex-1" onClick={handleSaveUpdateFeed}>
              Lưu URL cập nhật
            </button>
            <button
              className="btn btn-sm flex-1"
              style={{ background: 'var(--color-background-card)', color: 'var(--color-text)' }}
              onClick={() => {
                setUpdateFeedUrlInput('');
                setUpdateFeedUrlOverride('');
                showToast('Đã dùng lại URL mặc định.', 'success');
              }}
            >
              Dùng mặc định
            </button>
          </div>
        </div>
      </div>

      {/* Service Worker */}
      {!isElectron && (
        <div className="card mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Download size={20} style={{ color: 'var(--color-primary)' }} />
            <div className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>Service Worker</div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--color-text-light)' }}>Trạng thái:</span>
              <span className="font-bold" style={{
                color: swStatus === 'active' ? '#10B981' : swStatus === 'installing' ? '#F59E0B' : '#9CA3AF'
              }}>
                {swStatus === 'active' ? '✅ Hoạt động' : swStatus === 'installing' ? '⏳ Đang cài...' : '❌ Chưa cài'}
              </span>
            </div>
            {cacheSize && (
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--color-text-light)' }}>Bộ nhớ cache:</span>
                <span className="font-bold" style={{ color: 'var(--color-text)' }}>{cacheSize}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <button className="btn btn-sm flex-1 flex items-center justify-center gap-1" onClick={handleUpdateSW}>
              <RefreshCw size={14} /> Cập nhật SW
            </button>
            <button className="btn btn-sm flex-1 flex items-center justify-center gap-1" onClick={handleClearCache}
              style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}
            >
              Xóa cache
            </button>
          </div>
        </div>
      )}

      {/* Install instructions */}
      {!isElectron && (
        <div className="card mb-4">
          <h2 className="font-bold text-sm mb-2" style={{ color: 'var(--color-text)' }}>
            📱 Cài đặt ứng dụng (PWA)
          </h2>
          <div className="mb-3 rounded-xl p-3" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div className="text-sm font-bold mb-1" style={{ color: 'var(--color-text)' }}>
              Trạng thái cài đặt: {installState === 'installed' ? 'Đã cài như app' : installState === 'ready' ? 'Sẵn sàng cài' : 'Cài thủ công từ trình duyệt'}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
              Trên Android dùng Chrome hoặc Edge, mở site rồi thêm vào màn hình chính để dùng như app riêng, không qua Play Store.
            </div>
            {installState === 'ready' && (
              <button className="btn btn-sm mt-3 w-full flex items-center justify-center gap-2" onClick={handleInstallApp}>
                <Download size={14} /> Cài ngay trên thiết bị này
              </button>
            )}
          </div>
          <div className="space-y-2 text-xs" style={{ color: 'var(--color-text-light)' }}>
            <div className="flex gap-2">
              <span className="font-bold" style={{ color: 'var(--color-primary)' }}>Android Chrome:</span>
              <span>Nhấn menu ⋮ hoặc biểu tượng cài đặt → "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính"</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold" style={{ color: 'var(--color-primary)' }}>Safari (iOS):</span>
              <span>Nhấn nút Chia sẻ ↑ → "Thêm vào Màn hình chính"</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold" style={{ color: 'var(--color-primary)' }}>Edge:</span>
              <span>Nhấn ... → "Ứng dụng" → "Cài đặt trang web này"</span>
            </div>
          </div>
        </div>
      )}

      {/* Offline features */}
      <div className="card">
        <h2 className="font-bold text-sm mb-3" style={{ color: 'var(--color-text)' }}>
          ✅ Tính năng hoạt động offline
        </h2>
        <div className="space-y-2">
          {[
            'Làm bài tập & luyện tập',
            'Xem tiến bộ & huy hiệu',
            'Thi đấu với Robot',
            'Vẽ & tô màu',
            'Phòng trí nhớ (flashcard)',
            'Đổi giao diện',
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 text-xs">
              <CheckCircle size={14} className="text-green-500" />
              <span style={{ color: 'var(--color-text)' }}>{f}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-[10px]" style={{ color: 'var(--color-text-light)' }}>
            ⚠️ Giọng đọc dùng audio pack tĩnh: tải pack trong cài đặt audio để nghe ổn định khi offline.
          </div>
        </div>
      </div>
    </div>
  );
}
