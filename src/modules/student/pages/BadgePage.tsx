import { useAppData } from '../../../shared/providers/AppDataProvider';
import { allBadges, getUnlockedBadges, BadgeContext } from '../../../data/badges';
import { MascotCharacter } from '../../../shared/components';

export function BadgePage() {
  const { state, getCompletedCount, getAverageScore, getStreak, getSubjectLessons } = useAppData();

  const completedCount = getCompletedCount();
  const totalLessons = getSubjectLessons().length;
  const averageScore = getAverageScore();
  const streak = getStreak();
  const totalPracticeSets = state.practiceSets.filter((ps) => ps.finishedAt).length;
  const perfectScoreCount = state.progress.filter((p) => p.bestScore === 100).length;
  const masteredCount = state.progress.filter((p) => p.masteryLevel === 'mastered').length;

  const ctx: BadgeContext = {
    completedCount,
    totalLessons,
    averageScore,
    streak,
    totalPracticeSets,
    perfectScoreCount,
    masteredCount,
  };

  const unlocked = getUnlockedBadges(ctx);
  const unlockedIds = new Set(unlocked.map((b) => b.id));
  const completionPct = Math.round((unlocked.length / allBadges.length) * 100);

  return (
    <div className="subpage-shell subpage-shell--compact fade-in max-w-4xl mx-auto">
      <div className="subpage-hero subpage-hero--badge">
        <div className="subpage-hero__avatar"><MascotCharacter size="sm" /></div>
        <div className="subpage-hero__content">
          <div className="subpage-hero__eyebrow">Bộ sưu tập</div>
          <h1 className="subpage-hero__title" style={{ color: 'var(--color-primary-dark)' }}>
            🏅 Huy Hiệu Thành Tích
          </h1>
          <p className="subpage-hero__subtitle" style={{ color: 'var(--color-text-light)' }}>
            Đã mở khóa {unlocked.length}/{allBadges.length} huy hiệu
          </p>
        </div>
        <div className="subpage-hero__meta">
          <span className="subpage-hero__pill">🏅 {unlocked.length}</span>
          <span className="subpage-hero__pill">{completionPct}% hoàn thành</span>
        </div>
      </div>

      <div className="badge-progress-card subpage-panel">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            Tiến trình sưu tập
          </span>
          <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            {completionPct}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      <div className="badge-grid-premium">
        {allBadges.map((badge) => {
          const isUnlocked = unlockedIds.has(badge.id);
          return (
            <div
              key={badge.id}
              className="badge-card-premium"
              style={{
                opacity: isUnlocked ? 1 : 0.4,
                filter: isUnlocked ? 'none' : 'grayscale(1)',
                background: isUnlocked ? badge.bgColor : undefined,
                border: isUnlocked ? `2px solid ${badge.color}` : undefined,
              }}
            >
              <span className="text-4xl block mb-2">{badge.emoji}</span>
              <div className="font-bold text-sm" style={{ color: isUnlocked ? badge.color : 'var(--color-text-light)' }}>
                {badge.name}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
                {badge.description}
              </div>
              {isUnlocked && (
                <div className="text-xs mt-2 font-bold" style={{ color: badge.color }}>
                  ✅ Đã mở khóa!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
