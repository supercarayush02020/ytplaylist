const CACHE_NAME = 'video-library-v2'; // Increment version to force update
const urlsToCache = [
    '/',
    '/index.html', // Main HTML file
    '/manifest.json',       // Manifest file
    '/service-worker.js',   // Service Worker itself
    
    // Core Data Files (Crucial for offline loading)
    '/asmr.csv',            
    '/Songs 2023.csv',      
    '/Podcasts.csv',        
    '/studywithme.csv',     
    
    // External Assets
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' 
    // Add icon paths here if you create them:
    // '/icons/icon-192.png',
    // '/icons/icon-512.png'
];

// 1. Installation: Caches all necessary files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing and caching assets.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// 2. Fetching: Serves files from cache first, falling back to network
self.addEventListener('fetch', event => {
    // Only cache requests for local assets or the Font Awesome CDN
    const requestUrl = new URL(event.request.url);
    if (requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:') {
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
    }
});

// 3. Activation: Cleans up old caches (e.g., v1)
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating and cleaning old caches.');
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
