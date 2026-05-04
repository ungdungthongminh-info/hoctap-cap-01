import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type {
  Lesson, LessonCard, Question, Student, StudentProgress, PracticeSet, StudentAnswer,
} from '../../data/seedData';
import { calculateXpFromScore } from '../utils/achievements';
import { loadPersistedState, saveState as persistState, syncToSqlite } from '../utils/persistence';
import { STORAGE_KEYS } from '../constants/storageKeys';
import {
  detectWeaknesses, pickSmartQuestions, recommendNextLessons,
  analyzePostPractice, generateReviewSet,
  type SkillWeakness, type LessonRecommendation, type PostPracticeAnalysis, type SmartQuestion,
} from '../services/ruleEngine';
import {
  getMascotMessage, getMascotGreeting,
  type MascotMessage, type ChatContext,
} from '../services/mascotChat';
import { canAccessLesson, canAccessStudentGrade, canAccessSubjectCode, getAccessPlan, getUnlockedGrades } from '../services/accessControl';

// ==================== STORE TYPES ====================
interface AppState {
  student: Student;
  lessons: Lesson[];
  lessonCards: LessonCard[];
  questions: Question[];
  progress: StudentProgress[];
  practiceSets: PracticeSet[];
  answers: StudentAnswer[];
}

interface WeeklyDay {
  date: string; // 'YYYY-MM-DD'
  label: string; // 'T2', 'T3'...
  sessions: number;
  correctRate: number; // 0-100
}

interface DataHealth {
  totalLessons: number;
  totalCards: number;
  totalQuestions: number;
  verifiedQuestions: number;
  lessonsWithoutCards: number[];
  lessonsWithoutQuestions: number[];
  avgQuestionsPerLesson: number;
}

interface AppContextType {
  state: AppState;
  // Student
  updateStudent: (updates: Partial<Pick<Student, 'fullName' | 'grade' | 'subjectCode' | 'avatar'>>) => void;
  // Lesson helpers
  getGradeLessons: () => Lesson[];
  getSubjectLessons: () => Lesson[];
  getLessonCards: (lessonId: number) => LessonCard[];
  getLessonQuestions: (lessonId: number, count?: number) => Question[];
  getLessonProgress: (lessonId: number) => StudentProgress | undefined;
  // Practice flow
  startPractice: (lessonId: number, mode: string, customQuestionIds?: number[]) => PracticeSet;
  submitAnswer: (practiceSetId: number, questionId: number, answer: string) => boolean;
  finishPractice: (practiceSetId: number) => PracticeSet;
  // Progress
  getCompletedCount: () => number;
  getNeedsReviewLessons: () => Lesson[];
  getAverageScore: () => number;
  getStreak: () => number;
  getWeeklyActivity: () => WeeklyDay[];
  // Data health
  getDataHealth: () => DataHealth;
  // Admin
  resetProgress: () => void;
  // Backup/Restore
  exportBackup: () => string;
  importBackup: (json: string) => boolean;
  // Rule Engine
  getWeaknesses: (daysWindow?: number) => SkillWeakness[];
  getSmartQuestions: (lessonId: number, count?: number) => SmartQuestion[];
  getRecommendations: (grade?: number, subjectCode?: string, limit?: number) => LessonRecommendation[];
  getPostAnalysis: (practiceSetId: number) => PostPracticeAnalysis | null;
  getReviewSet: (grade?: number, subjectCode?: string, count?: number) => SmartQuestion[];
  // Mascot Chat
  getMascotMsg: (themeId: string, context: ChatContext, vars?: Record<string, string>) => MascotMessage;
  getMascotGreet: (themeId: string) => MascotMessage;
}

const AppContext = createContext<AppContextType | null>(null);

// ── Focused context types ────────────────────────────────────────
export interface ContentContextType {
  lessons: Lesson[];
  lessonCards: LessonCard[];
  questions: Question[];
  getLessonCards: (lessonId: number) => LessonCard[];
  getLessonQuestions: (lessonId: number, count?: number) => Question[];
  getDataHealth: () => DataHealth;
}

export interface StudentContextType {
  student: Student;
  updateStudent: (updates: Partial<Pick<Student, 'fullName' | 'grade' | 'subjectCode' | 'avatar'>>) => void;
  getGradeLessons: () => Lesson[];
  getSubjectLessons: () => Lesson[];
}

const ContentContext = createContext<ContentContextType | null>(null);
const StudentContext = createContext<StudentContextType | null>(null);

interface SeedPayload {
  seedStudent: Student;
  seedLessons: Lesson[];
  seedLessonCards: LessonCard[];
  seedQuestions: Question[];
}

const DEFAULT_STUDENT: Student = {
  id: 1,
  fullName: 'Bé Minh',
  grade: 1,
  subjectCode: 'math',
  avatar: 'default',
  createdAt: '2026-04-18T00:00:00',
  updatedAt: '2026-04-18T00:00:00',
  isActive: 1,
};

function buildFreshProgress(lessons: Lesson[]): StudentProgress[] {
  return lessons.map((l, i) => ({
    id: i + 1,
    studentId: 1,
    grade: l.grade,
    subjectCode: l.subjectCode,
    lessonId: l.id,
    lastScore: 0,
    bestScore: 0,
    attemptCount: 0,
    masteryLevel: 'new' as const,
    lastStudiedAt: null,
    needsReview: 0,
  }));
}

function hydrateInitialState(seed: SeedPayload): AppState {
  const freshProgress = buildFreshProgress(seed.seedLessons);

  try {
    const saved = loadPersistedState();
    if (saved) {
      const savedMap = new Map(saved.progress.map((p) => [p.lessonId, p]));
      const mergedProgress = freshProgress.map((fp) => {
        const sp = savedMap.get(fp.lessonId);
        if (sp) return { ...fp, ...sp, id: fp.id, studentId: 1 } as StudentProgress;
        return fp;
      });

      return {
        student: {
          ...seed.seedStudent,
          fullName: saved.student.fullName || seed.seedStudent.fullName,
          grade: saved.student.grade || seed.seedStudent.grade,
          subjectCode: saved.student.subjectCode || seed.seedStudent.subjectCode,
          avatar: saved.student.avatar || seed.seedStudent.avatar,
        },
        lessons: seed.seedLessons,
        lessonCards: seed.seedLessonCards,
        questions: seed.seedQuestions,
        progress: mergedProgress,
        practiceSets: (saved.practiceSets || []) as PracticeSet[],
        answers: (saved.answers || []) as StudentAnswer[],
      };
    }
  } catch (err) {
    console.error('Failed to load saved state, using fresh state:', err);
    try { localStorage.removeItem(STORAGE_KEYS.APP_STATE); } catch { /* */ }
  }

  return {
    student: seed.seedStudent,
    lessons: seed.seedLessons,
    lessonCards: seed.seedLessonCards,
    questions: seed.seedQuestions,
    progress: freshProgress,
    practiceSets: [],
    answers: [],
  };
}

// ==================== PROVIDER ====================
function buildInitialState(): AppState {
  return {
    student: DEFAULT_STUDENT,
    lessons: [],
    lessonCards: [],
    questions: [],
    progress: [],
    practiceSets: [],
    answers: [],
  };
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(buildInitialState);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hasHydratedRef = useRef(false);

  // Lazy-load curriculum data to keep initial chunk light.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const seed = await import('../../data/seedData');
        if (cancelled) return;
        setState(hydrateInitialState(seed));
        hasHydratedRef.current = true;
      } catch (err) {
        console.error('Failed to load curriculum data:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-save state on every change (debounced 500ms)
  useEffect(() => {
    if (!hasHydratedRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      persistState(state);
      // Also sync to SQLite in background (non-blocking)
      syncToSqlite(state).catch((err) => {
        if (import.meta.env.DEV) console.warn('[SQLite sync]', err);
      });
    }, 500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [state.student, state.progress, state.practiceSets, state.answers]);

  useEffect(() => {
    try {
      const host = window as unknown as {
        __HHK_APP_DATA_SNAPSHOT__?: {
          student: AppState['student'];
          lessons: AppState['lessons'];
          lessonCards: AppState['lessonCards'];
        };
      };
      host.__HHK_APP_DATA_SNAPSHOT__ = {
        student: state.student,
        lessons: state.lessons,
        lessonCards: state.lessonCards,
      };
    } catch {
      // Ignore snapshot publish errors in constrained runtimes.
    }
  }, [state.student, state.lessons, state.lessonCards]);

  // --- Student ---
  const updateStudent = useCallback((updates: Partial<Pick<Student, 'fullName' | 'grade' | 'subjectCode' | 'avatar'>>) => {
    const currentPlan = getAccessPlan();
    setState((prev) => ({
      ...prev,
      student: (() => {
        const requestedGrade = updates.grade ?? prev.student.grade;
        const unlockedGrades = getUnlockedGrades(prev.student.grade, currentPlan);
        const nextGrade = canAccessStudentGrade(requestedGrade, prev.student.grade, currentPlan)
          ? requestedGrade
          : unlockedGrades[0] ?? prev.student.grade;
        const requestedSubject = updates.subjectCode ?? prev.student.subjectCode;
        const nextSubject = canAccessSubjectCode(requestedSubject, currentPlan) ? requestedSubject : 'math';

        return {
          ...prev.student,
          ...updates,
          grade: nextGrade,
          subjectCode: nextSubject,
          updatedAt: new Date().toISOString(),
        };
      })(),
    }));
  }, []);

  // --- Grade-filtered lessons ---
  const getGradeLessons = useCallback(() => {
    return state.lessons.filter((l) => l.grade === state.student.grade);
  }, [state.lessons, state.student.grade]);

  // --- Grade + Subject filtered lessons ---
  const getSubjectLessons = useCallback(() => {
    return state.lessons.filter(
      (l) => l.grade === state.student.grade && l.subjectCode === state.student.subjectCode
    );
  }, [state.lessons, state.student.grade, state.student.subjectCode]);

  // --- Lesson helpers ---
  const getLessonCards = useCallback((lessonId: number) => {
    return state.lessonCards
      .filter((c) => c.lessonId === lessonId && c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [state.lessonCards]);

  const getLessonQuestions = useCallback((lessonId: number, count?: number) => {
    const lesson = state.lessons.find((l) => l.id === lessonId);
    if (!lesson) return [];

    const currentPlan = getAccessPlan();
    if (!canAccessLesson(lesson, state.student, currentPlan)) {
      return [];
    }

    const all = state.questions.filter((q) => q.lessonId === lessonId && q.isActive);
    if (!count) return all;
    // Fisher-Yates shuffle — phân phối đều hơn Math.random() sort
    const shuffled = [...all];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  }, [state.lessons, state.questions, state.student]);

  const getLessonProgress = useCallback((lessonId: number) => {
    return state.progress.find((p) => p.lessonId === lessonId);
  }, [state.progress]);

  // --- Practice flow ---
  const startPractice = useCallback((lessonId: number, mode: string, customQuestionIds?: number[]): PracticeSet => {
    const lesson = state.lessons.find((l) => l.id === lessonId);
    const currentPlan = getAccessPlan();
    if (!lesson || !canAccessLesson(lesson, state.student, currentPlan)) {
      throw new Error('LESSON_LOCKED_OR_NOT_FOUND');
    }

    let questionIds: number[];
    // If caller provides question IDs (including empty list), always honor that exact set.
    if (customQuestionIds !== undefined) {
      questionIds = customQuestionIds;
    } else {
      const count = mode === 'practice_5' ? 5 : mode === 'practice_10' ? 10 : mode === 'practice_20' ? 20 : mode === 'practice_25' ? 25 : 15;
      const questions = getLessonQuestions(lessonId, count);
      questionIds = questions.map((q) => q.id);
    }
    const newSet: PracticeSet = {
      id: state.practiceSets.length + 1,
      studentId: 1,
      lessonId,
      mode,
      questionIdsJson: JSON.stringify(questionIds),
      startedAt: new Date().toISOString(),
      finishedAt: null,
      score: null,
      correctCount: 0,
      wrongCount: 0,
    };
    setState((prev) => ({
      ...prev,
      practiceSets: [...prev.practiceSets, newSet],
    }));
    return newSet;
  }, [state.lessons, state.practiceSets.length, state.student, getLessonQuestions]);

  const submitAnswer = useCallback((practiceSetId: number, questionId: number, answer: string): boolean => {
    const question = state.questions.find((q) => q.id === questionId);
    if (!question) return false;

    const isCorrect = (() => {
      const a = answer.trim();
      const c = question.correctAnswer.trim();
      if (question.questionType === 'fill_text') return a.toLowerCase() === c.toLowerCase();
      if (question.questionType === 'multi_choice') {
        const aSorted = a.split(',').map(s => s.trim()).sort().join(',');
        const cSorted = c.split(',').map(s => s.trim()).sort().join(',');
        return aSorted === cSorted;
      }
      return a === c;
    })();
    const newAnswer: StudentAnswer = {
      id: state.answers.length + 1,
      practiceSetId,
      questionId,
      selectedAnswer: answer,
      isCorrect: isCorrect ? 1 : 0,
      answeredAt: new Date().toISOString(),
    };

    setState((prev) => {
      const updatedSets = prev.practiceSets.map((ps) => {
        if (ps.id !== practiceSetId) return ps;
        return {
          ...ps,
          correctCount: ps.correctCount + (isCorrect ? 1 : 0),
          wrongCount: ps.wrongCount + (isCorrect ? 0 : 1),
        };
      });
      return {
        ...prev,
        answers: [...prev.answers, newAnswer],
        practiceSets: updatedSets,
      };
    });
    return isCorrect;
  }, [state.questions, state.answers.length]);

  const finishPractice = useCallback((practiceSetId: number): PracticeSet => {
    let finishedSet: PracticeSet | null = null;

    setState((prev) => {
      const updatedSets = prev.practiceSets.map((ps) => {
        if (ps.id !== practiceSetId) return ps;
        const questionIds: number[] = JSON.parse(ps.questionIdsJson);
        const total = questionIds.length;
        const score = total > 0 ? Math.round((ps.correctCount / total) * 100) : 0;
        const finished = {
          ...ps,
          finishedAt: new Date().toISOString(),
          score,
        };
        finishedSet = finished;
        return finished;
      });

      // Update student progress
      const set = finishedSet!;
      const updatedProgress = prev.progress.map((p) => {
        if (p.lessonId !== set.lessonId) return p;
        const newAttempt = p.attemptCount + 1;
        const newBest = Math.max(p.bestScore, set.score || 0);
        let mastery: StudentProgress['masteryLevel'] = 'new';
        if (newBest >= 90) mastery = 'mastered';
        else if (newBest >= 70) mastery = 'good';
        else if (newAttempt > 0) mastery = 'learning';

        return {
          ...p,
          lastScore: set.score || 0,
          bestScore: newBest,
          attemptCount: newAttempt,
          masteryLevel: mastery,
          lastStudiedAt: new Date().toISOString(),
          needsReview: (set.score || 0) < 70 ? 1 : 0,
        };
      });

      return { ...prev, practiceSets: updatedSets, progress: updatedProgress };
    });

    // Award XP
    const fs = finishedSet as PracticeSet | null;
    if (fs) {
      const qCount = (JSON.parse(fs.questionIdsJson) as number[]).length;
      const xpEarned = calculateXpFromScore(fs.score || 0, qCount);
      try {
        const cur = parseInt(localStorage.getItem(STORAGE_KEYS.XP) || '0', 10) || 0;
        localStorage.setItem(STORAGE_KEYS.XP, String(cur + xpEarned));
      } catch { /* */ }
    }

    return finishedSet || state.practiceSets.find((ps) => ps.id === practiceSetId)!;
  }, [state.practiceSets]);

  // --- Progress stats ---
  const getCompletedCount = useCallback(() => {
    const subjectLessonIds = state.lessons
      .filter((l) => l.grade === state.student.grade && l.subjectCode === state.student.subjectCode)
      .map((l) => l.id);
    return state.progress.filter((p) => subjectLessonIds.includes(p.lessonId) && p.attemptCount > 0).length;
  }, [state.progress, state.lessons, state.student.grade, state.student.subjectCode]);

  const getNeedsReviewLessons = useCallback(() => {
    const reviewIds = state.progress.filter((p) => p.needsReview).map((p) => p.lessonId);
    return state.lessons.filter(
      (l) => l.grade === state.student.grade && l.subjectCode === state.student.subjectCode && reviewIds.includes(l.id)
    );
  }, [state.progress, state.lessons, state.student.grade, state.student.subjectCode]);

  const getAverageScore = useCallback(() => {
    const subjectLessonIds = state.lessons
      .filter((l) => l.grade === state.student.grade && l.subjectCode === state.student.subjectCode)
      .map((l) => l.id);
    const attempted = state.progress.filter((p) => subjectLessonIds.includes(p.lessonId) && p.attemptCount > 0);
    if (attempted.length === 0) return 0;
    const total = attempted.reduce((sum, p) => sum + p.bestScore, 0);
    return Math.round(total / attempted.length);
  }, [state.progress, state.lessons, state.student.grade, state.student.subjectCode]);

  const getStreak = useCallback(() => {
    // Simple streak: count unique recent days with activity
    const dates = state.practiceSets
      .filter((ps) => ps.finishedAt)
      .map((ps) => ps.finishedAt!.substring(0, 10));
    const uniqueDates = [...new Set(dates)].sort().reverse();
    if (uniqueDates.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    for (let i = 0; i < uniqueDates.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      const expectedStr = expected.toISOString().substring(0, 10);
      if (uniqueDates[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }
    return Math.max(streak, uniqueDates.length > 0 ? 1 : 0);
  }, [state.practiceSets]);

  const getWeeklyActivity = useCallback((): WeeklyDay[] => {
    const days: WeeklyDay[] = [];
    const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().substring(0, 10);
      const daySets = state.practiceSets.filter(
        (ps) => ps.finishedAt && ps.finishedAt.substring(0, 10) === dateStr
      );
      const dayAnswers = state.answers.filter((a) =>
        daySets.some((ps) => ps.id === a.practiceSetId)
      );
      const totalAns = dayAnswers.length;
      const correctAns = dayAnswers.filter((a) => a.isCorrect).length;
      days.push({
        date: dateStr,
        label: dayLabels[d.getDay()],
        sessions: daySets.length,
        correctRate: totalAns > 0 ? Math.round((correctAns / totalAns) * 100) : 0,
      });
    }
    return days;
  }, [state.practiceSets, state.answers]);

  const getDataHealth = useCallback((): DataHealth => {
    const lessonIds = state.lessons.map((l) => l.id);
    const lessonsWithoutCards = lessonIds.filter(
      (id) => !state.lessonCards.some((c) => c.lessonId === id && c.isActive)
    );
    const lessonsWithoutQuestions = lessonIds.filter(
      (id) => !state.questions.some((q) => q.lessonId === id && q.isActive)
    );
    return {
      totalLessons: state.lessons.length,
      totalCards: state.lessonCards.filter((c) => c.isActive).length,
      totalQuestions: state.questions.filter((q) => q.isActive).length,
      verifiedQuestions: state.questions.filter((q) => q.isActive && q.isVerified).length,
      lessonsWithoutCards,
      lessonsWithoutQuestions,
      avgQuestionsPerLesson: state.lessons.length > 0
        ? Math.round(state.questions.filter((q) => q.isActive).length / state.lessons.length)
        : 0,
    };
  }, [state.lessons, state.lessonCards, state.questions]);

  const resetProgress = useCallback(() => {
    setState((prev) => ({
      ...prev,
      progress: prev.lessons.map((l, i) => ({
        id: i + 1, studentId: 1, grade: l.grade, subjectCode: l.subjectCode, lessonId: l.id,
        lastScore: 0, bestScore: 0, attemptCount: 0,
        masteryLevel: 'new' as const, lastStudiedAt: null, needsReview: 0,
      })),
      practiceSets: [],
      answers: [],
    }));
    try { localStorage.removeItem(STORAGE_KEYS.APP_STATE); } catch { /* */ }
  }, []);

  const exportBackup = useCallback((): string => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      student: state.student,
      progress: state.progress,
      practiceSets: state.practiceSets,
      answers: state.answers,
    };
    return JSON.stringify(backup, null, 2);
  }, [state.student, state.progress, state.practiceSets, state.answers]);

  const importBackup = useCallback((json: string): boolean => {
    try {
      const data = JSON.parse(json);
      if (!data || data.version !== 1 || !Array.isArray(data.progress)) return false;
      setState((prev) => ({
        ...prev,
        student: { ...prev.student, ...data.student, id: 1 },
        progress: data.progress,
        practiceSets: data.practiceSets ?? [],
        answers: data.answers ?? [],
      }));
      return true;
    } catch {
      return false;
    }
  }, []);

  // --- Rule Engine wrappers ---
  const getWeaknesses = useCallback((daysWindow = 14): SkillWeakness[] => {
    return detectWeaknesses(state.answers, state.questions, state.practiceSets, daysWindow);
  }, [state.answers, state.questions, state.practiceSets]);

  const getSmartQuestions = useCallback((lessonId: number, count = 10): SmartQuestion[] => {
    return pickSmartQuestions(lessonId, state.questions, state.answers, state.practiceSets, count);
  }, [state.questions, state.answers, state.practiceSets]);

  const getRecommendations = useCallback((
    grade?: number, subjectCode?: string, limit = 5,
  ): LessonRecommendation[] => {
    return recommendNextLessons(
      state.lessons, state.progress,
      grade ?? state.student.grade,
      subjectCode ?? state.student.subjectCode,
      limit,
    );
  }, [state.lessons, state.progress, state.student.grade, state.student.subjectCode]);

  const getPostAnalysis = useCallback((practiceSetId: number): PostPracticeAnalysis | null => {
    const ps = state.practiceSets.find((p) => p.id === practiceSetId);
    if (!ps) return null;
    return analyzePostPractice(
      ps, state.answers, state.questions, state.progress, state.lessons, state.practiceSets, getStreak(),
    );
  }, [state.practiceSets, state.answers, state.questions, state.progress, state.lessons, getStreak]);

  const getReviewSet = useCallback((
    grade?: number, subjectCode?: string, count = 10,
  ): SmartQuestion[] => {
    return generateReviewSet(
      state.questions, state.answers, state.practiceSets, state.progress,
      grade ?? state.student.grade,
      subjectCode ?? state.student.subjectCode,
      count,
    );
  }, [state.questions, state.answers, state.practiceSets, state.progress, state.student.grade, state.student.subjectCode]);

  // --- Mascot Chat wrappers ---
  const getMascotMsg = useCallback((
    themeId: string, context: ChatContext, vars?: Record<string, string>,
  ): MascotMessage => {
    return getMascotMessage(themeId, context, { name: state.student.fullName, ...vars });
  }, [state.student.fullName]);

  const getMascotGreet = useCallback((themeId: string): MascotMessage => {
    return getMascotGreeting(themeId, state.student.fullName);
  }, [state.student.fullName]);

  // ── Memoized context values ──────────────────────────────────────────────
  // ContentContext: d\u1eef li\u1ec7u t\u0129nh (seed), kh\u00f4ng bao gi\u1edd thay \u0111\u1ed5i sau mount
  const contentValue = useMemo((): ContentContextType => ({
    lessons: state.lessons,
    lessonCards: state.lessonCards,
    questions: state.questions,
    getLessonCards,
    getLessonQuestions,
    getDataHealth,
  }), [getLessonCards, getLessonQuestions, getDataHealth]);

  // StudentContext: ch\u1ec9 thay \u0111\u1ed5i khi h\u1ecdc sinh c\u1eadp nh\u1eadt profile
  const studentValue = useMemo((): StudentContextType => ({
    student: state.student,
    updateStudent,
    getGradeLessons,
    getSubjectLessons,
  }), [state.student, updateStudent, getGradeLessons, getSubjectLessons]);

  // AppContext (backward-compat): full API g\u1ed9p c\u1ea3 3
  const value = useMemo((): AppContextType => ({
    state,
    updateStudent,
    getGradeLessons,
    getSubjectLessons,
    getLessonCards,
    getLessonQuestions,
    getLessonProgress,
    startPractice,
    submitAnswer,
    finishPractice,
    getCompletedCount,
    getNeedsReviewLessons,
    getAverageScore,
    getStreak,
    getWeeklyActivity,
    getDataHealth,
    resetProgress,
    exportBackup,
    importBackup,
    getWeaknesses,
    getSmartQuestions,
    getRecommendations,
    getPostAnalysis,
    getReviewSet,
    getMascotMsg,
    getMascotGreet,
  }), [state, updateStudent, getGradeLessons, getSubjectLessons, getLessonCards, getLessonQuestions, getLessonProgress, startPractice, submitAnswer, finishPractice, getCompletedCount, getNeedsReviewLessons, getAverageScore, getStreak, getWeeklyActivity, getDataHealth, resetProgress, exportBackup, importBackup, getWeaknesses, getSmartQuestions, getRecommendations, getPostAnalysis, getReviewSet, getMascotMsg, getMascotGreet]);

  return (
    <ContentContext.Provider value={contentValue}>
      <StudentContext.Provider value={studentValue}>
        <AppContext.Provider value={value}>
          {children}
        </AppContext.Provider>
      </StudentContext.Provider>
    </ContentContext.Provider>
  );
}

// ── Backward-compatible hook (full API) ─────────────────────────────────────
export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be inside AppDataProvider');
  return ctx;
}

// ── Focused hooks (subscribe only to what you need) ──────────────────────────

/** D\u1eef li\u1ec7u n\u1ed9i dung t\u0129nh \u2014 consumer kh\u00f4ng bao gi\u1edd re-render do progress thay \u0111\u1ed5i */
export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be inside AppDataProvider');
  return ctx;
}

/** D\u1eef li\u1ec7u h\u1ecdc sinh \u2014 consumer ch\u1ec9 re-render khi profile thay \u0111\u1ed5i */
export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error('useStudent must be inside AppDataProvider');
  return ctx;
}

