"use client";

import { useEffect } from "react";
import { forceDahoraTitle } from "@/lib/pwa/title";
import { brand } from "@/lib/brand";

/** Garante título Dahora Atacadista — uma vez após hidratação (sem observer). */
export function PwaIdentity() {
  useEffect(() => {
    const next = forceDahoraTitle(document.title);
    if (document.title !== next) {
      document.title = next;
    }

    document
      .querySelector('meta[name="application-name"]')
      ?.setAttribute("content", brand.fullName);

    document
      .querySelector('meta[name="apple-mobile-web-app-title"]')
      ?.setAttribute("content", brand.fullName);
  }, []);

  return null;
}
