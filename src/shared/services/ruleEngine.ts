/**
 * RULE ENGINE — Bộ não thông minh (không cần AI runtime)
 * Phân tích dữ liệu học sinh → gợi ý, nhận xét, chọn bài thông minh
 * Chi phí runtime: $0 — tất cả logic chạy local
 */
import type { StudentProgress, Question, StudentAnswer, PracticeSet, Lesson } from '../../data/seedData';

// ==================== TYPES ====================

/** Thông tin điểm yếu theo skillTag */
export interface SkillWeakness {
  skillTag: string;
  subjectCode: string;
  wrongCount: number;
  totalAttempts: number;
  accuracy: number; // 0-100
  recentWrongQuestionIds: number[];
  severity: 'mild' | 'moderate' | 'severe';
}

/** Gợi ý bài tiếp theo */
export interface LessonRecommendation {
  lessonId: number;
  reason: 'next_in_sequence' | 'needs_review' | 'weak_skill' | 'not_started' | 'spaced_review';
  priority: number; // higher = nên làm trước
  message: string;
}

/** Kết quả phân tích sau khi làm bài */
export interface PostPracticeAnalysis {
  score: number;
  streak: number;
  weakSkills: SkillWeakness[];
  recommendations: LessonRecommendation[];
  feedbackMessage: string;  // tin nhắn từ mascot
  encouragement: string;    // lời động viên
}

/** Câu hỏi được chọn thông minh */
export interface SmartQuestion {
  questionId: number;
  reason: 'wrong_before' | 'never_tried' | 'spaced_review' | 'random';
  weight: number;
}

// ==================== WEAKNESS DETECTOR ====================

/**
 * Phát hiện skillTag yếu từ lịch sử trả lời
 * Rule: Sai ≥ 3 câu cùng skillTag trong 14 ngày → yếu
 */
export function detectWeaknesses(
  answers: StudentAnswer[],
  questions: Question[],
  _practiceSets: PracticeSet[],
  daysWindow = 14,
): SkillWeakness[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysWindow);
  const cutoffStr = cutoff.toISOString();

  // Lọc answers gần đây
  const recentAnswers = answers.filter(a => a.answeredAt >= cutoffStr);

  // Nhóm theo skillTag
  const skillMap = new Map<string, { wrong: number; total: number; subjectCode: string; wrongQIds: number[] }>();

  for (const ans of recentAnswers) {
    const q = questions.find(qq => qq.id === ans.questionId);
    if (!q || !q.skillTag) continue;

    const key = `${q.subjectCode}::${q.skillTag}`;
    const cur = skillMap.get(key) || { wrong: 0, total: 0, subjectCode: q.subjectCode, wrongQIds: [] };
    cur.total++;
    if (!ans.isCorrect) {
      cur.wrong++;
      cur.wrongQIds.push(ans.questionId);
    }
    skillMap.set(key, cur);
  }

  const weaknesses: SkillWeakness[] = [];
  for (const [key, data] of skillMap) {
    if (data.wrong < 2) continue; // ít nhất 2 lần sai
    const accuracy = data.total > 0 ? Math.round(((data.total - data.wrong) / data.total) * 100) : 0;
    const tag = key.split('::')[1];

    let severity: SkillWeakness['severity'] = 'mild';
    if (data.wrong >= 5 || accuracy < 40) severity = 'severe';
    else if (data.wrong >= 3 || accuracy < 60) severity = 'moderate';

    weaknesses.push({
      skillTag: tag,
      subjectCode: data.subjectCode,
      wrongCount: data.wrong,
      totalAttempts: data.total,
      accuracy,
      recentWrongQuestionIds: [...new Set(data.wrongQIds)].slice(0, 20),
      severity,
    });
  }

  return weaknesses.sort((a, b) => a.accuracy - b.accuracy);
}

// ==================== SMART QUESTION PICKER ====================

/**
 * Chọn câu hỏi thông minh cho 1 bài:
 * - 60% ưu tiên câu đã sai trước đó
 * - 25% câu chưa từng làm
 * - 15% câu đã đúng lâu rồi (spaced repetition)
 */
export function pickSmartQuestions(
  lessonId: number,
  allQuestions: Question[],
  answers: StudentAnswer[],
  practiceSets: PracticeSet[],
  count: number,
): SmartQuestion[] {
  const lessonQs = allQuestions.filter(q => q.lessonId === lessonId && q.isActive);
  if (lessonQs.length === 0) return [];

  // Tìm tất cả answers của lesson này
  const lessonSetIds = new Set(
    practiceSets.filter(ps => ps.lessonId === lessonId).map(ps => ps.id)
  );
  const lessonAnswers = answers.filter(a => lessonSetIds.has(a.practiceSetId));

  // Phân loại từng câu
  const wrongQIds = new Set<number>();
  const correctQIds = new Set<number>();
  const correctTimestamps = new Map<number, string>();

  for (const ans of lessonAnswers) {
    if (!ans.isCorrect) {
      wrongQIds.add(ans.questionId);
    } else {
      correctQIds.add(ans.questionId);
      const prev = correctTimestamps.get(ans.questionId);
      if (!prev || ans.answeredAt > prev) {
        correctTimestamps.set(ans.questionId, ans.answeredAt);
      }
    }
  }

  const neverDone = lessonQs.filter(q => !wrongQIds.has(q.id) && !correctQIds.has(q.id));
  const wrongBefore = lessonQs.filter(q => wrongQIds.has(q.id));
  const correctOld = lessonQs
    .filter(q => correctQIds.has(q.id) && !wrongQIds.has(q.id))
    .sort((a, b) => {
      const ta = correctTimestamps.get(a.id) || '';
      const tb = correctTimestamps.get(b.id) || '';
      return ta.localeCompare(tb); // cũ nhất trước
    });

  // Tính số lượng mỗi nhóm
  const wantWrong = Math.ceil(count * 0.6);
  const wantNew = Math.ceil(count * 0.25);
  const wantReview = count - wantWrong - wantNew;

  const selected: SmartQuestion[] = [];
  const usedIds = new Set<number>();

  const pick = (pool: Question[], reason: SmartQuestion['reason'], max: number, weight: number) => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    for (const q of shuffled) {
      if (selected.length >= count || selected.filter(s => s.reason === reason).length >= max) break;
      if (usedIds.has(q.id)) continue;
      usedIds.add(q.id);
      selected.push({ questionId: q.id, reason, weight });
    }
  };

  pick(wrongBefore, 'wrong_before', wantWrong, 3);
  pick(neverDone, 'never_tried', wantNew, 2);
  pick(correctOld, 'spaced_review', Math.max(wantReview, 0), 1);

  // Nếu chưa đủ, bổ sung random
  if (selected.length < count) {
    const remaining = lessonQs.filter(q => !usedIds.has(q.id));
    pick(remaining, 'random', count - selected.length, 1);
  }

  // Nếu vẫn chưa đủ (ít câu), lấy lại từ pool
  if (selected.length < count) {
    pick(lessonQs, 'random', count - selected.length, 1);
  }

  return selected.sort(() => Math.random() - 0.5);
}

// ==================== NEXT LESSON RECOMMENDER ====================

/**
 * Gợi ý bài tiếp theo nên học
 * Rules:
 * 1. Bài chưa đạt 70% → cần ôn lại (ưu tiên cao)
 * 2. Bài chưa từng làm, nối tiếp bài đã master → tiếp theo
 * 3. Bài đã đạt nhưng lâu chưa ôn (>7 ngày) → spaced review
 */
export function recommendNextLessons(
  lessons: Lesson[],
  progress: StudentProgress[],
  grade: number,
  subjectCode: string,
  limit = 5,
): LessonRecommendation[] {
  const filtered = lessons
    .filter(l => l.grade === grade && l.subjectCode === subjectCode && l.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const recs: LessonRecommendation[] = [];
  const now = Date.now();

  for (const lesson of filtered) {
    const prog = progress.find(p => p.lessonId === lesson.id);
    if (!prog) continue;

    // Rule 1: Cần ôn lại (đã làm nhưng < 70%)
    if (prog.attemptCount > 0 && prog.bestScore < 70) {
      recs.push({
        lessonId: lesson.id,
        reason: 'needs_review',
        priority: 90 - prog.bestScore, // điểm càng thấp → ưu tiên càng cao
        message: `Bài "${lesson.title}" đạt ${prog.bestScore}% — cần ôn thêm!`,
      });
      continue;
    }

    // Rule 2: Chưa từng làm
    if (prog.attemptCount === 0) {
      // Tìm bài trước đó
      const idx = filtered.indexOf(lesson);
      const prevLesson = idx > 0 ? filtered[idx - 1] : null;
      const prevProg = prevLesson ? progress.find(p => p.lessonId === prevLesson.id) : null;

      // Mở khóa khi: bài đầu tiên HOẶC bài trước đã đạt >= 60%
      if (!prevProg || prevProg.bestScore >= 60 || prevProg.attemptCount === 0) {
        recs.push({
          lessonId: lesson.id,
          reason: idx === 0 ? 'next_in_sequence' : 'not_started',
          priority: 50 - idx, // bài sớm hơn → ưu tiên cao hơn
          message: `Bài "${lesson.title}" đang chờ con khám phá!`,
        });
      }
      continue;
    }

    // Rule 3: Đã master nhưng lâu không ôn (> 7 ngày)
    if (prog.lastStudiedAt) {
      const daysSince = Math.floor((now - new Date(prog.lastStudiedAt).getTime()) / 86400000);
      if (daysSince >= 7 && prog.bestScore < 95) {
        recs.push({
          lessonId: lesson.id,
          reason: 'spaced_review',
          priority: 20 + Math.min(daysSince, 30), // lâu hơn → ưu tiên hơn
          message: `Lâu rồi chưa ôn "${lesson.title}" (${daysSince} ngày)`,
        });
      }
    }
  }

  return recs.sort((a, b) => b.priority - a.priority).slice(0, limit);
}

// ==================== POST-PRACTICE ANALYZER ====================

/**
 * Phân tích ngay sau khi làm xong 1 bài
 * Trả về nhận xét, gợi ý, và message cho mascot
 */
export function analyzePostPractice(
  practiceSet: PracticeSet,
  allAnswers: StudentAnswer[],
  allQuestions: Question[],
  allProgress: StudentProgress[],
  allLessons: Lesson[],
  allPracticeSets: PracticeSet[],
  streak: number,
): PostPracticeAnalysis {
  const score = practiceSet.score || 0;
  const lesson = allLessons.find(l => l.id === practiceSet.lessonId);

  // Phát hiện yếu điểm
  const weakSkills = detectWeaknesses(allAnswers, allQuestions, allPracticeSets, 14);
  const lessonWeakSkills = weakSkills.filter(w => w.subjectCode === lesson?.subjectCode);

  // Gợi ý bài tiếp
  const recommendations = lesson
    ? recommendNextLessons(allLessons, allProgress, lesson.grade, lesson.subjectCode, 3)
    : [];

  // Tạo feedback
  let feedbackMessage: string;
  let encouragement: string;

  if (score === 100) {
    feedbackMessage = '🎉 TUYỆT VỜI! Con đã đạt điểm tuyệt đối!';
    encouragement = 'Con giỏi quá! Tiếp tục phát huy nhé!';
  } else if (score >= 90) {
    feedbackMessage = '⭐ Xuất sắc! Gần hoàn hảo rồi!';
    encouragement = 'Chỉ cần cẩn thận hơn một chút nữa thôi!';
  } else if (score >= 70) {
    feedbackMessage = '👍 Tốt lắm! Con đã hiểu bài rồi!';
    encouragement = lessonWeakSkills.length > 0
      ? `Ôn thêm phần "${lessonWeakSkills[0].skillTag}" sẽ tốt hơn nữa!`
      : 'Làm thêm vài câu nữa để chắc chắn hơn nhé!';
  } else if (score >= 50) {
    feedbackMessage = '💪 Cố lên! Con đã làm được hơn một nửa!';
    encouragement = 'Đọc lại bài học và thử lại — con sẽ tiến bộ nhanh thôi!';
  } else {
    feedbackMessage = '📚 Không sao! Học là một hành trình!';
    encouragement = 'Hãy đọc lại thẻ học và thử lại. Mỗi lần sai là một cơ hội học!';
  }

  // Streak bonus message
  if (streak >= 7) {
    encouragement += ` 🔥 Chuỗi ${streak} ngày — siêu kiên trì!`;
  } else if (streak >= 3) {
    encouragement += ` 🔥 Chuỗi ${streak} ngày liên tiếp!`;
  }

  return {
    score,
    streak,
    weakSkills: lessonWeakSkills,
    recommendations,
    feedbackMessage,
    encouragement,
  };
}

// ==================== REVIEW MODE GENERATOR ====================

/**
 * Tạo bộ câu hỏi ôn tập từ các bài yếu
 * Ưu tiên: câu sai gần đây > câu chưa làm ở bài yếu > random
 */
export function generateReviewSet(
  allQuestions: Question[],
  answers: StudentAnswer[],
  practiceSets: PracticeSet[],
  progress: StudentProgress[],
  _grade: number,
  subjectCode: string,
  count = 10,
): SmartQuestion[] {
  // Lấy bài cần review
  const reviewLessons = progress.filter(
    p => p.needsReview && p.subjectCode === subjectCode
  );

  if (reviewLessons.length === 0) {
    // Không có bài cần review → lấy bài có điểm thấp nhất
    const attempted = progress
      .filter(p => p.subjectCode === subjectCode && p.attemptCount > 0)
      .sort((a, b) => a.bestScore - b.bestScore);
    if (attempted.length > 0) {
      reviewLessons.push(attempted[0]);
    }
  }

  const allPicked: SmartQuestion[] = [];
  const perLesson = Math.max(Math.ceil(count / Math.max(reviewLessons.length, 1)), 3);

  for (const prog of reviewLessons) {
    const picked = pickSmartQuestions(
      prog.lessonId, allQuestions, answers, practiceSets, perLesson
    );
    allPicked.push(...picked);
    if (allPicked.length >= count) break;
  }

  return allPicked.slice(0, count).sort(() => Math.random() - 0.5);
}
