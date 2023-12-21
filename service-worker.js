const appPrefix = 'TrackGen';
const appVersion = 'v1.0.5';
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

function isCachable(request) {
    const url = new URL(request.url);
    return url.origin === location.origin && filesToCache.includes(url.pathname);
}

async function cacheFirstWithRefresh(request) {
    try {
        const fetchResponsePromise = fetch(request).then(async (networkResponse) => {
            if (networkResponse.ok) {
                const cache = await caches.open(cacheName);
                cache.put(request, networkResponse.clone());
            }
            console.log(`Fetched URL ${request.url} from network.`);
            return networkResponse;
        });

        return Promise.race([
            fetchResponsePromise,
            caches.match(request)
        ]);
    } catch (error) {
        console.error(`Failed to fetch ${request.url} from cache or network.`);
        throw error;
    }
}

self.addEventListener("fetch", async (event) => {
    if (isCachable(event.request)) {
        event.respondWith(await cacheFirstWithRefresh(event.request));
        console.log(`Serving ${event.request.url} from cache.`);
    }
});