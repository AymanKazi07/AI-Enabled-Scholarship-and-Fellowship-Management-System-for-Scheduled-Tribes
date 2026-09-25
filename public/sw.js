const CACHE = 'tribal-setu-shell-v4';
const home = self.registration.scope;
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const page = await fetch(home);
    if (!page.ok) return;
    const html = await page.clone().text();
    await cache.put(home, page);
    const assets = [...html.matchAll(/(?:src|href)="(\.?\/assets\/[^"]+)"/g)].map(match => match[1]);
    await cache.addAll(assets.map(asset => new URL(asset, home).href));
  })());
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(home, response.clone()));
      return response;
    }).catch(() => caches.match(home)));
  } else if (url.pathname.startsWith(new URL('assets/', home).pathname)) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
      return response;
    })));
  }
});
