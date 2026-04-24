import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, PencilLine, Shapes, Sparkles, Volume2 } from 'lucide-react';
import { playCorrect, playWrong, speakText, stopSpeaking } from '../../../shared/utils/sounds';

interface LetterRound {
  image: string;
  hint: string;
  promptSpeech: string;
  answer: string;
  options: Array<{ key: string; icon: string; label: string }>;
}

interface CountRound {
  image: string;
  promptSpeech: string;
  answer: number;
  options: Array<{ key: number; icon: string }>;
}

interface TraceRound {
  image: string;
  promptSpeech: string;
  pattern: string;
  points: Array<{ key: string; icon: string }>;
  answer: string;
}

type Mode = 'letters' | 'counting' | 'tracing';

const letterRounds: LetterRound[] = [
  {
    image: '🧒👩',
    hint: 'Bé và mẹ',
    promptSpeech: 'Nhìn hình bé và mẹ. Con chạm vào tiếng ME nhé.',
    answer: 'me',
    options: [
      { key: 'me', icon: '👩', label: 'ME' },
      { key: 'ba', icon: '👨', label: 'BA' },
      { key: 'be', icon: '🧒', label: 'BÉ' },
    ],
  },
  {
    image: '👶🐄',
    hint: 'Bé và bò',
    promptSpeech: 'Con tìm tiếng BÉ trong các lựa chọn nhé.',
    answer: 'be',
    options: [
      { key: 'be', icon: '👶', label: 'BÉ' },
      { key: 'bo', icon: '🐄', label: 'BÒ' },
      { key: 'na', icon: '👧', label: 'NA' },
    ],
  },
  {
    image: '👨🏠',
    hint: 'Ba ở nhà',
    promptSpeech: 'Con chọn tiếng BA nhé.',
    answer: 'ba',
    options: [
      { key: 'na', icon: '👧', label: 'NA' },
      { key: 'ba', icon: '👨', label: 'BA' },
      { key: 'me', icon: '👩', label: 'ME' },
    ],
  },
  {
    image: '👧🌸',
    hint: 'Bạn Na',
    promptSpeech: 'Con chạm vào tiếng NA nào.',
    answer: 'na',
    options: [
      { key: 'be', icon: '👶', label: 'BÉ' },
      { key: 'na', icon: '👧', label: 'NA' },
      { key: 'ba', icon: '👨', label: 'BA' },
    ],
  },
];

const countRounds: CountRound[] = [
  {
    image: '🍎🍎🍎',
    promptSpeech: 'Có bao nhiêu quả táo? Con chạm vào số đúng.',
    answer: 3,
    options: [
      { key: 2, icon: '2️⃣' },
      { key: 3, icon: '3️⃣' },
      { key: 4, icon: '4️⃣' },
    ],
  },
  {
    image: '⭐ ⭐ ⭐ ⭐ ⭐',
    promptSpeech: 'Đếm sao thật nhanh. Có mấy ngôi sao?',
    answer: 5,
    options: [
      { key: 4, icon: '4️⃣' },
      { key: 5, icon: '5️⃣' },
      { key: 6, icon: '6️⃣' },
    ],
  },
  {
    image: '🎈🎈🎈🎈',
    promptSpeech: 'Có mấy quả bóng bay nhỉ?',
    answer: 4,
    options: [
      { key: 3, icon: '3️⃣' },
      { key: 4, icon: '4️⃣' },
      { key: 5, icon: '5️⃣' },
    ],
  },
  {
    image: '🐟🐟',
    promptSpeech: 'Con đếm số cá trong bể nhé.',
    answer: 2,
    options: [
      { key: 1, icon: '1️⃣' },
      { key: 2, icon: '2️⃣' },
      { key: 3, icon: '3️⃣' },
    ],
  },
];

const traceRounds: TraceRound[] = [
  {
    image: '🖍️ ───>',
    promptSpeech: 'Tô nét thẳng. Con chạm điểm bắt đầu bên trái.',
    pattern: 'Nét thẳng',
    answer: 'start',
    points: [
      { key: 'start', icon: '🟢' },
      { key: 'middle', icon: '🟡' },
      { key: 'end', icon: '🔴' },
    ],
  },
  {
    image: '🖍️ ⤿',
    promptSpeech: 'Tô nét cong. Chạm điểm bắt đầu màu xanh.',
    pattern: 'Nét cong',
    answer: 'start',
    points: [
      { key: 'middle', icon: '🟡' },
      { key: 'start', icon: '🟢' },
      { key: 'end', icon: '🔴' },
    ],
  },
  {
    image: '🖍️ ⭕',
    promptSpeech: 'Tô nét tròn. Chạm điểm bắt đầu để đi vòng tròn.',
    pattern: 'Nét tròn',
    answer: 'start',
    points: [
      { key: 'end', icon: '🔴' },
      { key: 'start', icon: '🟢' },
      { key: 'middle', icon: '🟡' },
    ],
  },
];

export function PreGradeMiniGamesPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('letters');
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string>('');
  const [done, setDone] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const rounds = useMemo(() => {
    if (mode === 'letters') return letterRounds.length;
    if (mode === 'counting') return countRounds.length;
    return traceRounds.length;
  }, [mode]);

  const resetMode = (nextMode?: Mode) => {
    if (nextMode) setMode(nextMode);
    setIdx(0);
    setScore(0);
    setSelected('');
    setDone(false);
    setIsCorrect(null);
  };

  const nextRound = () => {
    if (idx + 1 >= rounds) {
      setDone(true);
      speakText('Tuyệt vời! Con đã hoàn thành mini game.', 'vi');
      return;
    }
    setIdx((v) => v + 1);
    setSelected('');
    setIsCorrect(null);
  };

  const getPromptSpeech = useCallback(() => {
    if (done) return '';
    if (mode === 'letters') return letterRounds[idx].promptSpeech;
    if (mode === 'counting') return countRounds[idx].promptSpeech;
    return traceRounds[idx].promptSpeech;
  }, [done, mode, idx]);

  const speakCurrentPrompt = useCallback(() => {
    const text = getPromptSpeech();
    if (!text) return;
    speakText(text, 'vi');
  }, [getPromptSpeech]);

  useEffect(() => {
    if (done) return;
    const timer = setTimeout(() => {
      speakCurrentPrompt();
    }, 220);
    return () => clearTimeout(timer);
  }, [mode, idx, done, speakCurrentPrompt]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const answerLetter = (value: string) => {
    if (selected || done) return;
    setSelected(value);
    const correct = value === letterRounds[idx].answer;
    setIsCorrect(correct);
    if (correct) {
      setScore((s) => s + 1);
      playCorrect();
      speakText('Đúng rồi, con giỏi lắm!', 'vi');
    } else {
      playWrong();
      speakText('Chưa đúng đâu, mình thử lại câu tiếp theo nhé.', 'vi');
    }
  };

  const answerCount = (value: number) => {
    if (selected || done) return;
    setSelected(String(value));
    const correct = value === countRounds[idx].answer;
    setIsCorrect(correct);
    if (correct) {
      setScore((s) => s + 1);
      playCorrect();
      speakText('Chuẩn luôn, con đếm rất giỏi!', 'vi');
    } else {
      playWrong();
      speakText('Gần đúng rồi, con xem lại hình nhé.', 'vi');
    }
  };

  const answerTrace = (value: string) => {
    if (selected || done) return;
    setSelected(value);
    const correct = value === traceRounds[idx].answer;
    setIsCorrect(correct);
    if (correct) {
      setScore((s) => s + 1);
      playCorrect();
      speakText('Đúng điểm bắt đầu rồi! Con khéo tay quá.', 'vi');
    } else {
      playWrong();
      speakText('Con chạm vào chấm màu xanh để bắt đầu nhé.', 'vi');
    }
  };

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <button className="btn btn-secondary p-2" onClick={() => navigate('/mini-games')}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--color-primary-dark)' }}>
            🌱 Vui Học Tiền Tiểu Học
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Bộ game riêng cho bé lớp Lá: ghép chữ, đếm nhanh, tô nét.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button className="btn btn-secondary" onClick={() => resetMode('letters')}>
          <Shapes size={14} /> Ghép chữ
        </button>
        <button className="btn btn-secondary" onClick={() => resetMode('counting')}>
          <Sparkles size={14} /> Đếm nhanh
        </button>
        <button className="btn btn-secondary" onClick={() => resetMode('tracing')}>
          <PencilLine size={14} /> Tô nét
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-sm font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            Câu {Math.min(idx + 1, rounds)}/{rounds}
          </span>
          <div className="flex items-center gap-2">
            <button className="btn btn-primary" style={{ padding: '8px 12px', fontSize: 13 }} onClick={speakCurrentPrompt}>
              <Volume2 size={14} /> Nghe lại
            </button>
            <span className="text-sm">⭐ {score}</span>
          </div>
        </div>

        {!done && mode === 'letters' && (
          <div className="pregrade-touch-area">
            <div className="pregrade-hero-image">{letterRounds[idx].image}</div>
            <p className="pregrade-hint-text">{letterRounds[idx].hint}</p>
            <div className="pregrade-options-grid">
              {letterRounds[idx].options.map((opt) => (
                <button key={opt.key} className="pregrade-option-card" onClick={() => answerLetter(opt.key)}>
                  <span className="pregrade-option-card__icon">{opt.icon}</span>
                  <span className="pregrade-option-card__label">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!done && mode === 'counting' && (
          <div className="pregrade-touch-area">
            <div className="pregrade-hero-image">{countRounds[idx].image}</div>
            <p className="pregrade-hint-text">Chạm số đúng</p>
            <div className="pregrade-options-grid">
              {countRounds[idx].options.map((opt) => (
                <button key={opt.key} className="pregrade-option-card" onClick={() => answerCount(opt.key)}>
                  <span className="pregrade-option-card__icon">{opt.icon}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!done && mode === 'tracing' && (
          <div className="pregrade-touch-area">
            <div className="pregrade-hero-image">{traceRounds[idx].image}</div>
            <p className="pregrade-hint-text">{traceRounds[idx].pattern}</p>
            <div className="pregrade-options-grid">
              {traceRounds[idx].points.map((p) => (
                <button key={p.key} className="pregrade-option-card" onClick={() => answerTrace(p.key)}>
                  <span className="pregrade-option-card__icon">{p.icon}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!done && selected && (
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-sm font-bold" style={{ color: isCorrect ? 'var(--color-success)' : 'var(--color-error)' }}>
              {isCorrect ? '✅ Giỏi lắm!' : '💡 Chưa đúng, mình thử tiếp nhé!'}
            </span>
            <button className="btn btn-primary" onClick={nextRound}>Tiếp theo</button>
          </div>
        )}

        {done && (
          <div className="text-center py-4">
            <CheckCircle2 size={32} style={{ color: 'var(--color-success)' }} className="mx-auto mb-2" />
            <p className="font-bold text-lg">Hoàn thành mini-game!</p>
            <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
              Bé đạt {score}/{rounds} sao.
            </p>
            <div className="flex gap-2 justify-center mt-3">
              <button className="btn btn-secondary" onClick={() => resetMode(mode)}>Chơi lại</button>
              <button className="btn btn-primary" onClick={() => navigate('/mini-games')}>Về kho game</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
