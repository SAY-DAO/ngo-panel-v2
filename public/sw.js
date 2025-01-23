const staticCacheName = 'SAY-GateWay-v2.5.0';
const urlsToCache = [
    '/',
  'manifest.json',
  'static/js/main.3bf525be.js',
  'static/css/main.b423f4ae.css',
  'static/js/6271.e961a0cf.chunk.js',
  'static/js/6720.1ef4c670.chunk.js',
  'static/js/5883.c607f9f5.chunk.js',
  'static/js/5761.a269a5d7.chunk.js',
  'static/js/3172.16ffaacb.chunk.js',
  'static/js/9709.97f0cb36.chunk.js',
  'static/js/2589.087bc8a8.chunk.js',
  'static/js/4366.e48f042a.chunk.js',
  'static/js/9619.25fcd95a.chunk.js',
  'static/js/1640.fe34aba8.chunk.js',
  'static/js/7187.f3f89502.chunk.js',
  'static/js/4330.8865ce0a.chunk.js',
  'static/js/7639.1060762b.chunk.js',
  'static/js/2827.e29c4af6.chunk.js',
  'static/js/1918.61a4da84.chunk.js',
  'static/js/6386.aaa34879.chunk.js',
  'static/js/8891.4ae7ede2.chunk.js',
  'static/js/4379.6ff51fd8.chunk.js',
  'static/js/6161.6f5880d7.chunk.js',
  'static/js/8275.9ee976ae.chunk.js',
  'static/js/4731.15e4466a.chunk.js',
  'static/js/6644.936751f8.chunk.js',
  'static/js/7477.0efceccc.chunk.js',
  'static/js/2395.d593d52f.chunk.js',
  'static/js/1211.aac28760.chunk.js',
  'static/js/4156.2f9d01ee.chunk.js',
  'static/js/9288.e85546de.chunk.js',
  'static/js/7315.8d6c409b.chunk.js',
  'static/js/9423.ded366d7.chunk.js',
  'static/js/2961.a0702fbe.chunk.js',
  'static/js/4529.cebabf3f.chunk.js',
  'static/js/5448.462e5b20.chunk.js',
  'static/css/3353.e062e504.chunk.css',
  'static/js/3353.3910d89b.chunk.js',
  'static/media/iranyekanwebbold.b163d295bd96f0917484.woff',
  'static/media/iranyekanwebbold.f1483d0d5baf60834d39.ttf',
  'static/media/iranyekanwebregular.8504883522cc498c424c.woff',
  'static/media/iranyekanwebregular.532d4e8b25f83f6f5105.ttf',
  'static/media/iranyekanwebmedium.67f31143e304e1132bdc.woff',
  'static/media/iranyekanwebmedium.5e4e58d1b969750544ef.ttf',
  'static/media/summer.8dfbc4d37aa840be927f.jpeg',
  'assets/locales/translations/fa.json',
  'assets/locales/translations/en.json',
  'images/logo2.png',
  'favicon.png'
];

const self = this;

// install Service Worker and save cache to Application - Cache
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing service worker');
  self.skipWaiting(); // to take over old service worker without waiting for session to be finishes e,g: opening new tab

  event.waitUntil(
    caches
      .open(staticCacheName)
      .then((cache) => {
        console.log('Service Worker: Caching');
        cache.addAll(urlsToCache);
      })
      .catch((e) => console.log({e})),
  );
});

// activate
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating new service worker...');
  const cacheAllowlist = [staticCacheName];

  // remove unwanted caches
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old service worker...');
            return caches.delete(cacheName);
          }
        }),
      ),
    ),
  );
});

// fetch
self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching ', event.request.url);
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        console.log('Network request for ', event.request.url);
        return fetch(event.request);

        // TODO 4 - Add fetched files to the cache
      })
      .catch((error) => {
        console.log(error);
        // TODO 6 - Respond with custom offline page
      }),
  );
});
