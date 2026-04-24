/**
 * SEED DATA — Toán Lớp 1 (Đầy đủ 20 bài GDPT 2018)
 * Types + Student + re-export từ lessons/cards/questions
 * Dùng được cả ở browser (in-memory) và Electron (SQLite)
 */

// ==================== TYPES ====================
export interface Lesson {
  id: number;
  grade: number;
  subjectCode: string;
  unitCode: string;
  lessonCode: string;
  title: string;
  objective: string;
  summarySimple: string;
  tips: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  status: 'draft' | 'ready' | 'archived';
  sortOrder: number;
  isActive: number;
  textbook?: 'canh_dieu' | 'ket_noi' | 'chan_troi' | 'chung';
}

export interface LessonCard {
  id: number;
  lessonId: number;
  cardType: 'intro' | 'explain' | 'example' | 'tip' | 'mini_check';
  title: string;
  content: string;
  exampleJson: string | null;
  sortOrder: number;
  isActive: number;
}

export interface Question {
  id: number;
  grade: number;
  subjectCode: string;
  lessonId: number;
  questionType: 'single_choice' | 'true_false' | 'fill_number' | 'ordering' | 'matching' | 'fill_text' | 'multi_choice';
  questionText: string;
  optionsJson: string | null;
  correctAnswer: string;
  explanationSimple: string;
  difficulty: 'easy' | 'medium' | 'hard';
  skillTag: string;
  sourceType: 'manual' | 'imported' | 'generated';
  isVerified: number;
  isActive: number;
}

export interface Student {
  id: number;
  fullName: string;
  grade: number;
  subjectCode: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  isActive: number;
}

export interface StudentProgress {
  id: number;
  studentId: number;
  grade: number;
  subjectCode: string;
  lessonId: number;
  lastScore: number;
  bestScore: number;
  attemptCount: number;
  masteryLevel: 'new' | 'learning' | 'good' | 'mastered';
  lastStudiedAt: string | null;
  needsReview: number;
}

export interface PracticeSet {
  id: number;
  studentId: number;
  lessonId: number;
  mode: string;
  questionIdsJson: string;
  startedAt: string;
  finishedAt: string | null;
  score: number | null;
  correctCount: number;
  wrongCount: number;
}

export interface StudentAnswer {
  id: number;
  practiceSetId: number;
  questionId: number;
  selectedAnswer: string;
  isCorrect: number;
  answeredAt: string;
}

// ==================== SEED STUDENT ====================
export const seedStudent: Student = {
  id: 1,
  fullName: 'Bé Minh',
  grade: 1,
  subjectCode: 'math',
  avatar: 'default',
  createdAt: '2026-04-18T00:00:00',
  updatedAt: '2026-04-18T00:00:00',
  isActive: 1,
};

// ==================== RE-EXPORTS FROM CURRICULUM ====================
import { allLessons } from './lessons';
import { allLessonCards } from './lessonCards';
import { allQuestions } from './questions';
import { allLessons2 } from './lessons2';
import { allLessonCards2 } from './lessonCards2';
import { allQuestions2 } from './questions2';
import { vietnameseLessons1 } from './vietnameseLessons1';
import { vietnameseCards1 } from './vietnameseCards1';
import { vietnameseQuestions1 } from './vietnameseQuestions1';
import { natureLessons1 } from './natureLessons1';
import { natureCards1 } from './natureCards1';
import { natureQuestions1 } from './natureQuestions1';
import { ethicsLessons1 } from './ethicsLessons1';
import { ethicsCards1 } from './ethicsCards1';
import { ethicsQuestions1 } from './ethicsQuestions1';
import { englishLessons3 } from './englishLessons3';
import { englishCards3 } from './englishCards3';
import { englishQuestions3 } from './englishQuestions3';
// Sprint 15 — Math G3-5
import { mathLessons3to5 } from './mathLessons3to5';
import { mathCards3to5 } from './mathCards3to5';
import { mathQuestions3 } from './mathQuestions3';
import { mathQuestions4 } from './mathQuestions4';
import { mathQuestions5 } from './mathQuestions5';
// Sprint 15 — Vietnamese G2-5
import { vietnameseLessons2, vietnameseLessons3, vietnameseLessons4, vietnameseLessons5 } from './vietnameseLessons2to5';
import { vietnameseCards2to5 } from './vietnameseCards2to5';
import { vietnameseQuestions2 } from './vietnameseQuestions2';
import { vietnameseQuestions3 } from './vietnameseQuestions3';
import { vietnameseQuestions4 } from './vietnameseQuestions4';
import { vietnameseQuestions5 } from './vietnameseQuestions5';
// Sprint 15 — Nature G2-3
import { natureLessons2, natureLessons3 } from './natureLessons2to3';
import { natureCards2to3 } from './natureCards2to3';
import { natureQuestions2 } from './natureQuestions2';
import { natureQuestions3 } from './natureQuestions3';
// Sprint 15 — Ethics G2-5
import { ethicsLessons2, ethicsLessons3, ethicsLessons4, ethicsLessons5 } from './ethicsLessons2to5';
import { ethicsCards2to5 } from './ethicsCards2to5';
import { ethicsQuestions2 } from './ethicsQuestions2';
import { ethicsQuestions3 } from './ethicsQuestions3';
import { ethicsQuestions4 } from './ethicsQuestions4';
import { ethicsQuestions5 } from './ethicsQuestions5';
// Sprint 15 — English G4-5
import { englishLessons4, englishLessons5 } from './englishLessons4to5';
import { englishCards4, englishCards5 } from './englishCards4to5';
import { englishQuestions4 } from './englishQuestions4';
import { englishQuestions5 } from './englishQuestions5';
// Sprint 16 — English G1-2
import { englishLessons1, englishLessons2 } from './englishLessons1to2';
import { englishCards1to2 } from './englishCards1to2';
import { englishQuestions1 } from './englishQuestions1';
import { englishQuestions2 } from './englishQuestions2';
// Sprint 16 — Science G4-5
import { scienceLessons4, scienceLessons5 } from './scienceLessons4to5';
import { scienceCards4to5 } from './scienceCards4to5';
import { scienceQuestions4 } from './scienceQuestions4';
import { scienceQuestions5 } from './scienceQuestions5';
// Sprint 16 — History & Geography G4-5
import { histgeoLessons4, histgeoLessons5 } from './histgeoLessons4to5';
import { histgeoCards4to5 } from './histgeoCards4to5';
import { histgeoQuestions4 } from './histgeoQuestions4';
import { histgeoQuestions5 } from './histgeoQuestions5';
// Sprint 18 — Tin học G3-5
import { informaticsLessons3, informaticsLessons4, informaticsLessons5 } from './informaticsLessons3to5';
import { informaticsCards3to5 } from './informaticsCards3to5';
import { informaticsQuestions3 } from './informaticsQuestions3';
import { informaticsQuestions4 } from './informaticsQuestions4';
import { informaticsQuestions5 } from './informaticsQuestions5';
// Sprint 18 — Mỹ thuật G1-5
import { artLessons1, artLessons2, artLessons3, artLessons4, artLessons5 } from './myThuatLessons1to5';
import { artCards1to5 } from './myThuatCards1to5';
import { artQuestions1 } from './myThuatQuestions1';
import { artQuestions2 } from './myThuatQuestions2';
import { artQuestions3 } from './myThuatQuestions3';
import { artQuestions4 } from './myThuatQuestions4';
import { artQuestions5 } from './myThuatQuestions5';
// Sprint 18 — Extra questions (15→25/bài)
import { extraQuestions } from './extraQuestionsAll';
// Sprint 19 — Content Expansion 20→35 bài/lớp
import { mathExpLessons, mathExpCards, mathExpQuestions } from './expandMathLessons';
import { vietExpLessons, vietExpCards, vietExpQuestions } from './expandVietnameseLessons';
import {
  natureExpLessons, natureExpCards, natureExpQuestions,
  ethicsExpLessons, ethicsExpCards, ethicsExpQuestions,
  englishExpLessons, englishExpCards, englishExpQuestions,
  scienceExpLessons, scienceExpCards, scienceExpQuestions,
  histgeoExpLessons, histgeoExpCards, histgeoExpQuestions,
  infoExpLessons, infoExpCards, infoExpQuestions,
  artExpLessons, artExpCards, artExpQuestions,
} from './expandOtherSubjects';
import { preGradeLessons, preGradeCards, preGradeQuestions } from './preGradeContent';
import { generatedQuestionPatches } from './generatedQuestionPatches';

// Auto-assign textbook for lessons that don't have one
const TEXT_BOOKS: Array<Lesson['textbook']> = ['canh_dieu', 'ket_noi', 'chan_troi'];
function assignTextbooks(lessons: Lesson[]): Lesson[] {
  // Group by grade+subject, then assign in round-robin: first lesson of each group = 'chung', rest cycle 3 textbooks
  const groups = new Map<string, Lesson[]>();
  for (const l of lessons) {
    const key = `${l.grade}_${l.subjectCode}`;
    const arr = groups.get(key) || [];
    arr.push(l);
    groups.set(key, arr);
  }
  const result: Lesson[] = [];
  for (const [, group] of groups) {
    const sorted = [...group].sort((a, b) => a.sortOrder - b.sortOrder);
    sorted.forEach((l, i) => {
      if (!l.textbook) {
        // First 2 lessons of each group = chung (shared), rest cycle across textbooks
        l.textbook = i < 2 ? 'chung' : TEXT_BOOKS[(i - 2) % 3];
      }
      result.push(l);
    });
  }
  return result;
}

export const seedLessons: Lesson[] = assignTextbooks([
  ...allLessons, ...allLessons2, ...vietnameseLessons1, ...natureLessons1, ...ethicsLessons1, ...englishLessons3,
  ...mathLessons3to5,
  ...vietnameseLessons2, ...vietnameseLessons3, ...vietnameseLessons4, ...vietnameseLessons5,
  ...natureLessons2, ...natureLessons3,
  ...ethicsLessons2, ...ethicsLessons3, ...ethicsLessons4, ...ethicsLessons5,
  ...englishLessons4, ...englishLessons5,
  ...englishLessons1, ...englishLessons2,
  ...scienceLessons4, ...scienceLessons5,
  ...histgeoLessons4, ...histgeoLessons5,
  ...informaticsLessons3, ...informaticsLessons4, ...informaticsLessons5,
  ...artLessons1, ...artLessons2, ...artLessons3, ...artLessons4, ...artLessons5,
  // Pre-grade (Tien lop 1)
  ...preGradeLessons,
  // Expansion 20→35
  ...mathExpLessons, ...vietExpLessons,
  ...natureExpLessons, ...ethicsExpLessons, ...englishExpLessons,
  ...scienceExpLessons, ...histgeoExpLessons, ...infoExpLessons, ...artExpLessons,
]);
export const seedLessonCards: LessonCard[] = [
  ...allLessonCards, ...allLessonCards2, ...vietnameseCards1, ...natureCards1, ...ethicsCards1, ...englishCards3,
  ...mathCards3to5, ...vietnameseCards2to5, ...natureCards2to3, ...ethicsCards2to5,
  ...englishCards4, ...englishCards5,
  ...englishCards1to2,
  ...scienceCards4to5,
  ...histgeoCards4to5,
  ...informaticsCards3to5,
  ...artCards1to5,
  // Pre-grade (Tien lop 1)
  ...preGradeCards,
  // Expansion 20→35
  ...mathExpCards, ...vietExpCards,
  ...natureExpCards, ...ethicsExpCards, ...englishExpCards,
  ...scienceExpCards, ...histgeoExpCards, ...infoExpCards, ...artExpCards,
];
export const seedQuestions: Question[] = [
  ...allQuestions, ...allQuestions2, ...vietnameseQuestions1, ...natureQuestions1, ...ethicsQuestions1, ...englishQuestions3,
  ...mathQuestions3, ...mathQuestions4, ...mathQuestions5,
  ...vietnameseQuestions2, ...vietnameseQuestions3, ...vietnameseQuestions4, ...vietnameseQuestions5,
  ...natureQuestions2, ...natureQuestions3,
  ...ethicsQuestions2, ...ethicsQuestions3, ...ethicsQuestions4, ...ethicsQuestions5,
  ...englishQuestions4, ...englishQuestions5,
  ...englishQuestions1, ...englishQuestions2,
  ...scienceQuestions4, ...scienceQuestions5,
  ...histgeoQuestions4, ...histgeoQuestions5,
  ...informaticsQuestions3, ...informaticsQuestions4, ...informaticsQuestions5,
  ...artQuestions1, ...artQuestions2, ...artQuestions3, ...artQuestions4, ...artQuestions5,
  // Pre-grade (Tien lop 1)
  ...preGradeQuestions,
  ...extraQuestions,
  // Expansion 20→35
  ...mathExpQuestions, ...vietExpQuestions,
  ...natureExpQuestions, ...ethicsExpQuestions, ...englishExpQuestions,
  ...scienceExpQuestions, ...histgeoExpQuestions, ...infoExpQuestions, ...artExpQuestions,
  // Auto-imported content patches from content team
  ...generatedQuestionPatches,
];

