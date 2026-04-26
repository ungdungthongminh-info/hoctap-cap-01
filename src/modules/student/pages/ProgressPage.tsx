import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../shared/themes';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel, getSubjectByCode } from '../../../data/subjects';
import { RefreshCw, ChevronRight, TrendingUp } from 'lucide-react';
import { MascotCharacter } from '../../../shared/components';

export function ProgressPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const {
    state,
    getCompletedCount,
    getAverageScore,
    getStreak,
    getNeedsReviewLessons,
    getWeeklyActivity,
    getSubjectLessons,
  } = useAppData();

  const subjectLessons = getSubjectLessons();
  const total = subjectLessons.length;
  const subject = getSubjectByCode(state.student.subjectCode);
  const completed = getCompletedCount();
  const avg = getAverageScore();
  const streak = getStreak();
  const needsReview = getNeedsReviewLessons();
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const weekly = getWeeklyActivity();
  const maxSessions = Math.max(...weekly.map((day) => day.sessions), 1);

  const rows = subjectLessons.map((lesson) => {
    const progress = state.progress.find((item) => item.lessonId === lesson.id);
    return { lesson, progress };
  });

  const subjectLessonIds = subjectLessons.map((lesson) => lesson.id);
  const masteryDist = { mastered: 0, good: 0, learning: 0, new: 0 };
  state.progress
    .filter((progress) => subjectLessonIds.includes(progress.lessonId))
    .forEach((progress) => {
      masteryDist[progress.masteryLevel]++;
    });

  return (
    <div className="subpage-shell subpage-shell--compact fade-in max-w-3xl mx-auto">
      <div className="subpage-hero subpage-hero--progress">
        <div className="subpage-hero__avatar"><MascotCharacter size="sm" /></div>
        <div className="subpage-hero__content">
          <div className="subpage-hero__eyebrow">{subject?.emoji} {subject?.name || 'Toán'}</div>
          <h1 className="subpage-hero__title" style={{ color: 'var(--color-primary-dark)' }}>
            📊 Tiến Bộ Học Tập
          </h1>
          <p className="subpage-hero__subtitle" style={{ color: 'var(--color-text-light)' }}>
            {theme.mascotName} giúp ba mẹ theo dõi {state.student.fullName} học!
          </p>
        </div>
        <div className="subpage-hero__meta">
          <span className="subpage-hero__pill">{progressPct}%</span>
          <span className="subpage-hero__pill">🔁 {needsReview.length}</span>
        </div>
      </div>

      <div className="progress-stat-grid">
        <div className="progress-stat-card">
          <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{completed}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>Bài đã học</div>
        </div>
        <div className="progress-stat-card">
          <div className="text-3xl font-bold" style={{ color: 'var(--color-success)' }}>{avg}%</div>
          <div className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>Điểm TB cao nhất</div>
        </div>
        <div className="progress-stat-card progress-stat-card--warm">
          <div className="text-3xl font-bold" style={{ color: 'var(--color-star)' }}>🔥 {streak}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>Ngày liên tiếp</div>
        </div>
      </div>

      <div className="subpage-panel">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold">{subject?.emoji} {subject?.name || 'Toán'} {getGradeLabel(state.student.grade)}</span>
          <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            {completed}/{total} bài ({progressPct}%)
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="subpage-panel">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="font-bold">📅 Hoạt động tuần này</h3>
        </div>
        {weekly.every((day) => day.sessions === 0) ? (
          <div className="text-center py-6" style={{ color: 'var(--color-text-light)' }}>
            <span className="text-3xl block mb-2">📭</span>
            Chưa có hoạt động tuần này. Bắt đầu học nhé!
          </div>
        ) : (
          <div className="progress-weekly-chart" style={{ height: 140 }}>
            {weekly.map((day) => {
              const barHeight = day.sessions > 0 ? Math.max(20, (day.sessions / maxSessions) * 110) : 4;
              const isToday = day.date === new Date().toISOString().slice(0, 10);

              return (
                <div key={day.date} className="progress-weekly-col">
                  {day.sessions > 0 && (
                    <span className="text-[10px] font-bold" style={{ color: 'var(--color-primary)' }}>
                      {day.correctRate}%
                    </span>
                  )}
                  <div
                    className="w-full max-w-[32px] rounded-t-lg transition-all"
                    style={{
                      height: barHeight,
                      background: day.sessions > 0
                        ? 'linear-gradient(to top, var(--color-primary), var(--color-primary-light))'
                        : '#E5E7EB',
                      opacity: day.sessions > 0 ? 1 : 0.4,
                    }}
                    title={`${day.label}: ${day.sessions} lượt, ${day.correctRate}% đúng`}
                  />
                  <span
                    className="text-[11px] font-medium"
                    style={{
                      color: isToday ? 'var(--color-primary)' : 'var(--color-text-light)',
                      fontWeight: isToday ? 700 : 500,
                    }}
                  >
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="subpage-panel">
        <h3 className="font-bold mb-3">🏆 Phân bổ trình độ</h3>
        <div className="progress-mastery-grid">
          {([
            { key: 'mastered', label: '⭐ Giỏi', color: '#059669', bg: '#D1FAE5' },
            { key: 'good', label: '👍 Tốt', color: '#2563EB', bg: '#DBEAFE' },
            { key: 'learning', label: '📖 Đang học', color: '#D97706', bg: '#FEF3C7' },
            { key: 'new', label: '🆕 Chưa', color: '#6B7280', bg: '#F3F4F6' },
          ] as const).map((item) => (
            <div key={item.key} className="progress-mastery-card" style={{ background: item.bg }}>
              <div className="text-2xl font-bold" style={{ color: item.color }}>
                {item.key === 'new'
                  ? total - Object.values(masteryDist).reduce((sum, value) => sum + value, 0) + masteryDist.new
                  : masteryDist[item.key]}
              </div>
              <div className="text-[11px] mt-1" style={{ color: item.color }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="subpage-panel">
        <h3 className="font-bold mb-4">📝 Chi tiết từng bài</h3>
        <div className="progress-row-list">
          {rows.map(({ lesson, progress }) => {
            const mastery = progress?.masteryLevel || 'new';
            const masteryColors: Record<string, { bg: string; color: string; label: string }> = {
              mastered: { bg: '#D1FAE5', color: '#059669', label: '⭐ Giỏi' },
              good: { bg: '#DBEAFE', color: '#2563EB', label: '👍 Tốt' },
              learning: { bg: '#FEF3C7', color: '#D97706', label: '📖 Đang học' },
              new: { bg: '#F3F4F6', color: '#6B7280', label: '🆕 Chưa' },
            };
            const colors = masteryColors[mastery] || masteryColors.new;

            return (
              <button
                key={lesson.id}
                className="progress-row-card"
                style={{ background: colors.bg }}
                onClick={() => navigate(`/lessons/${lesson.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate" style={{ color: 'var(--color-text)' }}>
                    {lesson.title}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span style={{ color: colors.color }}>{colors.label}</span>
                    {progress && progress.attemptCount > 0 && (
                      <>
                        <span style={{ color: 'var(--color-text-light)' }}>Lần: {progress.attemptCount}</span>
                        <span style={{ color: 'var(--color-text-light)' }}>Cao nhất: {progress.bestScore}%</span>
                      </>
                    )}
                  </div>
                </div>
                {progress && progress.attemptCount > 0 && (
                  <div className="w-12 text-center">
                    <div className="text-lg font-bold" style={{ color: colors.color }}>{progress.bestScore}%</div>
                  </div>
                )}
                <ChevronRight size={16} style={{ color: 'var(--color-text-light)' }} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="subpage-panel">
        <h3 className="font-bold mb-3">🔁 Bài cần ôn lại</h3>
        {needsReview.length === 0 ? (
          <div className="text-center py-6" style={{ color: 'var(--color-text-light)' }}>
            <span className="text-4xl mb-2 block">🎉</span>
            {completed === 0 ? 'Bắt đầu học để theo dõi tiến bộ!' : 'Không có bài nào cần ôn lại!'}
          </div>
        ) : (
          <div className="progress-row-list">
            {needsReview.map((lesson) => (
              <button
                key={lesson.id}
                className="progress-row-card progress-row-card--review"
                style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
                onClick={() => navigate(`/lessons/${lesson.id}`)}
              >
                <RefreshCw size={16} style={{ color: '#DC2626' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{lesson.title}</span>
                <ChevronRight size={16} className="ml-auto" style={{ color: '#DC2626' }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
