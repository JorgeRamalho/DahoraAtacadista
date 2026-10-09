"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePwa } from "@/components/pwa/PwaProvider";
import { getWhatsAppSacUrl } from "@/lib/pwa/device";

function NavIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="app-bottom-nav__icon" aria-hidden="true">
      {children}
    </span>
  );
}

export function AppBottomNav() {
  const pathname = usePathname();
  const { device, requestInstall } = usePwa();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  if (device === "desktop") return null;

  const isHome = pathname === "/";
  const isCliente = pathname.startsWith("/area-cliente");
  const isFaq = pathname === "/faq" || hash === "#faq";
  const isApp = hash === "#app-download";

  const itemClass = (active: boolean) =>
    `app-bottom-nav__item${active ? " is-active" : ""}`;

  return (
    <nav className="app-bottom-nav" aria-label="Navegação do aplicativo">
      <Link href="/" className={itemClass(isHome && !hash)} data-nav="home">
        <NavIcon>⌂</NavIcon>
        <span>Início</span>
      </Link>

      <button
        type="button"
        className={itemClass(isApp)}
        data-nav="app"
        onClick={() => void requestInstall()}
      >
        <NavIcon>↓</NavIcon>
        <span>App</span>
      </button>

      <Link
        href={isHome ? "/#faq" : "/faq"}
        className={itemClass(isFaq)}
        data-nav="faq"
      >
        <NavIcon>?</NavIcon>
        <span>FAQ</span>
      </Link>

      <a
        href={getWhatsAppSacUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClass(false)}
        data-nav="sac"
      >
        <NavIcon>☎</NavIcon>
        <span>SAC</span>
      </a>

      <Link
        href="/area-cliente"
        className={itemClass(isCliente)}
        data-nav="cliente"
      >
        <NavIcon>◎</NavIcon>
        <span>Conta</span>
      </Link>
    </nav>
  );
}
