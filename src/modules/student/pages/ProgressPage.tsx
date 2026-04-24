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
    state, getCompletedCount, getAverageScore, getStreak, getNeedsReviewLessons, getWeeklyActivity, getSubjectLessons,
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
  const maxSessions = Math.max(...weekly.map((d) => d.sessions), 1);

  // Per-lesson table
  const rows = subjectLessons.map((l) => {
    const p = state.progress.find((pr) => pr.lessonId === l.id);
    return { lesson: l, progress: p };
  });

  // Mastery distribution
  const subjectLessonIds = subjectLessons.map((l) => l.id);
  const masteryDist = { mastered: 0, good: 0, learning: 0, new: 0 };
  state.progress.filter((p) => subjectLessonIds.includes(p.lessonId)).forEach((p) => { masteryDist[p.masteryLevel]++; });

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <MascotCharacter size="sm" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            📊 Tiến Bộ Học Tập
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            {theme.mascotName} giúp ba mẹ theo dõi {state.student.fullName} học!
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{completed}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>Bài đã học</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold" style={{ color: 'var(--color-success)' }}>{avg}%</div>
          <div className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>Điểm TB cao nhất</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold" style={{ color: 'var(--color-star)' }}>🔥 {streak}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>Ngày liên tiếp</div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="card mb-6">
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

      {/* Weekly activity chart */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="font-bold">📅 Hoạt động tuần này</h3>
        </div>
        {weekly.every((d) => d.sessions === 0) ? (
          <div className="text-center py-6" style={{ color: 'var(--color-text-light)' }}>
            <span className="text-3xl block mb-2">📭</span>
            Chưa có hoạt động tuần này. Bắt đầu học nhé!
          </div>
        ) : (
          <div className="flex items-end gap-2 justify-between" style={{ height: 140 }}>
            {weekly.map((day) => {
              const barH = day.sessions > 0 ? Math.max(20, (day.sessions / maxSessions) * 110) : 4;
              const isToday = day.date === new Date().toISOString().slice(0, 10);
              return (
                <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                  {day.sessions > 0 && (
                    <span className="text-[10px] font-bold" style={{ color: 'var(--color-primary)' }}>
                      {day.correctRate}%
                    </span>
                  )}
                  <div
                    className="w-full max-w-[32px] rounded-t-lg transition-all"
                    style={{
                      height: barH,
                      background: day.sessions > 0
                        ? `linear-gradient(to top, var(--color-primary), var(--color-primary-light))`
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

      {/* Mastery distribution */}
      <div className="card mb-6">
        <h3 className="font-bold mb-3">🏆 Phân bổ trình độ</h3>
        <div className="grid grid-cols-4 gap-3 text-center">
          {([
            { key: 'mastered', label: '⭐ Giỏi', color: '#059669', bg: '#D1FAE5' },
            { key: 'good', label: '👍 Tốt', color: '#2563EB', bg: '#DBEAFE' },
            { key: 'learning', label: '📖 Đang học', color: '#D97706', bg: '#FEF3C7' },
            { key: 'new', label: '🆕 Chưa', color: '#6B7280', bg: '#F3F4F6' },
          ] as const).map((m) => (
            <div key={m.key} className="rounded-xl py-3" style={{ background: m.bg }}>
              <div className="text-2xl font-bold" style={{ color: m.color }}>
                {m.key === 'new' ? total - Object.values(masteryDist).reduce((a, b) => a + b, 0) + masteryDist.new : masteryDist[m.key]}
              </div>
              <div className="text-[11px] mt-1" style={{ color: m.color }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-lesson detail */}
      <div className="card mb-6">
        <h3 className="font-bold mb-4">📝 Chi tiết từng bài</h3>
        <div className="grid gap-3">
          {rows.map(({ lesson, progress: p }) => {
            const mastery = p?.masteryLevel || 'new';
            const masteryColors: Record<string, { bg: string; color: string; label: string }> = {
              mastered: { bg: '#D1FAE5', color: '#059669', label: '⭐ Giỏi' },
              good: { bg: '#DBEAFE', color: '#2563EB', label: '👍 Tốt' },
              learning: { bg: '#FEF3C7', color: '#D97706', label: '📖 Đang học' },
              new: { bg: '#F3F4F6', color: '#6B7280', label: '🆕 Chưa' },
            };
            const mc = masteryColors[mastery] || masteryColors.new;

            return (
              <button
                key={lesson.id}
                className="flex items-center gap-3 p-3 rounded-xl text-left w-full hover:scale-[1.01] transition-transform"
                style={{ background: mc.bg }}
                onClick={() => navigate(`/lessons/${lesson.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate" style={{ color: 'var(--color-text)' }}>
                    {lesson.title}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span style={{ color: mc.color }}>{mc.label}</span>
                    {p && p.attemptCount > 0 && (
                      <>
                        <span style={{ color: 'var(--color-text-light)' }}>
                          Lần: {p.attemptCount}
                        </span>
                        <span style={{ color: 'var(--color-text-light)' }}>
                          Cao nhất: {p.bestScore}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {p && p.attemptCount > 0 && (
                  <div className="w-12 text-center">
                    <div className="text-lg font-bold" style={{ color: mc.color }}>{p.bestScore}%</div>
                  </div>
                )}
                <ChevronRight size={16} style={{ color: 'var(--color-text-light)' }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Needs review */}
      <div className="card">
        <h3 className="font-bold mb-3">🔁 Bài cần ôn lại</h3>
        {needsReview.length === 0 ? (
          <div className="text-center py-6" style={{ color: 'var(--color-text-light)' }}>
            <span className="text-4xl mb-2 block">🎉</span>
            {completed === 0 ? 'Bắt đầu học để theo dõi tiến bộ!' : 'Không có bài nào cần ôn lại!'}
          </div>
        ) : (
          <div className="grid gap-2">
            {needsReview.map((l) => (
              <button
                key={l.id}
                className="flex items-center gap-3 p-3 rounded-xl text-left w-full hover:scale-[1.01] transition-transform"
                style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
                onClick={() => navigate(`/lessons/${l.id}`)}
              >
                <RefreshCw size={16} style={{ color: '#DC2626' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{l.title}</span>
                <ChevronRight size={16} className="ml-auto" style={{ color: '#DC2626' }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
