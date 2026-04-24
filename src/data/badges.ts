/**
 * BADGE SYSTEM — Huy hiệu thành tích
 * Mỗi badge có điều kiện unlock dựa trên progress data
 */

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  bgColor: string;
  check: (ctx: BadgeContext) => boolean;
}

export interface BadgeContext {
  completedCount: number;
  totalLessons: number;
  averageScore: number;
  streak: number;
  totalPracticeSets: number;
  perfectScoreCount: number; // bài đạt 100%
  masteredCount: number;     // bài mastery = 'mastered'
}

export const allBadges: Badge[] = [
  {
    id: 'first_step',
    name: 'Bước đầu tiên',
    emoji: '👣',
    description: 'Hoàn thành bài học đầu tiên',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    check: (ctx) => ctx.completedCount >= 1,
  },
  {
    id: 'five_done',
    name: 'Chăm chỉ',
    emoji: '📚',
    description: 'Hoàn thành 5 bài học',
    color: '#059669',
    bgColor: '#D1FAE5',
    check: (ctx) => ctx.completedCount >= 5,
  },
  {
    id: 'ten_done',
    name: 'Siêng năng',
    emoji: '🌟',
    description: 'Hoàn thành 10 bài học',
    color: '#D97706',
    bgColor: '#FEF3C7',
    check: (ctx) => ctx.completedCount >= 10,
  },
  {
    id: 'all_done',
    name: 'Chinh phục',
    emoji: '🏆',
    description: 'Hoàn thành tất cả bài học',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    check: (ctx) => ctx.totalLessons > 0 && ctx.completedCount >= ctx.totalLessons,
  },
  {
    id: 'perfect_one',
    name: 'Hoàn hảo',
    emoji: '💯',
    description: 'Đạt 100% trong 1 bài',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    check: (ctx) => ctx.perfectScoreCount >= 1,
  },
  {
    id: 'perfect_five',
    name: 'Thiên tài nhí',
    emoji: '🧠',
    description: 'Đạt 100% trong 5 bài',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    check: (ctx) => ctx.perfectScoreCount >= 5,
  },
  {
    id: 'streak_3',
    name: 'Kiên trì',
    emoji: '🔥',
    description: 'Học 3 ngày liên tiếp',
    color: '#EA580C',
    bgColor: '#FFF7ED',
    check: (ctx) => ctx.streak >= 3,
  },
  {
    id: 'streak_7',
    name: 'Siêu kiên trì',
    emoji: '⚡',
    description: 'Học 7 ngày liên tiếp',
    color: '#D97706',
    bgColor: '#FEF3C7',
    check: (ctx) => ctx.streak >= 7,
  },
  {
    id: 'avg_80',
    name: 'Xuất sắc',
    emoji: '⭐',
    description: 'Điểm trung bình ≥ 80%',
    color: '#059669',
    bgColor: '#D1FAE5',
    check: (ctx) => ctx.averageScore >= 80 && ctx.completedCount >= 3,
  },
  {
    id: 'practice_20',
    name: 'Luyện tập không nghỉ',
    emoji: '💪',
    description: 'Hoàn thành 20 lượt luyện tập',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    check: (ctx) => ctx.totalPracticeSets >= 20,
  },
  {
    id: 'mastered_5',
    name: 'Bậc thầy',
    emoji: '👑',
    description: 'Thành thạo 5 bài (≥ 90%)',
    color: '#B45309',
    bgColor: '#FEF3C7',
    check: (ctx) => ctx.masteredCount >= 5,
  },
  {
    id: 'explorer',
    name: 'Nhà khám phá',
    emoji: '🗺️',
    description: 'Thử ít nhất 3 lượt luyện tập',
    color: '#0891B2',
    bgColor: '#CFFAFE',
    check: (ctx) => ctx.totalPracticeSets >= 3,
  },
];

/** Tính danh sách badge đã unlock */
export function getUnlockedBadges(ctx: BadgeContext): Badge[] {
  return allBadges.filter((b) => b.check(ctx));
}
