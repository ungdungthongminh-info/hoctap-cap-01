import { useState, useMemo } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { Trophy, Medal, Star, TrendingUp, RefreshCw } from 'lucide-react';
import { playClick } from '../../../shared/utils/sounds';
import { MascotCharacter } from '../../../shared/components';

/* Tên giả lập bạn bè */
const FRIEND_NAMES = [
  'Minh Anh', 'Bảo Ngọc', 'Gia Bảo', 'Thanh Trúc',
  'Đức Huy', 'Phương Linh', 'Tuấn Kiệt', 'Hà My',
  'Quốc Đạt', 'Thùy Dương',
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
      avatar: ['👦', '👧', '🧒', '👶', '🧒'][i % 5],
      score: randomBetween(40, 100),
      lessons: randomBetween(1, 30),
      streak: randomBetween(0, 10),
      isMe: false,
    }));

    const all = [me, ...friends]
      .sort((a, b) => b.score - a.score || b.lessons - a.lessons)
      .map((p, i) => ({ ...p, rank: i + 1 }));

    return all;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, state.progress]);

  const myRank = players.find((p) => p.isMe)?.rank ?? 0;

  const podium = players.slice(0, 3);
  const rest = players.slice(3);

  const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // gold, silver, bronze
  const rankEmoji = ['🥇', '🥈', '🥉'];

  return (
    <div className="fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MascotCharacter size="sm" />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
              🏆 Bảng xếp hạng
            </h1>
            <p className="text-sm opacity-70">Thi đua cùng bạn bè nào!</p>
          </div>
        </div>
        <button
          onClick={() => { playClick(); setSeed((s) => s + 1); }}
          className="btn-secondary flex items-center gap-1 text-sm"
          title="Cập nhật bảng xếp hạng"
        >
          <RefreshCw size={14} /> Cập nhật
        </button>
      </div>

      {/* My rank banner */}
      <div className="card mb-6 text-center" style={{ background: 'var(--color-primary)', color: 'white' }}>
        <p className="text-sm opacity-80">Hạng của bé</p>
        <p className="text-4xl font-bold my-1">#{myRank}</p>
        <p className="text-sm opacity-80">trong {players.length} bạn</p>
      </div>

      {/* Podium top 3 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[1, 0, 2].map((idx) => {
          const p = podium[idx];
          if (!p) return null;
          const isCenter = idx === 0;
          return (
            <div
              key={p.name}
              className={`card text-center transition-transform ${p.isMe ? 'ring-2 ring-yellow-400' : ''} ${isCenter ? 'scale-105' : ''}`}
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

      {/* Rest of leaderboard */}
      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left opacity-60 border-b">
              <th className="pb-2 w-12">#</th>
              <th className="pb-2">Tên</th>
              <th className="pb-2 text-center"><Star size={14} className="inline" /> Điểm</th>
              <th className="pb-2 text-center"><Medal size={14} className="inline" /> Bài</th>
              <th className="pb-2 text-center"><TrendingUp size={14} className="inline" /> Streak</th>
            </tr>
          </thead>
          <tbody>
            {rest.map((p) => (
              <tr
                key={p.name}
                className={`border-b last:border-0 ${p.isMe ? 'font-bold' : ''}`}
                style={p.isMe ? { background: 'var(--color-accent)', color: 'var(--color-primary-dark)' } : {}}
              >
                <td className="py-2">{p.rank}</td>
                <td className="py-2">
                  <span className="mr-1">{p.avatar}</span>
                  {p.name} {p.isMe && <Trophy size={12} className="inline text-yellow-500" />}
                </td>
                <td className="py-2 text-center font-medium">{p.score}</td>
                <td className="py-2 text-center">{p.lessons}</td>
                <td className="py-2 text-center">{p.streak}🔥</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-center mt-4 opacity-50">
        💡 Điểm trung bình và số bài hoàn thành sẽ quyết định thứ hạng!
      </p>
    </div>
  );
}
