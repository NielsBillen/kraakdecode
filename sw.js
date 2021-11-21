/*global self, caches, fetch*/
/*version 1.0.7*/

const CACHE_NAME = "offline-kraak-de-code-cache";

self.addEventListener('install', function (event) {
    "use strict";
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll([
                './js/ComicNeue-bold.js',
                './js/ComicNeue-Bold-bold.js',
                './js/drawer.js',
                './js/jspdf.umd.min.js',
                './js/jspdf.umd.min.js.map',
                './icons/icon.svg',
                './icons/icon-32.png',
                './icons/icon-64.png',
                './icons/icon-128.png',
                './icons/icon-144.png',
                './icons/icon-256.png',
                './icons/icon-512.png',
                './icons/icon-1024.png',
                './fonts/ComicNeue-Bold.ttf',
                './fonts/ComicNeue-Bold.woff',
                './fonts/ComicNeue-Bold.woff2',
                './index.html',                
                './manifest.json',
                './sw.js'
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    "use strict";
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetchAndCache(event.request);
        })
    );
});

function fetchAndCache (url) {
    "use strict";
    return fetch(url).then(function (response) {
        // Check if we received a valid response
        if (!response.ok) {
            throw Error(response.statusText, url);
        }
    
        return caches.open(CACHE_NAME).then(function (cache) {
            cache.put(url, response.clone());
            return response;
        });
    }).catch(function(error) {
        console.log('Request failed:', error, url);
        // You could return a custom offline 404 page here
    });
}
