const CACHE_NAME = 'us-states-qr-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  'https://unpkg.com/qr-scanner@1.4.2/qr-scanner.umd.min.js',
  'https://www.youtube.com/iframe_api'
];

// Instalación del Service Worker y guardado en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepción de peticiones de red (Estrategia: Network First con Fallback a Caché)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});