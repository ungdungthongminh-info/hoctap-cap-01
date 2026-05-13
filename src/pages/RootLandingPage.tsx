import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Monitor, Sparkles, Users } from 'lucide-react';

const BENEFITS = [
  {
    title: 'Dễ dùng trên máy tính',
    description: 'Giao diện máy tính dễ dùng.',
    icon: Monitor,
  },
  {
    title: 'Học thử miễn phí',
    description: 'Học thử miễn phí trước khi kích hoạt.',
    icon: Sparkles,
  },
  {
    title: 'Phụ huynh đồng hành',
    description: 'Phụ huynh cũng theo dõi tiến độ.',
    icon: Users,
  },
];

export function RootLandingPage() {
  const navigate = useNavigate();

  return (
    <main className="root-landing-page relative min-h-screen overflow-y-auto bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[32px] bg-white/90 px-5 py-4 shadow-card backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-950 text-white shadow-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-600">Học Cấp 01</p>
              <p className="text-sm font-semibold text-slate-950">Phụ huynh đồng hành cùng con</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
              onClick={() => navigate('/home')}
            >
              Học miễn phí
            </button>
            <button
              className="rounded-full bg-amber-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-amber-300"
              onClick={() => navigate('/license/activate')}
            >
              Kích hoạt key
            </button>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-slate-100 via-sky-50 to-white px-6 py-10 shadow-card sm:px-10 lg:px-12">
          <div className="pointer-events-none absolute -right-10 top-8 h-56 w-56 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="pointer-events-none absolute left-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-amber-200/20 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="relative z-10">
              <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
                Học Cấp 01
              </span>
              <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                Công cụ phụ huynh đồng hành cùng con học tiểu học
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Ứng dụng học trực quan, bài học bám sát sách giáo khoa và khơi gợi hứng thú cho bé ngay lần đầu dùng.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  className="root-landing-primary-btn inline-flex min-w-[180px] items-center justify-center bg-slate-950 text-white transition hover:bg-slate-800"
                  onClick={() => navigate('/home')}
                >
                  Học miễn phí ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button
                  className="root-landing-primary-btn inline-flex min-w-[180px] items-center justify-center border border-slate-300 bg-white text-slate-950 transition hover:bg-slate-100"
                  onClick={() => navigate('/license/activate')}
                >
                  Kích hoạt key
                </button>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <div className="flex items-start gap-3 rounded-[24px] bg-white px-4 py-4 shadow-sm">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <Monitor className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Dễ dùng trên máy tính</p>
                    <p className="text-sm text-slate-600">Giao diện đơn giản, phù hợp bé và phụ huynh.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-[24px] bg-white px-4 py-4 shadow-sm">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Học thử miễn phí</p>
                    <p className="text-sm text-slate-600">Vào app ngay, dùng trước khi kích hoạt key.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-[24px] bg-white px-4 py-4 shadow-sm">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Users className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Phụ huynh đồng hành</p>
                    <p className="text-sm text-slate-600">Theo dõi tiến độ và hỗ trợ con mỗi buổi học.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="root-landing-visual">
              <img
                src="/image/landing-hero.jpg"
                alt="Phụ huynh đồng hành cùng con học tiểu học"
                className="root-landing-hero-image"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 sm:grid-cols-3">
          {BENEFITS.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 text-center shadow-card transition hover:-translate-y-1 hover:shadow-hover">
                <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-50 text-sky-700">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-10 grid gap-8 rounded-[32px] bg-white px-6 py-8 shadow-card sm:px-10 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-12 lg:py-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Xem trước app</p>
            <h2 className="mt-4 max-w-xl text-3xl font-bold text-slate-950 sm:text-4xl">
              Giao diện học trực quan, phù hợp cho bé và phụ huynh.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
              Màn hình bài học rõ ràng, tiến độ học tập và nội dung dễ theo dõi.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">Lộ trình rõ ràng</p>
                <p className="text-sm text-slate-600">Học theo chủ đề, dễ theo dõi tiến độ từng ngày.</p>
              </div>
              <div className="rounded-[28px] bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">Trực quan cho phụ huynh</p>
                <p className="text-sm text-slate-600">Xem nhanh kết quả và hỗ trợ con dễ hơn.</p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-card">
            <div className="mb-4 rounded-[24px] bg-slate-950 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-100">
              Giao diện app
            </div>
            <img
              src="/image/landing-app-preview.jpg"
              alt="Giao diện app Học Cấp 01"
              className="root-landing-preview-image"
              loading="lazy"
              decoding="async"
            />
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Mockup giao diện giúp phụ huynh thấy app thật sự rõ ràng và hiện đại.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-[32px] bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 px-6 py-10 text-white shadow-card sm:px-10 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">Bắt đầu ngay</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight">Bắt đầu cho bé học miễn phí ngay hôm nay</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className="root-landing-primary-btn inline-flex min-w-[160px] items-center justify-center bg-amber-400 text-slate-950 transition hover:bg-amber-300"
                onClick={() => navigate('/home')}
              >
                Học miễn phí
              </button>
              <button
                className="root-landing-primary-btn inline-flex min-w-[160px] items-center justify-center border border-white/20 bg-white/10 text-white transition hover:bg-white/15"
                onClick={() => navigate('/license/activate')}
              >
                Kích hoạt key
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-10 py-6 text-center text-sm text-slate-500">
          Học Cấp 01 © 2026. Thiết kế dành cho phụ huynh và học sinh tiểu học.
        </footer>
      </div>
    </main>
  );
}
