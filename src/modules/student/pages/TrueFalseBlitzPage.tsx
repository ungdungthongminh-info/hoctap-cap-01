import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { RotateCcw, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MascotCharacter } from '../../../shared/components';

interface TFItem {
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export function TrueFalseBlitzPage() {
  const navigate = useNavigate();
  const { state, getSubjectLessons, getLessonQuestions } = useAppData();

  const [items, setItems] = useState<TFItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const generateGame = useCallback(() => {
    const lessons = getSubjectLessons();
    const tfItems: TFItem[] = [];

    const shuffledLessons = [...lessons].sort(() => Math.random() - 0.5);
    for (const lesson of shuffledLessons) {
      const qs = getLessonQuestions(lesson.id);
      for (const q of qs) {
        // true_false questions are ideal
        if (q.questionType === 'true_false') {
          tfItems.push({
            statement: q.questionText,
            isTrue: q.correctAnswer.toLowerCase() === 'đúng' || q.correctAnswer.toLowerCase() === 'true',
            explanation: q.explanationSimple || '',
          });
        }
        // Convert single_choice to T/F by pairing question with its correct answer
        else if (q.questionType === 'single_choice' && q.optionsJson && q.questionText.length < 60) {
          try {
            const opts = JSON.parse(q.optionsJson) as string[];
            if (opts.length >= 2) {
              // True statement: Q → correct answer
              tfItems.push({
                statement: `${q.questionText} → ${q.correctAnswer}`,
                isTrue: true,
                explanation: q.explanationSimple || `Đáp án đúng: ${q.correctAnswer}`,
              });
              // False statement: Q → wrong answer (random)
              const wrongOpts = opts.filter(o => o !== q.correctAnswer);
              if (wrongOpts.length > 0) {
                const wrongAnswer = wrongOpts[Math.floor(Math.random() * wrongOpts.length)];
                tfItems.push({
                  statement: `${q.questionText} → ${wrongAnswer}`,
                  isTrue: false,
                  explanation: `Sai! Đáp án đúng là: ${q.correctAnswer}`,
                });
              }
            }
          } catch { /* skip */ }
        }
      }
      if (tfItems.length >= 50) break;
    }

    const chosen = tfItems.sort(() => Math.random() - 0.5).slice(0, 15);
    if (chosen.length < 3) return;

    setItems(chosen);
    setCurrentIdx(0);
    setScore(0);
    setSelected(null);
    setGameOver(false);
    setSeconds(0);
    setCombo(0);
    setBestCombo(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  }, [getSubjectLessons, getLessonQuestions]);

  useEffect(() => {
    generateGame();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.student.subjectCode, state.student.grade]);

  const handleAnswer = (answer: boolean) => {
    if (selected !== null || gameOver) return;
    setSelected(answer);

    const isCorrect = answer === items[currentIdx].isTrue;
    if (isCorrect) {
      setScore(s => s + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > bestCombo) setBestCombo(newCombo);
    } else {
      setCombo(0);
    }

    setTimeout(() => {
      const nextIdx = currentIdx + 1;
      if (nextIdx >= items.length) {
        setGameOver(true);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCurrentIdx(nextIdx);
        setSelected(null);
      }
    }, 1500);
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
        <h1 className="text-2xl font-bold mt-4" style={{ color: 'var(--color-primary-dark)' }}>✅ Đúng hay Sai</h1>
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
          <div className="text-5xl mb-3">🎯</div>
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
            <div>
              <div className="text-3xl font-extrabold" style={{ color: '#FDCB6E' }}>🔥 {bestCombo}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Combo</div>
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
  const isCorrect = selected !== null && selected === item.isTrue;
  const isWrong = selected !== null && selected !== item.isTrue;

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
            ✅ Đúng hay Sai
          </h1>
          <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
            Câu {currentIdx + 1}/{items.length} · {formatTime(seconds)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-extrabold" style={{ color: 'var(--color-primary)' }}>{score}</div>
          {combo >= 2 && (
            <div className="text-xs font-bold" style={{ color: '#E17055' }}>🔥 x{combo}</div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 rounded-full mb-6" style={{ background: 'var(--color-surface)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${((currentIdx) / items.length) * 100}%`, background: 'var(--color-primary)' }}
        />
      </div>

      {/* Statement Card */}
      <div
        className={`card mb-6 p-6 text-center transition-all ${
          isCorrect ? 'animate-bounce-once' : isWrong ? 'animate-shake' : ''
        }`}
        style={{
          border: selected !== null
            ? `3px solid ${isCorrect ? '#00B894' : '#E17055'}`
            : '3px solid transparent',
          minHeight: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p className="text-lg font-bold leading-relaxed" style={{ color: 'var(--color-text)' }}>
          {item.statement}
        </p>
        {selected !== null && (
          <p className="text-xs mt-3 font-medium" style={{ color: isCorrect ? '#00B894' : '#E17055' }}>
            {isCorrect ? '✅ Chính xác!' : `❌ ${item.explanation}`}
          </p>
        )}
      </div>

      {/* True / False Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleAnswer(true)}
          disabled={selected !== null}
          className="chip-card rounded-2xl p-6 flex flex-col items-center gap-2 shadow-lg"
          style={{
            background: selected !== null && item.isTrue ? '#00B894'
              : selected === true && !item.isTrue ? '#E17055'
                : '#00B894',
            color: '#FFF',
            opacity: selected !== null && selected !== true && !item.isTrue ? 0.4 : 1,
            border: '3px solid transparent',
          }}
          data-active={false}
        >
          <CheckCircle size={40} />
          <span className="text-xl font-extrabold">ĐÚNG</span>
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={selected !== null}
          className="chip-card rounded-2xl p-6 flex flex-col items-center gap-2 shadow-lg"
          style={{
            background: selected !== null && !item.isTrue ? '#00B894'
              : selected === false && item.isTrue ? '#E17055'
                : '#E17055',
            color: '#FFF',
            opacity: selected !== null && selected !== false && item.isTrue ? 0.4 : 1,
            border: '3px solid transparent',
          }}
          data-active={false}
        >
          <XCircle size={40} />
          <span className="text-xl font-extrabold">SAI</span>
        </button>
      </div>
    </div>
  );
}
