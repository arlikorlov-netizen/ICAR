/*
  БЛОК 17: service-worker.js v1
  Для PWA на iPhone
*/

const CACHE_NAME = 'icar-pwa-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/app.js',
  '/manifest.json',
  '/fonts/CrySis-Bold.ttf',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/assets/human-figure.png'
];

// Установка
self.addEventListener('install', event => {
  console.log('Service Worker: Установка');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Кэширование файлов');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация
self.addEventListener('activate', event => {
  console.log('Service Worker: Активация');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Очистка старого кэша', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Запросы
self.addEventListener('fetch', event => {
  // Пропускаем не-GET запросы
  if (event.request.method !== 'GET') return;
  
  // Пропускаем chrome-extension://
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Возвращаем кэшированный ответ если есть
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Иначе загружаем из сети
        return fetch(event.request)
          .then(response => {
            // Клонируем ответ
            const responseClone = response.clone();
            
            // Кэшируем только успешные ответы
            if (response.status === 200) {
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
            }
            
            return response;
          })
          .catch(() => {
            // Оффлайн-страница
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            return new Response('Оффлайн режим');
          });
      })
  );
});