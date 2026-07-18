/** K3D Service Worker (PWA).
* Strategy designed for an app authenticated by cookie:
*  - Navigations (HTML): network-first with fallback to /offline. Does NOT cache
*    the response, avoiding storing session content on the device.
*  - Public statics (_next/static, icons, fonts): stale-while-revalidate.
*  - Other requests go straight to the network.
* Also includes push/notificationclick handlers ready for future use.
**/

const VERSION = "v1";
const PRECACHE = `k3d-precache-${VERSION}`;
const RUNTIME = `k3d-runtime-${VERSION}`;

const PRECACHE_URLS = ["/offline", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== PRECACHE && key !== RUNTIME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Cache-first com revalidação em segundo plano para estáticos públicos.
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    PRECACHE_URLS.includes(url.pathname) ||
    /\.(?:png|jpg|jpeg|svg|gif|ico|webp|woff2?)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(
        async () => (await caches.match("/offline")) || Response.error(),
      ),
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Notificações push (requer chaves VAPID e backend para serem enviadas).
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || "Kria 3D", {
      body: data.body,
      icon: data.icon || "/icon-192.png",
      badge: "/icon-192.png",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow("/inicio"));
});
