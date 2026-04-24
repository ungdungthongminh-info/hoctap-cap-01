import { useState, useCallback, useMemo } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel, getSubjectsForGrade } from '../../../data/subjects';
import { CalendarDays, Trophy, ChevronRight, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { MascotCharacter } from '../../../shared/components';
import '../styles/premiumButtons.css';

const DAILY_KEY = 'hhk_daily_challenge';
const QUESTIONS_PER_CHALLENGE = 5;

interface DailyState {
  date: string;
  completed: boolean;
  score: number;
}

function getTodayStr() {
  return new Date().toISOString().substring(0, 10);
}

function getDailyState(): DailyState | null {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveDailyState(ds: DailyState) {
  localStorage.setItem(DAILY_KEY, JSON.stringify(ds));
}

export function DailyChallengePage() {
  const { state } = useAppData();

  const dailyState = getDailyState();
  const todayStr = getTodayStr();
  const alreadyDone = dailyState?.date === todayStr && dailyState.completed;

  // Generate today's questions deterministically from date seed
  const todayQuestions = useMemo(() => {
    const subjects = getSubjectsForGrade(state.student.grade).filter(s => s.hasContent);
    const allQ = state.questions.filter(q =>
      q.grade === state.student.grade &&
      q.isActive &&
      ['single_choice', 'true_false', 'fill_number'].includes(q.questionType) &&
      subjects.some(s => s.code === q.subjectCode)
    );
    if (allQ.length === 0) return [];

    // Simple deterministic shuffle using date as seed
    const seed = todayStr.replace(/-/g, '');
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
    const shuffled = [...allQ].sort((a, b) => {
      const ha = ((hash * a.id) & 0x7FFFFFFF) % 10000;
      const hb = ((hash * b.id) & 0x7FFFFFFF) % 10000;
      return ha - hb;
    });
    return shuffled.slice(0, QUESTIONS_PER_CHALLENGE);
  }, [state.questions, state.student.grade, todayStr]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(new Array(QUESTIONS_PER_CHALLENGE).fill(null));
  const [showResult, setShowResult] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(alreadyDone);
  const [savedScore] = useState(alreadyDone ? dailyState!.score : 0);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQ = todayQuestions[currentIdx];
  const options: string[] = currentQ?.optionsJson ? JSON.parse(currentQ.optionsJson) : [];

  const handleAnswer = useCallback((answer: string) => {
    if (showResult !== null) return;
    const isCorrect = answer.trim() === currentQ.correctAnswer.trim();
    setAnswers(prev => {
      const n = [...prev];
      n[currentIdx] = answer;
      return n;
    });
    if (isCorrect) setCorrectCount(c => c + 1);
    setShowResult(isCorrect);
  }, [currentQ, currentIdx, showResult]);

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= todayQuestions.length) {
      // Finish
      const finalCorrect = correctCount;
      const score = Math.round((finalCorrect / todayQuestions.length) * 100);
      saveDailyState({ date: todayStr, completed: true, score });
      setFinished(true);
    } else {
      setCurrentIdx(i => i + 1);
      setShowResult(null);
    }
  }, [currentIdx, todayQuestions.length, correctCount, todayStr]);

  if (todayQuestions.length === 0) {
    return (
      <div className="fade-in max-w-2xl mx-auto text-center py-12">
        <MascotCharacter size="lg" />
        <h1 className="text-2xl font-bold mt-4" style={{ color: 'var(--color-primary-dark)' }}>
          🌟 Thử Thách Hàng Ngày
        </h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>
          Chưa có câu hỏi cho {getGradeLabel(state.student.grade).toLowerCase()}. Hãy thêm nội dung!
        </p>
      </div>
    );
  }

  // Already done today
  if (finished) {
    const score = alreadyDone ? savedScore : Math.round((correctCount / todayQuestions.length) * 100);
    return (
      <div className="fade-in max-w-2xl mx-auto text-center py-8">
        <MascotCharacter size="lg" />
        <h1 className="text-2xl font-bold mt-4" style={{ color: 'var(--color-primary-dark)' }}>
          🌟 Thử Thách Hàng Ngày
        </h1>
        <div className="card mt-6 bounce-in" style={{ background: 'var(--color-primary-light)', border: '2px solid var(--color-primary)' }}>
          <div className="text-4xl mb-3">{score >= 80 ? '🏆' : score >= 60 ? '🎉' : '💪'}</div>
          <div className="text-lg font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            {alreadyDone ? 'Đã hoàn thành hôm nay!' : 'Hoàn thành xuất sắc!'}
          </div>
          <div className="text-3xl font-bold mt-2" style={{ color: 'var(--color-primary)' }}>
            {score} điểm
          </div>
          <div className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>
            {alreadyDone ? 'Quay lại vào ngày mai nhé!' : `${correctCount}/${todayQuestions.length} câu đúng`}
          </div>
          <div className="flex justify-center gap-1 mt-3">
            {Array.from({ length: QUESTIONS_PER_CHALLENGE }, (_, i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{
                background: i < correctCount ? 'var(--color-success)' : 'var(--color-error)',
              }} />
            ))}
          </div>
        </div>
        <div className="card mt-4 text-left">
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            <CalendarDays size={16} className="inline mr-1" /> Mẹo nhỏ
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Quay lại mỗi ngày để nhận thử thách mới! Ôn tập đều đặn giúp bé nhớ lâu hơn 💪
          </p>
        </div>
      </div>
    );
  }

  // Active quiz
  return (
    <div className="fade-in max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <MascotCharacter size="sm" />
        <div className="flex-1">
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            🌟 Thử Thách Ngày {todayStr.split('-').reverse().join('/')}
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Câu {currentIdx + 1}/{todayQuestions.length} · Trộn từ nhiều môn
          </p>
        </div>
        <div className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
          <Sparkles size={16} className="inline" /> {correctCount} đúng
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-4">
        {todayQuestions.map((_, i) => (
          <div key={i} className="flex-1 h-2 rounded-full" style={{
            background: i === currentIdx
              ? 'var(--color-primary)'
              : answers[i] !== null
                ? answers[i] === todayQuestions[i].correctAnswer ? 'var(--color-success)' : 'var(--color-error)'
                : '#E5E7EB',
          }} />
        ))}
      </div>

      {/* Question */}
      <div className="card mb-4">
        <div className="text-xs font-bold mb-2 px-2 py-1 rounded-full inline-block"
          style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
          {currentQ.questionType === 'true_false' ? 'Đúng / Sai' : currentQ.questionType === 'fill_number' ? 'Điền số' : 'Chọn đáp án'}
        </div>
        <h2 className="text-lg font-bold mt-2" style={{ color: 'var(--color-primary-dark)' }}>
          {currentQ.questionText}
        </h2>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {currentQ.questionType === 'true_false' ? (
          ['Đúng', 'Sai'].map(opt => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={showResult !== null}
              className="card text-left font-bold transition-all"
              style={{
                border: showResult !== null && opt === currentQ.correctAnswer
                  ? '2px solid var(--color-success)'
                  : showResult !== null && answers[currentIdx] === opt && opt !== currentQ.correctAnswer
                    ? '2px solid var(--color-error)'
                    : '2px solid transparent',
                opacity: showResult !== null && opt !== currentQ.correctAnswer && answers[currentIdx] !== opt ? 0.5 : 1,
              }}
            >
              <span className="flex items-center gap-2">
                {showResult !== null && opt === currentQ.correctAnswer && <CheckCircle2 size={18} className="text-green-500" />}
                {showResult !== null && answers[currentIdx] === opt && opt !== currentQ.correctAnswer && <XCircle size={18} className="text-red-500" />}
                {opt}
              </span>
            </button>
          ))
        ) : currentQ.questionType === 'fill_number' ? (
          <FillInput correctAnswer={currentQ.correctAnswer} onSubmit={handleAnswer} disabled={showResult !== null} />
        ) : (
          options.map((opt, oi) => (
            <button
              key={oi}
              onClick={() => handleAnswer(opt)}
              disabled={showResult !== null}
              className="card text-left font-bold transition-all"
              style={{
                border: showResult !== null && opt === currentQ.correctAnswer
                  ? '2px solid var(--color-success)'
                  : showResult !== null && answers[currentIdx] === opt && opt !== currentQ.correctAnswer
                    ? '2px solid var(--color-error)'
                    : '2px solid transparent',
                opacity: showResult !== null && opt !== currentQ.correctAnswer && answers[currentIdx] !== opt ? 0.5 : 1,
              }}
            >
              <span className="flex items-center gap-2">
                {showResult !== null && opt === currentQ.correctAnswer && <CheckCircle2 size={18} className="text-green-500" />}
                {showResult !== null && answers[currentIdx] === opt && opt !== currentQ.correctAnswer && <XCircle size={18} className="text-red-500" />}
                {String.fromCharCode(65 + oi)}. {opt}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Result feedback + Next */}
      {showResult !== null && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold" style={{
            color: showResult ? 'var(--color-success)' : 'var(--color-error)',
          }}>
            {showResult ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {showResult ? 'Chính xác! 🎉' : `Đáp án: ${currentQ.correctAnswer}`}
          </div>
          <button className="btn-primary text-sm" onClick={handleNext}>
            {currentIdx + 1 < todayQuestions.length ? (
              <><span>Câu tiếp</span> <ChevronRight size={16} /></>
            ) : (
              <><Trophy size={16} /> <span>Xem kết quả</span></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function FillInput({ onSubmit, disabled }: { correctAnswer?: string; onSubmit: (a: string) => void; disabled: boolean }) {
  const [val, setVal] = useState('');
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={val}
        onChange={e => setVal(e.target.value)}
        disabled={disabled}
        placeholder="Nhập đáp án..."
        className="premium-input flex-1 px-4 py-3 text-lg font-bold"
        onKeyDown={e => { if (e.key === 'Enter' && val.trim()) onSubmit(val.trim()); }}
      />
      {!disabled && (
        <button className="btn-primary" onClick={() => val.trim() && onSubmit(val.trim())}>
          OK
        </button>
      )}
    </div>
  );
}
