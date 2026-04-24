/**
 * AnalyticsDashboardPage — Bảng phân tích học tập chi tiết
 * - Thống kê tổng quan: tổng phiên, chính xác, thời gian, streak
 * - Biểu đồ hoạt động 30 ngày
 * - So sánh giữa các môn học
 * - Phân tích theo độ khó & kỹ năng
 * - Xu hướng tiến bộ
 */
import { useState, useMemo } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { BarChart3, TrendingUp, Clock, Target, BookOpen, Brain, Award, Flame, ArrowUpRight, ArrowDownRight } from 'lucide-react';

type TimeRange = '7d' | '30d' | 'all';

const SUBJECT_LABELS: Record<string, string> = {
  math: 'Toán', vietnamese: 'Tiếng Việt', nature: 'TN&XH',
  ethics: 'Đạo đức', english: 'Tiếng Anh',
  science: 'Khoa học', history_geo: 'Lịch sử & Địa lý',
  informatics: 'Tin học', art: 'Mỹ thuật',
};
const SUBJECT_EMOJIS: Record<string, string> = {
  math: '🔢', vietnamese: '📖', nature: '🌿', ethics: '💛', english: '🌍',
  science: '🔬', history_geo: '🗺️', informatics: '💻', art: '🎨',
};
const DIFF_LABELS: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
const MASTERY_COLORS: Record<string, string> = {
  mastered: '#059669', good: '#2563EB', learning: '#D97706', new: '#9CA3AF',
};

export function AnalyticsDashboardPage() {
  const { state, getStreak, getCompletedCount, getAverageScore } = useAppData();
  const [range, setRange] = useState<TimeRange>('30d');

  // ==================== COMPUTED DATA ====================
  const analytics = useMemo(() => {
    const now = Date.now();
    const rangeDays = range === '7d' ? 7 : range === '30d' ? 30 : 36500;
    const cutoff = now - rangeDays * 86400000;

    // Filter practice sets by range
    const sets = state.practiceSets.filter(
      s => s.finishedAt && new Date(s.startedAt).getTime() >= cutoff
    );
    const answers = state.answers.filter(a => {
      const set = state.practiceSets.find(s => s.id === a.practiceSetId);
      return set?.finishedAt && new Date(set.startedAt).getTime() >= cutoff;
    });

    // Total stats
    const totalSessions = sets.length;
    const totalCorrect = answers.filter(a => a.isCorrect).length;
    const totalAnswered = answers.length;
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    // Study time (minutes) from startedAt/finishedAt
    const totalMinutes = sets.reduce((sum, s) => {
      if (!s.finishedAt) return sum;
      const dur = (new Date(s.finishedAt).getTime() - new Date(s.startedAt).getTime()) / 60000;
      return sum + Math.min(dur, 60); // cap at 60 min per session
    }, 0);

    // Daily activity (last N days)
    const dayMap = new Map<string, { sessions: number; correct: number; total: number; minutes: number }>();
    for (let i = 0; i < rangeDays && i < 365; i++) {
      const d = new Date(now - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      dayMap.set(key, { sessions: 0, correct: 0, total: 0, minutes: 0 });
    }
    for (const s of sets) {
      const key = new Date(s.startedAt).toISOString().slice(0, 10);
      const entry = dayMap.get(key);
      if (entry) {
        entry.sessions++;
        entry.correct += s.correctCount;
        entry.total += s.correctCount + s.wrongCount;
        if (s.finishedAt) {
          entry.minutes += Math.min((new Date(s.finishedAt).getTime() - new Date(s.startedAt).getTime()) / 60000, 60);
        }
      }
    }
    const dailyData = Array.from(dayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, d]) => ({ date, ...d, accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0 }));

    // Subject breakdown
    const subjectMap = new Map<string, { sessions: number; correct: number; total: number; minutes: number }>();
    for (const s of sets) {
      const lesson = state.lessons.find(l => l.id === s.lessonId);
      const subj = lesson?.subjectCode || 'unknown';
      const entry = subjectMap.get(subj) || { sessions: 0, correct: 0, total: 0, minutes: 0 };
      entry.sessions++;
      entry.correct += s.correctCount;
      entry.total += s.correctCount + s.wrongCount;
      if (s.finishedAt) entry.minutes += Math.min((new Date(s.finishedAt).getTime() - new Date(s.startedAt).getTime()) / 60000, 60);
      subjectMap.set(subj, entry);
    }
    const subjectData = Array.from(subjectMap.entries()).map(([code, d]) => ({
      code,
      label: SUBJECT_LABELS[code] || code,
      emoji: SUBJECT_EMOJIS[code] || '📘',
      ...d,
      accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
    })).sort((a, b) => b.sessions - a.sessions);

    // Difficulty analysis
    const diffMap = new Map<string, { correct: number; total: number }>();
    for (const a of answers) {
      const q = state.questions.find(q => q.id === a.questionId);
      const diff = q?.difficulty || 'easy';
      const entry = diffMap.get(diff) || { correct: 0, total: 0 };
      entry.total++;
      if (a.isCorrect) entry.correct++;
      diffMap.set(diff, entry);
    }
    const diffData = ['easy', 'medium', 'hard'].map(d => {
      const entry = diffMap.get(d) || { correct: 0, total: 0 };
      return { diff: d, label: DIFF_LABELS[d], ...entry, accuracy: entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0 };
    });

    // Mastery distribution
    const masteryDist = { mastered: 0, good: 0, learning: 0, new: 0 };
    for (const p of state.progress) {
      masteryDist[p.masteryLevel as keyof typeof masteryDist]++;
    }
    const masteryTotal = Object.values(masteryDist).reduce((a, b) => a + b, 0);

    // Trend: compare current half to previous half of range
    const halfPoint = now - (rangeDays / 2) * 86400000;
    const firstHalf = sets.filter(s => new Date(s.startedAt).getTime() < halfPoint);
    const secondHalf = sets.filter(s => new Date(s.startedAt).getTime() >= halfPoint);
    const firstAccuracy = firstHalf.length > 0
      ? Math.round(firstHalf.reduce((s, p) => s + (p.correctCount / Math.max(1, p.correctCount + p.wrongCount)) * 100, 0) / firstHalf.length)
      : 0;
    const secondAccuracy = secondHalf.length > 0
      ? Math.round(secondHalf.reduce((s, p) => s + (p.correctCount / Math.max(1, p.correctCount + p.wrongCount)) * 100, 0) / secondHalf.length)
      : 0;
    const accuracyTrend = secondAccuracy - firstAccuracy;

    // Top skill tags
    const skillMap = new Map<string, { correct: number; total: number }>();
    for (const a of answers) {
      const q = state.questions.find(q => q.id === a.questionId);
      const tag = q?.skillTag || 'Chung';
      const entry = skillMap.get(tag) || { correct: 0, total: 0 };
      entry.total++;
      if (a.isCorrect) entry.correct++;
      skillMap.set(tag, entry);
    }
    const skillData = Array.from(skillMap.entries())
      .map(([tag, d]) => ({ tag, ...d, accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0 }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 8); // weakest skills first

    return {
      totalSessions, accuracy, totalMinutes, totalCorrect, totalAnswered,
      dailyData, subjectData, diffData, masteryDist, masteryTotal,
      accuracyTrend, firstAccuracy, secondAccuracy, skillData,
    };
  }, [state, range]);

  const streak = getStreak();
  const completed = getCompletedCount();
  const avgScore = getAverageScore();

  // Max for bar chart scaling
  const maxDailySessions = Math.max(1, ...analytics.dailyData.map(d => d.sessions));

  return (
    <div className="fade-in flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <span className="text-5xl">📊</span>
        <h1 className="text-2xl font-bold mt-2" style={{ color: 'var(--color-primary-dark)' }}>
          Phân tích học tập
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>
          Theo dõi chi tiết quá trình học của bé
        </p>
      </div>

      {/* Time range selector */}
      <div className="flex justify-center gap-1 p-1 rounded-xl" style={{ background: 'var(--color-surface)' }}>
        {([['7d', '7 ngày'], ['30d', '30 ngày'], ['all', 'Tất cả']] as const).map(([val, label]) => (
          <button
            key={val}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={range === val
              ? { background: 'var(--color-primary)', color: 'white' }
              : { color: 'var(--color-text-light)' }}
            onClick={() => setRange(val)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<BookOpen size={18} />} label="Phiên học" value={analytics.totalSessions} color="#2563EB" />
        <StatCard icon={<Target size={18} />} label="Chính xác" value={`${analytics.accuracy}%`} color="#059669"
          trend={analytics.accuracyTrend !== 0 ? analytics.accuracyTrend : undefined} />
        <StatCard icon={<Clock size={18} />} label="Thời gian" value={`${Math.round(analytics.totalMinutes)}p`} color="#D97706" />
        <StatCard icon={<Flame size={18} />} label="Streak" value={`${streak} ngày`} color="#DC2626" />
      </div>

      {/* Daily activity chart */}
      <div className="card p-5">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
          <BarChart3 size={16} /> Hoạt động theo ngày
        </h3>
        <div className="flex items-end gap-[2px] h-32 overflow-x-auto">
          {analytics.dailyData.map((d) => (
            <div key={d.date} className="flex flex-col items-center flex-shrink-0" style={{ width: range === '7d' ? '13%' : range === '30d' ? '3.2%' : '1px' }}>
              <div
                className="w-full rounded-t-sm transition-all"
                style={{
                  height: `${Math.max(4, (d.sessions / maxDailySessions) * 100)}%`,
                  background: d.sessions > 0
                    ? `linear-gradient(to top, var(--color-primary), var(--color-primary-light))`
                    : 'var(--color-surface)',
                  minHeight: '4px',
                }}
                title={`${d.date}: ${d.sessions} phiên, ${d.accuracy}% chính xác`}
              />
              {range === '7d' && (
                <span className="text-[10px] mt-1" style={{ color: 'var(--color-text-light)' }}>
                  {new Date(d.date).toLocaleDateString('vi-VN', { weekday: 'short' })}
                </span>
              )}
            </div>
          ))}
        </div>
        {analytics.dailyData.length === 0 && (
          <p className="text-center text-sm py-4" style={{ color: 'var(--color-text-light)' }}>
            Chưa có dữ liệu trong khoảng thời gian này
          </p>
        )}
      </div>

      {/* Subject comparison */}
      <div className="card p-5">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
          <BookOpen size={16} /> So sánh môn học
        </h3>
        {analytics.subjectData.length > 0 ? (
          <div className="flex flex-col gap-3">
            {analytics.subjectData.map(subj => (
              <div key={subj.code} className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">{subj.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>{subj.label}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                      {subj.sessions} phiên · {subj.accuracy}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${subj.accuracy}%`,
                        background: subj.accuracy >= 80 ? '#059669' : subj.accuracy >= 60 ? '#D97706' : '#DC2626',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm py-2" style={{ color: 'var(--color-text-light)' }}>
            Chưa có dữ liệu
          </p>
        )}
      </div>

      {/* Mastery distribution + Difficulty analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mastery */}
        <div className="card p-5">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
            <Award size={16} /> Mức thành thạo
          </h3>
          <div className="flex gap-1 h-5 rounded-full overflow-hidden mb-3" style={{ background: 'var(--color-surface)' }}>
            {(['mastered', 'good', 'learning', 'new'] as const).map(level => {
              const pct = analytics.masteryTotal > 0 ? (analytics.masteryDist[level] / analytics.masteryTotal) * 100 : 0;
              return pct > 0 ? (
                <div
                  key={level}
                  className="h-full transition-all"
                  style={{ width: `${pct}%`, background: MASTERY_COLORS[level] }}
                  title={`${level}: ${analytics.masteryDist[level]}`}
                />
              ) : null;
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {([
              ['mastered', 'Thành thạo'], ['good', 'Tốt'],
              ['learning', 'Đang học'], ['new', 'Mới'],
            ] as const).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ background: MASTERY_COLORS[key] }} />
                <span style={{ color: 'var(--color-text)' }}>{label}: <strong>{analytics.masteryDist[key]}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="card p-5">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
            <Brain size={16} /> Theo độ khó
          </h3>
          <div className="flex flex-col gap-3">
            {analytics.diffData.map(d => (
              <div key={d.diff}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--color-text)' }}>{d.label}</span>
                  <span style={{ color: 'var(--color-text-light)' }}>
                    {d.correct}/{d.total} ({d.accuracy}%)
                  </span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${d.accuracy}%`,
                      background: d.diff === 'easy' ? '#059669' : d.diff === 'medium' ? '#D97706' : '#DC2626',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill weaknesses */}
      {analytics.skillData.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
            <TrendingUp size={16} /> Điểm yếu cần cải thiện
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analytics.skillData.map(s => (
              <div key={s.tag} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: 'var(--color-surface)' }}>
                <div className="flex-1">
                  <div className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>{s.tag}</div>
                  <div className="text-[10px]" style={{ color: 'var(--color-text-light)' }}>
                    {s.correct}/{s.total} câu đúng
                  </div>
                </div>
                <span className="text-sm font-bold" style={{
                  color: s.accuracy >= 80 ? '#059669' : s.accuracy >= 60 ? '#D97706' : '#DC2626'
                }}>
                  {s.accuracy}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accuracy trend */}
      <div className="card p-5">
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
          <TrendingUp size={16} /> Xu hướng tiến bộ
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 p-3 rounded-lg text-center" style={{ background: 'var(--color-surface)' }}>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Nửa đầu</div>
            <div className="text-lg font-bold">{analytics.firstAccuracy}%</div>
          </div>
          <div className="flex flex-col items-center">
            {analytics.accuracyTrend > 0 ? (
              <ArrowUpRight size={24} style={{ color: '#059669' }} />
            ) : analytics.accuracyTrend < 0 ? (
              <ArrowDownRight size={24} style={{ color: '#DC2626' }} />
            ) : (
              <span className="text-lg">➡️</span>
            )}
            <span className="text-xs font-bold" style={{
              color: analytics.accuracyTrend > 0 ? '#059669' : analytics.accuracyTrend < 0 ? '#DC2626' : 'var(--color-text-light)'
            }}>
              {analytics.accuracyTrend > 0 ? '+' : ''}{analytics.accuracyTrend}%
            </span>
          </div>
          <div className="flex-1 p-3 rounded-lg text-center" style={{ background: 'var(--color-surface)' }}>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Nửa sau</div>
            <div className="text-lg font-bold">{analytics.secondAccuracy}%</div>
          </div>
        </div>
        <p className="text-xs mt-2 text-center" style={{ color: 'var(--color-text-light)' }}>
          {analytics.accuracyTrend > 3 ? '🎉 Bé đang tiến bộ rõ rệt!' :
            analytics.accuracyTrend < -3 ? '💪 Cần luyện tập thêm nhé!' :
            '📈 Giữ vững phong độ!'}
        </p>
      </div>

      {/* Quick summary */}
      <div className="card-flat p-4 text-center">
        <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
          Tổng cộng: <strong>{completed}</strong> bài đã học · Điểm trung bình: <strong>{avgScore}%</strong> · Đã trả lời <strong>{analytics.totalAnswered}</strong> câu hỏi
        </p>
      </div>
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================
function StatCard({ icon, label, value, color, trend }: {
  icon: React.ReactNode; label: string; value: string | number; color: string; trend?: number;
}) {
  return (
    <div className="card p-4 flex flex-col items-center gap-1">
      <div style={{ color }}>{icon}</div>
      <div className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{value}</div>
      <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>{label}</div>
      {trend !== undefined && (
        <div className="flex items-center gap-0.5 text-xs font-bold" style={{ color: trend > 0 ? '#059669' : '#DC2626' }}>
          {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  );
}
