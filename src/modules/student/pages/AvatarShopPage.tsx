import { useState } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getXpData } from '../../../shared/utils/achievements';
import { ShoppingBag, Check, Lock, Sparkles } from 'lucide-react';
import { playClick, playCorrect, playWrong } from '../../../shared/utils/sounds';
import { useToast } from '../../../shared/components/Toast';
import { MascotCharacter } from '../../../shared/components';
import { STORAGE_KEYS } from '../../../shared/constants/storageKeys';

// ==================== SHOP ITEMS ====================
interface ShopItem {
  id: string;
  type: 'avatar' | 'title' | 'frame';
  emoji: string;
  name: string;
  description: string;
  xpCost: number;
  unlockLevel: number;
}

const SHOP_ITEMS: ShopItem[] = [
  // Avatars
  { id: 'av_cat', type: 'avatar', emoji: '🐱', name: 'Mèo con', description: 'Avatar mèo dễ thương', xpCost: 0, unlockLevel: 1 },
  { id: 'av_dog', type: 'avatar', emoji: '🐶', name: 'Cún con', description: 'Avatar chó đáng yêu', xpCost: 0, unlockLevel: 1 },
  { id: 'av_panda', type: 'avatar', emoji: '🐼', name: 'Gấu Panda', description: 'Avatar gấu trúc', xpCost: 50, unlockLevel: 2 },
  { id: 'av_lion', type: 'avatar', emoji: '🦁', name: 'Sư tử', description: 'Vua của muông thú', xpCost: 100, unlockLevel: 3 },
  { id: 'av_unicorn', type: 'avatar', emoji: '🦄', name: 'Kỳ lân', description: 'Sinh vật huyền bí', xpCost: 200, unlockLevel: 4 },
  { id: 'av_dragon', type: 'avatar', emoji: '🐉', name: 'Rồng', description: 'Rồng vàng quyền uy', xpCost: 300, unlockLevel: 5 },
  { id: 'av_robot', type: 'avatar', emoji: '🤖', name: 'Robot', description: 'Robot thông minh', xpCost: 150, unlockLevel: 3 },
  { id: 'av_alien', type: 'avatar', emoji: '👽', name: 'Người ngoài hành tinh', description: 'Bạn từ vũ trụ', xpCost: 250, unlockLevel: 5 },
  { id: 'av_ninja', type: 'avatar', emoji: '🥷', name: 'Ninja', description: 'Chiến binh bóng đêm', xpCost: 400, unlockLevel: 6 },
  { id: 'av_wizard', type: 'avatar', emoji: '🧙', name: 'Phù thuỷ', description: 'Phù thuỷ đại tài', xpCost: 500, unlockLevel: 7 },
  { id: 'av_astronaut', type: 'avatar', emoji: '🧑‍🚀', name: 'Phi hành gia', description: 'Khám phá không gian', xpCost: 800, unlockLevel: 8 },
  { id: 'av_crown', type: 'avatar', emoji: '👑', name: 'Vua/Nữ hoàng', description: 'Hoàng tộc học giỏi', xpCost: 1000, unlockLevel: 9 },

  // Titles
  { id: 'ti_star', type: 'title', emoji: '⭐', name: 'Ngôi sao lớp', description: 'Danh hiệu: Ngôi sao lớp', xpCost: 30, unlockLevel: 1 },
  { id: 'ti_smart', type: 'title', emoji: '🧠', name: 'Bé thông minh', description: 'Danh hiệu: Bé thông minh', xpCost: 80, unlockLevel: 2 },
  { id: 'ti_champ', type: 'title', emoji: '🏆', name: 'Nhà vô địch', description: 'Danh hiệu: Nhà vô địch', xpCost: 200, unlockLevel: 4 },
  { id: 'ti_legend', type: 'title', emoji: '🌟', name: 'Huyền thoại', description: 'Danh hiệu: Huyền thoại', xpCost: 500, unlockLevel: 7 },

  // Frames
  { id: 'fr_rainbow', type: 'frame', emoji: '🌈', name: 'Khung cầu vồng', description: 'Khung hồ sơ cầu vồng', xpCost: 60, unlockLevel: 2 },
  { id: 'fr_fire', type: 'frame', emoji: '🔥', name: 'Khung lửa', description: 'Khung hồ sơ rực lửa', xpCost: 150, unlockLevel: 4 },
  { id: 'fr_diamond', type: 'frame', emoji: '💎', name: 'Khung kim cương', description: 'Khung hồ sơ quý giá', xpCost: 350, unlockLevel: 6 },
  { id: 'fr_galaxy', type: 'frame', emoji: '🌌', name: 'Khung thiên hà', description: 'Khung hồ sơ vũ trụ', xpCost: 700, unlockLevel: 8 },
];

const LS_PURCHASED = STORAGE_KEYS.SHOP_PURCHASED;
const LS_EQUIPPED = STORAGE_KEYS.SHOP_EQUIPPED;

function loadPurchased(): string[] {
  try { return JSON.parse(localStorage.getItem(LS_PURCHASED) || '["av_cat","av_dog"]'); }
  catch { return ['av_cat', 'av_dog']; }
}
function loadEquipped(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(LS_EQUIPPED) || '{"avatar":"av_cat"}'); }
  catch { return { avatar: 'av_cat' }; }
}

export function AvatarShopPage() {
  const { state } = useAppData();
  const [totalXp, setTotalXp] = useState(() => parseInt(localStorage.getItem(STORAGE_KEYS.XP) || '0', 10) || 0);
  const [purchased, setPurchased] = useState<string[]>(loadPurchased);
  const [equipped, setEquipped] = useState<Record<string, string>>(loadEquipped);
  const [filter, setFilter] = useState<'all' | 'avatar' | 'title' | 'frame'>('all');
  const { showToast } = useToast();

  const xpData = getXpData(totalXp);

  const handleBuy = (item: ShopItem) => {
    if (purchased.includes(item.id)) {
      // Equip
      playClick();
      const key = item.type;
      const newEquipped = { ...equipped, [key]: item.id };
      setEquipped(newEquipped);
      localStorage.setItem(LS_EQUIPPED, JSON.stringify(newEquipped));

      // Also update student avatar if it's an avatar
      if (item.type === 'avatar') {
        // Store emoji as avatar identifier
        try { localStorage.setItem(STORAGE_KEYS.AVATAR_EMOJI, item.emoji); } catch { /* */ }
      }
      showToast(`Đã trang bị ${item.emoji} ${item.name}!`, 'success');
      return;
    }

    // Check XP & level
    if (xpData.level < item.unlockLevel) {
      playWrong();
      showToast(`Cần level ${item.unlockLevel} để mua!`, 'warning');
      return;
    }
    if (totalXp < item.xpCost) {
      playWrong();
      showToast(`Không đủ XP! Cần ${item.xpCost} XP`, 'warning');
      return;
    }

    // Purchase
    playCorrect();
    const newXp = totalXp - item.xpCost;
    setTotalXp(newXp);
    localStorage.setItem(STORAGE_KEYS.XP, String(newXp));

    const newPurchased = [...purchased, item.id];
    setPurchased(newPurchased);
    localStorage.setItem(LS_PURCHASED, JSON.stringify(newPurchased));

    showToast(`🎉 Đã mua ${item.emoji} ${item.name}!`, 'success');
  };

  const filtered = filter === 'all' ? SHOP_ITEMS : SHOP_ITEMS.filter((i) => i.type === filter);

  return (
    <div className="fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MascotCharacter size="sm" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            🛒 Cửa Hàng Avatar
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Đổi XP lấy avatar, danh hiệu và khung hồ sơ
          </p>
        </div>
      </div>

      {/* XP Balance + Profile preview */}
      <div className="card mb-6 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}>
        <div className="text-center">
          <div className="text-4xl mb-1">
            {SHOP_ITEMS.find((i) => i.id === equipped.avatar)?.emoji || '🐱'}
          </div>
          <div className="text-xs text-white/70">{state.student.fullName}</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-bold">{xpData.levelEmoji} Lv.{xpData.level} {xpData.levelTitle}</span>
          </div>
          {equipped.title && (
            <div className="text-xs text-white/80 mb-1">
              {SHOP_ITEMS.find((i) => i.id === equipped.title)?.emoji} {SHOP_ITEMS.find((i) => i.id === equipped.title)?.name}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-yellow-300" />
            <span className="text-lg font-bold text-yellow-300">{totalXp} XP</span>
            <span className="text-xs text-white/60">có thể chi tiêu</span>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {([
          { value: 'all' as const, label: '🏷️ Tất cả' },
          { value: 'avatar' as const, label: '😀 Avatar' },
          { value: 'title' as const, label: '🏅 Danh hiệu' },
          { value: 'frame' as const, label: '🖼️ Khung' },
        ]).map((tab) => (
          <button
            key={tab.value}
            className="chip-tab chip-tab-sm"
            data-active={filter === tab.value}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {filtered.map((item) => {
          const owned = purchased.includes(item.id);
          const isEquipped = equipped[item.type] === item.id;
          const canBuy = xpData.level >= item.unlockLevel && totalXp >= item.xpCost;
          const locked = xpData.level < item.unlockLevel;

          return (
            <button
              key={item.id}
              className="card flex flex-col items-center gap-2 p-4 text-center transition-all hover:scale-[1.02] cursor-pointer"
              style={{
                opacity: locked ? 0.4 : 1,
                border: isEquipped ? '3px solid var(--color-primary)' : '2px solid transparent',
                background: isEquipped ? 'var(--color-surface)' : 'var(--color-background-card)',
              }}
              onClick={() => handleBuy(item)}
            >
              <div className="text-4xl mb-1">{item.emoji}</div>
              <div className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{item.name}</div>
              <div className="text-[10px]" style={{ color: 'var(--color-text-light)' }}>{item.description}</div>

              {locked ? (
                <div className="flex items-center gap-1 text-xs mt-1" style={{ color: '#9CA3AF' }}>
                  <Lock size={12} /> Level {item.unlockLevel}
                </div>
              ) : owned ? (
                isEquipped ? (
                  <div className="flex items-center gap-1 text-xs mt-1 font-bold" style={{ color: 'var(--color-primary)' }}>
                    <Check size={12} /> Đang dùng
                  </div>
                ) : (
                  <div className="text-xs mt-1 font-bold" style={{ color: 'var(--color-success)' }}>
                    Nhấn để trang bị
                  </div>
                )
              ) : (
                <div className="flex items-center gap-1 text-xs mt-1 font-bold"
                  style={{ color: canBuy ? 'var(--color-star)' : '#D1D5DB' }}
                >
                  <ShoppingBag size={12} /> {item.xpCost} XP
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
