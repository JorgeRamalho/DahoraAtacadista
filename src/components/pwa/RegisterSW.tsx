"use client";

import { useEffect } from "react";
import { PWA_CACHE_PREFIX, PWA_SW_PATH } from "@/lib/pwa/identity";

/** Remove SWs/caches de Carona, Trampolim ou qualquer outro app no mesmo origin. */
async function purgeForeignWorkers() {
  if (!("serviceWorker" in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations.map(async (reg) => {
      const scriptUrl =
        reg.active?.scriptURL ||
        reg.waiting?.scriptURL ||
        reg.installing?.scriptURL ||
        "";
      const isDahora = scriptUrl.endsWith(PWA_SW_PATH);
      if (!isDahora) {
        await reg.unregister();
      }
    })
  );

  if (!("caches" in window)) return;
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => !key.startsWith(PWA_CACHE_PREFIX))
      .map((key) => caches.delete(key))
  );
}

export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        await purgeForeignWorkers();

        const registration = await navigator.serviceWorker.register(PWA_SW_PATH, {
          scope: "/",
          updateViaCache: "none",
        });

        await registration.update();

        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              worker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      } catch (error) {
        console.warn("[PWA] Falha ao registrar service worker Dahora:", error);
      }
    };

    void register();
  }, []);

  return null;
}
