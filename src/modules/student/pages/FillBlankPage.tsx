import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { RotateCcw, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MascotCharacter } from '../../../shared/components';
import '../styles/premiumButtons.css';

interface FBItem {
  questionText: string;
  answer: string;
  hint: string;
}

export function FillBlankPage() {
  const navigate = useNavigate();
  const { state, getSubjectLessons, getLessonQuestions } = useAppData();

  const [items, setItems] = useState<FBItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateGame = useCallback(() => {
    const lessons = getSubjectLessons();
    const fbItems: FBItem[] = [];

    const shuffledLessons = [...lessons].sort(() => Math.random() - 0.5);
    for (const lesson of shuffledLessons) {
      const qs = getLessonQuestions(lesson.id);
      for (const q of qs) {
        // fill_text and fill_number questions
        if ((q.questionType === 'fill_text' || q.questionType === 'fill_number') && q.correctAnswer.length <= 30) {
          fbItems.push({
            questionText: q.questionText,
            answer: q.correctAnswer.trim(),
            hint: q.explanationSimple || '',
          });
        }
        // Convert single_choice: mask answer in question
        else if (q.questionType === 'single_choice' && q.correctAnswer.length <= 20 && q.correctAnswer.length >= 1) {
          fbItems.push({
            questionText: q.questionText,
            answer: q.correctAnswer.trim(),
            hint: q.explanationSimple || '',
          });
        }
      }
      if (fbItems.length >= 40) break;
    }

    const chosen = fbItems.sort(() => Math.random() - 0.5).slice(0, 10);
    if (chosen.length < 3) return;

    setItems(chosen);
    setCurrentIdx(0);
    setScore(0);
    setInput('');
    setFeedback(null);
    setShowAnswer(false);
    setGameOver(false);
    setSeconds(0);
    setHintUsed(false);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  }, [getSubjectLessons, getLessonQuestions]);

  useEffect(() => {
    generateGame();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.student.subjectCode, state.student.grade]);

  useEffect(() => {
    if (!gameOver && !feedback && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIdx, feedback, gameOver]);

  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

  const handleSubmit = () => {
    if (feedback || gameOver || !input.trim()) return;

    const isCorrect = normalize(input) === normalize(items[currentIdx].answer);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
    setShowAnswer(true);

    setTimeout(() => {
      const next = currentIdx + 1;
      if (next >= items.length) {
        setGameOver(true);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCurrentIdx(next);
        setInput('');
        setFeedback(null);
        setShowAnswer(false);
        setHintUsed(false);
      }
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const getStarRating = () => {
    if (!items.length) return 0;
    const pct = score / items.length;
    if (pct >= 0.9) return 3;
    if (pct >= 0.6) return 2;
    return 1;
  };

  if (items.length === 0) {
    return (
      <div className="fade-in max-w-2xl mx-auto text-center py-12">
        <MascotCharacter size="lg" />
        <h1 className="text-2xl font-bold mt-4" style={{ color: 'var(--color-primary-dark)' }}>✏️ Điền Từ</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>
          Chưa có đủ câu hỏi. Hãy học thêm bài!
        </p>
        <div className="flex gap-3 justify-center mt-4">
          <button className="btn btn-secondary" onClick={() => navigate('/mini-games')}>
            <ArrowLeft size={16} /> Quay lại
          </button>
          <button className="btn btn-primary" onClick={generateGame}>
            <RotateCcw size={16} /> Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="fade-in max-w-2xl mx-auto">
        <div className="card text-center py-8">
          <div className="text-5xl mb-3">✏️</div>
          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--color-primary-dark)' }}>
            Kết quả!
          </h2>
          <div className="flex justify-center gap-6 mt-4">
            <div>
              <div className="text-3xl font-extrabold" style={{ color: 'var(--color-primary)' }}>{score}/{items.length}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Đúng</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold" style={{ color: '#E17055' }}>{formatTime(seconds)}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Thời gian</div>
            </div>
          </div>
          <div className="text-3xl mt-4">
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} style={{ opacity: i < getStarRating() ? 1 : 0.3 }}>⭐</span>
            ))}
          </div>
          <div className="flex gap-3 justify-center mt-5">
            <button className="btn btn-secondary" onClick={() => navigate('/mini-games')}>
              <ArrowLeft size={16} /> Trở về
            </button>
            <button className="btn btn-primary" onClick={generateGame}>
              <RotateCcw size={16} /> Chơi lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const item = items[currentIdx];
  const blankedAnswer = item.answer.replace(/./g, (_, i) => i === 0 ? item.answer[0] : ' _');

  return (
    <div className="fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button className="btn btn-secondary p-2" onClick={() => navigate('/mini-games')}>
          <ArrowLeft size={18} />
        </button>
        <MascotCharacter size="sm" />
        <div className="flex-1">
          <h1 className="text-xl font-extrabold" style={{ color: 'var(--color-primary-dark)' }}>
            ✏️ Điền Từ
          </h1>
          <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
            Câu {currentIdx + 1}/{items.length} · {formatTime(seconds)}
          </p>
        </div>
        <div className="text-lg font-extrabold" style={{ color: 'var(--color-primary)' }}>{score}</div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 rounded-full mb-6" style={{ background: 'var(--color-surface)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${((currentIdx) / items.length) * 100}%`, background: 'var(--color-primary)' }}
        />
      </div>

      {/* Question Card */}
      <div
        className={`card mb-4 p-6 transition-all ${
          feedback === 'correct' ? 'animate-bounce-once' : feedback === 'wrong' ? 'animate-shake' : ''
        }`}
        style={{
          border: feedback
            ? `3px solid ${feedback === 'correct' ? '#00B894' : '#E17055'}`
            : '3px solid transparent',
        }}
      >
        <p className="text-lg font-bold leading-relaxed text-center" style={{ color: 'var(--color-text)' }}>
          {item.questionText}
        </p>

        {/* Hint */}
        {!hintUsed && !feedback && (
          <button
            className="text-xs mt-3 mx-auto block underline"
            style={{ color: 'var(--color-primary)' }}
            onClick={() => setHintUsed(true)}
          >
            💡 Xem gợi ý
          </button>
        )}
        {hintUsed && !feedback && (
          <p className="text-xs text-center mt-2" style={{ color: 'var(--color-primary)' }}>
            💡 Gợi ý: {blankedAnswer}
          </p>
        )}

        {/* Show answer after submit */}
        {showAnswer && (
          <p className="text-sm text-center mt-3 font-bold" style={{ color: feedback === 'correct' ? '#00B894' : '#E17055' }}>
            {feedback === 'correct' ? '✅ Chính xác!' : `❌ Đáp án: ${item.answer}`}
          </p>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          className="premium-input flex-1 px-4 py-3 text-base"
          style={{
            borderColor: feedback === 'correct' ? '#00B894' : feedback === 'wrong' ? '#E17055' : undefined,
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
          }}
          placeholder="Nhập đáp án..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!!feedback}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          className="btn btn-primary rounded-xl px-5"
          onClick={handleSubmit}
          disabled={!!feedback || !input.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
