import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

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
          Học Cấp 01 © 2026. Thiết kế dành cho phụ huynh và học sinh tiểu học.
        </footer>
      </div>

      {/* ===================== MOBILE ONLY (md:hidden) ===================== */}
      <div className="md:hidden min-h-screen bg-slate-100">
        {/* Mobile Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-white/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 text-2xl text-white shadow-lg shadow-blue-100">
              📖
            </div>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-blue-700">Học Cấp 01</p>
              <p className="text-xs font-medium text-slate-600">Phụ huynh đồng hành cùng con</p>
            </div>
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl shadow-sm ring-1 ring-slate-100">
            ☰
          </button>
        </header>

        {/* Mobile Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white px-4 pb-5 pt-4">
          <div className="pointer-events-none absolute right-4 top-10 h-40 w-40 rounded-full bg-blue-100/60 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 -right-8 h-44 w-44 rounded-full bg-yellow-100/70 blur-2xl" />

          <div className="relative">
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
        </section>

        {/* Quick Actions */}
        <section className="px-4 py-4">
          <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-xl font-black text-slate-900">Thao tác nhanh</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {quickActions.map((item, index) => (
                <button
                  key={item.title}
                  onClick={() => {
                    if (item.title.includes('Kích hoạt')) navigate('/pricing');
                    else if (item.title.includes('Học')) navigate('/home');
                    else if (item.title.includes('Tải')) {
                      // Open Windows download - use direct link or navigate
                      window.open('https://hoctap.ungdungthongminh.info/download', '_blank');
                    }
                    else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
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

        {/* Vì sao tin tưởng */}
        <section className="px-4 py-2">
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

        {/* 3 Bước */}
        <section className="px-4 py-5">
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
        <section className="px-4 py-3 pb-28">
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

        {/* Mobile Footer */}
        <footer className="px-4 py-6 text-center text-sm text-slate-500">
          Học Cấp 01 © 2026. Thiết kế dành cho phụ huynh và học sinh tiểu học.
        </footer>
      </div>

      {/* Floating Support Button - Mobile Only */}
      <button
        onClick={() => navigate('/pricing')}
        className="fixed bottom-5 left-1/2 z-50 inline-flex h-12 -translate-x-1/2 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white shadow-xl shadow-blue-300/50 transition active:scale-[0.98] md:hidden"
      >
        🎧 Hỗ trợ mua key
      </button>
    </main>
  );
}
