/* Cache only the public application shell. Account/API responses stay on the server. */
const CACHE = "prayer-shell-v1";
self.addEventListener("install", (event) =>
  event.waitUntil(
    (async () => {
      const response = await fetch("/asset-manifest.json", {
        cache: "no-store",
      });
      const manifest = await response.json();
      const assets = Object.values(manifest.files).filter((path) =>
        /\.(js|css)$/.test(path)
      );
      const cache = await caches.open(CACHE);
      await cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/logo192.png",
        "/logo512.png",
        ...assets,
      ]);
    })()
  )
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("prayer-shell-") && key !== CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
);
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (
    event.request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/")
  )
    return;
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/index.html"))
    );
  } else if (
    url.pathname.startsWith("/static/") ||
    ["/logo192.png", "/logo512.png", "/manifest.json"].includes(url.pathname)
  ) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        if (response.ok && response.type === "basic")
          await cache.put(event.request, response.clone());
        return response;
      })
    );
  }
});
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data?.json() || {};
  } catch {
    data.body = event.data?.text();
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "İbadet Takip", {
      body: data.body || "",
      icon: "/logo192.png",
      badge: "/logo192.png",
      tag: data.tag || "prayer-reminder",
      data: { url: "/dashboard" },
    })
  );
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (clients) => {
        for (const client of clients)
          if (new URL(client.url).origin === self.location.origin) {
            await client.navigate("/dashboard");
            return client.focus();
          }
        return self.clients.openWindow("/dashboard");
      })
  );
});
