import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../themes';
import { getAccessPlan } from '../services/accessControl';
import {
  Home,
  BookOpen,
  BarChart3,
  Users,
  Database,
  Palette,
  PenTool,
  Wifi,
  WifiOff,
  GraduationCap,
  Medal,
  Trophy,
  Gamepad2,
  CalendarDays,
  Brush,
  Star,
  Volume2,
  Sparkles,
  Brain,
  Lightbulb,
  ShoppingBag,
  Swords,
  Smartphone,
  ChevronDown,
  RefreshCw,
  UserCircle,
  Crown,
  TrendingUp,
  BookMarked,
  type LucideIcon,
} from 'lucide-react';
import { useAppData } from '../providers/AppDataProvider';
import { getGradeLabel, getSubjectByCode } from '../../data/subjects';
import { MascotCharacter } from './MascotCharacter';
import { isAdminUnlocked } from '../utils/adminAccess';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

interface NavGroup {
  id: string;
  label: string;
  emoji: string;
  items: NavItem[];
}

// Top-level items (always visible)
const topItems: NavItem[] = [
  { to: '/home', icon: Home, label: 'Trang chủ' },
  { to: '/pricing', icon: Crown, label: 'Cài đặt & Gói' },
];

// Grouped items (collapsible)
const navGroups: NavGroup[] = [
  {
    id: 'learn',
    label: 'Học tập',
    emoji: '📚',
    items: [
      { to: '/subjects', icon: GraduationCap, label: 'Môn học' },
      { to: '/lessons', icon: BookOpen, label: 'Bài học' },
      { to: '/quiz', icon: PenTool, label: 'Luyện tập' },
      { to: '/memory', icon: Brain, label: 'Phòng trí nhớ' },
      { to: '/smart-review', icon: RefreshCw, label: 'Ôn tập thông minh' },
      { to: '/learning-assistant', icon: Lightbulb, label: 'Trợ lý học tập' },
      { to: '/curriculum', icon: BookMarked, label: 'Giáo trình' },
    ],
  },
  {
    id: 'play',
    label: 'Vui chơi',
    emoji: '🎮',
    items: [
      { to: '/daily', icon: CalendarDays, label: 'Thử thách' },
      { to: '/mini-games', icon: Gamepad2, label: 'Mini-Game' },
      { to: '/drawing', icon: Brush, label: 'Vẽ & Tô màu' },
      { to: '/competition', icon: Swords, label: 'Thi đấu' },
    ],
  },
  {
    id: 'reward',
    label: 'Thành tích',
    emoji: '🏆',
    items: [
      { to: '/progress', icon: BarChart3, label: 'Tiến bộ' },
      { to: '/analytics', icon: TrendingUp, label: 'Phân tích' },
      { to: '/badges', icon: Medal, label: 'Huy hiệu' },
      { to: '/leaderboard', icon: Trophy, label: 'Bảng xếp hạng' },
      { to: '/achievements', icon: Star, label: 'Thành tựu' },
      { to: '/avatar-shop', icon: ShoppingBag, label: 'Cửa hàng' },
    ],
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    emoji: '⚙️',
    items: [
      { to: '/tts-settings', icon: Volume2, label: 'Giọng đọc' },
      { to: '/ai-settings', icon: Sparkles, label: 'Cài đặt AI' },
      { to: '/pwa', icon: Smartphone, label: 'Ngoại tuyến' },
      { to: '/themes', icon: Palette, label: 'Giao diện' },
      { to: '/parent', icon: Users, label: 'Phụ huynh' },
      { to: '/data', icon: Database, label: 'Dữ liệu' },
      { to: '/profiles', icon: UserCircle, label: 'Hồ sơ học sinh' },
      { to: '/pricing', icon: Crown, label: 'Gói dịch vụ' },
      { to: '/admin', icon: Database, label: 'Quản trị' },
    ],
  },
];

// Helper: check if current path is in a group
function groupContainsPath(group: NavGroup, path: string): boolean {
  return group.items.some((item) => item.to === path || (item.to !== '/' && path.startsWith(item.to)));
}

export function Sidebar() {
  const { theme } = useTheme();
  const { state } = useAppData();
  const location = useLocation();
  const [online, setOnline] = useState(navigator.onLine);
  const [isMobileNav, setIsMobileNav] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  );
  const [currentPlan, setCurrentPlan] = useState(() => getAccessPlan());
  const canSeeAdmin = isAdminUnlocked();
  const subject = getSubjectByCode(state.student.subjectCode);

  // Auto-open group that contains active route
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const g of navGroups) {
      if (groupContainsPath(g, location.pathname)) initial.add(g.id);
    }
    return initial;
  });

  // Update open groups when route changes
  useEffect(() => {
    for (const g of navGroups) {
      if (groupContainsPath(g, location.pathname)) {
        setOpenGroups((prev) => {
          if (prev.has(g.id)) return prev;
          return new Set(prev).add(g.id);
        });
      }
    }
  }, [location.pathname]);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 768px)');
    const onChange = (event: MediaQueryListEvent) => setIsMobileNav(event.matches);
    setIsMobileNav(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const syncPlan = () => setCurrentPlan(getAccessPlan());
    window.addEventListener('focus', syncPlan);
    window.addEventListener('storage', syncPlan);
    return () => {
      window.removeEventListener('focus', syncPlan);
      window.removeEventListener('storage', syncPlan);
    };
  }, []);

  return (
    <aside className="app-sidebar">
      {/* Logo + Mascot */}
      <div className="flex flex-col items-center gap-2 pb-4 mb-4 border-b border-gray-100">
        <MascotCharacter size="sm" />
        <div className="text-center">
          <div className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            Học Hứng Khởi
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
            Cùng {theme.mascotName} học nào!
          </div>
        </div>
        {/* Offline indicator */}
        <div className="flex items-center gap-1 text-xs" style={{ color: online ? 'var(--color-success)' : '#D97706' }}>
          {online ? <Wifi size={12} /> : <WifiOff size={12} />}
          <span>{online ? 'Trực tuyến' : 'Ngoại tuyến'}</span>
        </div>
        {/* Grade + Subject context */}
        <div className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
          <GraduationCap size={12} />
          <span>{getGradeLabel(state.student.grade)} · {subject?.emoji} {subject?.name || 'Toán'}</span>
        </div>
        <NavLink
          to="/pricing"
          className="w-full mt-2 rounded-xl px-3 py-2 text-xs border"
          style={{
            background: currentPlan === 'free' ? '#EFF6FF' : '#ECFDF5',
            borderColor: currentPlan === 'free' ? '#BFDBFE' : '#A7F3D0',
            color: currentPlan === 'free' ? '#1D4ED8' : '#065F46',
          }}
        >
          <div className="font-bold">{currentPlan === 'free' ? 'Gói Free mặc định' : `Đang dùng gói ${currentPlan === 'standard' ? 'Standard' : 'Premium'}`}</div>
          <div className="mt-1" style={{ opacity: 0.9 }}>
            {currentPlan === 'free'
              ? 'Mở mục Gói dịch vụ để xem gói và nhập key kích hoạt.'
              : 'Key đã kích hoạt. Có thể gia hạn hoặc đổi gói trong trang gói dịch vụ.'}
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {/* Top items (Trang chủ) */}
        {topItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            data-group="top"
            className={({ isActive }) => `nav-item nav-item-top ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Grouped sections */}
        {navGroups.map((group) => {
          const isOpen = openGroups.has(group.id);
          const hasActive = groupContainsPath(group, location.pathname);
          return (
            <div key={group.id} className={`nav-group nav-group-${group.id}`}>
              <button
                className={`nav-group-header ${hasActive && !isOpen ? 'has-active' : ''}`}
                onClick={() => toggleGroup(group.id)}
              >
                <span className="nav-group-emoji">{group.emoji}</span>
                <span className="nav-group-label">{group.label}</span>
                <ChevronDown
                  size={14}
                  className={`nav-group-chevron ${isOpen ? 'open' : ''}`}
                />
              </button>
              {(isOpen || isMobileNav) && (
                <div className="nav-group-items">
                  {group.items
                    .filter((item) => item.to !== '/admin' || canSeeAdmin)
                    .map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      data-group={group.id}
                      className={({ isActive }) => `nav-item nav-item-child ${isActive ? 'active' : ''}`}
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Mascot ở dưới sidebar */}
      <div className="flex flex-col items-center pt-4 mt-auto border-t border-gray-100">
        <MascotCharacter size="lg" />
        <span className="text-xs font-bold mt-1" style={{ color: 'var(--color-primary)' }}>
          {theme.mascotName}
        </span>
      </div>
    </aside>
  );
}
