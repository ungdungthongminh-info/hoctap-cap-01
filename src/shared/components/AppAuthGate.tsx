/**
 * AppAuthGate - Login Bridge cho App Cấp 01
 * Kiểm tra login/license trước khi cho vào app học
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ExternalLink, AlertCircle, Loader2, Lock, ShoppingCart } from 'lucide-react';

const WEB_TOTAL_SITE_URL = 'https://hochungkhoi.site';
const CAP01_RETURN_TO = encodeURIComponent('/cap-01/');

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
function NotLoggedInScreen({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();

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
          Bạn cần đăng nhập bằng tài khoản đã mua gói học trên web chủ để sử dụng App Cấp 01.
        </p>

        <div className="space-y-3">
          <button
            onClick={onLogin}
            className="btn-primary w-full py-3 text-base"
          >
            Đăng nhập tài khoản học tập
          </button>

          <button
            onClick={() => navigate('/')}
            className="btn-outline w-full py-3 text-base"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Về trang chủ
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Chưa có tài khoản?{' '}
          <a
            href={`${WEB_TOTAL_SITE_URL}/sign-up?redirect_url=${CAP01_RETURN_TO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Đăng ký tại web chủ
          </a>
        </p>
      </div>
    </div>
  );
}

/**
 * Màn hình chưa có license
 */
function NoLicenseScreen({ email }: { email?: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="card p-8 max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-6">
          <ShoppingCart className="w-8 h-8 text-orange-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Tài khoản chưa có gói học
        </h1>

        <p className="text-gray-600 mb-2">
          {email ? (
            <>Tài khoản <strong>{email}</strong> chưa mua gói học nào.</>
          ) : (
            'Tài khoản của bạn chưa mua gói học nào.'
          )}
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Vui lòng mua gói học để sử dụng App Cấp 01.
        </p>

        <button
          onClick={() => window.open(WEB_TOTAL_SITE_URL, '_blank', 'noopener,noreferrer')}
          className="btn-primary w-full py-3 text-base mb-3"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Mua gói học trên Web Tổng
        </button>

        <button
          onClick={() => navigate('/')}
          className="btn-outline w-full py-3 text-base"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
}

/**
 * Màn hình lỗi
 */
function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="card p-8 max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Không kiểm tra được quyền học
        </h1>

        <p className="text-gray-600 mb-6">
          {message || 'Đã xảy ra lỗi khi kiểm tra quyền học. Vui lòng thử lại.'}
        </p>

        <button
          onClick={onRetry}
          className="btn-primary w-full py-3 text-base mb-3"
        >
          Thử lại
        </button>

        <button
          onClick={() => window.location.reload()}
          className="btn-outline w-full py-3 text-base"
        >
          Tải lại trang
        </button>
      </div>
    </div>
  );
}

/**
 * Main AppAuthGate Component
 * Kiểm tra auth/license từ Clerk session
 */
export default function AppAuthGate({ children }: AppAuthGateProps) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const location = useLocation();

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
  if (authState.status === 'not_logged_in') {
    return (
      <NotLoggedInScreen onLogin={() => {
        // Clerk sẽ redirect về trang hiện tại sau login
        window.location.href = `/sign-in?redirect_url=${encodeURIComponent(location.pathname)}`;
      }} />
    );
  }

  // No license - show purchase screen
  if (authState.status === 'no_license') {
    return <NoLicenseScreen email={authState.email} />;
  }

  // Error - show error screen with retry
  if (authState.status === 'error') {
    const retry = () => setAuthState({ status: 'idle' });
    return <ErrorScreen message={authState.message ?? ''} onRetry={retry} />;
  }

  // Has license - show children
  return <>{children}</>;
}

// Import useState và useEffect
import { useState, useEffect } from 'react';

// Import API URL constant
const WEB_TOTAL_API = 'https://hochungkhoi.site/api';