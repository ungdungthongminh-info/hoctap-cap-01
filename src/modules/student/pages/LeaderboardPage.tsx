import { useState, useMemo } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { Trophy, Medal, Star, TrendingUp, RefreshCw } from 'lucide-react';
import { playClick } from '../../../shared/utils/sounds';
import { MascotCharacter } from '../../../shared/components';

const FRIEND_NAMES = [
  'Minh Anh',
  'Bảo Ngọc',
  'Gia Bảo',
  'Thanh Trúc',
  'Đức Huy',
  'Phương Linh',
  'Tuấn Kiệt',
  'Hà My',
  'Quốc Đạt',
  'Thùy Dương',
];

interface Player {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  lessons: number;
  streak: number;
  isMe: boolean;
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function LeaderboardPage() {
  const { state, getCompletedCount, getAverageScore, getStreak } = useAppData();
  const [seed, setSeed] = useState(0);

  const players: Player[] = useMemo(() => {
    const me: Player = {
      rank: 0,
      name: state.student.fullName,
      avatar: '🧒',
      score: getAverageScore(),
      lessons: getCompletedCount(),
      streak: getStreak(),
      isMe: true,
    };

    const friends: Player[] = FRIEND_NAMES.map((name, i) => ({
      rank: 0,
      name,
      avatar: ['👦', '👧', '🧒', '👶', '🧑'][i % 5],
      score: randomBetween(40, 100),
      lessons: randomBetween(1, 30),
      streak: randomBetween(0, 10),
      isMe: false,
    }));

    return [me, ...friends]
      .sort((a, b) => b.score - a.score || b.lessons - a.lessons)
      .map((p, i) => ({ ...p, rank: i + 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, state.progress]);

  const myRank = players.find((p) => p.isMe)?.rank ?? 0;
  const podium = players.slice(0, 3);
  const rest = players.slice(3);
  const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const rankEmoji = ['🥇', '🥈', '🥉'];

  return (
    <div className="subpage-shell subpage-shell--compact fade-in max-w-4xl mx-auto">
      <div className="subpage-hero subpage-hero--leaderboard">
        <div className="subpage-hero__avatar"><MascotCharacter size="sm" /></div>
        <div className="subpage-hero__content">
          <div className="subpage-hero__eyebrow">Thi đua</div>
          <h1 className="subpage-hero__title" style={{ color: 'var(--color-primary-dark)' }}>
            🏆 Bảng xếp hạng
          </h1>
          <p className="subpage-hero__subtitle" style={{ color: 'var(--color-text-light)' }}>
            Thi đua cùng bạn bè nào!
          </p>
        </div>
        <div className="subpage-hero__meta">
          <span className="subpage-hero__pill">#{myRank}</span>
          <button
            onClick={() => {
              playClick();
              setSeed((s) => s + 1);
            }}
            className="leaderboard-refresh-btn"
            title="Cập nhật bảng xếp hạng"
          >
            <RefreshCw size={14} /> Cập nhật
          </button>
        </div>
      </div>

      <div className="leaderboard-rank-card">
        <p className="text-sm opacity-80">Hạng của bé</p>
        <p className="text-4xl font-bold my-1">#{myRank}</p>
        <p className="text-sm opacity-80">trong {players.length} bạn</p>
      </div>

      <div className="leaderboard-podium-grid">
        {[1, 0, 2].map((idx) => {
          const p = podium[idx];
          if (!p) return null;
          const isCenter = idx === 0;

          return (
            <div
              key={p.name}
              className={`leaderboard-podium-card ${p.isMe ? 'leaderboard-podium-card--me' : ''} ${isCenter ? 'leaderboard-podium-card--top' : ''}`}
            >
              <div className="text-3xl mb-1">{rankEmoji[p.rank - 1]}</div>
              <div className="text-2xl">{p.avatar}</div>
              <p className="font-bold text-sm mt-1 truncate" style={p.isMe ? { color: 'var(--color-primary)' } : {}}>
                {p.name} {p.isMe && '(Bé)'}
              </p>
              <div
                className="text-lg font-bold mt-1"
                style={{ color: rankColors[p.rank - 1] }}
              >
                {p.score}đ
              </div>
              <p className="text-xs opacity-60">{p.lessons} bài</p>
            </div>
          );
        })}
      </div>

      <div className="leaderboard-row-list">
        {rest.map((p) => (
          <div
            key={p.name}
            className={`leaderboard-row-card ${p.isMe ? 'leaderboard-row-card--me' : ''}`}
          >
            <div className="leaderboard-row-rank">#{p.rank}</div>
            <div className="leaderboard-row-player">
              <span className="text-2xl">{p.avatar}</span>
              <div className="leaderboard-row-player-meta">
                <div className="font-bold truncate" style={p.isMe ? { color: 'var(--color-primary-dark)' } : { color: 'var(--color-text)' }}>
                  {p.name} {p.isMe && <Trophy size={12} className="inline text-yellow-500" />}
                </div>
                <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {p.isMe ? 'Thành tích của bé' : 'Bạn cùng thi đua'}
                </div>
              </div>
            </div>
            <div className="leaderboard-row-stats">
              <span><Star size={14} /> {p.score}đ</span>
              <span><Medal size={14} /> {p.lessons} bài</span>
              <span><TrendingUp size={14} /> {p.streak}🔥</span>
            </div>
          </div>
        ))}
      </div>

      <p className="leaderboard-footnote">
        💡 Điểm trung bình và số bài hoàn thành sẽ quyết định thứ hạng!
      </p>
    </div>
  );
}
