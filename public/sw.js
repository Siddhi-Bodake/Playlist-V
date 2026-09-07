// Minimal offline shell for "For Vishuu".
// This caches the app's own UI so the site can still open with no signal —
// it does NOT cache or proxy YouTube audio/video in any way. Songs still
// need an internet connection; see /offline and the OfflineBanner component.

const CACHE_NAME = "for-vishuu-shell-v2";
const OFFLINE_URL = "/offline";
const PRECACHE_URLS = [OFFLINE_URL, "/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Leave everything cross-origin (YouTube, fonts CDNs, etc.) to the network.
  if (url.origin !== self.location.origin) return;

  // Page navigations: try the network, fall back to the cached shell/offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(
        async () => (await caches.match(request)) || (await caches.match(OFFLINE_URL))
      )
    );
    return;
  }

  // Static build assets and generated icons: cache-first, refresh in the background.
  if (url.pathname.startsWith("/_next/static") || url.pathname.startsWith("/icons")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});
