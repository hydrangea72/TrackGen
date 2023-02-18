const appPrefix = 'TrackGen';
const appVersion = 'v1';
const cacheName = `${appPrefix}-${appVersion}`;

self.addEventListener('fetch', e => {
    console.log('Fetch event for ', e.request.url);
    e.respondWith((async () => {
        const requestUrl = new URL(e.request.url);
        const isBgImage = requestUrl.pathname === 'TrackGen/static/media/bg8192.png';
        const cache = await caches.open(cacheName);

        if (isBgImage) {
            const cachedBgResponse = await cache.match('TrackGen/static/media/bg8192.png');
            if (cachedBgResponse) {
                console.log('Returning cached background image...');
                return cachedBgResponse;
            }
        }

        const response = await cache.match(e.request) || fetch(e.request);

        console.log('Fetching', e.request.url);

        console.log('Caching', e.request.url);

        await cache.put(e.request, response.clone());

        return response;
    })());
});

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log("Installing cache: " + cacheName);
            cache.addAll([
                "/",
                "/TrackGen/",
                "/TrackGen/manifest.json",
                "/TrackGen/index.html",
                "/TrackGen/static/media/favicon.png",
                "/TrackGen/static/media/cyclone.png",
                "/TrackGen/static/media/background.png",
                "/TrackGen/static/js/sw.js",
                "/TrackGen/static/js/rsmc.js",
                "/TrackGen/static/js/new_point.js",
                "/TrackGen/static/js/hurdat.js",
                "/TrackGen/static/js/pages.js",
                "/TrackGen/static/js/ibtracs.js",
                "/TrackGen/static/js/manual_input.js",
                "/TrackGen/static/js/generate.js",
                "/TrackGen/static/js/atcf.js",
                "/TrackGen/static/js/file_upload.js",
                "/TrackGen/static/css/style.css"
            ])
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