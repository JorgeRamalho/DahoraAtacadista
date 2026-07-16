"use client";

import { useEffect } from "react";
import { forceDahoraTitle } from "@/lib/pwa/title";
import { brand } from "@/lib/brand";

type LaunchParamsLike = {
  targetURL?: string;
};

type LaunchQueueLike = {
  setConsumer: (callback: (params: LaunchParamsLike) => void) => void;
};

/**
 * Garante que o botão nativo «Abrir na app» do Chrome
 * foque/navegue o Dahora Atacadista (não outro PWA do localhost).
 */
export function PwaLaunchHandler() {
  useEffect(() => {
    const launchQueue = (window as Window & { launchQueue?: LaunchQueueLike }).launchQueue;
    if (!launchQueue?.setConsumer) return;

    launchQueue.setConsumer((params) => {
      document.title = forceDahoraTitle(document.title) || `${brand.fullName} — ${brand.slogan}`;

      const target = params.targetURL;
      if (!target) return;

      try {
        const url = new URL(target, window.location.origin);
        if (url.origin !== window.location.origin) return;

        const next = `${url.pathname}${url.search}${url.hash}`;
        const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (next !== current) {
          window.location.assign(next);
        }
      } catch {
        // ignora URL inválida do launch
      }
    });
  }, []);

  return null;
}
