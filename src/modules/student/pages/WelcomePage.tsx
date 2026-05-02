import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Clock3, KeyRound, MonitorSmartphone, Shield, Sparkles } from 'lucide-react';
import { MascotCharacter, AllMascotsParade } from '../../../shared/components';
import { getAccessPlan, type AccessPlan } from '../../../shared/services/accessControl';
import { openWindowsAppDownload } from '../../../shared/services/windowsAppDownload';
import '../styles/premiumButtons.css';

const SUB_EXPIRY_KEY = 'hhk_sub_expiry';

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
  const [isFreeTrialPulseActive, setIsFreeTrialPulseActive] = useState(false);

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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsFreeTrialPulseActive(true);
    }, 2000);

    return () => window.clearTimeout(timer);
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

  const heroGhostButtonStyle = {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.04) 44%, rgba(0,0,0,0.2) 100%), rgba(9,28,61,0.52)',
    color: '#D3E4FF',
    border: '1px solid rgba(123,155,211,0.54)',
    boxShadow: '0 10px 18px rgba(7,20,45,0.32), inset 0 1px 0 rgba(255,255,255,0.25)',
  };

  const freeTrialButtonStyle = {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.12) 40%, rgba(0,0,0,0.12) 100%), linear-gradient(135deg, #34D399 0%, #059669 100%)',
    color: '#FFFFFF',
    border: '1px solid rgba(167,243,208,0.75)',
    boxShadow: '0 14px 24px rgba(5,150,105,0.45), inset 0 1px 0 rgba(255,255,255,0.34), inset 0 -2px 0 rgba(4,120,87,0.48)',
  };

  const openAppPricing = () => {
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
                  Chào mừng đến với Học Hứng Khởi
                </div>
                <div className="text-[13px] sm:text-sm mt-1" style={{ color: '#D7E3FF' }}>
                  Chọn một thao tác nhanh để bắt đầu.
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

              <button
                className={`${glossyButtonBaseClass} premium-btn-sheen px-6 py-3.5 text-base font-extrabold inline-flex items-center justify-center gap-2 hover:brightness-105 w-full md:w-auto`}
                style={heroPrimaryButtonStyle}
                onClick={openAppPricing}
              >
                ⬇ Tải app Windows
              </button>

              {currentPlan === 'free' && (
                <button
                  className={`${glossyButtonBaseClass} premium-btn-sheen px-7 py-4 text-[1.05rem] font-extrabold inline-flex items-center justify-center gap-2.5 w-full md:w-auto hover:brightness-105 ${isFreeTrialPulseActive ? 'welcome-free-pulse' : ''}`}
                  style={freeTrialButtonStyle}
                  onClick={() => navigate('/home')}
                >
                  <MonitorSmartphone size={17} /> Dùng thử miễn phí
                </button>
              )}

              <div className="flex flex-col sm:flex-row sm:flex-wrap w-full sm:w-auto items-stretch sm:items-center justify-end gap-2">
                <button
                  className={`${glossyButtonBaseClass} premium-btn-sheen px-6 py-3.5 text-base font-extrabold inline-flex items-center justify-center gap-2 hover:brightness-105 w-full sm:w-auto`}
                  style={heroPrimaryButtonStyle}
                  onClick={() => navigate('/pricing')}
                >
                  Xem gói ngay <ArrowRight size={18} />
                </button>
                <button
                  className={`${glossyButtonBaseClass} px-6 py-3.5 text-base inline-flex items-center justify-center gap-2 hover:brightness-110 w-full sm:w-auto`}
                  style={heroSecondaryButtonStyle}
                  onClick={() => navigate('/pricing#activate-section')}
                >
                  <KeyRound size={18} /> Nhập key ngay
                </button>
                <button
                  className={`${glossyButtonBaseClass} px-6 py-3.5 text-base hover:brightness-110 w-full sm:w-auto`}
                  style={heroGhostButtonStyle}
                  onClick={() => navigate('/home')}
                >
                  Vào học ngay
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 sm:mt-6 w-full rounded-[20px] md:rounded-[24px] p-3.5 sm:p-4 md:p-6 lg:p-7" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #CFDDF6', boxShadow: '0 20px 44px rgba(12,35,75,0.18)' }}>
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
      </div>
    </div>
  );
}
