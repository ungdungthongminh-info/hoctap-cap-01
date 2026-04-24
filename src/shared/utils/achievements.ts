/**
 * Achievement & XP System
 * - XP earned per practice (based on score)
 * - Levels with fun titles
 * - Achievement definitions & unlock logic
 */

// ==================== XP & LEVELS ====================
export interface XpData {
  totalXp: number;
  level: number;
  levelTitle: string;
  levelEmoji: string;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPct: number;
}

const LEVELS = [
  { xp: 0, title: 'Mầm non', emoji: '🌱' },
  { xp: 50, title: 'Học sinh mới', emoji: '📒' },
  { xp: 150, title: 'Chăm chỉ', emoji: '✏️' },
  { xp: 300, title: 'Giỏi giang', emoji: '📚' },
  { xp: 500, title: 'Xuất sắc', emoji: '⭐' },
  { xp: 800, title: 'Ngôi sao', emoji: '🌟' },
  { xp: 1200, title: 'Thần đồng', emoji: '🧠' },
  { xp: 1800, title: 'Siêu nhân', emoji: '🦸' },
  { xp: 2500, title: 'Thiên tài', emoji: '👑' },
  { xp: 3500, title: 'Huyền thoại', emoji: '🏆' },
];

export function calculateXpFromScore(score: number, questionCount: number): number {
  // Base: 2 XP per question answered
  const baseXp = questionCount * 2;
  // Bonus: 50% extra for ≥70%, 100% extra for ≥90%
  if (score >= 90) return Math.round(baseXp * 2);
  if (score >= 70) return Math.round(baseXp * 1.5);
  return baseXp;
}

export function getXpData(totalXp: number): XpData {
  let level = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVELS[i].xp) { level = i; break; }
  }
  const current = LEVELS[level];
  const next = LEVELS[level + 1] || { xp: current.xp + 1000, title: '???', emoji: '🎯' };
  const xpInLevel = totalXp - current.xp;
  const xpNeeded = next.xp - current.xp;
  return {
    totalXp,
    level: level + 1,
    levelTitle: current.title,
    levelEmoji: current.emoji,
    xpForCurrentLevel: xpInLevel,
    xpForNextLevel: xpNeeded,
    progressPct: Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)),
  };
}

// ==================== ACHIEVEMENTS ====================
export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'practice' | 'streak' | 'score' | 'explore' | 'special';
  xpReward: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Practice milestones
  { id: 'first_practice', title: 'Bước đầu tiên', description: 'Hoàn thành bài luyện tập đầu tiên', emoji: '🎯', category: 'practice', xpReward: 10 },
  { id: 'practice_5', title: 'Siêng năng', description: 'Hoàn thành 5 bài luyện tập', emoji: '📝', category: 'practice', xpReward: 20 },
  { id: 'practice_10', title: 'Chăm chỉ', description: 'Hoàn thành 10 bài luyện tập', emoji: '💪', category: 'practice', xpReward: 30 },
  { id: 'practice_25', title: 'Kiên trì', description: 'Hoàn thành 25 bài luyện tập', emoji: '🔥', category: 'practice', xpReward: 50 },
  { id: 'practice_50', title: 'Bền bỉ', description: 'Hoàn thành 50 bài luyện tập', emoji: '🏋️', category: 'practice', xpReward: 100 },

  // Score milestones
  { id: 'first_perfect', title: 'Hoàn hảo!', description: 'Đạt 100% trong 1 bài', emoji: '💯', category: 'score', xpReward: 20 },
  { id: 'perfect_3', title: 'Thiên tài', description: 'Đạt 100% trong 3 bài', emoji: '🧠', category: 'score', xpReward: 50 },
  { id: 'perfect_10', title: 'Siêu sao', description: 'Đạt 100% trong 10 bài', emoji: '🌟', category: 'score', xpReward: 100 },
  { id: 'score_90_5', title: 'Giỏi toàn diện', description: 'Đạt ≥90% trong 5 bài', emoji: '⭐', category: 'score', xpReward: 40 },
  { id: 'avg_80', title: 'Ổn định', description: 'Điểm trung bình ≥80%', emoji: '📊', category: 'score', xpReward: 30 },

  // Streak milestones
  { id: 'streak_3', title: 'Đều đặn', description: 'Streak 3 ngày liên tiếp', emoji: '🔥', category: 'streak', xpReward: 15 },
  { id: 'streak_7', title: 'Tuần hoàn hảo', description: 'Streak 7 ngày liên tiếp', emoji: '🗓️', category: 'streak', xpReward: 50 },
  { id: 'streak_14', title: 'Nửa tháng', description: 'Streak 14 ngày liên tiếp', emoji: '💫', category: 'streak', xpReward: 100 },
  { id: 'streak_30', title: 'Một tháng!', description: 'Streak 30 ngày liên tiếp', emoji: '🏆', category: 'streak', xpReward: 200 },

  // Explore milestones
  { id: 'lesson_complete_5', title: 'Khám phá', description: 'Hoàn thành 5 bài học', emoji: '🗺️', category: 'explore', xpReward: 20 },
  { id: 'lesson_complete_10', title: 'Nhà thám hiểm', description: 'Hoàn thành 10 bài học', emoji: '🧭', category: 'explore', xpReward: 40 },
  { id: 'lesson_complete_20', title: 'Chinh phục', description: 'Hoàn thành 20 bài học', emoji: '🏔️', category: 'explore', xpReward: 80 },
  { id: 'multi_subject', title: 'Đa tài', description: 'Học ít nhất 2 môn', emoji: '🎭', category: 'explore', xpReward: 30 },

  // Special
  { id: 'night_owl', title: 'Cú đêm', description: 'Học sau 20:00', emoji: '🦉', category: 'special', xpReward: 10 },
  { id: 'early_bird', title: 'Chim sớm', description: 'Học trước 7:00', emoji: '🐦', category: 'special', xpReward: 10 },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

// ==================== UNLOCK CHECK LOGIC ====================
export interface AchievementCheckData {
  totalPractices: number;       // tổng số bài luyện tập đã hoàn thành
  perfectScoreCount: number;    // số bài đạt 100%
  score90Count: number;         // số bài đạt ≥90%
  avgScore: number;             // điểm trung bình
  streak: number;               // streak hiện tại
  completedLessons: number;     // số bài học đã hoàn thành
  subjectsStudied: number;      // số môn đã học
  currentHour: number;          // giờ hiện tại (0-23)
}

export function checkAchievements(data: AchievementCheckData, unlockedIds: string[]): string[] {
  const newUnlocks: string[] = [];

  const check = (id: string, condition: boolean) => {
    if (!unlockedIds.includes(id) && condition) newUnlocks.push(id);
  };

  // Practice milestones
  check('first_practice', data.totalPractices >= 1);
  check('practice_5', data.totalPractices >= 5);
  check('practice_10', data.totalPractices >= 10);
  check('practice_25', data.totalPractices >= 25);
  check('practice_50', data.totalPractices >= 50);

  // Score milestones
  check('first_perfect', data.perfectScoreCount >= 1);
  check('perfect_3', data.perfectScoreCount >= 3);
  check('perfect_10', data.perfectScoreCount >= 10);
  check('score_90_5', data.score90Count >= 5);
  check('avg_80', data.avgScore >= 80 && data.totalPractices >= 3);

  // Streak milestones
  check('streak_3', data.streak >= 3);
  check('streak_7', data.streak >= 7);
  check('streak_14', data.streak >= 14);
  check('streak_30', data.streak >= 30);

  // Explore milestones
  check('lesson_complete_5', data.completedLessons >= 5);
  check('lesson_complete_10', data.completedLessons >= 10);
  check('lesson_complete_20', data.completedLessons >= 20);
  check('multi_subject', data.subjectsStudied >= 2);

  // Special
  check('night_owl', data.currentHour >= 20);
  check('early_bird', data.currentHour < 7);

  return newUnlocks;
}
