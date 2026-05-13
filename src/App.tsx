import { useState, useEffect, Component } from 'react';
import { HashRouter, useLocation } from 'react-router-dom';
import { ThemeProvider } from './shared/themes';
import { AppDataProvider } from './shared/providers/AppDataProvider';
import { ToastProvider } from './shared/components/Toast';
import { StaticAudioSyncBanner } from './shared/components/StaticAudioSyncBanner';
import { isAdminUnlocked, unlockAdmin } from './shared/utils/adminAccess';
import { STORAGE_KEYS } from './shared/constants/storageKeys';
import { AppRoutes } from './routes/appRoutes';
import { verifyCap01License } from './shared/services/cap01License';

class RootErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; message: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, message: error instanceof Error ? error.message : 'Unknown error' };
  }

  componentDidCatch(error: unknown) {
    console.error('App crashed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ width: '100%', maxWidth: 680, background: '#FFFFFF', border: '2px solid #DC2626', borderRadius: 16, padding: 20 }}>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#991B1B' }}>Ứng dụng gặp lỗi hiển thị</h2>
            <p className="text-sm mb-2" style={{ color: '#7F1D1D' }}>
              Đã chặn màn hình trắng. Vui lòng tải lại trang hoặc xoá cache localStorage nếu vẫn gặp lỗi.
            </p>
            <div className="text-xs" style={{ color: '#DC2626' }}>
              {this.state.message}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                className="text-xs px-3 py-1.5 rounded-lg"
                style={{ background: '#111827', color: '#FFFFFF' }}
                onClick={() => window.location.reload()}
              >
                Tải lại
              </button>
              <button
                className="text-xs px-3 py-1.5 rounded-lg"
                style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }}
                onClick={() => {
                  try { localStorage.removeItem(STORAGE_KEYS.APP_STATE); } catch { /* */ }
                  try { sessionStorage.clear(); } catch { /* */ }
                  window.location.reload();
                }}
              >
                Xoá cache và tải lại
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

class AdminErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; message: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, message: error instanceof Error ? error.message : 'Unknown error' };
  }

  componentDidCatch(error: unknown) {
    console.error('Admin page crashed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ width: '100%', maxWidth: 640, background: '#FFFFFF', border: '2px solid #DC2626', borderRadius: 16, padding: 20 }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#991B1B' }}>Trang Admin bị lỗi</h2>
          <p className="text-sm mb-2" style={{ color: '#7F1D1D' }}>
            Đã chặn trang trắng. Vui lòng tải lại trang và đảm bảo backend đang chạy.
          </p>
          <div className="text-xs" style={{ color: '#DC2626' }}>
            {this.state.message}
          </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AdminGate({ children }: { children: React.ReactNode }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(isAdminUnlocked());

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#FFFFFF', border: '2px solid #111827', borderRadius: 16, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}>
      <h2 className="text-xl font-bold mb-2" style={{ color: '#111827' }}>Khu vực quản trị</h2>
      <p className="text-sm mb-4" style={{ color: '#374151' }}>
        Nhập mã PIN để vào trang admin.
      </p>
      <input
        type="password"
        className="w-full px-3 py-2 rounded-lg border mb-3"
        style={{ borderColor: '#9CA3AF', color: '#111827', background: '#FFFFFF' }}
        placeholder="Nhập PIN admin"
        value={pin}
        onChange={(e) => { setPin(e.target.value); setError(''); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const ok = unlockAdmin(pin);
            if (!ok) setError('PIN không đúng');
            else setUnlocked(true);
          }
        }}
      />
      {error && <div className="text-sm mb-3" style={{ color: '#DC2626' }}>{error}</div>}
      <button
        className="w-full"
        style={{ background: '#111827', color: '#FFFFFF', padding: '10px 12px', borderRadius: 10, fontWeight: 700 }}
        onClick={() => {
          const ok = unlockAdmin(pin);
          if (!ok) setError('PIN không đúng');
          else setUnlocked(true);
        }}
      >
        Mở trang Admin
      </button>
      </div>
    </div>
  );
}

function LicenseHeartbeat() {
  useEffect(() => {
    let disposed = false;

    const sync = async () => {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        return;
      }

      await verifyCap01License({ force: false }).catch(() => null);
      if (disposed) return;
    };

    void sync();
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void sync();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return null;
}

function AppContent({ AdminGate, AdminErrorBoundary }: { AdminGate: React.ComponentType<{ children: React.ReactNode }>; AdminErrorBoundary: React.ComponentType<{ children: React.ReactNode }>; }) {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && <StaticAudioSyncBanner />}
      <AppRoutes AdminGate={AdminGate} AdminErrorBoundary={AdminErrorBoundary} />
    </>
  );
}

export function App() {
  return (
    <RootErrorBoundary>
      <ThemeProvider>
        <AppDataProvider>
          <LicenseHeartbeat />
          <ToastProvider>
            <HashRouter>
              <AppContent AdminGate={AdminGate} AdminErrorBoundary={AdminErrorBoundary} />
            </HashRouter>
          </ToastProvider>
        </AppDataProvider>
      </ThemeProvider>
    </RootErrorBoundary>
  );
}
