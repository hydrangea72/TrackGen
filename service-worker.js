const appPrefix = 'TrackGen';
const appVersion = 'v1.0.2';
const cacheName = `${appPrefix}-${appVersion}`;
const filesToCache = [
    '/',
    'manifest.json',
    'index.html',
    'static/media/favicon.png',
    'static/media/cyclone.png',
    'static/media/background.png',
    'static/media/bg8192.png',
    'static/media/bg12000.jpg',
    'static/js/sw.js',
    'static/js/rsmc.js',
    'static/js/new_point.js',
    'static/js/hurdat.js',
    'static/js/pages.js',
    'static/js/ibtracs.js',
    'static/js/manual_input.js',
    'static/js/generate.js',
    'static/js/atcf.js',
    'static/js/file_upload.js',
    'static/css/style.css'
];

self.addEventListener('fetch', e => {
    console.log('Fetch event for ', e.request.url);
    e.respondWith(
        caches.match(e.request).then(request => {
            if (request) {
                console.log("Found in cache, returning cached response: " + e.request.url);
                return request;
            }
            console.log("Not found in cache, fetching request from the network: " + e.request.url);
            return fetch(e.request);
        }).catch(error => {
            console.error("Fetch failed: " + error);
            throw error;
        })
    );
});

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log("Installing cache: " + cacheName);
            return cache.addAll(filesToCache)
        }).then(() => {
            console.log("Cached files!");
        }).catch(error => {
            console.error("Installation failed: " + error);
        })
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== cacheName)
                    .map(name => caches.delete(name))
            );
            console.log("Old caches deleted!");
        })
    );
});