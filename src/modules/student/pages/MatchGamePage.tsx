import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { Shuffle, RotateCcw, Timer, Star, Zap } from 'lucide-react';
import { MascotCharacter } from '../../../shared/components';

interface MatchCard {
  id: number;
  text: string;
  pairId: number;
  flipped: boolean;
  matched: boolean;
}

export function MatchGamePage() {
  const { state, getSubjectLessons, getLessonQuestions } = useAppData();
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const lockRef = useRef(false);

  const generateGame = useCallback(() => {
    const lessons = getSubjectLessons();
    if (lessons.length === 0) return;

    // Collect Q&A pairs from random lessons
    const allPairs: { q: string; a: string }[] = [];
    const shuffledLessons = [...lessons].sort(() => Math.random() - 0.5);
    for (const lesson of shuffledLessons) {
      const qs = getLessonQuestions(lesson.id);
      for (const q of qs) {
        if (q.questionType === 'single_choice' && q.questionText.length < 40 && q.correctAnswer.length < 25) {
          allPairs.push({ q: q.questionText, a: q.correctAnswer });
        }
      }
      if (allPairs.length >= 30) break;
    }

    // Take 6 random pairs
    const chosen = allPairs.sort(() => Math.random() - 0.5).slice(0, 6);
    if (chosen.length < 3) return;

    const matchCards: MatchCard[] = [];
    chosen.forEach((pair, i) => {
      matchCards.push({ id: i * 2, text: pair.q, pairId: i, flipped: false, matched: false });
      matchCards.push({ id: i * 2 + 1, text: pair.a, pairId: i, flipped: false, matched: false });
    });

    // Shuffle
    for (let i = matchCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [matchCards[i], matchCards[j]] = [matchCards[j], matchCards[i]];
    }

    setCards(matchCards);
    setTotalPairs(chosen.length);
    setSelected([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameOver(false);
    setSeconds(0);
    setStarted(true);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  }, [getSubjectLessons, getLessonQuestions]);

  useEffect(() => {
    generateGame();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.student.subjectCode, state.student.grade]);

  const handleClick = useCallback((cardId: number) => {
    if (lockRef.current || gameOver) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return;
    if (selected.includes(cardId)) return;

    const newSelected = [...selected, cardId];
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, flipped: true } : c));

    if (newSelected.length === 2) {
      lockRef.current = true;
      setMoves(m => m + 1);
      const [a, b] = newSelected;
      const ca = cards.find(c => c.id === a)!;
      const cb = cards.find(c => c.id === b)!;

      if (ca.pairId === cb.pairId) {
        // Match!
        setCards(prev => prev.map(c =>
          c.id === a || c.id === b ? { ...c, matched: true, flipped: true } : c
        ));
        const newMatched = matchedPairs + 1;
        setMatchedPairs(newMatched);
        if (newMatched === totalPairs) {
          setGameOver(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
        setSelected([]);
        lockRef.current = false;
      } else {
        // No match — flip back after delay
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === a || c.id === b ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          lockRef.current = false;
        }, 800);
        return;
      }
    } else {
      setSelected(newSelected);
    }
  }, [cards, selected, matchedPairs, totalPairs, gameOver]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const getStarRating = () => {
    if (!totalPairs) return 0;
    const idealMoves = totalPairs;
    const ratio = moves / idealMoves;
    if (ratio <= 1.5) return 3;
    if (ratio <= 2.5) return 2;
    return 1;
  };

  if (!started || cards.length === 0) {
    return (
      <div className="fade-in max-w-3xl mx-auto text-center py-12">
        <MascotCharacter size="lg" />
        <h1 className="text-2xl font-bold mt-4" style={{ color: 'var(--color-primary-dark)' }}>
          🎮 Mini-Game Ghép Cặp
        </h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>
          Chưa có đủ câu hỏi để tạo trò chơi. Hãy học thêm bài!
        </p>
        <button className="btn-primary mt-4" onClick={generateGame}>
          <Shuffle size={18} /> Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <MascotCharacter size="sm" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            🎮 Ghép Cặp Câu Hỏi — Đáp Án
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Lật thẻ và tìm cặp câu hỏi + đáp án đúng!
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="card mb-4 flex items-center justify-around text-center">
        <div>
          <div className="flex items-center gap-1 justify-center text-xs" style={{ color: 'var(--color-text-light)' }}>
            <Timer size={14} /> Thời gian
          </div>
          <div className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{formatTime(seconds)}</div>
        </div>
        <div>
          <div className="flex items-center gap-1 justify-center text-xs" style={{ color: 'var(--color-text-light)' }}>
            <Zap size={14} /> Lượt lật
          </div>
          <div className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{moves}</div>
        </div>
        <div>
          <div className="flex items-center gap-1 justify-center text-xs" style={{ color: 'var(--color-text-light)' }}>
            <Star size={14} /> Cặp đúng
          </div>
          <div className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{matchedPairs}/{totalPairs}</div>
        </div>
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="card mb-4 text-center bounce-in" style={{ background: 'var(--color-primary-light)', border: '2px solid var(--color-primary)' }}>
          <div className="text-3xl mb-2">🎉</div>
          <div className="text-lg font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            Tuyệt vời! Hoàn thành!
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>
            Thời gian: {formatTime(seconds)} · Số lượt: {moves}
          </div>
          <div className="text-2xl mt-2">
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} style={{ opacity: i < getStarRating() ? 1 : 0.3 }}>⭐</span>
            ))}
          </div>
          <button className="btn-primary mt-3" onClick={generateGame}>
            <RotateCcw size={18} /> Chơi lại
          </button>
        </div>
      )}

      {/* Game grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleClick(card.id)}
            className="relative rounded-2xl font-bold text-sm transition-all duration-300 min-h-[90px] p-3 cursor-pointer select-none"
            style={{
              background: card.matched
                ? 'var(--color-success)'
                : card.flipped
                  ? 'var(--color-primary-light)'
                  : 'var(--color-primary)',
              color: card.matched
                ? 'white'
                : card.flipped
                  ? 'var(--color-primary-dark)'
                  : 'white',
              transform: card.flipped || card.matched ? 'rotateY(0deg)' : 'rotateY(0deg)',
              opacity: card.matched ? 0.7 : 1,
              boxShadow: card.flipped && !card.matched ? '0 0 0 3px var(--color-primary)' : 'none',
            }}
          >
            {card.flipped || card.matched ? (
              <span className="text-xs sm:text-sm leading-tight">{card.text}</span>
            ) : (
              <span className="text-2xl">❓</span>
            )}
          </button>
        ))}
      </div>

      {/* New game button */}
      {!gameOver && (
        <div className="text-center mt-4">
          <button className="btn-outline text-sm" onClick={generateGame}>
            <Shuffle size={16} /> Trò chơi mới
          </button>
        </div>
      )}
    </div>
  );
}
