/**
 * SUBJECTS — Danh sách môn học Tiểu học (GDPT 2018)
 * Mỗi môn có code, tên tiếng Việt, emoji, và danh sách lớp áp dụng
 */

export interface Subject {
  code: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  grades: number[]; // Lớp nào có môn này
  hasContent: boolean; // Đã có nội dung chưa
}

export const allSubjects: Subject[] = [
  {
    code: 'math',
    name: 'Toán',
    emoji: '🔢',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    grades: [0, 1, 2, 3, 4, 5],
    hasContent: true,
  },
  {
    code: 'vietnamese',
    name: 'Tiếng Việt',
    emoji: '📖',
    color: '#059669',
    bgColor: '#D1FAE5',
    grades: [0, 1, 2, 3, 4, 5],
    hasContent: true,
  },
  {
    code: 'nature',
    name: 'Tự nhiên & Xã hội',
    emoji: '🌿',
    color: '#16A34A',
    bgColor: '#DCFCE7',
    grades: [1, 2, 3],
    hasContent: true,
  },
  {
    code: 'ethics',
    name: 'Đạo đức',
    emoji: '💛',
    color: '#D97706',
    bgColor: '#FEF3C7',
    grades: [0, 1, 2, 3, 4, 5],
    hasContent: true,
  },
  {
    code: 'english',
    name: 'Tiếng Anh',
    emoji: '🌍',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    grades: [1, 2, 3, 4, 5],
    hasContent: true,
  },
  {
    code: 'science',
    name: 'Khoa học',
    emoji: '🔬',
    color: '#0891B2',
    bgColor: '#CFFAFE',
    grades: [4, 5],
    hasContent: true,
  },
  {
    code: 'history_geo',
    name: 'Lịch sử & Địa lý',
    emoji: '🗺️',
    color: '#B45309',
    bgColor: '#FEF3C7',
    grades: [4, 5],
    hasContent: true,
  },
  {
    code: 'informatics',
    name: 'Tin học',
    emoji: '💻',
    color: '#0D9488',
    bgColor: '#CCFBF1',
    grades: [3, 4, 5],
    hasContent: true,
  },
  {
    code: 'art',
    name: 'Mỹ thuật',
    emoji: '🎨',
    color: '#DB2777',
    bgColor: '#FCE7F3',
    grades: [0, 1, 2, 3, 4, 5],
    hasContent: true,
  },
];

export function getGradeLabel(grade: number): string {
  if (grade === 0) return 'Tiền Tiểu Học (Lớp Lá)';
  return `Lớp ${grade}`;
}

/** Lấy danh sách môn cho 1 lớp cụ thể */
export function getSubjectsForGrade(grade: number): Subject[] {
  return allSubjects.filter((s) => s.grades.includes(grade));
}

/** Lấy thông tin 1 môn theo code */
export function getSubjectByCode(code: string): Subject | undefined {
  return allSubjects.find((s) => s.code === code);
}
