import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../shared/themes';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel, getSubjectsForGrade, getSubjectByCode } from '../../../data/subjects';
import { BookOpen, BarChart3, Sparkles, RefreshCw, PenTool, GraduationCap, Gamepad2, CalendarDays, Brush, Star, Brain, Swords, ShoppingBag, Crown, Shield } from 'lucide-react';
import { StudyReminder } from '../../../shared/components/StudyReminder';
import { MascotCharacter } from '../../../shared/components';
import { getXpData } from '../../../shared/utils/achievements';
import { STORAGE_KEYS } from '../../../shared/constants/storageKeys';
import { getAccessPlan } from '../../../shared/services/accessControl';
import '../styles/premiumButtons.css';

const SUB_EXPIRY_KEY = 'hhk_sub_expiry';

type KeyExpiryBadge = {
  text: string;
  bg: string;
  color: string;
  border: string;
};

function getKeyExpiryBadge(plan: ReturnType<typeof getAccessPlan>): KeyExpiryBadge | null {
  if (plan === 'free') return null;

  const expiryRaw = localStorage.getItem(SUB_EXPIRY_KEY);
  if (!expiryRaw) {
    return {
      text: 'Key vinh vien',
      bg: '#D1FAE5',
      color: '#065F46',
      border: '#6EE7B7',
    };
  }

  const expiresAt = new Date(expiryRaw);
  if (Number.isNaN(expiresAt.getTime())) {
    return {
      text: 'Key dang hoat dong',
      bg: '#DBEAFE',
      color: '#1D4ED8',
      border: '#93C5FD',
    };
  }

  const diffMs = expiresAt.getTime() - Date.now();
  const leftDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const expiryDate = expiresAt.toLocaleDateString('vi-VN');

  if (leftDays < 0) {
    return {
      text: `Het han ${expiryDate}`,
      bg: '#FEE2E2',
      color: '#991B1B',
      border: '#FCA5A5',
    };
  }

  if (leftDays <= 7) {
    return {
      text: `HSD ${expiryDate} • con ${leftDays} ngay`,
      bg: '#FEF3C7',
      color: '#92400E',
      border: '#FCD34D',
    };
  }

  return {
    text: `HSD ${expiryDate} • con ${leftDays} ngay`,
    bg: '#DCFCE7',
    color: '#166534',
    border: '#86EFAC',
  };
}

export function HomePage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { state, getCompletedCount, getAverageScore, getStreak, getNeedsReviewLessons, getSubjectLessons } = useAppData();
  const [currentPlan, setCurrentPlan] = useState(() => getAccessPlan());
  const [keyExpiryBadge, setKeyExpiryBadge] = useState<KeyExpiryBadge | null>(() => getKeyExpiryBadge(getAccessPlan()));

  const completed = getCompletedCount();
  const total = getSubjectLessons().length;
  const avg = getAverageScore();
  const streak = getStreak();
  const needsReview = getNeedsReviewLessons();
  const currentSubject = getSubjectByCode(state.student.subjectCode);
  const gradeSubjects = getSubjectsForGrade(state.student.grade);
  const studiedToday = state.practiceSets.some((ps) => ps.finishedAt && ps.finishedAt.startsWith(new Date().toISOString().slice(0, 10)));
  const xpData = getXpData(parseInt(localStorage.getItem(STORAGE_KEYS.XP) || '0', 10) || 0);

  useEffect(() => {
    const syncPlan = () => {
      const nextPlan = getAccessPlan();
      setCurrentPlan(nextPlan);
      setKeyExpiryBadge(getKeyExpiryBadge(nextPlan));
    };

    window.addEventListener('focus', syncPlan);
    window.addEventListener('storage', syncPlan);
    return () => {
      window.removeEventListener('focus', syncPlan);
      window.removeEventListener('storage', syncPlan);
    };
  }, []);

  return (
    <div className="fade-in flex flex-col items-center gap-8 w-full max-w-[1480px] mx-auto pb-8">
      {/* Notifications */}
      <StudyReminder streak={streak} studiedToday={studiedToday} needsReviewCount={needsReview.length} />

      {/* Hero mascot */}
      <div className="text-center mt-2">
        <MascotCharacter size="xl" />
        <h1 className="text-3xl font-bold mt-4" style={{ color: 'var(--color-primary-dark)' }}>
          Chào <strong style={{ color: 'var(--color-primary)' }}>{state.student.fullName}</strong>! 🎉
        </h1>
        <p className="text-lg mt-2" style={{ color: 'var(--color-text-light)' }}>
          Cùng bạn <strong style={{ color: 'var(--color-primary)' }}>{theme.mascotName}</strong> học {currentSubject?.name || 'Toán'} thật vui nào!
        </p>
      </div>

      <div
        className="card relative w-full max-w-3xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        style={{
          borderColor: currentPlan === 'free' ? '#BFDBFE' : '#A7F3D0',
          borderWidth: 2,
          background: currentPlan === 'free' ? 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)' : 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
        }}
      >
        {keyExpiryBadge && (
          <div
            className="absolute top-2 right-2 rounded-full px-2.5 py-1 text-[11px] font-bold"
            style={{
              background: keyExpiryBadge.bg,
              color: keyExpiryBadge.color,
              border: `1px solid ${keyExpiryBadge.border}`,
              maxWidth: '58%',
            }}
            title={keyExpiryBadge.text}
          >
            <span className="block truncate">{keyExpiryBadge.text}</span>
          </div>
        )}
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{ background: currentPlan === 'free' ? '#DBEAFE' : '#D1FAE5' }}
          >
            {currentPlan === 'free' ? <Shield size={22} style={{ color: '#2563EB' }} /> : <Crown size={22} style={{ color: '#059669' }} />}
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: currentPlan === 'free' ? '#1D4ED8' : '#065F46' }}>
              {currentPlan === 'free' ? 'Bạn đang dùng gói Free' : `Bạn đang dùng gói ${currentPlan === 'standard' ? 'Standard' : 'Premium'}`}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
              {currentPlan === 'free'
                ? 'Free dùng ngay sau khi cài. Khi cần thêm tính năng, hãy mua key trên Web Tổng và kích hoạt trong app.'
                : 'Key của bạn đang hoạt động. Có thể tiếp tục học hoặc quản lý gói trong trang gói dịch vụ.'}
            </div>
          </div>
        </div>
        <button
          className="premium-btn-base premium-btn-sheen px-4 py-2.5 rounded-[14px] font-bold text-sm text-white hover:brightness-105"
          style={currentPlan === 'free'
            ? {
                background: 'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.08) 42%, rgba(0,0,0,0.16) 100%), linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                border: '1px solid rgba(191,219,254,0.7)',
                boxShadow: '0 12px 22px rgba(29,78,216,0.22), inset 0 1px 0 rgba(255,255,255,0.38), inset 0 -2px 0 rgba(30,64,175,0.36)',
              }
            : {
                background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 42%, rgba(0,0,0,0.14) 100%), linear-gradient(135deg, #10B981 0%, #059669 100%)',
                border: '1px solid rgba(167,243,208,0.72)',
                boxShadow: '0 12px 22px rgba(5,150,105,0.2), inset 0 1px 0 rgba(255,255,255,0.36), inset 0 -2px 0 rgba(4,120,87,0.34)',
              }}
          onClick={() => navigate('/pricing')}
        >
          {currentPlan === 'free' ? 'Xem gói và nhập key' : 'Quản lý gói hiện tại'}
        </button>
      </div>

      {/* Streak warning — handled by StudyReminder above */}

      {/* Stats mini */}
      <div className="flex gap-4 flex-wrap justify-center w-full">
        <div className="card-flat text-center px-5 py-3">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{completed}/{total}</div>
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Bài đã học</div>
        </div>
        <div className="card-flat text-center px-5 py-3">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>{avg}%</div>
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Điểm TB</div>
        </div>
        <div className="card-flat text-center px-5 py-3 streak-glow">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-star)' }}>🔥 {streak}</div>
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Ngày liên tiếp</div>
        </div>
        <button className="premium-btn-base card-flat text-center px-5 py-3 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/achievements')}>
          <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
            {xpData.levelEmoji} Lv.{xpData.level}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>{xpData.totalXp} XP</div>
        </button>
      </div>

      {/* Quick actions */}
      <div className="flex gap-4 flex-wrap justify-center w-full">
        <button
          className="card-action-btn"
          onClick={() => navigate('/subjects')}
          style={{ minWidth: '180px' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#FEF3C7' }}>
            <GraduationCap size={28} style={{ color: '#D97706' }} />
          </div>
          <span className="text-lg font-bold" style={{ color: '#D97706' }}>Môn học</span>
          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
            {gradeSubjects.length} môn {getGradeLabel(state.student.grade)}
          </span>
        </button>

        <button
          className="card-action-btn"
          onClick={() => navigate('/lessons')}
          style={{ minWidth: '180px' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: currentSubject?.bgColor || 'var(--color-primary-light)' }}>
            <BookOpen size={28} style={{ color: currentSubject?.color || 'var(--color-primary-dark)' }} />
          </div>
          <span className="text-lg font-bold" style={{ color: currentSubject?.color || 'var(--color-primary)' }}>
            {currentSubject?.emoji} {currentSubject?.name || 'Toán'}
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
            {total - completed > 0 ? `${total - completed} bài chưa học` : 'Ôn lại bài cũ'}
          </span>
        </button>

        <button
          className="card-action-btn"
          onClick={() => navigate('/quiz')}
          style={{ minWidth: '180px' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#EDE9FE' }}>
            <PenTool size={28} style={{ color: '#7C3AED' }} />
          </div>
          <span className="text-lg font-bold" style={{ color: '#7C3AED' }}>Luyện tập</span>
          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>Làm bài kiểm tra nhanh</span>
        </button>

        {needsReview.length > 0 && (
          <button
            className="card-action-btn"
            onClick={() => navigate('/progress')}
            style={{ minWidth: '180px' }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: '#FEE2E2' }}>
              <RefreshCw size={28} style={{ color: '#DC2626' }} />
            </div>
            <span className="text-lg font-bold" style={{ color: '#DC2626' }}>Ôn lại</span>
            <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
              {needsReview.length} bài cần ôn
            </span>
          </button>
        )}

        <button
          className="card-action-btn"
          onClick={() => navigate('/progress')}
          style={{ minWidth: '180px' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#D1FAE5' }}>
            <BarChart3 size={28} style={{ color: '#059669' }} />
          </div>
          <span className="text-lg font-bold" style={{ color: '#059669' }}>Tiến bộ</span>
          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>Xem con học được gì</span>
        </button>

        <button
          className="card-action-btn"
          onClick={() => navigate('/themes')}
          style={{ minWidth: '180px' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#FEF3C7' }}>
            <Sparkles size={28} style={{ color: '#D97706' }} />
          </div>
          <span className="text-lg font-bold" style={{ color: '#D97706' }}>Giao diện</span>
          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>Chọn theme yêu thích</span>
        </button>

        <button
          className="card-action-btn"
          onClick={() => navigate('/daily')}
          style={{ minWidth: '180px' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#F3E8FF' }}>
            <CalendarDays size={28} style={{ color: '#8B5CF6' }} />
          </div>
          <span className="text-lg font-bold" style={{ color: '#8B5CF6' }}>Thử thách</span>
          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>Thử thách hàng ngày</span>
        </button>

        <button
          className="card-action-btn"
          onClick={() => navigate('/match-game')}
          style={{ minWidth: '180px' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#FCE7F3' }}>
            <Gamepad2 size={28} style={{ color: '#DB2777' }} />
          </div>
          <span className="text-lg font-bold" style={{ color: '#DB2777' }}>Mini-Game</span>
          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>Ghép cặp ôn tập</span>
        </button>

        <button
          className="card-action-btn"
          onClick={() => navigate('/drawing')}
          style={{ minWidth: '180px' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#DBEAFE' }}>
            <Brush size={28} style={{ color: '#2563EB' }} />
          </div>
          <span className="text-lg font-bold" style={{ color: '#2563EB' }}>Vẽ & Tô màu</span>
          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>Giải trí sáng tạo</span>
        </button>

        <button
          className="card-action-btn"
          onClick={() => navigate('/achievements')}
          style={{ minWidth: '180px' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#FEF3C7' }}>
            <Star size={28} style={{ color: '#D97706' }} />
          </div>
          <span className="text-lg font-bold" style={{ color: '#D97706' }}>Thành tựu</span>
          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>{xpData.levelTitle} · Lv.{xpData.level}</span>
        </button>

        <button
          className="card-action-btn"
          onClick={() => navigate('/memory')}
          style={{ minWidth: '180px' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#E0E7FF' }}>
            <Brain size={28} style={{ color: '#4F46E5' }} />
          </div>
          <span className="text-lg font-bold" style={{ color: '#4F46E5' }}>Trí nhớ</span>
          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>Flashcard ôn tập</span>
        </button>

        <button
          className="card-action-btn"
          onClick={() => navigate('/competition')}
          style={{ minWidth: '180px' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#FEE2E2' }}>
            <Swords size={28} style={{ color: '#DC2626' }} />
          </div>
          <span className="text-lg font-bold" style={{ color: '#DC2626' }}>Thi đấu</span>
          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>Đấu Robot / bạn bè</span>
        </button>

        <button
          className="card-action-btn"
          onClick={() => navigate('/avatar-shop')}
          style={{ minWidth: '180px' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#D1FAE5' }}>
            <ShoppingBag size={28} style={{ color: '#059669' }} />
          </div>
          <span className="text-lg font-bold" style={{ color: '#059669' }}>Cửa hàng</span>
          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>Đổi XP lấy avatar</span>
        </button>
      </div>

      {/* Info bar */}
      <div className="card-flat flex items-center gap-4 px-6 py-3 mt-4">
        <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>
          📅 {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
        <span style={{ color: 'var(--color-text-light)' }}>•</span>
        <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>
          📚 {currentSubject?.emoji} {currentSubject?.name || 'Toán'} {getGradeLabel(state.student.grade)}
        </span>
      </div>
    </div>
  );
}
