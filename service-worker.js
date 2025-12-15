const CACHE_NAME = 'asmr-library-v1';
const urlsToCache = [
    '/',
    '/asmr_videos_pwa.html', // The main HTML file
    '/manifest.json',       // The manifest file
    '/service-worker.js',   // The service worker itself
    '/asmr.csv',            // Your video data file (crucial for offline)
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' // External CSS
    // Add your icon files here if you create them:
    // '/icons/icon-192.png',
    // '/icons/icon-512.png'
];

// 1. Installation: Caches all necessary files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and added core assets');
                return cache.addAll(urlsToCache);
            })
    );
});

// 2. Fetching: Serves files from cache first, falling back to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request);
            })
    );
});

// 3. Activation: Cleans up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
