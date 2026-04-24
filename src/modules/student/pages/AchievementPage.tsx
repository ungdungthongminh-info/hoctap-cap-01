import { useState, useEffect } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import {
  ACHIEVEMENTS, getXpData, checkAchievements,
  type Achievement, type AchievementCheckData,
} from '../../../shared/utils/achievements';
import { Star, Trophy, Flame, Compass, Sparkles, Lock } from 'lucide-react';
import { MascotCharacter } from '../../../shared/components';
import { STORAGE_KEYS } from '../../../shared/constants/storageKeys';

const CATEGORY_META: Record<string, { label: string; emoji: string; Icon: typeof Star }> = {
  practice: { label: 'Luyện tập', emoji: '📝', Icon: Star },
  score: { label: 'Điểm số', emoji: '💯', Icon: Trophy },
  streak: { label: 'Liên tiếp', emoji: '🔥', Icon: Flame },
  explore: { label: 'Khám phá', emoji: '🧭', Icon: Compass },
  special: { label: 'Đặc biệt', emoji: '✨', Icon: Sparkles },
};

export function AchievementPage() {
  const { state, getCompletedCount, getAverageScore, getStreak } = useAppData();

  // Load unlocked achievements from localStorage
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS) || '[]');
    } catch { return []; }
  });
  const [totalXp, setTotalXp] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.XP) || '0', 10) || 0;
    } catch { return 0; }
  });
  const [newUnlocks, setNewUnlocks] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>('all');

  // Check for new achievements
  useEffect(() => {
    const totalPractices = state.practiceSets.filter((ps) => ps.finishedAt).length;
    const perfectScoreCount = state.progress.filter((p) => p.bestScore === 100 && p.attemptCount > 0).length;
    const score90Count = state.progress.filter((p) => p.bestScore >= 90 && p.attemptCount > 0).length;
    const subjectsStudied = new Set(
      state.progress.filter((p) => p.attemptCount > 0).map((p) => p.subjectCode)
    ).size;

    const data: AchievementCheckData = {
      totalPractices,
      perfectScoreCount,
      score90Count,
      avgScore: getAverageScore(),
      streak: getStreak(),
      completedLessons: getCompletedCount(),
      subjectsStudied,
      currentHour: new Date().getHours(),
    };

    const freshUnlocks = checkAchievements(data, unlockedIds);
    if (freshUnlocks.length > 0) {
      const updated = [...unlockedIds, ...freshUnlocks];
      setUnlockedIds(updated);
      setNewUnlocks(freshUnlocks);
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(updated));

      // Award XP for achievements
      const bonusXp = freshUnlocks.reduce((sum, id) => {
        const a = ACHIEVEMENTS.find((a) => a.id === id);
        return sum + (a?.xpReward || 0);
      }, 0);
      const newXp = totalXp + bonusXp;
      setTotalXp(newXp);
      localStorage.setItem(STORAGE_KEYS.XP, String(newXp));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.practiceSets.length, state.progress]);

  const xpData = getXpData(totalXp);

  const categories = ['all', 'practice', 'score', 'streak', 'explore', 'special'];
  const filtered = filter === 'all'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter((a) => a.category === filter);

  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className="fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MascotCharacter size="sm" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            🏆 Thành Tựu & XP
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            {unlockedCount}/{totalCount} thành tựu đã mở khóa
          </p>
        </div>
      </div>

      {/* XP & Level Card */}
      <div className="card mb-6" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}>
        <div className="flex items-center gap-4">
          <div className="text-5xl">{xpData.levelEmoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-white">Lv.{xpData.level}</span>
              <span className="text-sm text-white/80">{xpData.levelTitle}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-white/70">{xpData.totalXp} XP</span>
              <span className="text-xs text-white/50">·</span>
              <span className="text-xs text-white/70">
                {xpData.xpForCurrentLevel}/{xpData.xpForNextLevel} XP đến level tiếp
              </span>
            </div>
            <div className="w-full h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${xpData.progressPct}%`,
                  background: 'linear-gradient(90deg, #FBBF24, #F59E0B)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* New unlocks toast */}
      {newUnlocks.length > 0 && (
        <div className="card mb-6 animate-bounce-once" style={{ background: '#FEF3C7', border: '2px solid #FBBF24' }}>
          <div className="text-center">
            <div className="text-2xl mb-1">🎉</div>
            <div className="font-bold" style={{ color: '#92400E' }}>Mới mở khóa!</div>
            <div className="flex justify-center gap-3 mt-2 flex-wrap">
              {newUnlocks.map((id) => {
                const a = ACHIEVEMENTS.find((a) => a.id === id);
                return a ? (
                  <span key={id} className="text-sm">
                    {a.emoji} {a.title} (+{a.xpReward} XP)
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            className="chip-tab chip-tab-sm"
            data-active={filter === cat}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? '🏅 Tất cả' : `${CATEGORY_META[cat]?.emoji} ${CATEGORY_META[cat]?.label}`}
          </button>
        ))}
      </div>

      {/* Achievements grid */}
      <div className="grid gap-3">
        {filtered.map((a: Achievement) => {
          const unlocked = unlockedIds.includes(a.id);
          const isNew = newUnlocks.includes(a.id);
          return (
            <div
              key={a.id}
              className={`card flex items-center gap-4 transition-all ${isNew ? 'animate-bounce-once' : ''}`}
              style={{
                opacity: unlocked ? 1 : 0.5,
                background: unlocked
                  ? isNew ? '#FEF3C7' : 'var(--color-background-card)'
                  : '#F9FAFB',
                border: isNew ? '2px solid #FBBF24' : undefined,
              }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl"
                style={{
                  background: unlocked ? 'var(--color-surface)' : '#E5E7EB',
                }}
              >
                {unlocked ? a.emoji : <Lock size={20} style={{ color: '#9CA3AF' }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm" style={{ color: unlocked ? 'var(--color-text)' : '#9CA3AF' }}>
                  {a.title}
                </div>
                <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {a.description}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold" style={{ color: unlocked ? 'var(--color-star)' : '#D1D5DB' }}>
                  +{a.xpReward} XP
                </div>
                <div className="text-[10px]" style={{ color: 'var(--color-text-light)' }}>
                  {CATEGORY_META[a.category]?.emoji} {CATEGORY_META[a.category]?.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
