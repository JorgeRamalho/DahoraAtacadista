"use client";

import { useEffect } from "react";
import { forceDahoraTitle } from "@/lib/pwa/title";
import { brand } from "@/lib/brand";

/** Garante título Dahora Atacadista — remove resíduos de Carona/Trampolim. */
export function PwaIdentity() {
  useEffect(() => {
    const apply = () => {
      document.title = forceDahoraTitle(document.title);

      document
        .querySelector('meta[name="application-name"]')
        ?.setAttribute("content", brand.fullName);

      document
        .querySelector('meta[name="apple-mobile-web-app-title"]')
        ?.setAttribute("content", brand.fullName);
    };

    apply();

    const titleEl = document.querySelector("title");
    const observer = new MutationObserver(apply);
    if (titleEl) {
      observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }

    const interval = window.setInterval(apply, 500);
    window.setTimeout(() => window.clearInterval(interval), 5000);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
