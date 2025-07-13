const CACHE_NAME = 'lista-compras-cache-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  '/icon-192.png',
  '/icon-512.png'
];

// Instala el service worker y guarda los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activa el service worker y elimina cachés viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      )
    )
  );
});

// Intercepta las solicitudes y responde desde caché o red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response =>
        response || fetch(event.request).catch(() =>
          new Response('⚠️ Recurso no disponible sin conexión.')
        )
      )
  );
});
