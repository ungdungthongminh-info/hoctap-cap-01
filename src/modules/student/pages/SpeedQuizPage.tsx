import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { RotateCcw, ArrowLeft, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MascotCharacter } from '../../../shared/components';

interface QuizItem {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const TIME_PER_QUESTION = 8; // seconds

export function SpeedQuizPage() {
  const navigate = useNavigate();
  const { state, getSubjectLessons, getLessonQuestions } = useAppData();

  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selected, setSelected] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const generateQuiz = useCallback(() => {
    const lessons = getSubjectLessons();
    const items: QuizItem[] = [];

    const shuffledLessons = [...lessons].sort(() => Math.random() - 0.5);
    for (const lesson of shuffledLessons) {
      const qs = getLessonQuestions(lesson.id);
      for (const q of qs) {
        if (q.questionType === 'single_choice' && q.optionsJson) {
          try {
            const opts = JSON.parse(q.optionsJson) as string[];
            if (opts.length >= 2) {
              const correctIdx = opts.indexOf(q.correctAnswer);
              if (correctIdx >= 0) {
                items.push({
                  question: q.questionText,
                  options: opts,
                  correctIdx,
                  explanation: q.explanationSimple || '',
                });
              }
            }
          } catch { /* skip */ }
        }
      }
      if (items.length >= 50) break;
    }

    // Pick 15 random
    const chosen = items.sort(() => Math.random() - 0.5).slice(0, 15);
    if (chosen.length < 3) return;

    setQuestions(chosen);
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(TIME_PER_QUESTION);
    setSelected(null);
    setGameOver(false);
    setTotalTime(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
      setTotalTime(t => t + 1);
    }, 1000);
  }, [getSubjectLessons, getLessonQuestions]);

  useEffect(() => {
    generateQuiz();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.student.subjectCode, state.student.grade]);

  // Time out → auto next
  useEffect(() => {
    if (timeLeft === 0 && !gameOver && selected === null && questions.length > 0) {
      handleTimeout();
    }
  }, [timeLeft]);

  const handleTimeout = () => {
    setStreak(0);
    setSelected(-1); // -1 = timeout indicator
    setTimeout(() => advanceQuestion(), 1200);
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null || gameOver) return;
    setSelected(idx);

    const isCorrect = idx === questions[currentIdx].correctIdx;
    if (isCorrect) {
      setScore(s => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }

    setTimeout(() => advanceQuestion(), 1200);
  };

  const advanceQuestion = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= questions.length) {
      setGameOver(true);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setCurrentIdx(nextIdx);
      setSelected(null);
      setTimeLeft(TIME_PER_QUESTION);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const getStarRating = () => {
    if (!questions.length) return 0;
    const pct = score / questions.length;
    if (pct >= 0.9) return 3;
    if (pct >= 0.6) return 2;
    return 1;
  };

  const timerPct = (timeLeft / TIME_PER_QUESTION) * 100;
  const timerColor = timeLeft <= 3 ? '#E17055' : timeLeft <= 5 ? '#FDCB6E' : '#00B894';

  if (questions.length === 0) {
    return (
      <div className="fade-in max-w-2xl mx-auto text-center py-12">
        <MascotCharacter size="lg" />
        <h1 className="text-2xl font-bold mt-4" style={{ color: 'var(--color-primary-dark)' }}>⚡ Tốc Độ</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>
          Chưa có đủ câu hỏi. Hãy học thêm bài!
        </p>
        <div className="flex gap-3 justify-center mt-4">
          <button className="btn btn-secondary" onClick={() => navigate('/mini-games')}>
            <ArrowLeft size={16} /> Quay lại
          </button>
          <button className="btn btn-primary" onClick={generateQuiz}>
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
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--color-primary-dark)' }}>
            Kết quả Tốc Độ!
          </h2>
          <div className="flex justify-center gap-6 mt-4 text-center">
            <div>
              <div className="text-3xl font-extrabold" style={{ color: 'var(--color-primary)' }}>{score}/{questions.length}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Đúng</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold" style={{ color: '#E17055' }}>{formatTime(totalTime)}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Thời gian</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold" style={{ color: '#FDCB6E' }}>🔥 {bestStreak}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Streak cao nhất</div>
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
            <button className="btn btn-primary" onClick={generateQuiz}>
              <RotateCcw size={16} /> Chơi lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button className="btn btn-secondary p-2" onClick={() => navigate('/mini-games')}>
          <ArrowLeft size={18} />
        </button>
        <MascotCharacter size="sm" />
        <div className="flex-1">
          <h1 className="text-xl font-extrabold flex items-center gap-1" style={{ color: 'var(--color-primary-dark)' }}>
            <Zap size={20} /> Tốc Độ
          </h1>
          <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
            Câu {currentIdx + 1}/{questions.length}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-extrabold" style={{ color: 'var(--color-primary)' }}>
            {score} điểm
          </div>
          {streak >= 2 && (
            <div className="text-xs font-bold" style={{ color: '#E17055' }}>
              🔥 x{streak}
            </div>
          )}
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-3 rounded-full mb-4 overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{
            width: `${timerPct}%`,
            background: timerColor,
          }}
        />
      </div>

      {/* Timer number  */}
      <div className="text-center mb-3">
        <span
          className="text-4xl font-extrabold"
          style={{
            color: timerColor,
            animation: timeLeft <= 3 ? 'bounceOnce 0.5s ease infinite' : 'none',
          }}
        >
          {timeLeft}
        </span>
      </div>

      {/* Question */}
      <div className="card mb-4">
        <p className="text-base font-bold text-center leading-relaxed" style={{ color: 'var(--color-text)' }}>
          {q.question}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIdx;
          const isSelected = selected === i;
          const showResult = selected !== null;

          let bg = 'var(--color-surface)';
          let color = 'var(--color-text)';
          let border = '2px solid transparent';

          if (showResult) {
            if (isCorrect) {
              bg = '#00B894';
              color = '#FFF';
              border = '2px solid #00B894';
            } else if (isSelected && !isCorrect) {
              bg = '#E17055';
              color = '#FFF';
              border = '2px solid #E17055';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className={`chip-card p-4 rounded-xl text-left font-bold text-sm transition-all ${
                showResult && isCorrect ? 'animate-bounce-once' :
                showResult && isSelected && !isCorrect ? 'animate-shake' : ''
              }`}
              style={{ background: bg, color, border }}
              data-active={false}
            >
              <span className="mr-2 inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-extrabold"
                style={{
                  background: showResult && isCorrect ? 'rgba(255,255,255,0.3)' : 'var(--color-primary-light)',
                  color: showResult && isCorrect ? '#FFF' : 'var(--color-primary-dark)',
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Timeout indicator */}
      {selected === -1 && (
        <div className="text-center mt-3 text-sm font-bold animate-shake" style={{ color: '#E17055' }}>
          ⏰ Hết giờ! Đáp án: {q.options[q.correctIdx]}
        </div>
      )}
    </div>
  );
}
