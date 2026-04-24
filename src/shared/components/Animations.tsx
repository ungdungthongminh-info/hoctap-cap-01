/**
 * Confetti — component hiệu ứng pháo giấy khi hoàn thành bài/đạt thành tích
 * Pure CSS animations, no external dependencies
 */
import { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number; // ms, default 3000
  count?: number; // number of pieces, default 40
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA', '#F97316', '#38BDF8', '#34D399', '#FB7185', '#FBBF24', '#818CF8'];
const SHAPES = ['circle', 'square', 'triangle'];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export function Confetti({ active, duration = 3000, count = 40 }: ConfettiProps) {
  const [pieces, setPieces] = useState<Array<{
    id: number; left: number; color: string; shape: string;
    delay: number; size: number; rotation: number; drift: number;
  }>>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) { setShow(false); return; }
    const newPieces = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: randomBetween(2, 98),
      color: COLORS[i % COLORS.length],
      shape: SHAPES[i % SHAPES.length],
      delay: randomBetween(0, 500),
      size: randomBetween(6, 12),
      rotation: randomBetween(0, 360),
      drift: randomBetween(-30, 30),
    }));
    setPieces(newPieces);
    setShow(true);
    const timer = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(timer);
  }, [active, count, duration]);

  if (!show || pieces.length === 0) return null;

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className={`confetti-piece confetti-${p.shape}`}
          style={{
            left: `${p.left}%`,
            '--confetti-color': p.color,
            '--confetti-size': `${p.size}px`,
            '--confetti-delay': `${p.delay}ms`,
            '--confetti-rotation': `${p.rotation}deg`,
            '--confetti-drift': `${p.drift}px`,
            '--confetti-duration': `${duration}ms`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/**
 * LevelUpBanner — hiệu ứng khi lên level
 */
interface LevelUpProps {
  show: boolean;
  level: number;
  title: string;
  emoji: string;
  onClose: () => void;
}

export function LevelUpBanner({ show, level, title, emoji, onClose }: LevelUpProps) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, 4000);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="level-up-overlay" onClick={onClose}>
      <div className="level-up-card">
        <Confetti active={true} count={60} duration={4000} />
        <div className="level-up-emoji">{emoji}</div>
        <div className="level-up-title">🎉 Lên Level!</div>
        <div className="level-up-level">Level {level}</div>
        <div className="level-up-subtitle">{title}</div>
      </div>
    </div>
  );
}

/**
 * StarBurst — hiệu ứng ngôi sao bay ra khi đáp đúng
 */
export function StarBurst({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="star-burst" aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <span key={i} className="star-burst-item" style={{
          '--star-angle': `${i * 60}deg`,
          '--star-delay': `${i * 50}ms`,
        } as React.CSSProperties}>⭐</span>
      ))}
    </div>
  );
}

/**
 * MascotReaction — mascot phản ứng cảm xúc
 */
export function MascotReaction({ type, emoji }: { type: 'happy' | 'sad' | 'cheer' | 'think'; emoji: string }) {
  const animations: Record<string, string> = {
    happy: 'mascot-bounce-anim',
    sad: 'mascot-sad-anim',
    cheer: 'mascot-cheer-anim',
    think: 'mascot-think-anim',
  };
  return (
    <div className={`mascot-reaction ${animations[type]}`}>
      <span className="text-5xl">{emoji}</span>
      {type === 'cheer' && <span className="mascot-sparkle">✨</span>}
    </div>
  );
}
