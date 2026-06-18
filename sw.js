const CACHE = 'wavemeet-v3';
const CORE  = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(CORE.map(u => c.add(u)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Don't cache API calls or external scripts
  const url = e.request.url;
  if (url.includes('/api/')) return;
  if (url.includes('firebasejs')) return;
  if (url.includes('flutterwave')) return;
  if (url.includes('peerjs')) return;
  if (url.includes('googleapis')) return;
  if (url.includes('ibb.co')) return;

  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request)
        .then(res => {
          // Cache successful responses for our own pages
          if (res.ok && url.includes(self.location.origin)) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match('/'))
      )
  );
});
