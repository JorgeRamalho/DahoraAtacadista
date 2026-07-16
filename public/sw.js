/**
 * Stub legado — Carona/Trampolim também usavam /sw.js no localhost:3000.
 * Este arquivo só se desregistra e limpa caches estranhos; o SW real do Dahora é
 * /sw-dahora-atacadista.js na porta 3010.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => /carona|trampolim|eletrolar/i.test(key) || key.startsWith("dahora-static-"))
          .map((key) => caches.delete(key))
      );
      const regs = await self.registration.unregister();
      await self.clients.claim();
      return regs;
    })()
  );
});
