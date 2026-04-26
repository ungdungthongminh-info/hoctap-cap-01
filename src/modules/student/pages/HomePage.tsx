import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../shared/themes';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel, getSubjectsForGrade, getSubjectByCode } from '../../../data/subjects';
import {
  BookOpen,
  BarChart3,
  Sparkles,
  RefreshCw,
  PenTool,
  GraduationCap,
  Gamepad2,
  CalendarDays,
  Brush,
  Star,
  Brain,
  Swords,
  ShoppingBag,
  Crown,
  Shield,
  PlayCircle,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
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

type ActionCardProps = {
  icon: LucideIcon;
  label: string;
  meta: string;
  color: string;
  bg: string;
  onClick: () => void;
  compact?: boolean;
};

function getKeyExpiryBadge(plan: ReturnType<typeof getAccessPlan>): KeyExpiryBadge | null {
  if (plan === 'free') return null;

  const expiryRaw = localStorage.getItem(SUB_EXPIRY_KEY);
  if (!expiryRaw) {
    return {
      text: 'Key vĩnh viễn',
      bg: '#D1FAE5',
      color: '#065F46',
      border: '#6EE7B7',
    };
  }

  const expiresAt = new Date(expiryRaw);
  if (Number.isNaN(expiresAt.getTime())) {
    return {
      text: 'Key đang hoạt động',
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
      text: `Hết hạn ${expiryDate}`,
      bg: '#FEE2E2',
      color: '#991B1B',
      border: '#FCA5A5',
    };
  }

  if (leftDays <= 7) {
    return {
      text: `HSD ${expiryDate} · còn ${leftDays} ngày`,
      bg: '#FEF3C7',
      color: '#92400E',
      border: '#FCD34D',
    };
  }

  return {
    text: `HSD ${expiryDate} · còn ${leftDays} ngày`,
    bg: '#DCFCE7',
    color: '#166534',
    border: '#86EFAC',
  };
}

function ActionCard({ icon: Icon, label, meta, color, bg, onClick, compact }: ActionCardProps) {
  return (
    <button className={`card-action-btn home-action-card ${compact ? 'home-action-card--compact' : ''}`} onClick={onClick}>
      <div className="home-action-icon" style={{ background: bg }}>
        <Icon size={26} style={{ color }} />
      </div>
      <span className="home-action-title" style={{ color }}>{label}</span>
      <span className="home-action-meta">{meta}</span>
    </button>
  );
}

export function HomePage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const {
    state,
    getCompletedCount,
    getAverageScore,
    getStreak,
    getNeedsReviewLessons,
    getSubjectLessons,
    getLessonProgress,
  } = useAppData();
  const [currentPlan, setCurrentPlan] = useState(() => getAccessPlan());
  const [keyExpiryBadge, setKeyExpiryBadge] = useState<KeyExpiryBadge | null>(() => getKeyExpiryBadge(getAccessPlan()));

  const subjectLessons = getSubjectLessons();
  const completed = getCompletedCount();
  const total = subjectLessons.length;
  const avg = getAverageScore();
  const streak = getStreak();
  const needsReview = getNeedsReviewLessons();
  const currentSubject = getSubjectByCode(state.student.subjectCode);
  const gradeSubjects = getSubjectsForGrade(state.student.grade);
  const studiedToday = state.practiceSets.some((ps) => ps.finishedAt && ps.finishedAt.startsWith(new Date().toISOString().slice(0, 10)));
  const xpData = getXpData(parseInt(localStorage.getItem(STORAGE_KEYS.XP) || '0', 10) || 0);
  const subjectProgressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const reviewLesson = needsReview.find(
    (lesson) => lesson.grade === state.student.grade && lesson.subjectCode === state.student.subjectCode,
  );
  const nextLesson = reviewLesson
    || subjectLessons.find((lesson) => {
      const progress = getLessonProgress(lesson.id);
      return !progress || progress.attemptCount === 0;
    })
    || subjectLessons[0];
  const nextLessonProgress = nextLesson ? getLessonProgress(nextLesson.id) : undefined;
  const nextLessonPercent = nextLessonProgress?.attemptCount
    ? Math.min(100, nextLessonProgress.bestScore || nextLessonProgress.lastScore || 0)
    : subjectProgressPercent;
  const remainingLessons = Math.max(total - completed, 0);
  const planName = currentPlan === 'free' ? 'Free' : currentPlan === 'standard' ? 'Standard' : 'Premium';

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
    <div className="home-page-shell fade-in w-full max-w-[1480px] mx-auto pb-8">
      <section className="home-hero">
        <div className="home-hero-art">
          <MascotCharacter size="xl" />
        </div>
        <div className="home-hero-copy">
          <div className="home-eyebrow">{getGradeLabel(state.student.grade)} · {currentSubject?.emoji} {currentSubject?.name || 'Toán'}</div>
          <h1>
            Chào <strong>{state.student.fullName}</strong>!
          </h1>
          <p>
            Cùng bạn <strong>{theme.mascotName}</strong> học {currentSubject?.name || 'Toán'} thật vui nào!
          </p>
        </div>
        <div className="home-hero-actions">
          <button className="home-plan-pill" onClick={() => navigate('/pricing')}>
            {currentPlan === 'free' ? <Shield size={18} /> : <Crown size={18} />}
            <span>
              <strong>Gói {planName}</strong>
              <small>{currentPlan === 'free' ? 'Xem gói & nhập key' : 'Key đang hoạt động'}</small>
            </span>
          </button>
          {keyExpiryBadge && (
            <span
              className="home-key-expiry"
              style={{
                background: keyExpiryBadge.bg,
                color: keyExpiryBadge.color,
                borderColor: keyExpiryBadge.border,
              }}
            >
              {keyExpiryBadge.text}
            </span>
          )}
        </div>
      </section>

      <div className="home-reminder-slot">
        <StudyReminder streak={streak} studiedToday={studiedToday} needsReviewCount={needsReview.length} />
      </div>

      <section className="home-stats">
        <div className="home-stat-card">
          <div className="home-stat-icon home-stat-icon--book"><BookOpen size={24} /></div>
          <div>
            <span>Bài đã học</span>
            <strong>{completed}/{total}</strong>
          </div>
          <div className="home-stat-track"><i style={{ width: `${subjectProgressPercent}%` }} /></div>
        </div>
        <div className="home-stat-card">
          <div className="home-stat-icon home-stat-icon--score"><Star size={24} /></div>
          <div>
            <span>Điểm TB</span>
            <strong>{avg}%</strong>
          </div>
          <div className="home-stat-track home-stat-track--amber"><i style={{ width: `${avg}%` }} /></div>
        </div>
        <div className="home-stat-card">
          <div className="home-stat-icon home-stat-icon--streak"><CalendarDays size={24} /></div>
          <div>
            <span>Ngày liên tiếp</span>
            <strong>{streak}</strong>
          </div>
          <div className="home-stat-track home-stat-track--coral"><i style={{ width: `${Math.min(100, streak * 12)}%` }} /></div>
        </div>
        <button className="home-stat-card home-stat-card--button" onClick={() => navigate('/achievements')}>
          <div className="home-stat-icon home-stat-icon--xp"><Trophy size={24} /></div>
          <div>
            <span>{xpData.levelTitle}</span>
            <strong>{xpData.levelEmoji} Lv.{xpData.level}</strong>
          </div>
          <small>{xpData.totalXp} XP</small>
        </button>
      </section>

      <section className="home-focus-card card">
        <div className="home-focus-visual">
          <div className="home-board-mini">
            <span>245</span>
            <span>+127</span>
          </div>
          <MascotCharacter size="md" />
        </div>
        <div className="home-focus-content">
          <span className="home-focus-badge">{reviewLesson ? 'Cần ôn lại' : 'Tiếp tục học'}</span>
          <h2>{nextLesson?.title || `${currentSubject?.name || 'Toán'} ${getGradeLabel(state.student.grade)}`}</h2>
          <p>{currentSubject?.name || 'Toán'} · {nextLesson ? `Bài ${nextLesson.sortOrder || nextLesson.id}` : `${remainingLessons} bài chưa học`}</p>
          <div className="home-focus-progress">
            <i style={{ width: `${nextLessonPercent}%` }} />
            <span>{nextLessonPercent}%</span>
          </div>
        </div>
        <button
          className="home-focus-button"
          onClick={() => navigate(nextLesson ? `/lessons/${nextLesson.id}` : '/lessons')}
        >
          <PlayCircle size={20} />
          Tiếp tục học
        </button>
      </section>

      <section className="home-quick-actions">
        <ActionCard
          icon={GraduationCap}
          label="Môn học"
          meta={`${gradeSubjects.length} môn ${getGradeLabel(state.student.grade)}`}
          color="#0F766E"
          bg="#CCFBF1"
          onClick={() => navigate('/subjects')}
        />
        <ActionCard
          icon={BookOpen}
          label="Bài học"
          meta={remainingLessons > 0 ? `${remainingLessons} bài chưa học` : 'Ôn lại bài cũ'}
          color="#2563EB"
          bg="#DBEAFE"
          onClick={() => navigate('/lessons')}
        />
        <ActionCard
          icon={PenTool}
          label="Luyện tập"
          meta="Làm bài kiểm tra nhanh"
          color="#D97706"
          bg="#FEF3C7"
          onClick={() => navigate('/quiz')}
        />
        <ActionCard
          icon={Gamepad2}
          label="Mini-Game"
          meta="Ghép cặp ôn tập"
          color="#7C3AED"
          bg="#EDE9FE"
          onClick={() => navigate('/match-game')}
        />
        <ActionCard
          icon={BarChart3}
          label="Tiến bộ"
          meta="Xem con học được gì"
          color="#059669"
          bg="#D1FAE5"
          onClick={() => navigate('/progress')}
        />
        <ActionCard
          icon={Star}
          label="Thành tựu"
          meta={`${xpData.levelTitle} · Lv.${xpData.level}`}
          color="#C2410C"
          bg="#FFEDD5"
          onClick={() => navigate('/achievements')}
        />
      </section>

      <section className="home-secondary-actions">
        {needsReview.length > 0 && (
          <ActionCard
            icon={RefreshCw}
            label="Ôn lại"
            meta={`${needsReview.length} bài cần ôn`}
            color="#DC2626"
            bg="#FEE2E2"
            compact
            onClick={() => navigate('/progress')}
          />
        )}
        <ActionCard
          icon={Sparkles}
          label="Giao diện"
          meta="Chọn theme yêu thích"
          color="#D97706"
          bg="#FEF3C7"
          compact
          onClick={() => navigate('/themes')}
        />
        <ActionCard
          icon={CalendarDays}
          label="Thử thách"
          meta="Thử thách hằng ngày"
          color="#8B5CF6"
          bg="#F3E8FF"
          compact
          onClick={() => navigate('/daily')}
        />
        <ActionCard
          icon={Brush}
          label="Vẽ & Tô màu"
          meta="Giải trí sáng tạo"
          color="#2563EB"
          bg="#DBEAFE"
          compact
          onClick={() => navigate('/drawing')}
        />
        <ActionCard
          icon={Brain}
          label="Trí nhớ"
          meta="Flashcard ôn tập"
          color="#4F46E5"
          bg="#E0E7FF"
          compact
          onClick={() => navigate('/memory')}
        />
        <ActionCard
          icon={Swords}
          label="Thi đấu"
          meta="Đấu Robot / bạn bè"
          color="#DC2626"
          bg="#FEE2E2"
          compact
          onClick={() => navigate('/competition')}
        />
        <ActionCard
          icon={ShoppingBag}
          label="Cửa hàng"
          meta="Đổi XP lấy avatar"
          color="#059669"
          bg="#D1FAE5"
          compact
          onClick={() => navigate('/avatar-shop')}
        />
      </section>

      <div className="home-info-bar card-flat">
        <span>
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
        <span>·</span>
        <span>
          {currentSubject?.emoji} {currentSubject?.name || 'Toán'} {getGradeLabel(state.student.grade)}
        </span>
      </div>
    </div>
  );
}
