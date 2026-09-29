// ============================================================================
// MAILCARE OFFLINE-FIRST SERVICE WORKER (PWA CACHE + API FALLBACK)
// ============================================================================

const CACHE_NAME = 'mailcare-offline-v1';
const CORE_ROUTES = [
  '/dashboard',
  '/consumer-inbox',
  '/email-verification',
  '/batch-jobs',
  '/analytics',
  '/integrations',
  '/settings',
  '/manifest.json',
  '/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ROUTES))
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return undefined;
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // For GET navigation & static assets: Network-first, falling back to cache
  if (request.method === 'GET') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallbackDashboard = await caches.match('/dashboard');
          return (
            fallbackDashboard ||
            new Response('MailCare Offline Mode Active', {
              status: 200,
              headers: { 'Content-Type': 'text/plain' },
            })
          );
        })
    );
  }
});
