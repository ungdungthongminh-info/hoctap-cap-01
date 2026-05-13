import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function RootLandingPage() {
  const navigate = useNavigate();

  return (
    <main className="root-landing-page relative min-h-screen overflow-y-auto bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
              onClick={() => navigate('/license/activate')}
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
    </main>
  );
}
