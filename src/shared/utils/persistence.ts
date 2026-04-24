/**
 * Persistence layer — lưu trữ state giữa các lần mở app
 * - Lớp 1: localStorage (luôn hoạt động)
 * - Lớp 2: SQLite qua electronAPI IPC (khi chạy trong Electron)
 */
import { STORAGE_KEYS } from '../constants/storageKeys';

const STORAGE_KEY = STORAGE_KEYS.APP_STATE;
const STORAGE_VERSION = 2;

interface PersistedState {
  version: number;
  savedAt: string;
  student: {
    fullName: string;
    grade: number;
    subjectCode: string;
    avatar: string;
  };
  progress: Array<{
    lessonId: number;
    grade: number;
    subjectCode: string;
    lastScore: number;
    bestScore: number;
    attemptCount: number;
    masteryLevel: string;
    lastStudiedAt: string | null;
    needsReview: number;
  }>;
  practiceSets: Array<{
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
  }>;
  answers: Array<{
    id: number;
    practiceSetId: number;
    questionId: number;
    selectedAnswer: string;
    isCorrect: number;
    answeredAt: string;
  }>;
}

// ==================== LOAD ====================
export function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedState;
    if (!data || data.version !== STORAGE_VERSION || !Array.isArray(data.progress)) return null;
    return data;
  } catch {
    return null;
  }
}

// ==================== SAVE ====================
export function saveState(state: {
  student: { fullName: string; grade: number; subjectCode: string; avatar: string };
  progress: PersistedState['progress'];
  practiceSets: PersistedState['practiceSets'];
  answers: PersistedState['answers'];
}): void {
  try {
    const data: PersistedState = {
      version: STORAGE_VERSION,
      savedAt: new Date().toISOString(),
      student: {
        fullName: state.student.fullName,
        grade: state.student.grade,
        subjectCode: state.student.subjectCode,
        avatar: state.student.avatar,
      },
      progress: state.progress,
      practiceSets: state.practiceSets,
      answers: state.answers,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full hoặc bị chặn — bỏ qua
  }
}

// ==================== SQLITE SYNC (Electron only) ====================
interface ElectronDb {
  query: (sql: string, params?: unknown[]) => Promise<unknown[]>;
  run: (sql: string, params?: unknown[]) => Promise<void>;
  get: (sql: string, params?: unknown[]) => Promise<unknown | null>;
}

function getElectronDb(): ElectronDb | null {
  try {
    const api = (window as unknown as { electronAPI?: { db?: ElectronDb } }).electronAPI;
    return api?.db ?? null;
  } catch {
    return null;
  }
}

export async function syncToSqlite(state: {
  student: { fullName: string; grade: number; subjectCode: string; avatar: string };
  progress: PersistedState['progress'];
  practiceSets: PersistedState['practiceSets'];
  answers: PersistedState['answers'];
}): Promise<boolean> {
  const db = getElectronDb();
  if (!db) return false;

  try {
    // Upsert student
    await db.run(
      `INSERT INTO students (id, fullName, grade, avatar, updatedAt) VALUES (1, ?, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET fullName=excluded.fullName, grade=excluded.grade, avatar=excluded.avatar, updatedAt=datetime('now')`,
      [state.student.fullName, state.student.grade, state.student.avatar]
    );

    // Save settings
    await db.run(
      `INSERT INTO app_settings (key, value) VALUES ('subjectCode', ?)
       ON CONFLICT(key) DO UPDATE SET value=excluded.value`,
      [state.student.subjectCode]
    );

    // Sync progress
    for (const p of state.progress) {
      if (p.attemptCount === 0) continue; // Bỏ qua bài chưa học
      await db.run(
        `INSERT INTO student_progress (studentId, grade, subjectCode, lessonId, lastScore, bestScore, attemptCount, masteryLevel, lastStudiedAt, needsReview)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(studentId, lessonId) DO UPDATE SET
           lastScore=excluded.lastScore, bestScore=excluded.bestScore,
           attemptCount=excluded.attemptCount, masteryLevel=excluded.masteryLevel,
           lastStudiedAt=excluded.lastStudiedAt, needsReview=excluded.needsReview`,
        [p.grade, p.subjectCode, p.lessonId, p.lastScore, p.bestScore, p.attemptCount, p.masteryLevel, p.lastStudiedAt, p.needsReview]
      );
    }

    // Sync practice sets
    for (const ps of state.practiceSets) {
      await db.run(
        `INSERT OR REPLACE INTO practice_sets (id, studentId, lessonId, mode, questionIdsJson, startedAt, finishedAt, score, correctCount, wrongCount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ps.id, ps.studentId, ps.lessonId, ps.mode, ps.questionIdsJson, ps.startedAt, ps.finishedAt, ps.score, ps.correctCount, ps.wrongCount]
      );
    }

    // Sync answers
    for (const a of state.answers) {
      await db.run(
        `INSERT OR REPLACE INTO student_answers (id, practiceSetId, questionId, selectedAnswer, isCorrect, answeredAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [a.id, a.practiceSetId, a.questionId, a.selectedAnswer, a.isCorrect, a.answeredAt]
      );
    }

    return true;
  } catch {
    return false;
  }
}

export function isElectron(): boolean {
  return getElectronDb() !== null;
}
