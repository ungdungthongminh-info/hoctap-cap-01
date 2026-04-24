import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, RotateCcw, Timer, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { MascotCharacter } from '../../../shared/components';
import { getGradeLabel } from '../../../data/subjects';
import '../styles/premiumButtons.css';

interface MathRound {
  id: number;
  text: string;
  answer: number;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildRound(id: number, grade: number): MathRound {
  if (grade <= 2) {
    const a = randomInt(1, 20);
    const b = randomInt(1, 20);
    const add = Math.random() > 0.5;
    const answer = add ? a + b : Math.max(a, b) - Math.min(a, b);
    return { id, text: add ? `${a} + ${b} = ?` : `${Math.max(a, b)} - ${Math.min(a, b)} = ?`, answer };
  }

  if (grade <= 4) {
    const a = randomInt(2, 20);
    const b = randomInt(2, 10);
    const useMul = Math.random() > 0.35;
    if (useMul) return { id, text: `${a} × ${b} = ?`, answer: a * b };
    const c = randomInt(20, 99);
    const d = randomInt(10, 49);
    return { id, text: `${c} + ${d} = ?`, answer: c + d };
  }

  const mode = randomInt(1, 3);
  if (mode === 1) {
    const a = randomInt(12, 40);
    const b = randomInt(11, 35);
    return { id, text: `${a} × ${b} = ?`, answer: a * b };
  }
  if (mode === 2) {
    const denom = randomInt(2, 12);
    const num = denom * randomInt(2, 12);
    return { id, text: `${num} ÷ ${denom} = ?`, answer: num / denom };
  }
  const pctBase = randomInt(20, 200);
  const pct = [10, 20, 25, 50][randomInt(0, 3)];
  return { id, text: `${pct}% của ${pctBase} = ?`, answer: (pctBase * pct) / 100 };
}

export function QuickMathRushPage() {
  const navigate = useNavigate();
  const { state } = useAppData();
  const totalRounds = 12;

  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [idx, setIdx] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const rounds = useMemo(() => {
    return Array.from({ length: totalRounds }, (_, i) => buildRound(i + 1, state.student.grade));
  }, [state.student.grade]);

  const current = rounds[idx];

  useEffect(() => {
    if (!started || done) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [started, done]);

  const submit = () => {
    if (!started || done) return;
    const n = Number(answerText.replace(',', '.'));
    if (!Number.isFinite(n)) return;

    if (Math.abs(n - current.answer) < 0.0001) {
      setScore((s) => s + 1);
    }

    if (idx + 1 >= rounds.length) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setAnswerText('');
    }
  };

  const reset = () => {
    setStarted(false);
    setSeconds(0);
    setIdx(0);
    setAnswerText('');
    setScore(0);
    setDone(false);
  };

  const stars = done ? (score / totalRounds >= 0.9 ? 3 : score / totalRounds >= 0.6 ? 2 : 1) : 0;

  return (
    <div className="fade-in max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <button className="btn btn-secondary p-2" onClick={() => navigate('/mini-games')}>
          <ArrowLeft size={18} />
        </button>
        <MascotCharacter size="sm" />
        <div className="flex-1">
          <h1 className="text-xl font-extrabold flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
            <Zap size={20} /> Toán Siêu Tốc
          </h1>
          <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
            {getGradeLabel(state.student.grade)} · {totalRounds} câu
          </p>
        </div>
      </div>

      {!started ? (
        <div className="card text-center py-7">
          <div className="text-5xl mb-2">🚀</div>
          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--color-primary-dark)' }}>Toán Siêu Tốc</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>
            Trả lời nhanh 12 phép toán phù hợp với lớp của bé.
          </p>
          <button className="btn btn-primary mt-4" onClick={() => setStarted(true)}>Bắt đầu</button>
        </div>
      ) : done ? (
        <div className="card text-center py-7">
          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--color-primary-dark)' }}>Hoàn thành!</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>
            Đúng {score}/{totalRounds} · Thời gian {seconds}s
          </p>
          <div className="text-3xl mt-3">
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} style={{ opacity: i < stars ? 1 : 0.25 }}>⭐</span>
            ))}
          </div>
          <div className="flex gap-3 justify-center mt-5">
            <button className="btn btn-secondary" onClick={() => navigate('/mini-games')}>Quay lại</button>
            <button className="btn btn-primary" onClick={reset}><RotateCcw size={16} /> Chơi lại</button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold">Câu {idx + 1}/{totalRounds}</div>
            <div className="text-sm font-bold inline-flex items-center gap-1"><Timer size={14} /> {seconds}s</div>
          </div>

          <div className="text-center text-4xl font-black py-4" style={{ color: 'var(--color-primary-dark)' }}>
            {current.text}
          </div>

          <div className="flex gap-2 items-center justify-center">
            <input
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              className="premium-input px-3 py-2 w-44 text-center text-lg"
              placeholder="Nhập đáp án"
              autoFocus
            />
            <button className="btn btn-primary" onClick={submit}>Trả lời</button>
          </div>

          <div className="mt-4 text-xs text-center" style={{ color: 'var(--color-text-light)' }}>
            Mẹo: Gõ số rồi nhấn Enter để nhanh hơn.
          </div>
        </div>
      )}
    </div>
  );
}
