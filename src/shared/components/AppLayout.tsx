import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { PageTransition } from './PageTransition';
import { MascotChatPanel } from './MascotChatPanel';
import { InternalBuildBanner } from './AccessGuard';

export function AppLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <InternalBuildBanner />
        <PageTransition key={location.pathname}>
          {children ?? <Outlet />}
        </PageTransition>
      </main>
      <MascotChatPanel />
    </div>
  );
}
