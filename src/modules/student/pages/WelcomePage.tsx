import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Clock3, KeyRound, MonitorSmartphone, Shield, Sparkles } from 'lucide-react';
import { MascotCharacter, AllMascotsParade } from '../../../shared/components';
import { getAccessPlan, type AccessPlan } from '../../../shared/services/accessControl';
import { openWindowsAppDownload } from '../../../shared/services/windowsAppDownload';
import '../styles/premiumButtons.css';

const SUB_EXPIRY_KEY = 'hhk_sub_expiry';

// ===== 3D Icon Types =====
type Icon3DType = 'key' | 'bigKey' | 'cap' | 'download' | 'book' | 'star' | 'target' | 'reader' | 'chart' | 'devices' | 'giftKey' | 'shield' | 'laptop' | 'boyLaptop';
type Icon3DSize = 'sm' | 'md' | 'lg';
type Icon3DTone = string;

// ===== Data for mobile sections =====
const quickActions = [
  { icon: 'key' as Icon3DType, title: 'Kích hoạt key', desc: 'Mở khóa đầy đủ', tone: 'from-blue-500 to-sky-300' },
  { icon: 'cap' as Icon3DType, title: 'Học miễn phí', desc: 'Vào học ngay', tone: 'from-violet-500 to-indigo-300' },
  { icon: 'download' as Icon3DType, title: 'Tải bản desktop', desc: 'Cài đặt ứng dụng', tone: 'from-green-500 to-lime-300' },
  { icon: 'book' as Icon3DType, title: 'Hướng dẫn', desc: 'Xem cách sử dụng', tone: 'from-purple-500 to-fuchsia-300' },
  { icon: 'star' as Icon3DType, title: 'Tính năng chính', desc: 'Xem chi tiết', tone: 'from-yellow-400 to-orange-300' },
];

const reasons = [
  { icon: 'target' as Icon3DType, title: 'Bám sát chương trình', desc: 'Nội dung chuẩn sách giáo khoa', bg: 'bg-sky-50', tone: 'from-blue-500 to-sky-300' },
  { icon: 'reader' as Icon3DType, title: 'Dễ hiểu – Dễ nhớ', desc: 'Giải thích đơn giản, minh họa sinh động', bg: 'bg-emerald-50', tone: 'from-emerald-400 to-lime-200' },
  { icon: 'chart' as Icon3DType, title: 'Lộ trình rõ ràng', desc: 'Học theo cấp lớp, tiến bộ từng ngày', bg: 'bg-amber-50', tone: 'from-orange-400 to-yellow-300' },
  { icon: 'devices' as Icon3DType, title: 'Học mọi lúc, mọi nơi', desc: 'Chỉ cần máy tính, học tiện lợi tại nhà', bg: 'bg-violet-50', tone: 'from-blue-500 to-violet-300' },
  { icon: 'giftKey' as Icon3DType, title: 'Dùng thử miễn phí', desc: 'Trải nghiệm trước khi kích hoạt', bg: 'bg-pink-50', tone: 'from-rose-400 to-pink-200' },
  { icon: 'shield' as Icon3DType, title: 'An toàn cho trẻ', desc: 'Môi trường học lành mạnh, không quảng cáo', bg: 'bg-green-50', tone: 'from-green-500 to-emerald-300' },
];

const steps = [
  { no: '1', icon: 'laptop' as Icon3DType, title: 'Truy cập & tải ứng dụng', desc: 'Vào ứng dụng hoặc tải bản desktop về máy tính.', tone: 'from-blue-500 to-sky-300' },
  { no: '2', icon: 'bigKey' as Icon3DType, title: 'Dùng thử hoặc kích hoạt key', desc: 'Trải nghiệm miễn phí hoặc kích hoạt đầy đủ tính năng.', tone: 'from-yellow-400 to-orange-300' },
  { no: '3', icon: 'boyLaptop' as Icon3DType, title: 'Bé bắt đầu học', desc: 'Chọn môn học yêu thích và học đều mỗi ngày.', tone: 'from-orange-400 to-amber-200' },
];

// ===== MiniButton Component =====
function MiniButton({ children, variant = 'blue', onClick }: { children: React.ReactNode; variant?: 'blue' | 'yellow'; onClick?: () => void }) {
  const styles =
    variant === 'yellow'
      ? 'bg-yellow-400 text-slate-950 shadow-yellow-200/70'
      : 'bg-blue-600 text-white shadow-blue-200/70';

  return (
    <button
      onClick={onClick}
      className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-2xl px-3 text-[13px] font-bold shadow-md transition active:scale-[0.98] sm:h-12 sm:px-6 sm:text-base ${styles}`}
    >
      {children}
    </button>
  );
}

// ===== Icon3D Component =====
function Icon3D({ type, tone = 'from-blue-500 to-sky-300', size = 'md' }: { type: Icon3DType; tone?: Icon3DTone; size?: Icon3DSize }) {
  const box = size === 'lg' ? 'h-20 w-20' : size === 'sm' ? 'h-12 w-12' : 'h-16 w-16';
  const inner = size === 'lg' ? 'scale-110' : size === 'sm' ? 'scale-75' : 'scale-100';

  const base = `relative ${box} shrink-0 rounded-[1.25rem] bg-gradient-to-br ${tone} shadow-[inset_0_2px_8px_rgba(255,255,255,.65),0_14px_22px_rgba(15,23,42,.12)]`;

  return (
    <div className={base}>
      <div className="absolute inset-x-2 top-1 h-4 rounded-full bg-white/35 blur-sm" />
      <div className={`absolute inset-0 flex items-center justify-center ${inner}`}>
        {type === 'key' && <div className="relative h-7 w-10 rounded-full border-[7px] border-white/95"><span className="absolute left-7 top-1/2 h-2 w-8 -translate-y-1/2 rounded-full bg-white" /><span className="absolute left-12 top-1/2 h-3 w-1.5 -translate-y-1/2 rounded-full bg-white" /></div>}
        {type === 'bigKey' && <div className="relative h-9 w-14 rounded-full border-[9px] border-white/95"><span className="absolute left-9 top-1/2 h-3 w-12 -translate-y-1/2 rounded-full bg-white" /><span className="absolute left-[68px] top-1/2 h-5 w-2 -translate-y-1/2 rounded-full bg-white" /></div>}
        {type === 'cap' && <><div className="h-8 w-12 rotate-[-8deg] rounded-md bg-white/95 shadow-sm" /><div className="absolute mt-7 h-2 w-10 rounded-full bg-white/90" /><div className="absolute right-4 top-8 h-6 w-1 rounded-full bg-white/90" /></>}
        {type === 'download' && <><div className="absolute bottom-4 h-4 w-11 rounded-lg bg-white/90" /><div className="h-10 w-4 rounded-full bg-white" /><div className="absolute mt-8 h-5 w-5 rotate-45 rounded-br bg-white" /></>}
        {type === 'book' && <><div className="h-10 w-8 rounded-l-lg rounded-r-sm bg-white/95 shadow-sm" /><div className="ml-1 h-10 w-8 rounded-l-sm rounded-r-lg bg-white/80 shadow-sm" /><span className="absolute h-8 w-0.5 bg-blue-300/50" /></>}
        {type === 'star' && <div className="text-4xl drop-shadow-sm">★</div>}
        {type === 'target' && <><div className="absolute h-12 w-12 rounded-full bg-white shadow-sm" /><div className="absolute h-8 w-8 rounded-full bg-blue-400" /><div className="absolute h-4 w-4 rounded-full bg-white" /><div className="absolute h-2 w-2 rounded-full bg-red-400" /><div className="absolute right-2 top-3 h-1.5 w-10 rotate-[-30deg] rounded-full bg-red-400" /></>}
        {type === 'reader' && <><div className="absolute top-2 h-8 w-8 rounded-full bg-amber-200" /><div className="absolute top-5 h-4 w-10 rounded-t-full bg-slate-800" /><div className="absolute bottom-4 left-3 h-8 w-7 rotate-[-8deg] rounded-lg bg-white/95" /><div className="absolute bottom-4 right-3 h-8 w-7 rotate-[8deg] rounded-lg bg-white/85" /><div className="absolute right-2 top-1 text-xl">💡</div></>}
        {type === 'chart' && <><span className="absolute bottom-4 left-4 h-6 w-3 rounded-t bg-white/75" /><span className="absolute bottom-4 left-8 h-9 w-3 rounded-t bg-white/85" /><span className="absolute bottom-4 left-12 h-12 w-3 rounded-t bg-white" /><span className="absolute right-3 top-4 h-2 w-9 rotate-[-35deg] rounded-full bg-white" /><span className="absolute right-2 top-3 h-4 w-4 rotate-45 rounded-tr bg-white" /></>}
        {type === 'devices' && <><div className="absolute bottom-4 left-3 h-9 w-12 rounded-lg bg-slate-800 shadow-md"><div className="m-1 h-6 rounded bg-white/90" /></div><div className="absolute bottom-3 right-4 h-11 w-6 rounded-lg bg-white shadow-md"><div className="m-1 h-8 rounded bg-blue-100" /></div></>}
        {type === 'giftKey' && <><div className="absolute bottom-4 h-10 w-12 rounded-xl bg-white/90" /><div className="absolute bottom-8 h-3 w-14 rounded bg-white" /><div className="absolute bottom-4 h-10 w-2 bg-rose-300" /><div className="absolute right-2 top-8 h-5 w-7 rounded-full border-[5px] border-yellow-300"><span className="absolute left-5 top-1/2 h-1.5 w-8 -translate-y-1/2 rounded-full bg-yellow-300" /></div></>}
        {type === 'shield' && <><div className="absolute h-12 w-11 rounded-t-2xl bg-white/90 shadow-sm" style={{ clipPath: 'polygon(50% 0%, 92% 18%, 84% 78%, 50% 100%, 16% 78%, 8% 18%)' }} /><div className="absolute text-2xl text-green-500">♥</div></>}
        {type === 'laptop' && <><div className="absolute top-4 h-10 w-14 rounded-lg bg-slate-800 shadow-md"><div className="m-1 flex h-7 items-center justify-center rounded bg-blue-100 text-blue-600">↓</div></div><div className="absolute bottom-4 h-2 w-16 rounded-full bg-white/90" /></>}
        {type === 'boyLaptop' && <><div className="absolute top-3 h-9 w-9 rounded-full bg-amber-200" /><div className="absolute top-4 h-5 w-11 rounded-t-full bg-slate-800" /><div className="absolute bottom-4 h-8 w-14 rounded-lg bg-slate-700 shadow-md"><div className="m-1 h-5 rounded bg-white/80" /></div></>}
      </div>
    </div>
  );
}

const QUICK_NOTES = [
  {
    title: 'Không cần tạo tài khoản',
    text: 'Mở app là dùng được ngay gói Free. Khi cần thêm tính năng thì kích hoạt key.',
    accent: '#1D4ED8',
    bg: '#DBEAFE',
    icon: MonitorSmartphone,
  },
  {
    title: 'Xem gói ở một nơi duy nhất',
    text: 'Trang Pricing là nơi duy nhất để xem giá, mua gói và nhập key kích hoạt.',
    accent: '#D97706',
    bg: '#FEF3C7',
    icon: Sparkles,
  },
  {
    title: 'Key gắn với thiết bị',
    text: 'Hệ thống kiểm tra theo ID máy để tránh nhầm lẫn khi kích hoạt.',
    accent: '#16A34A',
    bg: '#DCFCE7',
    icon: Shield,
  },
] as const;

type KeyStatusTone = 'free' | 'good' | 'warning' | 'expired';

type KeyStatusSnapshot = {
  tone: KeyStatusTone;
  headline: string;
  detail: string;
  hint: string;
};

function getKeyStatusSnapshot(plan: AccessPlan): KeyStatusSnapshot {
  if (plan === 'free') {
    return {
      tone: 'free',
      headline: 'Chưa kích hoạt key',
      detail: 'Hiện đang ở gói Free',
      hint: 'Bấm Xem gói ngay để mở trang Pricing và chọn gói phù hợp.',
    };
  }

  const expiryRaw = localStorage.getItem(SUB_EXPIRY_KEY);
  if (!expiryRaw) {
    return {
      tone: 'good',
      headline: 'Key vĩnh viễn',
      detail: `Gói ${plan === 'standard' ? 'Standard' : 'Premium'} đang hoạt động`,
      hint: 'Có thể vào học ngay.',
    };
  }

  const expiryDate = new Date(expiryRaw);
  if (Number.isNaN(expiryDate.getTime())) {
    return {
      tone: 'warning',
      headline: 'Không đọc được hạn key',
      detail: 'Dữ liệu hạn sử dụng đang sai định dạng',
      hint: 'Mở trang Pricing để đồng bộ lại trạng thái key.',
    };
  }

  const leftDays = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const dateText = expiryDate.toLocaleDateString('vi-VN');

  if (leftDays < 0) {
    return {
      tone: 'expired',
      headline: 'Key đã hết hạn',
      detail: `Hết hạn ngày ${dateText}`,
      hint: 'Gia hạn trên trang Pricing để dùng tiếp đầy đủ tính năng.',
    };
  }

  if (leftDays <= 7) {
    return {
      tone: 'warning',
      headline: 'Key sắp hết hạn',
      detail: `Còn ${leftDays} ngày (đến ${dateText})`,
      hint: 'Nên gia hạn sớm để tránh gián đoạn học tập.',
    };
  }

  return {
    tone: 'good',
    headline: 'Key đang hoạt động',
    detail: `Còn ${leftDays} ngày (đến ${dateText})`,
    hint: 'Trạng thái ổn định. Có thể học tiếp bình thường.',
  };
}

const STATUS_THEME: Record<KeyStatusTone, { bg: string; border: string; title: string; text: string; hint: string; glow: string }> = {
  free: {
    bg: 'linear-gradient(120deg, rgba(27,77,165,0.18), rgba(15,39,88,0.42))',
    border: 'rgba(132,170,238,0.45)',
    title: '#DCEBFF',
    text: '#EAF3FF',
    hint: '#BFD6FB',
    glow: '0 12px 24px rgba(15,50,114,0.35)',
  },
  good: {
    bg: 'linear-gradient(120deg, rgba(17,96,59,0.28), rgba(8,43,33,0.52))',
    border: 'rgba(103,215,161,0.52)',
    title: '#D8FDEB',
    text: '#EAFEF5',
    hint: '#B7F2D7',
    glow: '0 12px 24px rgba(8,68,46,0.35)',
  },
  warning: {
    bg: 'linear-gradient(120deg, rgba(144,83,10,0.34), rgba(65,36,8,0.56))',
    border: 'rgba(246,192,93,0.55)',
    title: '#FFE9B8',
    text: '#FFF4DC',
    hint: '#FFE2A0',
    glow: '0 12px 24px rgba(102,58,10,0.35)',
  },
  expired: {
    bg: 'linear-gradient(120deg, rgba(132,33,33,0.35), rgba(54,11,11,0.58))',
    border: 'rgba(239,130,130,0.55)',
    title: '#FFD6D6',
    text: '#FFECEC',
    hint: '#FFC1C1',
    glow: '0 12px 24px rgba(89,19,19,0.35)',
  },
};

export function WelcomePage() {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState<AccessPlan>(() => getAccessPlan());
  const [keyStatus, setKeyStatus] = useState<KeyStatusSnapshot>(() => getKeyStatusSnapshot(getAccessPlan()));

  useEffect(() => {
    const syncPlan = () => {
      const nextPlan = getAccessPlan();
      setCurrentPlan(nextPlan);
      setKeyStatus(getKeyStatusSnapshot(nextPlan));
    };

    window.addEventListener('focus', syncPlan);
    window.addEventListener('storage', syncPlan);
    return () => {
      window.removeEventListener('focus', syncPlan);
      window.removeEventListener('storage', syncPlan);
    };
  }, []);

  const statusTheme = STATUS_THEME[keyStatus.tone];
  const glossyButtonBaseClass = 'premium-btn-base rounded-[14px] text-sm font-bold';
  const heroPrimaryButtonStyle = {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.08) 38%, rgba(0,0,0,0.12) 100%), linear-gradient(135deg, #F3DFB1 0%, #D3A85C 54%, #C49240 100%)',
    color: '#1D2A4D',
    border: '1px solid rgba(255,255,255,0.45)',
    boxShadow: '0 14px 24px rgba(10,24,53,0.4), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -2px 0 rgba(103,65,19,0.28)',
  };

  const heroSecondaryButtonStyle = {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.04) 42%, rgba(0,0,0,0.18) 100%), linear-gradient(135deg, #1D4A8A 0%, #123463 62%, #102B54 100%)',
    color: '#E6F0FF',
    border: '1px solid rgba(150,184,238,0.58)',
    boxShadow: '0 12px 22px rgba(8,21,49,0.38), inset 0 1px 0 rgba(255,255,255,0.32), inset 0 -2px 0 rgba(8,27,56,0.42)',
  };

  const openWindowsDownload = () => {
    openWindowsAppDownload();
  };

  return (
    <div
      className="fade-in min-h-screen"
      style={{
        background: 'radial-gradient(circle at 12% -10%, rgba(227,181,86,0.24) 0%, rgba(18,38,76,0) 38%), radial-gradient(circle at 88% 2%, rgba(89,162,255,0.2) 0%, rgba(12,28,62,0) 32%), linear-gradient(180deg, #050F24 0%, #0C2754 42%, #164381 65%, #EAF2FC 100%)',
      }}
    >
      <div className="w-full min-h-screen px-3 pb-10 pt-3 sm:px-4 md:px-8 md:pt-6 xl:px-12">
        <section
          className="w-full rounded-2xl md:rounded-[30px] px-4 py-5 sm:px-5 sm:py-6 md:px-8 lg:px-10"
          style={{
            background: 'linear-gradient(112deg, #03142F 0%, #072B5D 48%, #0F3A79 100%)',
            border: '1px solid rgba(201,160,70,0.32)',
            boxShadow: '0 28px 56px rgba(1,8,25,0.52)',
          }}
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#36578A] bg-[#061E44]/70 px-3 py-3 sm:px-4">
            <button
              className="text-left text-sm font-black tracking-[0.02em]"
              style={{ color: '#E9D39A' }}
                onClick={() => navigate('/')}
            >
              Học Hứng Khởi
            </button>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <button className="px-3 py-2 rounded-xl font-semibold" style={{ color: '#D7E3FF' }} onClick={() => document.getElementById('welcome-features')?.scrollIntoView({ behavior: 'smooth' })}>Tính năng</button>
              <button className="px-3 py-2 rounded-xl font-semibold" style={{ color: '#D7E3FF' }} onClick={() => navigate('/pricing')}>Bảng giá</button>
              <button
                className="px-3 py-2 rounded-xl font-extrabold"
                style={{ background: '#F3DFB1', color: '#1D2A4D', border: '1px solid rgba(255,255,255,0.52)' }}
                onClick={() => navigate('/pricing')}
              >
                Kích hoạt key
              </button>
              <button
                className="px-3 py-2 rounded-xl font-bold"
                style={{ background: '#123463', color: '#E6F0FF', border: '1px solid rgba(150,184,238,0.58)' }}
                onClick={() => navigate('/pricing')}
              >
                Đăng nhập
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3 sm:items-center">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(140deg, #EEDAA0, #C99C46)', color: '#16213D' }}
              >
                <MascotCharacter size="sm" />
              </div>
              <div>
                <div className="text-[1.3rem] leading-tight sm:text-[1.65rem] md:text-[2.4rem] font-bold tracking-[-0.025em]" style={{ color: '#E9D39A' }}>
                  Kích hoạt key trong 1 phút để mở khóa học tập
                </div>
                <div className="text-[13px] sm:text-sm mt-1" style={{ color: '#D7E3FF' }}>
                  Đăng nhập bằng email và license key để vào đúng gói đã mua.
                </div>
                <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    className={`${glossyButtonBaseClass} premium-btn-sheen px-6 py-3.5 text-base font-extrabold inline-flex items-center justify-center gap-2 hover:brightness-105 w-full sm:w-auto`}
                    style={heroPrimaryButtonStyle}
                    onClick={() => navigate('/pricing')}
                  >
                    <KeyRound size={18} /> Kích hoạt key
                  </button>
                  <button
                    className={`${glossyButtonBaseClass} px-6 py-3.5 text-base inline-flex items-center justify-center gap-2 hover:brightness-110 w-full sm:w-auto`}
                    style={heroSecondaryButtonStyle}
                    onClick={() => navigate('/pricing')}
                  >
                    Đăng nhập
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-2.5 md:items-end">
              <div
                className="rounded-2xl px-3.5 py-3 w-full max-w-full sm:max-w-[360px] md:min-w-[280px]"
                style={{
                  background: statusTheme.bg,
                  border: `1px solid ${statusTheme.border}`,
                  boxShadow: statusTheme.glow,
                }}
              >
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-bold" style={{ color: statusTheme.hint }}>
                  <Clock3 size={13} /> Tình trạng key
                </div>
                <div className="text-sm font-extrabold mt-1" style={{ color: statusTheme.title }}>{keyStatus.headline}</div>
                <div className="text-[13px] mt-0.5" style={{ color: statusTheme.text }}>{keyStatus.detail}</div>
                <div className="text-[12px] mt-1.5" style={{ color: statusTheme.hint }}>{keyStatus.hint}</div>
              </div>
              <div className="text-xs text-right">
                <button
                  className="inline-flex items-center gap-2 font-bold underline"
                  style={{ color: '#CFE0FF' }}
                  onClick={openWindowsDownload}
                >
                  <ArrowRight size={14} /> Tải app Windows
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="welcome-features" className="mt-5 sm:mt-6 w-full rounded-[20px] md:rounded-[24px] p-3.5 sm:p-4 md:p-6 lg:p-7" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #CFDDF6', boxShadow: '0 20px 44px rgba(12,35,75,0.18)' }}>
          <div className="text-xs uppercase tracking-[0.18em] font-bold" style={{ color: '#6B7FA3' }}>Bắt đầu nhanh</div>
          <div className="text-[1.65rem] leading-tight sm:text-2xl md:text-4xl font-bold tracking-[-0.03em]" style={{ color: '#123E72' }}>
            2 bước để dùng đầy đủ tính năng
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="rounded-2xl p-4" style={{ background: '#F7FAFF', border: '1px solid #D5E4FC' }}>
              <div className="text-sm font-extrabold" style={{ color: '#1E3A8A' }}>Bước 1: Xem gói trên Pricing</div>
              <div className="text-sm mt-2" style={{ color: '#475569' }}>
                Bấm Xem gói ngay để vào trang Pricing. Trang này hiển thị đầy đủ giá và hướng dẫn mua.
              </div>
            </div>
            <div className="rounded-2xl p-4" style={{ background: '#FFF8EC', border: '1px solid #F3D8A3' }}>
              <div className="text-sm font-extrabold" style={{ color: '#9A3412' }}>Bước 2: Nhập key để kích hoạt</div>
              <div className="text-sm mt-2" style={{ color: '#7C2D12' }}>
                Sau khi mua key, vào khung Nhập key trên Pricing để mở gói Standard hoặc Premium.
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {QUICK_NOTES.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl p-4" style={{ background: '#F7FAFF', border: '1px solid #D5E4FC' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.bg, color: item.accent }}>
                    <Icon size={18} />
                  </div>
                  <div className="text-[15px] font-bold mt-3" style={{ color: '#0F2E57' }}>{item.title}</div>
                  <div className="text-[13px] mt-2" style={{ color: '#5A6F92', lineHeight: 1.65 }}>{item.text}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold" style={{ background: currentPlan === 'free' ? '#EEF4FF' : '#ECFDF5', color: currentPlan === 'free' ? '#1A4FB2' : '#0F8A4F', border: `1px solid ${currentPlan === 'free' ? '#C5D9FA' : '#A6E5BF'}` }}>
              <BadgeCheck size={14} /> Trạng thái hiện tại: {currentPlan === 'free' ? 'Free' : currentPlan === 'standard' ? 'Standard' : 'Premium'}
            </div>
            <button
              className="rounded-xl px-4 py-2 text-sm font-bold"
              style={{ background: '#FFFFFF', color: '#1A4FB2', border: '1px solid #C7DAFA' }}
              onClick={() => navigate('/pricing')}
            >
              Mở trang gói dịch vụ
            </button>
          </div>
        </section>

        {/* ===================== MASCOT WELCOME SHOWCASE ===================== */}
        <section
          className="mt-5 sm:mt-6 w-full rounded-[22px] md:rounded-[28px] px-4 py-7 sm:px-5 sm:py-10 md:px-10 md:py-12 text-center overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #04122B 0%, #081F4A 48%, #0C2E68 100%)',
            border: '1px solid rgba(140,185,255,0.18)',
            boxShadow: '0 28px 56px rgba(1,8,26,0.56)',
          }}
        >
          {/* Trang trí ngôi sao nền */}
          <span aria-hidden="true" className="hidden sm:block" style={{ position: 'absolute', top: '10%',  left: '6%',  fontSize: '2rem', opacity: 0.3, animation: 'hhk-float-star 5s ease-in-out infinite' }}>✦</span>
          <span aria-hidden="true" className="hidden sm:block" style={{ position: 'absolute', top: '15%',  right: '8%', fontSize: '1.5rem', opacity: 0.25, animation: 'hhk-float-star 4s ease-in-out infinite 0.8s' }}>✦</span>
          <span aria-hidden="true" className="hidden sm:block" style={{ position: 'absolute', bottom: '14%', left: '12%', fontSize: '1.2rem', opacity: 0.2, animation: 'hhk-spin-star 10s linear infinite' }}>⭐</span>
          <span aria-hidden="true" className="hidden sm:block" style={{ position: 'absolute', bottom: '18%', right: '10%', fontSize: '1.8rem', opacity: 0.25, animation: 'hhk-float-star 3.5s ease-in-out infinite 1.2s' }}>🌟</span>
          <span aria-hidden="true" className="hidden sm:block" style={{ position: 'absolute', top: '45%', left: '2%', fontSize: '1rem', opacity: 0.18, animation: 'hhk-spin-star 7s linear infinite reverse' }}>✦</span>
          <span aria-hidden="true" className="hidden sm:block" style={{ position: 'absolute', top: '40%', right: '2%', fontSize: '1rem', opacity: 0.18, animation: 'hhk-spin-star 9s linear infinite' }}>✦</span>

          <div className="relative z-10">
            <div className="text-xs uppercase tracking-[0.22em] font-bold mb-2" style={{ color: '#7FB4FF', opacity: 0.85 }}>
              Đồng hành cùng bạn mỗi ngày
            </div>
            <h2 className="hhk-shimmer-text text-[1.6rem] sm:text-[2rem] md:text-[2.8rem] lg:text-[3.2rem] font-black tracking-[-0.03em] leading-tight">
              Chào mừng bạn đến với<br />Học Hứng Khởi!
            </h2>
            <p className="mt-3 text-sm md:text-base max-w-[520px] mx-auto" style={{ color: '#B0CCEE', lineHeight: 1.7 }}>
              6 người bạn đồng hành sẽ luôn bên cạnh bạn —<br className="hidden md:block" />
              mỗi giao diện một cá tính riêng, thay đổi bất cứ lúc nào!
            </p>
            <div className="mt-8 md:hidden">
              <AllMascotsParade size={72} />
            </div>
            <div className="mt-10 hidden md:block">
              <AllMascotsParade size={104} />
            </div>
            <div className="mt-6 inline-flex max-w-full items-center justify-center gap-2 rounded-full px-4 sm:px-5 py-2 text-[13px] sm:text-sm font-bold"
              style={{ background: 'rgba(100,160,255,0.12)', color: '#90BFFF', border: '1px solid rgba(100,160,255,0.25)' }}>
              <Sparkles size={14} /> Đổi giao diện trong mục Cài đặt → Giao diện
            </div>
          </div>
        </section>

        {/* ===================== MOBILE LANDING SECTIONS (NEW) ===================== */}
        {/* Mobile Hero - Only visible on small screens */}
        <section className="mt-5 sm:mt-6 w-full md:hidden">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-sky-50 via-white to-white px-4 pb-5 pt-4 shadow-lg ring-1 ring-slate-100">
            <div className="pointer-events-none absolute right-4 top-10 h-40 w-40 rounded-full bg-blue-100/60 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-44 w-44 rounded-full bg-yellow-100/70 blur-2xl" />

            <div className="relative">
              {/* Hero Text - kept as real HTML */}
              <div className="max-w-[330px]">
                <h1 className="text-[42px] font-black leading-none tracking-tight text-blue-700">
                  HỌC CẤP 01
                </h1>

                <h2 className="mt-4 text-[23px] font-extrabold leading-tight text-slate-950">
                  Công cụ đồng hành tin cậy cho phụ huynh tiểu học
                </h2>

                <div className="mt-4 space-y-2.5 text-sm font-medium text-slate-700">
                  <p className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    <span>Kho bài giảng & đề luyện chuẩn chương trình</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <span>Học hiệu quả, dễ hiểu, dễ nhớ</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                    <span>An toàn, lành mạnh, không quảng cáo độc hại</span>
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MiniButton onClick={() => navigate('/home')}>▶ Học thử</MiniButton>
                  <MiniButton variant="yellow" onClick={() => navigate('/pricing')}>🔑 Kích hoạt</MiniButton>
                </div>
              </div>

              {/* Illustration Card */}
              <div className="mt-5 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-blue-50 via-white to-amber-50 p-4 shadow-sm ring-1 ring-slate-100">
                <div className="relative min-h-[190px]">
                  <div className="absolute right-4 top-2 text-3xl">💡</div>
                  <div className="absolute left-4 top-8 text-xl">⭐</div>
                  <div className="absolute bottom-4 right-6 text-xl">✨</div>

                  <div className="absolute bottom-0 left-0 w-[42%] rounded-3xl bg-white p-3 shadow-md">
                    <div className="mb-2 flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-red-300" />
                      <span className="h-2 w-2 rounded-full bg-yellow-300" />
                      <span className="h-2 w-2 rounded-full bg-green-300" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['📘', '🧮', '✍️', '🏆'].map((item) => (
                        <div key={item} className="flex h-10 items-center justify-center rounded-2xl bg-slate-50 text-lg">
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-blue-100" />
                    <div className="mt-2 h-2 w-2/3 rounded-full bg-slate-100" />
                  </div>

                  <div className="absolute bottom-0 right-0 w-[58%] rounded-[1.5rem] bg-white p-3 shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-4xl">👩‍👦</div>
                      <div className="space-y-2">
                        <div className="h-3 w-20 rounded-full bg-blue-100" />
                        <div className="h-3 w-16 rounded-full bg-amber-100" />
                      </div>
                    </div>
                    <div className="mt-4 rounded-2xl bg-amber-100 px-3 py-3">
                      <div className="h-2 rounded-full bg-amber-200" />
                      <div className="mt-2 h-2 w-2/3 rounded-full bg-amber-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="mt-5 sm:mt-6 w-full md:hidden px-4">
          <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-xl font-black text-slate-900">Thao tác nhanh</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {quickActions.map((item, index) => (
                <button
                  key={item.title}
                  onClick={() => {
                    if (item.title.includes('Kích hoạt')) navigate('/pricing');
                    else if (item.title.includes('Học')) navigate('/home');
                    else if (item.title.includes('Tải')) openWindowsAppDownload();
                    else if (item.title.includes('Hướng')) document.getElementById('welcome-features')?.scrollIntoView({ behavior: 'smooth' });
                    else document.getElementById('welcome-features')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`${index === 4 ? 'col-span-2' : ''} rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-100 transition active:scale-[0.99]`}
                >
                  <Icon3D type={item.icon} tone={item.tone} size="sm" />
                  <p className="mt-2 text-sm font-extrabold">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Vì sao phụ huynh tin tưởng Section */}
        <section className="mt-5 sm:mt-6 w-full md:hidden px-4">
          <h3 className="text-center text-xl font-black text-blue-950">Vì sao phụ huynh tin tưởng Học Cấp 01?</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {reasons.map((item) => (
              <article key={item.title} className={`rounded-2xl ${item.bg} p-3 ring-1 ring-slate-100`}>
                <div className="flex items-start gap-3">
                  <Icon3D type={item.icon} tone={item.tone} />
                  <div className="min-w-0 pt-1">
                    <h4 className="text-sm font-extrabold leading-tight">{item.title}</h4>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{item.desc}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3 Bước Section */}
        <section className="mt-5 sm:mt-6 w-full md:hidden px-4">
          <h3 className="text-center text-xl font-black text-blue-950">Bắt đầu chỉ với 3 bước đơn giản</h3>
          <div className="mt-4 grid gap-3">
            {steps.map((step) => (
              <article key={step.no} className="relative flex gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                  {step.no}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Icon3D type={step.icon} tone={step.tone} size="sm" />
                    <h4 className="text-sm font-extrabold leading-tight">{step.title}</h4>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{step.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-5 sm:mt-6 w-full md:hidden px-4 pb-24">
          <div className="overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-blue-700 to-sky-500 p-4 text-white shadow-xl shadow-blue-100">
            <div className="grid grid-cols-[0.9fr_1.2fr] items-center gap-3">
              <div className="rounded-3xl bg-white/15 p-3">
                <Icon3D type="boyLaptop" tone="from-yellow-300 to-orange-200" size="lg" />
              </div>
              <div>
                <h3 className="text-xl font-black leading-tight">Bắt đầu cho bé học miễn phí ngay hôm nay!</h3>
                <p className="mt-2 text-xs leading-5 text-blue-50">Đồng hành cùng con, học vui mỗi ngày, tiến bộ từng bước nhỏ.</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/home')} className="h-11 rounded-2xl bg-white px-3 text-[13px] font-bold text-blue-700 transition active:scale-[0.98]">▶ Học miễn phí</button>
              <button onClick={() => navigate('/pricing')} className="h-11 rounded-2xl bg-yellow-400 px-3 text-[13px] font-bold text-slate-950 transition active:scale-[0.98]">🔑 Kích hoạt</button>
            </div>
          </div>
        </section>

        {/* Floating Support Button - Mobile Only */}
        <button
          onClick={() => navigate('/pricing')}
          className="fixed bottom-5 left-1/2 z-50 inline-flex h-12 -translate-x-1/2 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white shadow-xl shadow-blue-300/50 transition active:scale-[0.98] md:hidden"
        >
          🎧 Hỗ trợ mua key
        </button>
      </div>
    </div>
  );
}
