const cacheName = "cache-v3";

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            cache.addAll([
                "/",
                "/manifest.json",
                "/index.html",
                "/static/media/favicon.png",
                "/static/media/cyclone.png",
                "/static/media/background.png",
                "/static/js/sw.js",
                "/static/js/rsmc.js",
                "/static/js/new_point.js",
                "/static/js/hurdat.js",
                "/static/js/pages.js",
                "/static/js/ibtracs.js",
                "/static/js/manual_input.js",
                "/static/js/generate.js",
                "/static/js/atcf.js",
                "/static/js/file_upload.js",
                "/static/css/style.css"
            ])
                .then(() => { console.log("Cached files!") })
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith((async () => {
        const requestUrl = new URL(e.request.url);
        const isBgImage = requestUrl.pathname === '/static/media/bg8192.png';
        const cache = await caches.open(cacheName);

        if (isBgImage) {
            const cachedBgResponse = await cache.match('/static/media/bg8192.png');
            if (cachedBgResponse) {
                console.log('Returning cached bg image');
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