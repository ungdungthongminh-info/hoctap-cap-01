import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, ArrowRight, Sparkles, Zap, Brain, Shapes } from 'lucide-react';
import { MascotCharacter } from '../../../shared/components';
import { useAppData } from '../../../shared/providers/AppDataProvider';

interface GameInfo {
  id: string;
  path: string;
  emoji: string;
  title: string;
  desc: string;
  tag: 'toan' | 'ngon-ngu' | 'tri-nho' | 'tong-hop';
  level: 'de' | 'vua' | 'kho';
  color: string;
  gradient: string;
}

const gamesBase: GameInfo[] = [
  {
    id: 'match',
    path: '/match-game',
    emoji: '🃏',
    title: 'Ghép Cặp',
    desc: 'Lật thẻ tìm cặp câu hỏi + đáp án đúng!',
    tag: 'tri-nho',
    level: 'de',
    color: '#0984E3',
    gradient: 'linear-gradient(135deg, #74B9FF, #0984E3)',
  },
  {
    id: 'scramble',
    path: '/mini/word-scramble',
    emoji: '🔤',
    title: 'Xếp Chữ',
    desc: 'Sắp xếp lại các chữ cái để tạo từ đúng!',
    tag: 'ngon-ngu',
    level: 'vua',
    color: '#6C5CE7',
    gradient: 'linear-gradient(135deg, #A29BFE, #6C5CE7)',
  },
  {
    id: 'speed',
    path: '/mini/speed-quiz',
    emoji: '⚡',
    title: 'Tốc Độ',
    desc: 'Trả lời nhanh nhất có thể trước khi hết giờ!',
    tag: 'tong-hop',
    level: 'kho',
    color: '#E17055',
    gradient: 'linear-gradient(135deg, #FAB1A0, #E17055)',
  },
  {
    id: 'truefalse',
    path: '/mini/true-false',
    emoji: '✅',
    title: 'Đúng hay Sai',
    desc: 'Phán đoán câu nào đúng, câu nào sai!',
    tag: 'tong-hop',
    level: 'de',
    color: '#00B894',
    gradient: 'linear-gradient(135deg, #55EFC4, #00B894)',
  },
  {
    id: 'fillblank',
    path: '/mini/fill-blank',
    emoji: '✏️',
    title: 'Điền Từ',
    desc: 'Điền từ còn thiếu vào chỗ trống!',
    tag: 'ngon-ngu',
    level: 'vua',
    color: '#FDCB6E',
    gradient: 'linear-gradient(135deg, #FFEAA7, #FDCB6E)',
  },
  {
    id: 'quickmath',
    path: '/mini/quick-math',
    emoji: '🚀',
    title: 'Toán Siêu Tốc',
    desc: 'Giải nhanh phép toán theo cấp lớp trong thời gian ngắn!',
    tag: 'toan',
    level: 'vua',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #FB7185, #EF4444)',
  },
];

export function MiniGameHubPage() {
  const navigate = useNavigate();
  const { state } = useAppData();
  const [activeTag, setActiveTag] = useState<'all' | GameInfo['tag']>('all');

  const games = useMemo(() => {
    const list = [...gamesBase];
    if (state.student.grade === 0) {
      list.unshift({
        id: 'pregrade-pack',
        path: '/mini/pre-grade',
        emoji: '🌱',
        title: 'Vui Học Tiền Tiểu Học',
        desc: 'Ghép chữ, đếm nhanh, tô nét cho bé lớp Lá.',
        tag: 'tong-hop',
        level: 'de',
        color: '#059669',
        gradient: 'linear-gradient(135deg, #86EFAC, #10B981)',
      });
    }
    return list;
  }, [state.student.grade]);

  const shownGames = useMemo(() => {
    if (activeTag === 'all') return games;
    return games.filter((g) => g.tag === activeTag);
  }, [activeTag, games]);

  const tagMeta = {
    all: { label: 'Tất cả', icon: Sparkles },
    toan: { label: 'Toán', icon: Zap },
    'ngon-ngu': { label: 'Ngôn ngữ', icon: Brain },
    'tri-nho': { label: 'Trí nhớ', icon: Shapes },
    'tong-hop': { label: 'Tổng hợp', icon: Gamepad2 },
  } as const;

  const levelLabel: Record<GameInfo['level'], string> = {
    de: 'Dễ',
    vua: 'Vừa',
    kho: 'Khó',
  };

  return (
    <div className="fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div
        className="rounded-3xl p-4 md:p-6 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#FDE68A,#FCA5A5 45%,#93C5FD)' }}
      >
        <div className="flex items-center gap-3 relative z-10">
          <MascotCharacter size="md" />
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2" style={{ color: '#111827' }}>
              <Gamepad2 size={30} /> Vương Quốc Mini-Game
            </h1>
            <p className="text-sm md:text-base mt-1" style={{ color: '#374151' }}>
              Chọn trò chơi bé thích nhất và săn thật nhiều sao nhé!
            </p>
          </div>
        </div>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/40" />
        <div className="absolute -bottom-7 left-8 w-28 h-28 rounded-full bg-white/30" />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(Object.keys(tagMeta) as Array<keyof typeof tagMeta>).map((k) => {
          const Icon = tagMeta[k].icon;
          const active = activeTag === k;
          return (
            <button
              key={k}
              onClick={() => setActiveTag(k as 'all' | GameInfo['tag'])}
              className="px-3 py-2 rounded-full text-sm font-bold inline-flex items-center gap-1 transition-all"
              style={{
                background: active ? '#111827' : '#F3F4F6',
                color: active ? '#fff' : '#111827',
              }}
            >
              <Icon size={14} /> {tagMeta[k].label}
            </button>
          );
        })}
      </div>

      {/* Game cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shownGames.map((game, i) => (
          <button
            key={game.id}
            onClick={() => navigate(game.path)}
            className="group relative overflow-hidden rounded-3xl text-left p-0 border-none shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
            style={{
              background: game.gradient,
              animationDelay: `${i * 70}ms`,
            }}
          >
            <div className="p-5 flex flex-col gap-3 relative z-10 min-h-[190px]">
              <div className="flex items-center justify-between">
                <span className="text-4xl drop-shadow-sm">{game.emoji}</span>
                <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-white/40 transition-colors">
                  <ArrowRight size={18} />
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white leading-tight">{game.title}</h3>
                <p className="text-xs text-white/90 mt-1 leading-relaxed">{game.desc}</p>
              </div>
              <div className="mt-auto inline-flex items-center gap-2">
                <span className="text-[11px] px-2 py-1 rounded-full font-bold bg-white/20 text-white">{tagMeta[game.tag].label}</span>
                <span className="text-[11px] px-2 py-1 rounded-full font-bold bg-white/20 text-white">{levelLabel[game.level]}</span>
              </div>
            </div>

            <div className="absolute -top-7 -right-7 w-24 h-24 rounded-full opacity-25 bg-white" />
            <div className="absolute -bottom-5 -left-4 w-16 h-16 rounded-full opacity-20 bg-white" />
          </button>
        ))}
      </div>

      {shownGames.length === 0 && (
        <div className="text-center text-sm mt-6" style={{ color: 'var(--color-text-light)' }}>
          Chưa có game trong nhóm này, bé thử chọn nhóm khác nhé.
        </div>
      )}
    </div>
  );
}
