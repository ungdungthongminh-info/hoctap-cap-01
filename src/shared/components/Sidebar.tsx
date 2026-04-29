import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../themes';
import { getAccessPlan, getUnlockedGrades } from '../services/accessControl';
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
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useAppData } from '../providers/AppDataProvider';
import { getGradeLabel, getSubjectByCode, getSubjectsForGrade } from '../../data/subjects';
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

const primaryItems: NavItem[] = [
  { to: '/home', icon: Home, label: 'Trang chủ' },
  { to: '/subjects', icon: GraduationCap, label: 'Môn học' },
  { to: '/lessons', icon: BookOpen, label: 'Bài học' },
  { to: '/quiz', icon: PenTool, label: 'Luyện tập' },
  { to: '/mini-games', icon: Gamepad2, label: 'Mini-Game' },
  { to: '/progress', icon: BarChart3, label: 'Tiến bộ' },
  { to: '/achievements', icon: Star, label: 'Thành tựu' },
];

const primaryRoutes = new Set(primaryItems.map((item) => item.to));

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
      { to: '/pwa', icon: Smartphone, label: 'Ngoại tuyến & cập nhật' },
      { to: '/themes', icon: Palette, label: 'Giao diện' },
      { to: '/parent', icon: Users, label: 'Phụ huynh' },
      { to: '/data', icon: Database, label: 'Dữ liệu' },
      { to: '/profiles', icon: UserCircle, label: 'Hồ sơ học sinh' },
      { to: '/pricing', icon: Crown, label: 'Gói dịch vụ' },
      { to: '/admin', icon: Database, label: 'Quản trị' },
    ],
  },
];

function groupContainsPath(group: NavGroup, path: string): boolean {
  return group.items.some((item) => item.to === path || (item.to !== '/' && path.startsWith(item.to)));
}

export function Sidebar() {
  const { theme } = useTheme();
  const { state, updateStudent } = useAppData();
  const location = useLocation();
  const [online, setOnline] = useState(navigator.onLine);
  const [isMobileNav, setIsMobileNav] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(() => getAccessPlan());
  const canSeeAdmin = isAdminUnlocked();
  const subject = getSubjectByCode(state.student.subjectCode);
  const unlockedGrades = getUnlockedGrades(state.student.grade, currentPlan);
  const gradeSubjects = getSubjectsForGrade(state.student.grade);
  const readySubjects = gradeSubjects.filter((s) =>
    state.lessons.some((l) => l.grade === state.student.grade && l.subjectCode === s.code),
  );

  const lessonCountByGrade = (g: number) => state.lessons.filter((l) => l.grade === g).length;

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const g of navGroups) {
      if (groupContainsPath(g, location.pathname)) initial.add(g.id);
    }
    return initial;
  });

  const visibleGroups = useMemo(() => navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      !primaryRoutes.has(item.to) && (item.to !== '/admin' || canSeeAdmin),
    ),
  })).filter((group) => group.items.length > 0), [canSeeAdmin]);

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

  const handleGradeChange = (value: string) => {
    const nextGrade = Number(value);
    if (!Number.isFinite(nextGrade)) return;

    const subjectsOfGrade = getSubjectsForGrade(nextGrade);
    const firstReadySubject = subjectsOfGrade.find((s) =>
      state.lessons.some((l) => l.grade === nextGrade && l.subjectCode === s.code),
    );

    updateStudent({
      grade: nextGrade,
      subjectCode: firstReadySubject?.code || subjectsOfGrade[0]?.code || 'math',
    });
  };

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 768px)');
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobileNav(event.matches);
      if (!event.matches) {
        setIsMobileMenuOpen(false);
      }
    };
    setIsMobileNav(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (isMobileNav) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileNav, location.pathname]);

  useEffect(() => {
    const syncPlan = () => setCurrentPlan(getAccessPlan());
    window.addEventListener('focus', syncPlan);
    window.addEventListener('storage', syncPlan);
    return () => {
      window.removeEventListener('focus', syncPlan);
      window.removeEventListener('storage', syncPlan);
    };
  }, []);

  useEffect(() => {
    if (isMobileNav && isMobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isMobileNav, isMobileMenuOpen]);

  useEffect(() => {
    const shouldHideChatLauncher = isMobileNav && isMobileMenuOpen;
    document.body.classList.toggle('sidebar-menu-open', shouldHideChatLauncher);
    return () => {
      document.body.classList.remove('sidebar-menu-open');
    };
  }, [isMobileNav, isMobileMenuOpen]);

  const handleNavItemClick = () => {
    if (isMobileNav) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {isMobileNav && isMobileMenuOpen && (
        <button
          type="button"
          className="sidebar-mobile-backdrop"
          aria-label="Đóng menu điều hướng"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={`app-sidebar ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`}>
      <button
        type="button"
        className="sidebar-mobile-toggle"
        aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
        aria-expanded={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
      >
        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        <span>{isMobileMenuOpen ? 'Đóng menu' : 'Menu'}</span>
      </button>
      <div className="sidebar-brand-card">
        <div className="sidebar-brand-main">
          <MascotCharacter size="sm" />
          <div>
            <div className="sidebar-brand-title">Học Hứng Khởi</div>
            <div className="sidebar-brand-subtitle">Cùng {theme.mascotName} học nào!</div>
          </div>
        </div>

        <div className="sidebar-status-row">
          <span className="sidebar-status-chip" data-online={online}>
            {online ? <Wifi size={12} /> : <WifiOff size={12} />}
            {online ? 'Trực tuyến' : 'Ngoại tuyến'}
          </span>
          <NavLink to="/pricing" className="sidebar-plan-chip">
            <Crown size={12} />
            {currentPlan === 'free' ? 'Free' : currentPlan === 'standard' ? 'Standard' : 'Premium'}
          </NavLink>
        </div>

        <div className="sidebar-study-context">
          <label>
            <span>Lớp hiện tại</span>
            <select value={state.student.grade} onChange={(event) => handleGradeChange(event.target.value)}>
              {[0, 1, 2, 3, 4, 5].map((g) => {
                const gradeReady = lessonCountByGrade(g) > 0;
                const unlocked = unlockedGrades.includes(g);
                return (
                  <option key={g} value={g} disabled={!gradeReady || !unlocked}>
                    {getGradeLabel(g)}
                  </option>
                );
              })}
            </select>
          </label>
          <label>
            <span>Môn đang học</span>
            <select
              value={state.student.subjectCode}
              onChange={(event) => updateStudent({ subjectCode: event.target.value })}
            >
              {(readySubjects.length > 0 ? readySubjects : gradeSubjects).map((s) => (
                <option key={s.code} value={s.code}>
                  {s.emoji} {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-primary-nav">
          {primaryItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/home'}
              data-group="primary"
              onClick={handleNavItemClick}
              className={({ isActive }) => `nav-item nav-item-primary ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="sidebar-secondary-nav">
          {visibleGroups.map((group) => {
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
                  <ChevronDown size={14} className={`nav-group-chevron ${isOpen ? 'open' : ''}`} />
                </button>
                {(isOpen || isMobileNav) && (
                  <div className="nav-group-items">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        data-group={group.id}
                        onClick={handleNavItemClick}
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
        </div>
      </nav>

      <NavLink to="/profiles" className="sidebar-profile-card">
        <UserCircle size={34} />
        <span>
          <strong>{state.student.fullName}</strong>
          <small>{getGradeLabel(state.student.grade)} · {subject?.name || 'Toán'}</small>
        </span>
        <ChevronDown size={14} />
      </NavLink>
      </aside>
    </>
  );
}
