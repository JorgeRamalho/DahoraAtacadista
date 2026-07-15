"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DISMISS_KEY = "dahora-float-banner-dismissed";

export function FloatAnnounceBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <aside
      className="float-announce"
      aria-label="Anúncio Dahora Card"
      role="complementary"
    >
      <div className="float-announce__card">
        <p className="float-announce__eyebrow">Oferta do dia</p>
        <p className="float-announce__title">Ganhe 100 pontos no cadastro do Dahora Card</p>
        <p className="float-announce__text">
          Preencha o formulário abaixo e ative seu cartão digital em minutos.
        </p>
        <div className="float-announce__actions">
          <Link href="/#cadastro" className="float-announce__cta">
            Quero meu cartão
          </Link>
          <button
            type="button"
            className="float-announce__close"
            aria-label="Fechar anúncio"
            onClick={() => {
              sessionStorage.setItem(DISMISS_KEY, "1");
              setVisible(false);
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </aside>
  );
}
