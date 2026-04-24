import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { RotateCcw, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MascotCharacter } from '../../../shared/components';

interface Puzzle {
  original: string;
  scrambled: string[];
  hint: string;
}

export function WordScramblePage() {
  const navigate = useNavigate();
  const { state, getSubjectLessons, getLessonQuestions } = useAppData();

  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const generatePuzzles = useCallback(() => {
    const lessons = getSubjectLessons();
    const words: { word: string; hint: string }[] = [];

    const shuffledLessons = [...lessons].sort(() => Math.random() - 0.5);
    for (const lesson of shuffledLessons) {
      const qs = getLessonQuestions(lesson.id);
      for (const q of qs) {
        // Get words from correct answers (2-8 chars, Vietnamese-safe)
        const answer = q.correctAnswer.trim();
        if (answer.length >= 2 && answer.length <= 12 && !answer.includes(' ') && /^[a-zA-ZÀ-ỹ]+$/.test(answer)) {
          words.push({ word: answer.toUpperCase(), hint: q.questionText });
        }
        // Also try extracting single words from short answers
        if (answer.includes(' ') && answer.length <= 20) {
          const parts = answer.split(' ').filter(w => w.length >= 2 && w.length <= 8);
          for (const p of parts) {
            if (/^[a-zA-ZÀ-ỹ]+$/.test(p)) {
              words.push({ word: p.toUpperCase(), hint: q.questionText });
            }
          }
        }
      }
      if (words.length >= 40) break;
    }

    // Dedupe and pick 8
    const unique = Array.from(new Map(words.map(w => [w.word, w])).values());
    const chosen = unique.sort(() => Math.random() - 0.5).slice(0, 8);

    if (chosen.length < 3) return;

    const pzls: Puzzle[] = chosen.map(({ word, hint }) => {
      const chars = word.split('');
      // Shuffle until different from original
      let scrambled = [...chars];
      for (let attempts = 0; attempts < 20; attempts++) {
        for (let i = scrambled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
        }
        if (scrambled.join('') !== word) break;
      }
      return { original: word, scrambled, hint };
    });

    setPuzzles(pzls);
    setCurrentIdx(0);
    setUserAnswer([]);
    setAvailable(pzls[0].scrambled);
    setScore(0);
    setTotal(pzls.length);
    setGameOver(false);
    setFeedback(null);
    setShowHint(false);
    setSeconds(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  }, [getSubjectLessons, getLessonQuestions]);

  useEffect(() => {
    generatePuzzles();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.student.subjectCode, state.student.grade]);

  const handleSelectChar = (idx: number) => {
    if (feedback) return;
    const char = available[idx];
    setUserAnswer(prev => [...prev, char]);
    setAvailable(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveChar = (idx: number) => {
    if (feedback) return;
    const char = userAnswer[idx];
    setUserAnswer(prev => prev.filter((_, i) => i !== idx));
    setAvailable(prev => [...prev, char]);
  };

  // Check when answer is complete
  useEffect(() => {
    if (puzzles.length === 0 || gameOver) return;
    const puzzle = puzzles[currentIdx];
    if (!puzzle || userAnswer.length !== puzzle.original.length) return;

    const answer = userAnswer.join('');
    const isCorrect = answer === puzzle.original;

    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      const nextIdx = currentIdx + 1;
      if (nextIdx >= puzzles.length) {
        setGameOver(true);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCurrentIdx(nextIdx);
        setUserAnswer([]);
        setAvailable(puzzles[nextIdx].scrambled);
        setShowHint(false);
      }
      setFeedback(null);
    }, 1200);
  }, [userAnswer, puzzles, currentIdx, gameOver]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const getStarRating = () => {
    if (!total) return 0;
    const pct = score / total;
    if (pct >= 0.9) return 3;
    if (pct >= 0.6) return 2;
    return 1;
  };

  if (puzzles.length === 0) {
    return (
      <div className="fade-in max-w-2xl mx-auto text-center py-12">
        <MascotCharacter size="lg" />
        <h1 className="text-2xl font-bold mt-4" style={{ color: 'var(--color-primary-dark)' }}>
          🔤 Xếp Chữ
        </h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>
          Chưa có đủ từ để tạo trò chơi. Hãy học thêm bài!
        </p>
        <div className="flex gap-3 justify-center mt-4">
          <button className="btn btn-secondary" onClick={() => navigate('/mini-games')}>
            <ArrowLeft size={16} /> Quay lại
          </button>
          <button className="btn btn-primary" onClick={generatePuzzles}>
            <RotateCcw size={16} /> Thử lại
          </button>
        </div>
      </div>
    );
  }

  const puzzle = puzzles[currentIdx];

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
            🔤 Xếp Chữ
          </h1>
          <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
            Câu {currentIdx + 1}/{total} · {formatTime(seconds)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-extrabold" style={{ color: 'var(--color-primary)' }}>
            {score}/{total}
          </div>
        </div>
      </div>

      {/* Game Over */}
      {gameOver ? (
        <div className="card text-center py-8">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--color-primary-dark)' }}>
            Hoàn thành!
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>
            Đúng {score}/{total} · Thời gian: {formatTime(seconds)}
          </p>
          <div className="text-3xl mt-3">
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} style={{ opacity: i < getStarRating() ? 1 : 0.3 }}>⭐</span>
            ))}
          </div>
          <div className="flex gap-3 justify-center mt-5">
            <button className="btn btn-secondary" onClick={() => navigate('/mini-games')}>
              <ArrowLeft size={16} /> Trở về
            </button>
            <button className="btn btn-primary" onClick={generatePuzzles}>
              <RotateCcw size={16} /> Chơi lại
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="w-full h-2 rounded-full mb-5" style={{ background: 'var(--color-surface)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((currentIdx) / total) * 100}%`,
                background: 'var(--color-primary)',
              }}
            />
          </div>

          {/* Hint */}
          <div className="card mb-4">
            <div className="flex items-start gap-2">
              <span className="text-xl">💡</span>
              <div className="flex-1">
                <div className="text-xs font-bold mb-1" style={{ color: 'var(--color-text-light)' }}>Gợi ý câu hỏi:</div>
                <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  {showHint ? puzzle.hint : (
                    <button
                      className="text-xs underline"
                      style={{ color: 'var(--color-primary)' }}
                      onClick={() => setShowHint(true)}
                    >
                      <Sparkles size={12} className="inline" /> Bấm để xem gợi ý
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Answer slots */}
          <div className="flex gap-2 justify-center mb-5 flex-wrap">
            {puzzle.original.split('').map((_, i) => (
              <button
                key={i}
                onClick={() => userAnswer[i] && handleRemoveChar(i)}
                className="w-12 h-14 rounded-xl font-extrabold text-xl flex items-center justify-center transition-all"
                style={{
                  background: userAnswer[i]
                    ? feedback === 'correct' ? '#00B894'
                      : feedback === 'wrong' ? '#E17055'
                        : 'var(--color-primary)'
                    : 'var(--color-surface)',
                  color: userAnswer[i] ? '#FFF' : 'var(--color-text-light)',
                  border: `2px solid ${userAnswer[i] ? 'transparent' : 'var(--color-border, #E5E7EB)'}`,
                  transform: feedback && userAnswer[i] ? (feedback === 'correct' ? 'scale(1.05)' : 'translateX(2px)') : 'none',
                }}
              >
                {userAnswer[i] || '_'}
              </button>
            ))}
          </div>

          {/* Feedback text */}
          {feedback && (
            <div className={`text-center mb-4 text-sm font-bold ${feedback === 'correct' ? 'animate-bounce-once' : 'animate-shake'}`}
              style={{ color: feedback === 'correct' ? '#00B894' : '#E17055' }}
            >
              {feedback === 'correct' ? '✅ Chính xác!' : `❌ Đáp án đúng: ${puzzle.original}`}
            </div>
          )}

          {/* Available characters */}
          <div className="flex gap-2 justify-center flex-wrap">
            {available.map((char, i) => (
              <button
                key={`${char}-${i}`}
                onClick={() => handleSelectChar(i)}
                className="chip-card w-12 h-14 rounded-xl font-extrabold text-xl flex items-center justify-center shadow-md"
                style={{
                  background: 'var(--color-surface)',
                  color: 'var(--color-primary-dark)',
                  border: '2px solid var(--color-primary-light)',
                }}
                data-active={false}
              >
                {char}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
