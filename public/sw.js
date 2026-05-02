const CACHE_NAME = 'hhk-v4';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './offline.html',
  './icon-192.svg',
  './icon-512.svg',
  './audio/tts/manifest.json',
];

// Install — cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network-first for navigations, cache-first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin
  if (event.request.method !== 'GET') return;
  if (url.origin !== location.origin) return;
  if (url.pathname.includes('/api/')) return;

  // Skip binary download routes — never cache EXE, blockmap, or audio ZIPs
  if (url.pathname.startsWith('/desktop-updates/') || url.pathname.startsWith('/tts-static-pack/')) {
    return;
  }

  // HTML navigations → network-first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          if (res.ok) {
            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          }
          return res;
        })
        .catch(async () => {
          const cachedPage = await caches.match(event.request);
          if (cachedPage) return cachedPage;
          return caches.match('./offline.html');
        })
    );
    return;
  }

  // Assets (JS, CSS, images) → stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          }
          return res;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
