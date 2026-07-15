"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { navLinks } from "@/lib/brand";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-dahora-line/70 bg-dahora-cream/85 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
      <div className="container-page flex h-[4.25rem] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Principal">
          {navLinks.map((link) => (
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
          <Link href="/area-cliente" className="btn-secondary !px-4 !py-2.5 text-sm">
            Entrar
          </Link>
          <Link href="/#cadastro" className="btn-primary !px-4 !py-2.5 text-sm">
            Pedir cartão
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-base font-medium text-dahora-ink hover:bg-dahora-mist"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/area-cliente" className="btn-secondary w-full" onClick={() => setOpen(false)}>
                Entrar
              </Link>
              <Link href="/#cadastro" className="btn-primary w-full" onClick={() => setOpen(false)}>
                Pedir cartão
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
