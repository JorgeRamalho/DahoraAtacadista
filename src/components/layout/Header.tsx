"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { OpenInAppTrigger } from "@/components/pwa/OpenInAppTrigger";
import { navLinks } from "@/lib/brand";

/** Menu do header: Nossa História primeiro; app fica no botão OpenInApp. */
const mainNavLinks = [
  ...navLinks.filter((link) => link.href === "/"),
  ...navLinks.filter((link) => link.href !== "/" && link.href !== "/#app-download"),
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-dahora-line/70 bg-dahora-cream/85 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
      <div className="container-page flex h-[4.25rem] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Principal">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-dahora-slate transition hover:bg-dahora-mist hover:text-dahora-forest"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <OpenInAppTrigger size="compact" />
          <Link href="/#cadastro" className="btn-secondary !px-4 !py-2.5 text-sm">
            Cadastrar
          </Link>
          <Link href="/area-cliente" className="btn-primary !px-4 !py-2.5 text-sm">
            Área do Cliente
          </Link>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-xl border border-dahora-line bg-white xl:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div
          id="menu-mobile"
          className="max-h-[70vh] overflow-y-auto border-t border-dahora-line bg-white xl:hidden"
        >
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-base font-medium text-dahora-ink hover:bg-dahora-mist"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 px-3 pb-1">
              <OpenInAppTrigger size="default" className="w-full justify-center" />
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/#cadastro" className="btn-secondary w-full" onClick={() => setOpen(false)}>
                Cadastrar
              </Link>
              <Link href="/area-cliente" className="btn-primary w-full" onClick={() => setOpen(false)}>
                Área do Cliente
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
