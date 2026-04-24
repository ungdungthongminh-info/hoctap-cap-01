import { useState, useEffect, useCallback } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { playCorrect, playWrong, playClick, playFinish } from '../../../shared/utils/sounds';
import { RotateCcw, ChevronRight, Brain, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { EmptyState, MascotCharacter } from '../../../shared/components';

interface FlashCard {
  id: number;
  front: string;   // question
  back: string;     // answer
  lessonTitle: string;
  difficulty: number; // 1=easy 2=medium 3=hard (user-rated)
  nextReview: number; // timestamp ms
  interval: number;   // current interval in ms
}

const LS_KEY = 'hhk_memory_cards';
const INTERVALS = [
  60_000,        // 1 min (lần đầu sai)
  5 * 60_000,    // 5 min (dễ lần 1)
  30 * 60_000,   // 30 min
  4 * 3600_000,  // 4 giờ
  24 * 3600_000, // 1 ngày
  3 * 86400_000, // 3 ngày
  7 * 86400_000, // 1 tuần
];

function loadCards(): FlashCard[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
  catch { return []; }
}
function saveCards(cards: FlashCard[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(cards)); } catch { /* */ }
}

export function MemoryRoomPage() {
  const { getSubjectLessons, getLessonQuestions } = useAppData();
  const [cards, setCards] = useState<FlashCard[]>(loadCards);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState({ easy: 0, medium: 0, hard: 0 });
  const [initialized, setInitialized] = useState(false);

  // Build deck from current subject's questions
  const buildDeck = useCallback(() => {
    const lessons = getSubjectLessons();
    const newCards: FlashCard[] = [];
    const existingIds = new Set(cards.map((c) => c.id));

    for (const lesson of lessons) {
      const questions = getLessonQuestions(lesson.id);
      for (const q of questions) {
        if (existingIds.has(q.id)) continue;
        newCards.push({
          id: q.id,
          front: q.questionText,
          back: q.correctAnswer,
          lessonTitle: lesson.title,
          difficulty: 0,
          nextReview: 0,
          interval: 0,
        });
      }
    }

    if (newCards.length > 0) {
      const merged = [...cards, ...newCards];
      setCards(merged);
      saveCards(merged);
    }
    setInitialized(true);
  }, [cards, getSubjectLessons, getLessonQuestions]);

  useEffect(() => {
    if (!initialized) buildDeck();
  }, [initialized, buildDeck]);

  // Get cards due for review
  const now = Date.now();
  const dueCards = cards
    .filter((c) => c.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview)
    .slice(0, 20); // Max 20 cards per session

  const current = dueCards[currentIdx];
  const totalDue = dueCards.length;

  const handleRate = (rating: 'easy' | 'medium' | 'hard') => {
    if (!current) return;
    playClick();

    const card = { ...current };
    let intervalIdx = INTERVALS.indexOf(card.interval);

    if (rating === 'easy') {
      intervalIdx = Math.min(intervalIdx + 2, INTERVALS.length - 1);
      playCorrect();
    } else if (rating === 'medium') {
      intervalIdx = Math.min(intervalIdx + 1, INTERVALS.length - 1);
    } else {
      intervalIdx = 0;
      playWrong();
    }

    card.interval = INTERVALS[intervalIdx];
    card.nextReview = now + card.interval;
    card.difficulty = rating === 'easy' ? 1 : rating === 'medium' ? 2 : 3;

    const updated = cards.map((c) => (c.id === card.id ? card : c));
    setCards(updated);
    saveCards(updated);

    setStats((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));
    setFlipped(false);

    if (currentIdx + 1 >= totalDue) {
      setDone(true);
      playFinish();
    } else {
      setCurrentIdx((i) => i + 1);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setFlipped(false);
    setDone(false);
    setStats({ easy: 0, medium: 0, hard: 0 });
    buildDeck();
  };

  // Format interval
  const fmtInterval = (ms: number) => {
    if (ms < 60_000) return '< 1 phút';
    if (ms < 3600_000) return `${Math.round(ms / 60_000)} phút`;
    if (ms < 86400_000) return `${Math.round(ms / 3600_000)} giờ`;
    return `${Math.round(ms / 86400_000)} ngày`;
  };

  // Empty state
  if (initialized && cards.length === 0) {
    return (
      <div className="fade-in max-w-2xl mx-auto">
        <EmptyState
          emoji="🧠"
          title="Phòng Trí Nhớ"
          description="Chưa có câu hỏi nào. Hãy học ít nhất 1 bài trước nhé!"
        />
      </div>
    );
  }

  // No cards due
  if (initialized && totalDue === 0 && !done) {
    const nextCard = [...cards].sort((a, b) => a.nextReview - b.nextReview)[0];
    const waitTime = nextCard ? fmtInterval(nextCard.nextReview - now) : '';
    return (
      <div className="fade-in max-w-2xl mx-auto text-center py-16">
        <span className="text-6xl block mb-4">🎉</span>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary-dark)' }}>Tuyệt vời!</h1>
        <p className="mb-4" style={{ color: 'var(--color-text-light)' }}>
          Không có thẻ nào cần ôn lại ngay bây giờ.
        </p>
        {nextCard && (
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Thẻ tiếp theo sẽ xuất hiện sau {waitTime}
          </p>
        )}
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>
          📚 Tổng: {cards.length} thẻ đã tạo
        </p>
      </div>
    );
  }

  // Done session
  if (done) {
    const total = stats.easy + stats.medium + stats.hard;
    return (
      <div className="fade-in max-w-2xl mx-auto text-center py-12">
        <span className="text-6xl block mb-4">🏆</span>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary-dark)' }}>
          Hoàn thành ôn tập!
        </h1>
        <p className="mb-6" style={{ color: 'var(--color-text-light)' }}>
          Đã ôn {total} thẻ trong phiên này
        </p>
        <div className="flex gap-4 justify-center mb-8">
          <div className="card text-center px-6 py-4">
            <div className="text-2xl font-bold" style={{ color: '#059669' }}>{stats.easy}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Dễ ✅</div>
          </div>
          <div className="card text-center px-6 py-4">
            <div className="text-2xl font-bold" style={{ color: '#D97706' }}>{stats.medium}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Vừa 🤔</div>
          </div>
          <div className="card text-center px-6 py-4">
            <div className="text-2xl font-bold" style={{ color: '#DC2626' }}>{stats.hard}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Khó ❌</div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={restart}>
          <RotateCcw size={16} /> Ôn thêm
        </button>
      </div>
    );
  }

  // Main flashcard view
  return (
    <div className="fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MascotCharacter size="sm" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            🧠 Phòng Trí Nhớ
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Lật thẻ, nhớ lại, đánh giá mức độ nhớ!
          </p>
        </div>
        <div className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
          {currentIdx + 1}/{totalDue}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {dueCards.map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-all"
            style={{
              background: i < currentIdx ? 'var(--color-success)' : i === currentIdx ? 'var(--color-primary)' : '#E5E7EB',
              transform: i === currentIdx ? 'scale(1.4)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Flashcard */}
      {current && (
        <>
          <div className="text-xs mb-2" style={{ color: 'var(--color-text-light)' }}>
            📖 {current.lessonTitle}
          </div>

          <button
            className="card w-full text-center cursor-pointer transition-all hover:scale-[1.01]"
            style={{
              minHeight: 220,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: flipped
                ? 'linear-gradient(135deg, #D1FAE5, #ECFDF5)'
                : 'linear-gradient(135deg, var(--color-surface), var(--color-background-card))',
              border: flipped ? '2px solid #10B981' : '2px solid var(--color-primary-light)',
            }}
            onClick={() => { setFlipped((f) => !f); playClick(); }}
          >
            {!flipped ? (
              <>
                <Brain size={32} style={{ color: 'var(--color-primary)', marginBottom: 12 }} />
                <div className="text-lg font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                  {current.front}
                </div>
                <div className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-light)' }}>
                  Nhấn để lật <ChevronRight size={12} />
                </div>
              </>
            ) : (
              <>
                <Sparkles size={32} style={{ color: '#10B981', marginBottom: 12 }} />
                <div className="text-xl font-bold mb-3" style={{ color: '#059669' }}>
                  {current.back}
                </div>
                <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  Bạn nhớ được không?
                </div>
              </>
            )}
          </button>

          {/* Rating buttons — shown after flip */}
          {flipped && (
            <div className="flex gap-3 mt-6 justify-center">
              <button
                className="flex-1 card flex flex-col items-center gap-2 py-4 cursor-pointer hover:scale-105 transition-all"
                style={{ background: '#FEE2E2', border: '2px solid #FECACA' }}
                onClick={() => handleRate('hard')}
              >
                <XCircle size={24} style={{ color: '#DC2626' }} />
                <span className="text-sm font-bold" style={{ color: '#DC2626' }}>Khó</span>
                <span className="text-[10px]" style={{ color: '#991B1B' }}>Ôn lại sau 1 phút</span>
              </button>
              <button
                className="flex-1 card flex flex-col items-center gap-2 py-4 cursor-pointer hover:scale-105 transition-all"
                style={{ background: '#FEF3C7', border: '2px solid #FDE68A' }}
                onClick={() => handleRate('medium')}
              >
                <RotateCcw size={24} style={{ color: '#D97706' }} />
                <span className="text-sm font-bold" style={{ color: '#D97706' }}>Vừa</span>
                <span className="text-[10px]" style={{ color: '#92400E' }}>
                  Ôn sau {fmtInterval(INTERVALS[Math.min(INTERVALS.indexOf(current.interval) + 1, INTERVALS.length - 1)])}
                </span>
              </button>
              <button
                className="flex-1 card flex flex-col items-center gap-2 py-4 cursor-pointer hover:scale-105 transition-all"
                style={{ background: '#D1FAE5', border: '2px solid #A7F3D0' }}
                onClick={() => handleRate('easy')}
              >
                <CheckCircle size={24} style={{ color: '#059669' }} />
                <span className="text-sm font-bold" style={{ color: '#059669' }}>Dễ</span>
                <span className="text-[10px]" style={{ color: '#065F46' }}>
                  Ôn sau {fmtInterval(INTERVALS[Math.min(INTERVALS.indexOf(current.interval) + 2, INTERVALS.length - 1)])}
                </span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Stats footer */}
      <div className="flex justify-center gap-6 mt-8 text-xs" style={{ color: 'var(--color-text-light)' }}>
        <span>📚 Tổng: {cards.length} thẻ</span>
        <span>⏰ Cần ôn: {totalDue}</span>
        <span>✅ Dễ: {stats.easy}</span>
        <span>🤔 Vừa: {stats.medium}</span>
        <span>❌ Khó: {stats.hard}</span>
      </div>
    </div>
  );
}
