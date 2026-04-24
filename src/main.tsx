import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/index.css';

document.title = import.meta.env.VITE_APP_TITLE || 'Học Hứng Khởi Tiểu Học';

// ==================== GLOBAL ERROR HANDLERS ====================
// Catch unhandled errors that escape React error boundaries
function renderFatal(message: string) {
  // Prevent overwriting if root already has meaningful content
  const root = document.getElementById('root');
  if (root && root.childElementCount > 0) return;
  document.body.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f8fafc;padding:16px;font-family:Segoe UI,Arial,sans-serif;">
      <div style="max-width:760px;width:100%;background:#fff;border:2px solid #dc2626;border-radius:16px;padding:20px;">
        <h2 style="margin:0 0 8px;color:#991b1b;font-size:20px;">Ứng dụng không khởi động được</h2>
        <p style="margin:0 0 8px;color:#7f1d1d;font-size:13px;">Không thể render app. Thử tải lại hoặc xoá dữ liệu local.</p>
        <pre style="white-space:pre-wrap;color:#dc2626;font-size:12px;margin:0 0 12px;">${message}</pre>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button onclick="location.reload();" style="background:#111827;color:#fff;border:none;border-radius:8px;padding:8px 12px;font-size:12px;cursor:pointer;">Tải lại trang</button>
          <button onclick="localStorage.removeItem('hhk_app_state'); location.reload();" style="background:#fee2e2;color:#991b1b;border:1px solid #fca5a5;border-radius:8px;padding:8px 12px;font-size:12px;cursor:pointer;">Xoá cache và tải lại</button>
        </div>
      </div>
    </div>
  `;
}

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  const msg = event.error instanceof Error ? `${event.error.name}: ${event.error.message}` : String(event.message);
  renderFatal(msg);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  const msg = event.reason instanceof Error ? `${event.reason.name}: ${event.reason.message}` : String(event.reason);
  renderFatal(msg);
});

// ==================== SW CLEANUP ====================
async function cleanupLocalPwaArtifacts() {
  try {
    const isLocalHost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (!isLocalHost) return;

    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }

    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {
    // ignore - best-effort cleanup
  }
}

// ==================== BOOT ====================
async function boot() {
  try {
    // Cleanup stale SW caches BEFORE rendering to prevent serving old JS
    await cleanupLocalPwaArtifacts();

    const rootEl = document.getElementById('root');
    if (!rootEl) {
      renderFatal('Khong tim thay #root trong index.html');
      return;
    }

    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    renderFatal(msg);
  }
}

boot();
