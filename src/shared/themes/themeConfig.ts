/* ============================================
   HOC HUNG KHOI - THEME SYSTEM
   ============================================ */

export interface ThemeConfig {
  id: string;
  name: string;
  emoji: string;
  mascotName: string;
  mascotAvatarSrc?: string;
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundCard: string;
    surface: string;
    text: string;
    textLight: string;
    success: string;
    error: string;
    warning: string;
    star: string;
  };
  gradientBg: string;
  patternClass: string;
}

function resolvePublicAssetUrl(relativePath: string): string {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${relativePath.replace(/^\/+/, '')}`;
}

const oceanTheme: ThemeConfig = {
  id: 'ocean',
  name: 'Đại Dương Xanh',
  emoji: '🐬',
  mascotName: 'Dopi',
  mascotAvatarSrc: resolvePublicAssetUrl('mascots/dopi-avatar.png'),
  colors: {
    primary: '#0EA5E9',
    primaryLight: '#7DD3FC',
    primaryDark: '#0369A1',
    secondary: '#06B6D4',
    accent: '#F59E0B',
    background: '#F0F9FF',
    backgroundCard: '#FFFFFF',
    surface: '#E0F2FE',
    text: '#0C4A6E',
    textLight: '#64748B',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    star: '#FBBF24',
  },
  gradientBg: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 30%, #7DD3FC 100%)',
  patternClass: 'pattern-ocean',
};

const gardenTheme: ThemeConfig = {
  id: 'garden',
  name: 'Vườn Hoa Hồng',
  emoji: '🐰',
  mascotName: 'Bông',
  colors: {
    primary: '#EC4899',
    primaryLight: '#F9A8D4',
    primaryDark: '#BE185D',
    secondary: '#A855F7',
    accent: '#F472B6',
    background: '#FDF2F8',
    backgroundCard: '#FFFFFF',
    surface: '#FCE7F3',
    text: '#831843',
    textLight: '#9CA3AF',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    star: '#FBBF24',
  },
  gradientBg: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 30%, #FBCFE8 100%)',
  patternClass: 'pattern-garden',
};

const forestTheme: ThemeConfig = {
  id: 'forest',
  name: 'Rừng Xanh',
  emoji: '🐻',
  mascotName: 'Mochi',
  colors: {
    primary: '#22C55E',
    primaryLight: '#86EFAC',
    primaryDark: '#15803D',
    secondary: '#84CC16',
    accent: '#EAB308',
    background: '#F0FDF4',
    backgroundCard: '#FFFFFF',
    surface: '#DCFCE7',
    text: '#14532D',
    textLight: '#6B7280',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    star: '#FBBF24',
  },
  gradientBg: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 30%, #BBF7D0 100%)',
  patternClass: 'pattern-forest',
};

const sunsetTheme: ThemeConfig = {
  id: 'sunset',
  name: 'Hoàng Hôn Cam',
  emoji: '🐱',
  mascotName: 'Miu',
  colors: {
    primary: '#F97316',
    primaryLight: '#FDBA74',
    primaryDark: '#C2410C',
    secondary: '#FB923C',
    accent: '#EF4444',
    background: '#FFF7ED',
    backgroundCard: '#FFFFFF',
    surface: '#FFEDD5',
    text: '#7C2D12',
    textLight: '#78716C',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    star: '#FBBF24',
  },
  gradientBg: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 30%, #FED7AA 100%)',
  patternClass: 'pattern-sunset',
};

const galaxyTheme: ThemeConfig = {
  id: 'galaxy',
  name: 'Thiên Hà Tím',
  emoji: '🦉',
  mascotName: 'Zizi',
  colors: {
    primary: '#8B5CF6',
    primaryLight: '#C4B5FD',
    primaryDark: '#6D28D9',
    secondary: '#A78BFA',
    accent: '#EC4899',
    background: '#F5F3FF',
    backgroundCard: '#FFFFFF',
    surface: '#EDE9FE',
    text: '#3B0764',
    textLight: '#7C7C8A',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    star: '#FBBF24',
  },
  gradientBg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 30%, #DDD6FE 100%)',
  patternClass: 'pattern-galaxy',
};

const sunnyTheme: ThemeConfig = {
  id: 'sunny',
  name: 'Nắng Vàng',
  emoji: '🐶',
  mascotName: 'Lucky',
  colors: {
    primary: '#EAB308',
    primaryLight: '#FDE68A',
    primaryDark: '#A16207',
    secondary: '#FACC15',
    accent: '#F97316',
    background: '#FEFCE8',
    backgroundCard: '#FFFFFF',
    surface: '#FEF9C3',
    text: '#713F12',
    textLight: '#92400E',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    star: '#FBBF24',
  },
  gradientBg: 'linear-gradient(135deg, #FEFCE8 0%, #FEF9C3 30%, #FDE68A 100%)',
  patternClass: 'pattern-sunny',
};

export const themes: ThemeConfig[] = [
  oceanTheme,
  gardenTheme,
  forestTheme,
  sunsetTheme,
  galaxyTheme,
  sunnyTheme,
];

export const defaultTheme = oceanTheme;

export function getThemeById(id: string): ThemeConfig {
  return themes.find((theme) => theme.id === id) || defaultTheme;
}
