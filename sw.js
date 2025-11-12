// Simple service worker with basic precache + runtime caching and offline fallback.
// This is intentionally small and doesn't require Workbox. It precaches the app
// shell that is stable between builds (root, index.html, manifest, icons) and
// falls back to cache when the network is unavailable.

const CACHE_NAME = 'weekly-schedule-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install: pre-cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  const expectedCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!expectedCaches.includes(key)) return caches.delete(key);
      })
    )).then(() => self.clients.claim())
  );
});

// Fetch: serve from cache first for navigation requests (SPA behavior),
// and try network then cache for other requests with a cache fallback.
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // For navigation requests, respond with index.html (app shell) from cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For other same-origin requests, try network then cache, else cache then fallback
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Optionally update cache for this resource
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match('/index.html'))
      )
    );
  }
  // For cross-origin requests, just try network and fallback to cache if available
});

// Note: If you later switch to a hashed-build output where assets have content hashes
// you can generate a precache list during the build step or switch to Workbox for
// a more advanced caching strategy.