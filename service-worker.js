const appPrefix = 'TrackGen';
const appVersion = 'v1.0.1';
const cacheName = `${appPrefix}-${appVersion}`;
const filesToCache = [
    '/',
    'manifest.json',
    'index.html',
    'static/media/favicon.png',
    'static/media/cyclone.png',
    'static/media/background.png',
    'static/media/bg8192.png',
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
    e.respondWith((async () => {
        cache.match(e.request).then(function(response) {
            if (response) {
                console.log('Returning cached response: ', response);
                return response;
            }
            console.log('Fetching request from the network: ', e.request.url);
            return fetch(e.request);
        })
    })());
});

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log("Installing cache: " + cacheName);
            cache.addAll(filesToCache)
                .then(() => { console.log("Cached files!") })
        })
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log("Deleting old cache: " + cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});