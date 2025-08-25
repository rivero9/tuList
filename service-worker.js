const CACHE_NAME = 'tulist-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/main.js',
  '/styles/normalize.css',
  '/styles/style.css',
  '/styles/welcome.css',
  // Temas CSS
  '/styles/themes/dark.css',
  '/styles/themes/green.css',
  '/styles/themes/red.css',
  '/styles/themes/yellow.css',
  // Iconos
  '/styles/icons/favicon.ico',
  '/styles/icons/close.png',
  '/styles/icons/outside.png',
  '/styles/icons/clear.png',
  '/styles/icons/clear-item.png',
  '/styles/icons/edit.png',
  '/styles/icons/checkout.png',
  '/styles/themes/icons/close.png',
  '/styles/themes/icons/outside.png',
  // Librerías externas
  'https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js'
];


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache abierta. Agregando URLs a la caché.');
        return cache.addAll(urlsToCache)
          .catch(error => {
            console.error('Service Worker: Fallo al cachear algunas URLs:', error);
          });
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Si el recurso está en la caché, lo devolvemos
      if (response) {
        return response;
      }
      // Si no está en caché, intentamos obtenerlo de la red
      return fetch(event.request).then(
        networkResponse => {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }
      ).catch(() => {
        console.error('Service Worker: Fallo de red para la solicitud:', event.request.url);
      });
    })
  );
});
