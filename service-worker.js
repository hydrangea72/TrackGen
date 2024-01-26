const appPrefix = 'TrackGen';
const appVersion = 'v1.0.5';
const cacheName = `${appPrefix}-${appVersion}`;
const foldersToCache = ['media', 'js', 'css'];
const additionalCache = ['/', 'manifest.json', 'index.html'];

let filesToCache;

async function generateFilesToCache() {
    const filesToCache = [];

    for (const folder of foldersToCache) {
        const folderFiles = await fetch(`/${folder}/`).then(response => response.text());
        const regex = /href="([^"]+\.(png|jpg|jpeg|jxl|webp|js|css))"/g;
        let match;

        while ((match = regex.exec(folderFiles)) !== null) {
            filesToCache.push(`/${folder}/${match[1]}`);
        }
    }

    filesToCache.push(...additionalCache);

    return filesToCache;
}

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

self.addEventListener("install", (event) => {
    event.waitUntil(
        generateFilesToCache().then((files) => {
            return caches.open(cacheName).then((cache) => {
                return cache.addAll(files);
            });
        })
    );
});

self.addEventListener("fetch", async (event) => {
    if (isCachable(event.request)) {
        event.respondWith(await cacheFirstWithRefresh(event.request));
        console.log(`Serving ${event.request.url} from cache.`);
    }
});