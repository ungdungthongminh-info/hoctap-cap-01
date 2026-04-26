import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Lock, Shield, Sparkles } from 'lucide-react';
import { useAppData } from '../providers/AppDataProvider';
import { canAccessLesson, getAccessPlan, hasRequiredPlan, isInternalBuild, type AccessPlan } from '../services/accessControl';

const WEB_TOTAL_PRODUCTS_URL = 'https://www.ungdungthongminh.shop/product/prod-study-month';

export function LoginGuard({ children }: { children: React.ReactNode }) {
  useLocation();
  return <>{children}</>;
}

export function FeatureGuard({
  children,
  requiredPlan,
  title,
  description,
}: {
  children: React.ReactNode;
  requiredPlan: AccessPlan;
  title: string;
  description: string;
}) {
  const navigate = useNavigate();
  const currentPlan = getAccessPlan();

  if (isInternalBuild() || hasRequiredPlan(requiredPlan)) {
    return <>{children}</>;
  }

  return (
    <div className="fade-in flex items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="card feature-guard-card w-full max-w-2xl p-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#FEF3C7' }}>
          <Lock size={28} style={{ color: '#D97706' }} />
        </div>
        <h1 className="feature-guard-title text-2xl font-bold mt-4" style={{ color: 'var(--color-primary-dark)' }}>
          {title}
        </h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>{description}</p>
        <div className="feature-guard-status mt-4 p-4 rounded-xl text-left" style={{ background: 'var(--color-surface)' }}>
          <div className="text-xs font-bold" style={{ color: 'var(--color-text-light)' }}>Trạng thái hiện tại</div>
          <div className="mt-2 text-sm" style={{ color: 'var(--color-text)' }}>
            Gói hiện tại: <strong>{currentPlan === 'free' ? 'Free' : currentPlan === 'standard' ? 'Standard' : 'Premium'}</strong>
          </div>
          <div className="mt-1 text-sm" style={{ color: 'var(--color-text)' }}>
            Cần tối thiểu: <strong>{requiredPlan === 'standard' ? 'Standard' : 'Premium'}</strong>
          </div>
          <div className="mt-1 text-sm" style={{ color: 'var(--color-text)' }}>
            Free dùng ngay, nâng cấp bằng key khi cần.
          </div>
        </div>
        <div className="feature-guard-actions mt-5 flex flex-wrap gap-3 justify-center">
          <button
            className="btn-primary feature-guard-button"
            onClick={() => window.open(WEB_TOTAL_PRODUCTS_URL, '_blank', 'noopener,noreferrer')}
          >
            <Sparkles size={16} /> Mua key trên Web Tổng
          </button>
          <button
            className="btn-outline feature-guard-button"
            onClick={() => navigate('/pricing#web-total-account')}
          >
            <Shield size={16} /> Nhập key / quản lý gói
          </button>
        </div>
      </div>
    </div>
  );
}

export function InternalBuildBanner() {
  if (!isInternalBuild()) return null;

  return (
    <div
      className="mx-4 mt-4 rounded-xl px-4 py-2 text-xs font-bold"
      style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' }}
    >
      Bản nội bộ: đã bỏ qua phân quyền gói để test local.
    </div>
  );
}

export function LessonAccessGuard({ children }: { children: React.ReactNode }) {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { state } = useAppData();
  const id = Number(lessonId);
  const isHydrating = state.lessons.length === 0;

  if (isHydrating) {
    return (
      <div className="fade-in text-center py-20">
        <span className="text-4xl block mb-4">⏳</span>
        <p style={{ color: 'var(--color-text-light)' }}>Đang nạp dữ liệu bài học...</p>
      </div>
    );
  }

  const lesson = state.lessons.find((item) => item.id === id);
  if (!lesson) {
    return <>{children}</>;
  }

  const currentPlan = getAccessPlan();
  const lessonAccessible = canAccessLesson(lesson, state.student, currentPlan);

  if (!lessonAccessible) {
    return <Navigate to="/subjects" replace />;
  }

  return <>{children}</>;
}
