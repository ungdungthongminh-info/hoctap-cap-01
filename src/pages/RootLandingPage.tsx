import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

// ===== 3D Icon Types =====
type Icon3DType = 'key' | 'bigKey' | 'cap' | 'download' | 'book' | 'star' | 'target' | 'reader' | 'chart' | 'devices' | 'giftKey' | 'shield' | 'laptop' | 'boyLaptop';

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

// ===== Depth Button Components =====
const btnBase = 'inline-flex h-11 min-h-11 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold transition-all duration-200 focus:outline-none focus-visible:ring-4';

function BtnBlue({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`${btnBase} bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0_10px_22px_rgba(37,99,235,0.28),inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-blue-400/30 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(37,99,235,0.34)] active:translate-y-0 active:scale-[0.98] active:shadow-[0_6px_14px_rgba(37,99,235,0.24)] focus-visible:ring-blue-300/50`}
    >
      {children}
    </button>
  );
}

function BtnYellow({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`${btnBase} bg-gradient-to-b from-yellow-300 to-amber-500 text-slate-950 shadow-[0_10px_22px_rgba(245,158,11,0.28),inset_0_1px_0_rgba(255,255,255,0.45)] ring-1 ring-amber-300/50 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(245,158,11,0.34)] active:translate-y-0 active:scale-[0.98] active:shadow-[0_6px_14px_rgba(245,158,11,0.24)] focus-visible:ring-amber-300/50`}
    >
      {children}
    </button>
  );
}

function BtnWhite({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`${btnBase} bg-white text-blue-700 shadow-[0_10px_22px_rgba(255,255,255,0.28),inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-white/50 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(255,255,255,0.34)] active:translate-y-0 active:scale-[0.98] active:shadow-[0_6px_14px_rgba(255,255,255,0.24)] focus-visible:ring-white/50`}
    >
      {children}
    </button>
  );
}

// ===== Safe Icon3D Component =====
// Uses emoji/icons instead of complex shapes to prevent overflow issues
const iconEmoji: Record<Icon3DType, string> = {
  key: '🔑',
  bigKey: '🗝️',
  cap: '🎓',
  download: '⬇️',
  book: '📚',
  star: '⭐',
  target: '🎯',
  reader: '📖',
  chart: '📊',
  devices: '💻',
  giftKey: '🎁',
  shield: '🛡️',
  laptop: '💻',
  boyLaptop: '👨‍💻',
};

function Icon3D({ type, size = 'md' }: { type: Icon3DType; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-16 w-16 text-3xl' : size === 'sm' ? 'h-11 w-11 text-xl' : size === 'xs' ? 'h-10 w-10 text-lg' : 'h-14 w-14 text-2xl';
  return (
    <div className={`${box} shrink-0 overflow-hidden rounded-[1.1rem] bg-gradient-to-br from-slate-100 to-slate-200 shadow-[0_4px_12px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/50 flex items-center justify-center`}>
      <span className="drop-shadow-sm">{iconEmoji[type]}</span>
    </div>
  );
}

export function RootLandingPage() {
  const navigate = useNavigate();

  return (
    <main className="root-landing-page relative min-h-screen overflow-y-auto bg-slate-50 text-slate-950">
      {/* ===================== DESKTOP ONLY (hidden on mobile) ===================== */}
      <div className="hidden md:block mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-center gap-4 rounded-[32px] bg-white/90 px-5 py-4 shadow-card backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-950 text-white shadow-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-600">Học Cấp 01</p>
              <p className="text-sm font-semibold text-slate-950">Phụ huynh đồng hành cùng con</p>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[36px] shadow-card">
          <div className="absolute top-6 left-6 right-6 z-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              className="root-landing-primary-btn inline-flex items-center justify-center bg-sky-950 text-white transition hover:bg-sky-900"
              onClick={() => navigate('/home')}
            >
              Học miễn phí ngay
            </button>
            <button
              className="root-landing-secondary-btn inline-flex items-center justify-center bg-amber-400 text-slate-950 transition hover:bg-amber-300"
              onClick={() => navigate('/pricing')}
            >
              Kích hoạt key
            </button>
          </div>
          <img
            src="/image/landing-hero.jpg"
            alt="Phụ huynh đồng hành cùng con học tiểu học"
            className="root-landing-hero-image"
            loading="eager"
            decoding="async"
          />
        </section>

        <footer className="mt-10 py-6 text-center text-sm text-slate-500">
          Học Cấp 01 2026. Thiết kế dành cho phụ huynh và học sinh tiểu học.
        </footer>
      </div>

      {/* ===================== MOBILE ONLY (md:hidden) ===================== */}
      <div className="md:hidden min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 pb-28">
        {/* Mobile Header */}
        <header className="sticky top-0 z-20 flex w-full items-center justify-between bg-white/95 px-4 py-3 backdrop-blur-sm shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-xl text-white shadow-lg shadow-blue-200/50">
              📖
            </div>
            <div className="min-w-0">
              <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-blue-700">Học Cấp 01</p>
              <p className="truncate text-xs font-medium text-slate-600">Phụ huynh đồng hành cùng con</p>
            </div>
          </div>
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-lg shadow-sm ring-1 ring-slate-200 transition active:scale-95">
            ☰
          </button>
        </header>

        {/* Mobile Hero */}
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white px-4 py-6">
          <div className="pointer-events-none absolute right-2 top-4 h-28 w-28 rounded-full bg-blue-100/50 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-yellow-100/60 blur-2xl" />

          <div className="relative">
            <h1 className="text-[32px] font-black leading-none tracking-tight text-blue-700">
              HỌC CẤP 01
            </h1>
            <h2 className="mt-3 text-base font-extrabold leading-snug text-slate-900">
              Công cụ đồng hành tin cậy cho phụ huynh tiểu học
            </h2>

            <div className="mt-4 space-y-2 text-sm font-medium text-slate-700">
              <p className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                <span className="leading-snug">Kho bài giảng & đề luyện chuẩn chương trình</span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                <span className="leading-snug">Học hiệu quả, dễ hiểu, dễ nhớ</span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                <span className="leading-snug">An toàn, lành mạnh, không quảng cáo</span>
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <BtnBlue onClick={() => navigate('/home')}>▶ Học thử</BtnBlue>
              <BtnYellow onClick={() => navigate('/pricing')}>🔑 Kích hoạt</BtnYellow>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="w-full px-4 py-5">
          <div className="w-full rounded-[22px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            <h3 className="text-[17px] font-black text-slate-900">Thao tác nhanh</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {quickActions.map((item) => (
                <button
                  key={item.title}
                  onClick={() => {
                    if (item.title.includes('Kích hoạt')) navigate('/pricing');
                    else if (item.title.includes('Học')) navigate('/home');
                    else if (item.title.includes('Tải')) {
                      window.open('https://hoctap.ungdungthongminh.info/download', '_blank');
                    }
                    else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center rounded-[18px] bg-white p-4 text-center shadow-[0_2px_8px_rgba(15,23,42,0.04)] ring-1 ring-slate-100 transition active:scale-[0.98]"
                >
                  <Icon3D type={item.icon} size="sm" />
                  <p className="mt-3 text-sm font-bold leading-tight">{item.title}</p>
                  <p className="mt-1 text-[13px] leading-4 text-slate-500">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Vì sao tin tưởng */}
        <section className="w-full px-4 py-5">
          <h3 className="px-2 text-center text-[17px] font-black leading-snug text-slate-900">
            Vì sao phụ huynh tin tưởng?
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4">
            {reasons.map((item) => (
              <article
                key={item.title}
                className="flex items-start gap-3 rounded-[22px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
              >
                <div className="shrink-0">
                  <Icon3D type={item.icon} size="sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[15px] font-bold leading-snug text-slate-900">{item.title}</h4>
                  <p className="mt-1 text-[13px] leading-5 text-slate-600">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3 Bước */}
        <section className="w-full px-4 py-5">
          <h3 className="px-2 text-center text-[17px] font-black leading-snug text-slate-900">
            Bắt đầu chỉ với 3 bước đơn giản
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4">
            {steps.map((step) => (
              <article
                key={step.no}
                className="rounded-[22px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-black text-white shadow-md shadow-blue-200">
                    {step.no}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[15px] font-bold leading-snug text-slate-900">{step.title}</h4>
                    <p className="mt-1 text-[13px] leading-5 text-slate-600">{step.desc}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 py-5">
          <div className="w-full overflow-hidden rounded-[22px] bg-gradient-to-br from-blue-600 to-sky-500 p-5 text-white shadow-[0_12px_32px_rgba(37,99,235,0.25)]">
            <h3 className="text-[17px] font-black leading-snug">Bắt đầu cho bé học miễn phí ngay!</h3>
            <p className="mt-2 text-sm leading-5 text-blue-50">Đồng hành cùng con, học vui mỗi ngày.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <BtnWhite onClick={() => navigate('/home')}>▶ Học miễn phí</BtnWhite>
              <BtnYellow onClick={() => navigate('/pricing')}>🔑 Kích hoạt</BtnYellow>
            </div>
          </div>
        </section>

        {/* Mobile Footer */}
        <footer className="w-full px-4 py-8 text-center text-sm text-slate-500">
          <p>Học Cấp 01 2026</p>
          <p className="mt-1 text-xs">Thiết kế dành cho phụ huynh và học sinh tiểu học</p>
        </footer>
      </div>

      {/* Floating Support Button - Mobile Only - Zalo Link */}
      <a
        href="https://zalo.me/0902964685"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 left-1/2 z-50 inline-flex h-11 -translate-x-1/2 items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-blue-500 to-blue-700 px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-blue-300/40 transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/50 md:hidden"
      >
        🎧 Hỗ trợ mua key
      </a>
    </main>
  );
}
