import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { Home, RotateCcw, BookOpen, Trophy, Target, Clock } from 'lucide-react';
import { Confetti } from '../../../shared/components/Confetti';
import { playFinish } from '../../../shared/utils/sounds';
import { MascotCharacter } from '../../../shared/components';
import { canAccessLesson, getAccessPlan } from '../../../shared/services/accessControl';

export function ResultPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state, getLessonProgress } = useAppData();

  const id = Number(lessonId);
  const isHydrating = state.lessons.length === 0;
  const setId = Number(searchParams.get('setId'));
  const lesson = state.lessons.find((l) => l.id === id);
  const currentPlan = getAccessPlan();
  const lessonAccessible = lesson ? canAccessLesson(lesson, state.student, currentPlan) : false;
  const practiceSet = state.practiceSets.find((ps) => ps.id === setId);
  const progress = getLessonProgress(id);

  useEffect(() => {
    if (isHydrating) return;
    if (!lesson) return;
    if (lessonAccessible) return;
    navigate('/subjects', { replace: true });
  }, [isHydrating, lesson, lessonAccessible, navigate]);

  if (isHydrating) {
    return (
      <div className="fade-in text-center py-20">
        <span className="text-4xl block mb-4">⏳</span>
        <p>Đang nạp dữ liệu bài học...</p>
      </div>
    );
  }

  if (!lesson || !practiceSet) {
    return (
      <div className="fade-in text-center py-20">
        <span className="text-6xl block mb-4">😵</span>
        <p>Không tìm thấy kết quả.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/lessons')}>Quay lại</button>
      </div>
    );
  }

  if (!lessonAccessible) {
    return (
      <div className="fade-in text-center py-20">
        <span className="text-4xl block mb-4">⏳</span>
        <p>Đang chuyển về danh sách môn học...</p>
      </div>
    );
  }

  const score = practiceSet.score ?? 0;
  const correct = practiceSet.correctCount;
  const wrong = practiceSet.wrongCount;
  const _total = correct + wrong; void _total;
  const startedAt = practiceSet.startedAt ? new Date(practiceSet.startedAt) : null;
  const finishedAt = practiceSet.finishedAt ? new Date(practiceSet.finishedAt) : null;
  const durationSec = startedAt && finishedAt ? Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000) : 0;
  const durationMin = Math.floor(durationSec / 60);
  const durationSecRem = durationSec % 60;

  // Get answers for this practice set
  const answers = state.answers.filter((a) => a.practiceSetId === setId);
  const questionIds: number[] = (() => {
    try { return JSON.parse(practiceSet.questionIdsJson); } catch { return []; }
  })();
  const questions = questionIds
    .map((qid) => state.questions.find((q) => q.id === qid))
    .filter(Boolean);

  // Determine feedback
  const getEmoji = () => {
    if (score >= 90) return { emoji: '🏆', text: 'Xuất sắc!', color: '#059669' };
    if (score >= 70) return { emoji: '👍', text: 'Tốt lắm!', color: 'var(--color-primary)' };
    if (score >= 50) return { emoji: '💪', text: 'Cố gắng thêm nhé!', color: '#D97706' };
    return { emoji: '📚', text: 'Ôn lại bài nhé!', color: '#DC2626' };
  };
  const feedback = getEmoji();
  const showConfetti = score >= 90;

  useEffect(() => {
    if (showConfetti) playFinish();
  }, [showConfetti]);

  return (
    <div className="fade-in max-w-2xl mx-auto">
      {showConfetti && <Confetti duration={4000} />}
      {/* Result hero */}
      <div className="card text-center mb-6" style={{ background: 'var(--color-gradient-start)', borderRadius: '24px' }}>
        <span className="text-6xl block mb-2">{feedback.emoji}</span>
        <MascotCharacter size="sm" />
        <h1 className="text-3xl font-bold mt-2" style={{ color: feedback.color }}>
          {feedback.text}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>
          {lesson.title}
        </p>

        {/* Big score */}
        <div className="my-6">
          <div className="text-7xl font-bold" style={{ color: feedback.color }}>
            {score}<span className="text-3xl">%</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex justify-center gap-6 flex-wrap">
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center">
              <Target size={16} style={{ color: 'var(--color-success)' }} />
              <span className="text-xl font-bold" style={{ color: 'var(--color-success)' }}>{correct}</span>
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Đúng</div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center">
              <Target size={16} style={{ color: '#DC2626' }} />
              <span className="text-xl font-bold" style={{ color: '#DC2626' }}>{wrong}</span>
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Sai</div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center">
              <Clock size={16} style={{ color: 'var(--color-text-light)' }} />
              <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                {durationMin}:{durationSecRem.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Thời gian</div>
          </div>
          {progress && (
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Trophy size={16} style={{ color: 'var(--color-star)' }} />
                <span className="text-xl font-bold" style={{ color: 'var(--color-star)' }}>
                  {progress.bestScore}%
                </span>
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Kỷ lục</div>
            </div>
          )}
        </div>
      </div>

      {/* Answer review */}
      <div className="card mb-6">
        <h3 className="font-bold mb-4" style={{ color: 'var(--color-primary-dark)' }}>
          📋 Chi tiết câu trả lời
        </h3>
        <div className="grid gap-3">
          {questions.map((q, i) => {
            if (!q) return null;
            const ans = answers.find((a) => a.questionId === q.id);
            const isCorrect = ans?.isCorrect === 1;
            return (
              <div
                key={q.id}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{
                  background: isCorrect ? '#F0FDF4' : '#FEF2F2',
                  border: `1px solid ${isCorrect ? '#BBF7D0' : '#FECACA'}`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
                  style={{ background: isCorrect ? '#059669' : '#DC2626' }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {q.questionText}
                  </div>
                  <div className="text-xs mt-1">
                    {ans ? (
                      <span style={{ color: isCorrect ? '#059669' : '#DC2626' }}>
                        Trả lời: <strong>{ans.selectedAnswer}</strong>
                        {!isCorrect && (
                          <span> → Đáp án: <strong style={{ color: '#059669' }}>{q.correctAnswer}</strong></span>
                        )}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-light)' }}>Chưa trả lời</span>
                    )}
                  </div>
                  {!isCorrect && q.explanationSimple && (
                    <div className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
                      💡 {q.explanationSimple}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center flex-wrap mb-8">
        <button className="btn btn-primary flex items-center gap-2"
          style={{ padding: '12px 24px' }}
          onClick={() => navigate(`/lessons/${id}/practice?mode=${practiceSet.mode}`)}>
          <RotateCcw size={18} /> Làm lại
        </button>
        <button className="btn btn-secondary flex items-center gap-2"
          style={{ padding: '12px 24px' }}
          onClick={() => navigate(`/lessons/${id}`)}>
          <BookOpen size={18} /> Xem lại bài
        </button>
        <button className="btn btn-secondary flex items-center gap-2"
          style={{ padding: '12px 24px' }}
          onClick={() => navigate('/home')}>
          <Home size={18} /> Trang chủ
        </button>
      </div>
    </div>
  );
}
