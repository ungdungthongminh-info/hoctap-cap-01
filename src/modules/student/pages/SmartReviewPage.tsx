/**
 * SmartReviewPage — Ôn tập thông minh
 * Tự động chọn bài yếu nhất, spaced repetition, ưu tiên câu sai
 */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel, getSubjectByCode } from '../../../data/subjects';
import { Brain, RotateCcw, Zap, TrendingUp, CheckCircle, XCircle, ChevronRight, Target } from 'lucide-react';
import { EmptyState } from '../../../shared/components';

interface ReviewItem {
  lessonId: number;
  title: string;
  lastScore: number;
  bestScore: number;
  attemptCount: number;
  daysSinceStudy: number;
  urgencyScore: number; // higher = needs more review
  weakQuestionIds: number[];
}

type Phase = 'overview' | 'practicing' | 'result';

export function SmartReviewPage() {
  const navigate = useNavigate();
  const { state, getSubjectLessons, getLessonProgress, getLessonQuestions, startPractice, submitAnswer, finishPractice } = useAppData();
  const subject = getSubjectByCode(state.student.subjectCode);

  const [phase, setPhase] = useState<Phase>('overview');
  const [currentSetId, setCurrentSetId] = useState<number | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState<{ correct: number; total: number; score: number }>({ correct: 0, total: 0, score: 0 });

  // Build smart review list
  const reviewItems = useMemo((): ReviewItem[] => {
    const lessons = getSubjectLessons();
    const now = Date.now();
    const items: ReviewItem[] = [];

    for (const lesson of lessons) {
      const prog = getLessonProgress(lesson.id);
      if (!prog || prog.attemptCount === 0) continue; // Skip never-studied

      const daysSince = prog.lastStudiedAt
        ? Math.floor((now - new Date(prog.lastStudiedAt).getTime()) / 86400000)
        : 999;

      // Find weak questions (incorrectly answered)
      const lessonAnswers = state.answers.filter(a => {
        const ps = state.practiceSets.find(s => s.id === a.practiceSetId);
        return ps && ps.lessonId === lesson.id;
      });
      const weakQIds = [...new Set(
        lessonAnswers.filter(a => !a.isCorrect).map(a => a.questionId)
      )];

      // Urgency formula: low score + long time + many wrong answers = high urgency
      const scoreWeight = Math.max(0, 100 - prog.bestScore) * 2;
      const timeWeight = Math.min(daysSince * 5, 200);
      const wrongWeight = weakQIds.length * 10;
      const urgencyScore = scoreWeight + timeWeight + wrongWeight;

      if (urgencyScore > 20) { // Only include if needs review
        items.push({
          lessonId: lesson.id,
          title: lesson.title,
          lastScore: prog.lastScore,
          bestScore: prog.bestScore,
          attemptCount: prog.attemptCount,
          daysSinceStudy: daysSince,
          urgencyScore,
          weakQuestionIds: weakQIds,
        });
      }
    }

    return items.sort((a, b) => b.urgencyScore - a.urgencyScore);
  }, [state.answers, state.practiceSets, getSubjectLessons, getLessonProgress]);

  // Questions for current practice
  const [practiceQuestions, setPracticeQuestions] = useState<typeof state.questions>([]);

  const startSmartReview = (item?: ReviewItem) => {
    // Pick top 3 weakest lessons, gather weak questions
    const targets = item ? [item] : reviewItems.slice(0, 3);
    if (targets.length === 0) return;

    // Collect questions: prioritize weak ones, then random from those lessons
    const allQs: typeof state.questions = [];
    for (const t of targets) {
      const lessonQs = getLessonQuestions(t.lessonId);
      // Weak questions first
      // Only include question types the smart review UI can handle
      const supportedTypes = ['single_choice', 'true_false', 'fill_number'];
      const supported = lessonQs.filter(q => supportedTypes.includes(q.questionType));
      const weak = supported.filter(q => t.weakQuestionIds.includes(q.id));
      const others = supported.filter(q => !t.weakQuestionIds.includes(q.id));
      allQs.push(...weak, ...others.sort(() => Math.random() - 0.5).slice(0, 3));
    }

    // Limit to 10 questions, shuffle
    const selected = allQs.slice(0, 10).sort(() => Math.random() - 0.5);
    if (selected.length === 0) return;

    setPracticeQuestions(selected);
    const ps = startPractice(targets[0].lessonId, 'smart_review', selected.map(q => q.id));
    setCurrentSetId(ps.id);
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setPhase('practicing');
  };

  const handleAnswer = (answer: string) => {
    if (showExplanation || !currentSetId) return;
    setSelectedAnswer(answer);
    submitAnswer(currentSetId, practiceQuestions[currentQIndex].id, answer);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQIndex < practiceQuestions.length - 1) {
      setCurrentQIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else if (currentSetId) {
      const finished = finishPractice(currentSetId);
      setResults({ correct: finished.correctCount, total: practiceQuestions.length, score: finished.score || 0 });
      setPhase('result');
    }
  };

  const getUrgencyColor = (score: number) => {
    if (score > 150) return '#DC2626';
    if (score > 80) return '#D97706';
    return '#059669';
  };

  const getUrgencyLabel = (score: number) => {
    if (score > 150) return 'Cần ôn gấp';
    if (score > 80) return 'Nên ôn lại';
    return 'Ôn thêm';
  };

  // ===== OVERVIEW PHASE =====
  if (phase === 'overview') {
    return (
      <div className="fade-in flex flex-col items-center gap-6 p-4 max-w-3xl mx-auto">
        <div className="text-center">
          <span className="text-5xl">🧠</span>
          <h1 className="text-2xl font-bold mt-2" style={{ color: 'var(--color-primary-dark)' }}>
            Ôn tập thông minh
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>
            {subject?.emoji} {subject?.name} · {getGradeLabel(state.student.grade)} — Hệ thống tự chọn bài yếu nhất
          </p>
        </div>

        {reviewItems.length === 0 ? (
          <EmptyState
            emoji="🎉"
            title="Tuyệt vời!"
            description="Hiện tại không có bài nào cần ôn lại. Hãy tiếp tục học bài mới!"
            action={
              <button className="btn btn-primary btn-icon-slide" onClick={() => navigate('/lessons')}>
                <ChevronRight size={16} /> Học bài mới
              </button>
            }
          />
        ) : (
          <>
            {/* Quick start */}
            <button
              className="card w-full p-6 cursor-pointer hover:scale-[1.02] transition-transform text-left flex items-center gap-4"
              onClick={() => startSmartReview()}
              style={{ borderLeft: '4px solid var(--color-primary)' }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--color-primary-light)' }}>
                <Zap size={28} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                  ⚡ Ôn nhanh ({Math.min(10, reviewItems.reduce((s, r) => s + r.weakQuestionIds.length + 3, 0))} câu)
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
                  Tự động chọn câu yếu nhất từ {Math.min(3, reviewItems.length)} bài cần ôn
                </div>
              </div>
              <ChevronRight size={24} style={{ color: 'var(--color-primary)' }} />
            </button>

            {/* Stats summary */}
            <div className="flex gap-3 flex-wrap justify-center w-full">
              <div className="card-flat text-center px-4 py-2">
                <div className="text-xl font-bold" style={{ color: '#DC2626' }}>{reviewItems.filter(r => r.urgencyScore > 150).length}</div>
                <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Cần ôn gấp</div>
              </div>
              <div className="card-flat text-center px-4 py-2">
                <div className="text-xl font-bold" style={{ color: '#D97706' }}>{reviewItems.filter(r => r.urgencyScore > 80 && r.urgencyScore <= 150).length}</div>
                <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Nên ôn lại</div>
              </div>
              <div className="card-flat text-center px-4 py-2">
                <div className="text-xl font-bold" style={{ color: '#059669' }}>{reviewItems.filter(r => r.urgencyScore <= 80).length}</div>
                <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Ôn thêm</div>
              </div>
            </div>

            {/* Review list */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-sm font-bold uppercase" style={{ color: 'var(--color-text-light)' }}>
                <Target size={14} className="inline mr-1" /> Danh sách cần ôn ({reviewItems.length} bài)
              </h2>
              {reviewItems.map((item) => (
                <button
                  key={item.lessonId}
                  className="card w-full p-4 cursor-pointer hover:scale-[1.01] transition-transform text-left flex items-center gap-3"
                  onClick={() => startSmartReview(item)}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: getUrgencyColor(item.urgencyScore) + '20' }}>
                    <Brain size={20} style={{ color: getUrgencyColor(item.urgencyScore) }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate" style={{ color: 'var(--color-text)' }}>
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: getUrgencyColor(item.urgencyScore) + '20', color: getUrgencyColor(item.urgencyScore) }}>
                        {getUrgencyLabel(item.urgencyScore)}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                        Điểm: {item.bestScore}% · {item.daysSinceStudy}d trước · {item.weakQuestionIds.length} câu yếu
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} style={{ color: 'var(--color-text-light)' }} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // ===== PRACTICING PHASE =====
  if (phase === 'practicing' && practiceQuestions.length > 0) {
    const q = practiceQuestions[currentQIndex];
    const options: string[] = q.optionsJson ? JSON.parse(q.optionsJson) : (q.questionType === 'true_false' ? ['Đúng', 'Sai'] : []);
    const isCorrect = selectedAnswer === q.correctAnswer;

    return (
      <div className="fade-in flex flex-col items-center gap-6 p-4 max-w-2xl mx-auto">
        {/* Progress */}
        <div className="w-full flex items-center gap-3">
          <span className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
            {currentQIndex + 1}/{practiceQuestions.length}
          </span>
          <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--color-surface)' }}>
            <div
              className="h-full rounded-full progress-fill"
              style={{ width: `${((currentQIndex + 1) / practiceQuestions.length) * 100}%`, background: 'var(--color-primary)' }}
            />
          </div>
          <RotateCcw size={14} style={{ color: 'var(--color-text-light)' }} />
        </div>

        {/* Question */}
        <div className="card w-full p-6 text-center">
          <div className="text-xs font-bold mb-2" style={{ color: 'var(--color-text-light)' }}>
            🧠 Ôn tập thông minh
          </div>
          <div className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
            {q.questionText}
          </div>
        </div>

        {/* Options */}
        <div className="w-full flex flex-col gap-2">
          {options.map((opt) => {
            let style = {};
            let className = 'card w-full p-4 text-left cursor-pointer hover:scale-[1.01] transition-transform';
            if (showExplanation) {
              if (opt === q.correctAnswer) {
                style = { borderColor: '#059669', background: '#D1FAE520' };
              } else if (opt === selectedAnswer && !isCorrect) {
                style = { borderColor: '#DC2626', background: '#FEE2E220' };
                className += ' animate-shake';
              }
            } else if (opt === selectedAnswer) {
              style = { borderColor: 'var(--color-primary)' };
            }
            return (
              <button
                key={opt}
                className={className}
                style={style}
                onClick={() => handleAnswer(opt)}
                disabled={showExplanation}
              >
                <span className="text-sm font-medium">{q.questionType === 'true_false' ? (opt === 'Đúng' ? '✅ Đúng' : '❌ Sai') : opt}</span>
                {showExplanation && opt === q.correctAnswer && (
                  <CheckCircle size={16} className="inline ml-2" style={{ color: '#059669' }} />
                )}
                {showExplanation && opt === selectedAnswer && !isCorrect && (
                  <XCircle size={16} className="inline ml-2" style={{ color: '#DC2626' }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="card w-full p-4" style={{ background: isCorrect ? '#D1FAE520' : '#FEF3C720', borderColor: isCorrect ? '#059669' : '#D97706' }}>
            <div className="text-sm font-bold" style={{ color: isCorrect ? '#059669' : '#D97706' }}>
              {isCorrect ? '🎉 Đúng rồi!' : '💡 Giải thích:'}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
              {q.explanationSimple}
            </div>
            <button className="btn btn-primary btn-icon-slide mt-3 w-full" onClick={nextQuestion}>
              {currentQIndex < practiceQuestions.length - 1 ? 'Câu tiếp →' : '📊 Xem kết quả'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ===== RESULT PHASE =====
  return (
    <div className="fade-in flex flex-col items-center gap-6 p-4 max-w-2xl mx-auto">
      <div className="card w-full p-8 text-center">
        <span className="text-6xl">{results.score >= 80 ? '🌟' : results.score >= 60 ? '👍' : '💪'}</span>
        <h1 className="text-2xl font-bold mt-4" style={{ color: 'var(--color-primary-dark)' }}>
          Kết quả ôn tập
        </h1>
        <div className="text-4xl font-bold mt-4" style={{ color: results.score >= 80 ? '#059669' : results.score >= 60 ? '#D97706' : '#DC2626' }}>
          {results.score}%
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <CheckCircle size={20} style={{ color: '#059669' }} className="mx-auto" />
            <div className="text-lg font-bold" style={{ color: '#059669' }}>{results.correct}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Đúng</div>
          </div>
          <div className="text-center">
            <XCircle size={20} style={{ color: '#DC2626' }} className="mx-auto" />
            <div className="text-lg font-bold" style={{ color: '#DC2626' }}>{results.total - results.correct}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Sai</div>
          </div>
        </div>
        <p className="text-sm mt-4" style={{ color: 'var(--color-text-light)' }}>
          {results.score >= 80 ? 'Tuyệt vời! Bạn đã tiến bộ nhiều!' : results.score >= 60 ? 'Tốt lắm! Cố gắng thêm nhé!' : 'Đừng nản! Ôn lại sẽ tốt hơn!'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <button className="btn btn-primary btn-icon-slide" onClick={() => { setPhase('overview'); setCurrentSetId(null); }}>
          <TrendingUp size={16} /> Ôn tiếp
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/lessons')}>
          Học bài mới
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/progress')}>
          Xem tiến bộ
        </button>
      </div>
    </div>
  );
}
