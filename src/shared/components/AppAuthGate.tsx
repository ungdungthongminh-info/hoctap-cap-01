/**
 * AppAuthGate - Login Bridge cho App Cấp 01
 * Kiểm tra login/license trước khi cho vào app học
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { ExternalLink, AlertCircle, Loader2, Lock } from 'lucide-react';

const WEB_TOTAL_SITE_URL = 'https://hochungkhoi.site';

interface AppAuthGateProps {
  children: React.ReactNode;
}

/**
 * Màn hình loading khi đang kiểm tra auth
 */
function AuthLoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
    </div>
  );
}

/**
 * Màn hình yêu cầu đăng nhập
 */
function NotLoggedInScreen({ onLogin, onSignUp }: { onLogin: () => void; onSignUp: () => void }) {
  const navigate = useNavigate();
  void navigate;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="card p-8 max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-yellow-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Cần đăng nhập
        </h1>

        <p className="text-gray-600 mb-6">
          Bạn cần đăng nhập để sử dụng App Cấp 01. Nếu chưa mua gói, bạn vẫn có thể học ở chế độ Free.
        </p>

        <div className="space-y-3">
          <button
            onClick={onLogin}
            className="btn-primary w-full py-3 text-base"
          >
            Đăng nhập tài khoản học tập
          </button>

          <button
            onClick={() => window.location.href = 'https://hochungkhoi.site'}
            className="btn-outline w-full py-3 text-base"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Về trang chủ
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Chưa có tài khoản?{' '}
          <button
            onClick={onSignUp}
            className="text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            Đăng ký tài khoản
          </button>
        </p>
      </div>
    </div>
  );
}

/**
 * Banner nhẹ hiển thị góc trên - đang dùng gói Free
 */
export function FreeBanner({ email, onUpgrade }: { email?: string; onUpgrade?: () => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-amber-200 px-3 py-2 flex items-center justify-between text-sm overflow-hidden">
      <span className="text-amber-800 min-w-0 truncate">
        {email ? <><strong className="truncate">{email}</strong> — </> : ''}
        Đang dùng <strong>Gói Free</strong>. Nâng cấp để mở đầy đủ tính năng.
      </span>
      <button
        onClick={onUpgrade ?? (() => window.open(WEB_TOTAL_SITE_URL, '_blank', 'noopener,noreferrer'))}
        className="ml-4 shrink-0 rounded-lg bg-amber-500 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-600"
      >
        Nâng cấp
      </button>
    </div>
  );
}

/**
 * Banner cảnh báo nhẹ khi check entitlements lỗi - vẫn vào Free
 */
function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  if (message) console.warn('[AppAuthGate] entitlement check error:', message);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-amber-200 px-3 py-2 flex items-center justify-between text-sm overflow-hidden">
      <span className="text-amber-800 flex items-center gap-2 min-w-0 truncate">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span className="truncate">Đang dùng chế độ Free. Không kiểm tra được quyền học.</span>
      </span>
      <button
        onClick={onRetry}
        className="ml-3 shrink-0 rounded-lg bg-amber-500 px-2 py-1 text-xs font-semibold text-white hover:bg-amber-600"
      >
        Thử lại
      </button>
    </div>
  );
}

/**
 * Main AppAuthGate Component
 * Kiểm tra auth/license từ Clerk session
 * - Chưa login: chặn, hiện màn đăng nhập
 * - Đã login, chưa mua: vào Free mode (banner nhẹ)
 * - Đã login, có license: vào paid mode
 * - Lỗi check: vào Free mode (banner cảnh báo)
 */
export default function AppAuthGate({ children }: AppAuthGateProps) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { openSignIn, openSignUp } = useClerk();
  const location = useLocation();
  void location;

  // State để tracking auth status
  const [authState, setAuthState] = useState<{
    status: 'idle' | 'loading' | 'not_logged_in' | 'no_license' | 'has_license' | 'error';
    email?: string;
    message?: string;
  }>({ status: 'idle' });

  // Effect để check auth khi component mount hoặc auth thay đổi
  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      setAuthState({ status: 'loading' });

      // Chưa load xong Clerk
      if (!isLoaded) {
        return;
      }

      // Chưa login
      if (!isSignedIn) {
        if (!cancelled) setAuthState({ status: 'not_logged_in' });
        return;
      }

      // Đã login - kiểm tra entitlements
      try {
        const token = await getToken();
        const response = await fetch(`${WEB_TOTAL_API}/auth/check-entitlements`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!data.ok || !data.loggedIn) {
          if (!cancelled) setAuthState({
            status: 'error',
            message: data.error || 'Không xác thực được người dùng',
          });
          return;
        }

        // Check if user has license for Cấp 01
        const hasCap01License =
          (data.allowedGrades && data.allowedGrades.some((g: number) => g >= 2 && g <= 5)) ||
          (data.activeProducts && data.activeProducts.some((p: any) =>
            p.productId?.includes('grade') || p.productId?.includes('cap01')
          )) ||
          data.hasPaidOrder;

        if (!hasCap01License) {
          if (!cancelled) setAuthState({
            status: 'no_license',
            email: data.email,
          });
          return;
        }

        if (!cancelled) setAuthState({
          status: 'has_license',
          email: data.email,
        });

      } catch (err: any) {
        if (!cancelled) setAuthState({
          status: 'error',
          message: err?.message || 'Không kiểm tra được quyền học, vui lòng thử lại',
        });
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken]);

  // Show loading screen
  if (!isLoaded || authState.status === 'idle' || authState.status === 'loading') {
    return <AuthLoadingScreen />;
  }

  // Not logged in - show login screen
  const cap01Url = `${window.location.origin}/cap-01/`;

  if (authState.status === 'not_logged_in') {
    return (
      <NotLoggedInScreen
        onLogin={() => openSignIn({ fallbackRedirectUrl: cap01Url, forceRedirectUrl: cap01Url })}
        onSignUp={() => openSignUp({ fallbackRedirectUrl: cap01Url, forceRedirectUrl: cap01Url })}
      />
    );
  }

  // No license - allow Free mode with upgrade banner
  if (authState.status === 'no_license') {
    return (
      <>
        <FreeBanner email={authState.email} />
        <div className="pt-10">{children}</div>
      </>
    );
  }

  // Error checking entitlements - allow Free mode with warning banner
  if (authState.status === 'error') {
    const retry = () => setAuthState({ status: 'idle' });
    return (
      <>
        <ErrorBanner message={authState.message ?? ''} onRetry={retry} />
        <div className="pt-10">{children}</div>
      </>
    );
  }

  // Has license - show children normally
  return <>{children}</>;
}

// Import useState và useEffect
import { useState, useEffect } from 'react';

// Import API URL constant
const WEB_TOTAL_API = 'https://hochungkhoi.site/api';