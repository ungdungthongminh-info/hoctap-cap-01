import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Laptop2 } from 'lucide-react';

const BENEFITS = [
  {
    title: 'Dễ dùng trên máy tính',
    description: 'Giao diện tinh gọn, nút lớn, phù hợp phụ huynh và học sinh tiểu học.',
  },
  {
    title: 'Học thử miễn phí',
    description: 'Vào app ngay để dùng gói Free trước khi kích hoạt key.',
  },
  {
    title: 'Phụ huynh dễ đồng hành',
    description: 'Tổng quan rõ ràng để cha mẹ hỗ trợ con học tại nhà.',
  },
];

export function RootLandingPage() {
  const navigate = useNavigate();

  return (
    <main className="root-landing-simple min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex max-w-[1120px] flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-[28px] bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-950 text-white shadow-sm">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Học Cấp 01</p>
              <p className="text-lg font-semibold text-slate-950">Tiểu học dễ tiếp cận</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              onClick={() => navigate('/home')}
            >
              Học miễn phí
            </button>
            <button
              className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={() => navigate('/license/activate')}
            >
              Kích hoạt key
            </button>
          </div>
        </header>

        <section className="grid gap-8 rounded-[32px] bg-white px-6 py-8 shadow-sm sm:grid-cols-[1fr_0.95fr] sm:px-10 sm:py-12">
          <div className="space-y-6">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Landing phụ huynh</div>
            <h1 className="max-w-xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              Công cụ hỗ trợ phụ huynh đồng hành cùng con học tiểu học
            </h1>
            <p className="max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Bé có thể học thử miễn phí, luyện tập nhẹ nhàng tại nhà và kích hoạt key khi cần mở thêm tính năng.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-slate-800"
                onClick={() => navigate('/home')}
              >
                Học miễn phí ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                onClick={() => navigate('/license/activate')}
              >
                Kích hoạt key
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="rounded-[26px] bg-gradient-to-br from-sky-500 via-sky-400 to-amber-300 p-6 text-white shadow-lg">
                <div className="mb-5 flex h-60 items-center justify-center rounded-[24px] bg-white/10">
                  <Laptop2 className="h-16 w-16 text-white" />
                </div>
                <div className="text-sm leading-7 text-white/90">
                  Giao diện học đơn giản, không rối, dành cho phụ huynh và con học tiểu học.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[32px] bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Lợi ích</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">3 lý do nên chọn Học Cấp 01</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {BENEFITS.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 text-lg font-semibold text-slate-950">{item.title}</div>
                <div className="text-sm leading-6 text-slate-600">{item.description}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[28px] bg-slate-950 px-6 py-8 text-white shadow-sm sm:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Bắt đầu ngay</p>
              <h2 className="mt-3 text-3xl font-bold">Bắt đầu học miễn phí ngay</h2>
            </div>
            <button
              className="inline-flex items-center justify-center rounded-2xl bg-amber-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-amber-300"
              onClick={() => navigate('/home')}
            >
              Học miễn phí ngay
            </button>
          </div>
        </section>

        <footer className="mt-12 py-6 text-center text-sm text-slate-500">
          Học Cấp 01 © 2026. Phụ huynh đồng hành cùng con học tiểu học.
        </footer>
      </div>
    </main>
  );
}
