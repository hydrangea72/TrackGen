const appPrefix = 'TrackGen';
const appVersion = 'v1.0.0';
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
                "manifest.json",
                "index.html",
                "static/media/favicon.png",
                "static/media/cyclone.png",
                "static/media/background.png",
                "static/js/sw.js",
                "static/js/rsmc.js",
                "static/js/new_point.js",
                "static/js/hurdat.js",
                "static/js/pages.js",
                "static/js/ibtracs.js",
                "static/js/manual_input.js",
                "static/js/generate.js",
                "static/js/atcf.js",
                "static/js/file_upload.js",
                "static/css/style.css"
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