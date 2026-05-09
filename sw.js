const CACHE = 'namaste-v1';

const PRECACHE = [
  '/home.html',
  '/app.css',
  '/images/pexels-polina-kovaleva-6019787.jpg',
  '/images/pic1.jpg',
  '/images/pic6.jpg',
  '/images/pic7.jpg',
  '/images/tea.jpg',
  '/images/urdamuka.jpg',
  '/images/yogastudio.jpeg',
  '/images/newlogo.png',
  '/teachersimages/linda.jpeg',
  '/teachersimages/sophia.jpeg',
  '/teachersimages/rob.jpeg',
  '/teachersimages/ella.jpeg',
  '/teachersimages/liv.jpeg',
  '/teachersimages/ral.jpeg',
];

// Install: cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first, fall back to network
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
