/**
 * NexcoinPR Service Worker
 * Enables offline support, app caching, and TWA Google Play Store eligibility.
 * Version: 1.0.0
 */

const CACHE_VERSION = 'nexcoinpr-v1.0.0';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Core assets to pre-cache on install (app shell)
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/news.html',
  '/pricing.html',
  '/contact.html',
  '/press-releases.html',
  '/press-release-distribution.html',
  '/markets.html',
  '/services.html',
  '/about.html',
  '/site.webmanifest',
  '/assets/images/android-chrome-192x192.png',
  '/assets/images/android-chrome-512x512.png',
  '/assets/images/apple-touch-icon.png',
  '/offline.html'
];

// ─── INSTALL: Pre-cache the app shell ────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(CORE_ASSETS.filter(url => !url.endsWith('.html') || url === '/offline.html' || url === '/index.html'));
    }).then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE: Clean up old caches ───────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// ─── FETCH: Network-first for HTML, cache-first for assets ───────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // HTML pages: network-first with offline fallback
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('/offline.html')))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, responseClone));
        }
        return response;
      });
    })
  );
});

// ─── PUSH NOTIFICATIONS (future) ─────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'NexcoinPR', {
      body: data.body || 'New update from NexcoinPR',
      icon: '/assets/images/android-chrome-192x192.png',
      badge: '/assets/images/favicon-48x48.png',
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
