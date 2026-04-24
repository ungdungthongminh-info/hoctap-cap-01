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
    completedCount, totalLessons, averageScore, streak,
    totalPracticeSets, perfectScoreCount, masteredCount,
  };

  const unlocked = getUnlockedBadges(ctx);
  const unlockedIds = new Set(unlocked.map((b) => b.id));

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <MascotCharacter size="sm" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            🏅 Huy Hiệu Thành Tích
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Đã mở khóa {unlocked.length}/{allBadges.length} huy hiệu
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            Tiến trình sưu tập
          </span>
          <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            {Math.round((unlocked.length / allBadges.length) * 100)}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${(unlocked.length / allBadges.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {allBadges.map((badge) => {
          const isUnlocked = unlockedIds.has(badge.id);
          return (
            <div
              key={badge.id}
              className="card text-center p-5 transition-transform"
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
