import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel } from '../../../data/subjects';
import { Swords, Bot, Users, Timer, RotateCcw } from 'lucide-react';
import { playClick, playCorrect, playWrong, playFinish } from '../../../shared/utils/sounds';
import { MascotCharacter } from '../../../shared/components';
import { calculateXpFromScore } from '../../../shared/utils/achievements';
import { STORAGE_KEYS } from '../../../shared/constants/storageKeys';
import '../styles/premiumButtons.css';

type Phase = 'setup' | 'playing' | 'result';
type Mode = 'bot' | 'pvp';

interface Player {
  name: string;
  score: number;
  answers: boolean[];
}

export function CompetitionPage() {
  const { state, getSubjectLessons, getLessonQuestions } = useAppData();

  // Setup state
  const [phase, setPhase] = useState<Phase>('setup');
  const [mode, setMode] = useState<Mode>('bot');
  const [player2Name, setPlayer2Name] = useState('');
  const [questionCount, setQuestionCount] = useState(10);

  // Game state
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(0); // 0 or 1
  const [player1, setPlayer1] = useState<Player>({ name: '', score: 0, answers: [] });
  const [player2, setPlayer2] = useState<Player>({ name: '', score: 0, answers: [] });
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Build questions pool from all lessons of current subject
  const buildQuestions = useCallback(() => {
    const lessons = getSubjectLessons();
    const allQs: any[] = [];
    for (const l of lessons) {
      const qs = getLessonQuestions(l.id);
      // Only keep single_choice questions with valid optionsJson for competition
      for (const q of qs) {
        if (q.questionType === 'single_choice' && q.optionsJson) {
          try {
            const opts = JSON.parse(q.optionsJson) as string[];
            if (opts.length >= 2) {
              allQs.push({ ...q, _options: opts });
            }
          } catch { /* skip malformed */ }
        }
      }
    }
    // Shuffle and pick
    const shuffled = allQs.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  }, [getSubjectLessons, getLessonQuestions, questionCount]);

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || showCorrect) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, currentQ, currentPlayer, showCorrect]);

  const handleTimeout = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    playWrong();
    // Mark wrong
    if (currentPlayer === 0) {
      setPlayer1((p) => ({ ...p, answers: [...p.answers, false] }));
    } else {
      setPlayer2((p) => ({ ...p, answers: [...p.answers, false] }));
    }
    setShowCorrect(true);
    setTimeout(advanceTurn, 1500);
  };

  const startGame = () => {
    playClick();
    const qs = buildQuestions();
    if (qs.length === 0) return;
    setQuestions(qs);
    setCurrentQ(0);
    setCurrentPlayer(0);
    setPlayer1({ name: state.student.fullName, score: 0, answers: [] });
    setPlayer2({
      name: mode === 'bot' ? '🤖 Robot' : (player2Name.trim() || 'Bạn chơi 2'),
      score: 0,
      answers: [],
    });
    setTimeLeft(15);
    setSelectedAnswer(null);
    setShowCorrect(false);
    setPhase('playing');
  };

  const handleAnswer = (ansIdx: number) => {
    if (showCorrect || selectedAnswer !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const q = questions[currentQ];
    const opts = q._options as string[];
    const isCorrect = opts[ansIdx] === q.correctAnswer;
    setSelectedAnswer(ansIdx);
    setShowCorrect(true);

    if (isCorrect) {
      playCorrect();
      const pts = Math.max(1, Math.ceil(timeLeft / 3)); // Speed bonus
      if (currentPlayer === 0) {
        setPlayer1((p) => ({ ...p, score: p.score + pts, answers: [...p.answers, true] }));
      } else {
        setPlayer2((p) => ({ ...p, score: p.score + pts, answers: [...p.answers, true] }));
      }
    } else {
      playWrong();
      if (currentPlayer === 0) {
        setPlayer1((p) => ({ ...p, answers: [...p.answers, false] }));
      } else {
        setPlayer2((p) => ({ ...p, answers: [...p.answers, false] }));
      }
    }

    setTimeout(advanceTurn, 1500);
  };

  const advanceTurn = () => {
    setSelectedAnswer(null);
    setShowCorrect(false);

    if (currentPlayer === 0) {
      // Player 2's turn (same question)
      if (mode === 'bot') {
        // Bot answers — 60% accuracy
        setBotAnswer();
      } else {
        setCurrentPlayer(1);
        setTimeLeft(15);
      }
    } else {
      // Both answered → next question
      if (currentQ + 1 >= questions.length) {
        endGame();
      } else {
        setCurrentQ((q) => q + 1);
        setCurrentPlayer(0);
        setTimeLeft(15);
      }
    }
  };

  const setBotAnswer = () => {
    const botCorrect = Math.random() < 0.6;
    const botTime = 5 + Math.random() * 8;
    const pts = botCorrect ? Math.max(1, Math.ceil((15 - botTime) / 3)) : 0;

    setPlayer2((p) => ({
      ...p,
      score: p.score + pts,
      answers: [...p.answers, botCorrect],
    }));

    // Move to next question
    if (currentQ + 1 >= questions.length) {
      setTimeout(endGame, 500);
    } else {
      setTimeout(() => {
        setCurrentQ((q) => q + 1);
        setCurrentPlayer(0);
        setTimeLeft(15);
      }, 500);
    }
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    playFinish();

    // Award XP to player 1
    const correctCount = player1.answers.filter(Boolean).length;
    const xp = calculateXpFromScore(correctCount * 10, questions.length);
    const cur = parseInt(localStorage.getItem(STORAGE_KEYS.XP) || '0', 10) || 0;
    localStorage.setItem(STORAGE_KEYS.XP, String(cur + xp));

    setPhase('result');
  };

  const resetGame = () => {
    playClick();
    setPhase('setup');
    setQuestions([]);
    setCurrentQ(0);
    setCurrentPlayer(0);
    setSelectedAnswer(null);
    setShowCorrect(false);
  };

  // ======================= RENDER =======================
  if (phase === 'setup') {
    return (
      <div className="fade-in max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <MascotCharacter size="sm" />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
              ⚔️ Chế Độ Thi Đấu
            </h1>
            <p className="text-base" style={{ color: 'var(--color-text-light)' }}>
              Môn: {state.student.subjectCode} · {getGradeLabel(state.student.grade)}
            </p>
          </div>
        </div>

        {/* Mode */}
        <div className="card mb-3 p-4">
          <h2 className="font-bold text-base mb-3" style={{ color: 'var(--color-text)' }}>🎮 Chọn chế độ</h2>
          <div className="flex gap-3">
            <button
              className="chip-card flex-1 rounded-2xl flex flex-col items-center gap-2 p-5 shadow-md"
              style={{
                background: mode === 'bot' ? 'var(--color-primary)' : 'var(--color-surface)',
                color: mode === 'bot' ? '#FFF' : 'var(--color-text)',
                border: mode === 'bot' ? '3px solid var(--color-primary)' : '3px solid var(--color-border, #E5E7EB)',
              }}
              data-active={mode === 'bot'}
              onClick={() => setMode('bot')}
            >
              <Bot size={36} />
              <span className="text-base font-bold">🤖 Đấu Robot</span>
              <span className="text-sm opacity-80">Thi với máy</span>
            </button>
            <button
              className="chip-card flex-1 rounded-2xl flex flex-col items-center gap-2 p-5 shadow-md"
              style={{
                background: mode === 'pvp' ? 'var(--color-primary)' : 'var(--color-surface)',
                color: mode === 'pvp' ? '#FFF' : 'var(--color-text)',
                border: mode === 'pvp' ? '3px solid var(--color-primary)' : '3px solid var(--color-border, #E5E7EB)',
              }}
              data-active={mode === 'pvp'}
              onClick={() => setMode('pvp')}
            >
              <Users size={36} />
              <span className="text-base font-bold">👫 Đấu bạn bè</span>
              <span className="text-sm opacity-80">2 người 1 máy</span>
            </button>
          </div>
        </div>

        {/* PvP name */}
        {mode === 'pvp' && (
          <div className="card mb-3 p-4">
            <label className="text-sm font-bold mb-2 block" style={{ color: 'var(--color-text)' }}>✏️ Tên bạn chơi 2</label>
            <input
              className="premium-input w-full p-3 text-base font-medium"
              style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              placeholder="Nhập tên bạn chơi..."
              maxLength={20}
            />
          </div>
        )}

        {/* Question count */}
        <div className="card mb-4 p-4">
          <h2 className="font-bold text-base mb-3" style={{ color: 'var(--color-text)' }}>📝 Số câu hỏi</h2>
          <div className="flex gap-2">
            {[5, 10, 15, 20].map((n) => (
              <button
                key={n}
                className="chip-card flex-1 py-3 rounded-xl text-base font-bold shadow-sm"
                style={{
                  background: questionCount === n ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: questionCount === n ? '#FFF' : 'var(--color-text)',
                  border: questionCount === n ? '3px solid var(--color-primary)' : '3px solid var(--color-border, #E5E7EB)',
                }}
                data-active={questionCount === n}
                onClick={() => setQuestionCount(n)}
              >
                {n} câu
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full py-4 rounded-2xl text-lg font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          style={{ background: 'var(--color-primary)' }}
          onClick={startGame}
        >
          <Swords size={22} /> Bắt đầu thi đấu!
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    const winner = player1.score > player2.score ? player1.name : player2.score > player1.score ? player2.name : 'Hòa';

    return (
      <div className="fade-in max-w-lg mx-auto text-center">
        <div className="text-6xl mb-2 animate-bounce-once">🏆</div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-primary-dark)' }}>Kết quả thi đấu</h1>
        <p className="text-xl font-bold mb-4" style={{ color: winner === 'Hòa' ? 'var(--color-text)' : 'var(--color-success)' }}>
          {winner === 'Hòa' ? '🤝 Hòa!' : `🎉 ${winner} thắng!`}
        </p>

        <div className="flex gap-3 mb-5">
          {[player1, player2].map((p, i) => {
            const correct = p.answers.filter(Boolean).length;
            const isWinner = p.score > (i === 0 ? player2 : player1).score;
            return (
              <div key={i} className="flex-1 rounded-2xl p-5 shadow-md" style={{
                background: isWinner ? 'var(--color-primary)' : 'var(--color-surface)',
                color: isWinner ? '#FFF' : 'var(--color-text)',
                border: isWinner ? '3px solid var(--color-primary)' : '3px solid var(--color-border, #E5E7EB)',
              }}>
                <div className="text-3xl mb-2">{i === 0 ? '🧑' : (mode === 'bot' ? '🤖' : '🧒')}</div>
                <div className="font-bold text-base mb-2">{p.name}</div>
                <div className="text-4xl font-bold mb-1">{p.score}</div>
                <div className="text-sm opacity-80">điểm</div>
                <div className="text-base mt-2 font-bold" style={{ color: isWinner ? '#FFF' : 'var(--color-success)' }}>✅ {correct}/{questions.length} đúng</div>
              </div>
            );
          })}
        </div>

        <button
          className="py-4 px-8 rounded-2xl text-lg font-bold text-white flex items-center gap-2 mx-auto shadow-lg transition-all hover:scale-105 active:scale-95"
          style={{ background: 'var(--color-primary)' }}
          onClick={resetGame}
        >
          <RotateCcw size={20} /> Chơi lại
        </button>
      </div>
    );
  }

  // ===== PLAYING PHASE =====
  const q = questions[currentQ];
  if (!q) return null;

  const progress = ((currentQ) / questions.length) * 100;
  const playerName = currentPlayer === 0 ? player1.name : player2.name;

  return (
    <div className="fade-in max-w-lg mx-auto">
      {/* Scoreboard */}
      <div className="flex items-center justify-between mb-3 rounded-2xl p-3 shadow-sm" style={{ background: 'var(--color-surface)' }}>
        <div className="text-center flex-1">
          <div className="text-2xl font-bold" style={{ color: currentPlayer === 0 ? 'var(--color-primary)' : 'var(--color-text-light)' }}>
            {player1.score}
          </div>
          <div className="text-sm font-medium truncate max-w-[100px]" style={{ color: currentPlayer === 0 ? 'var(--color-primary)' : 'var(--color-text-light)' }}>
            {currentPlayer === 0 ? '👉 ' : ''}{player1.name}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 px-3">
          <div className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
            Câu {currentQ + 1}/{questions.length}
          </div>
          <div className="w-32 h-2.5 rounded-full" style={{ background: 'var(--color-background-card, #E5E7EB)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'var(--color-primary)' }} />
          </div>
          {/* Timer inline */}
          <div className="flex items-center gap-1 mt-1">
            <Timer size={16} style={{ color: timeLeft <= 5 ? '#EF4444' : 'var(--color-text-light)' }} />
            <span className="text-xl font-bold" style={{ color: timeLeft <= 5 ? '#EF4444' : 'var(--color-text)' }}>
              {timeLeft}s
            </span>
          </div>
        </div>
        <div className="text-center flex-1">
          <div className="text-2xl font-bold" style={{ color: currentPlayer === 1 ? 'var(--color-primary)' : 'var(--color-text-light)' }}>
            {player2.score}
          </div>
          <div className="text-sm font-medium truncate max-w-[100px]" style={{ color: currentPlayer === 1 ? 'var(--color-primary)' : 'var(--color-text-light)' }}>
            {currentPlayer === 1 ? '👉 ' : ''}{player2.name}
          </div>
        </div>
      </div>

      {/* Current player indicator */}
      <div className="text-center mb-2">
        <span className="text-sm px-4 py-1.5 rounded-full font-bold shadow-sm" style={{ background: 'var(--color-primary)', color: '#FFF' }}>
          🎯 Lượt của: {playerName}
        </span>
      </div>

      {/* Question */}
      <div className="card mb-3 p-5 text-center shadow-md" style={{ borderLeft: '4px solid var(--color-primary)' }}>
        <p className="text-lg font-bold leading-relaxed" style={{ color: 'var(--color-text)' }}>{q.questionText}</p>
      </div>

      {/* Answers */}
      <div className="space-y-2.5">
        {(q._options as string[]).map((opt: string, i: number) => {
          let bg = 'var(--color-surface)';
          let border = 'var(--color-border, #D1D5DB)';
          let shadow = 'shadow-sm';
          if (showCorrect) {
            if (opt === q.correctAnswer) { bg = '#D1FAE5'; border = '#10B981'; shadow = 'shadow-md'; }
            else if (i === selectedAnswer) { bg = '#FEE2E2'; border = '#EF4444'; }
          } else if (selectedAnswer === i) {
            bg = 'var(--color-primary)'; border = 'var(--color-primary)';
          }
          const isSelected = !showCorrect && selectedAnswer === i;
          return (
            <button
              key={i}
              className={`w-full p-4 rounded-2xl text-left text-base font-medium transition-all hover:scale-[1.01] active:scale-[0.98] ${shadow}`}
              style={{ background: bg, border: `3px solid ${border}`, color: isSelected ? '#FFF' : 'var(--color-text)' }}
              onClick={() => handleAnswer(i)}
              disabled={showCorrect}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-bold"
                style={{ background: isSelected ? 'rgba(255,255,255,0.3)' : 'var(--color-primary)', color: '#FFF' }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
