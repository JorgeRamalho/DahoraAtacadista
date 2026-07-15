"use client";

import { useEffect, useState } from "react";
import {
  IfoodMark,
  NineNineFoodMark,
  UberEatsMark,
} from "@/components/layout/PartnerLogos";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const TEXT_KEY = "dahora-a11y-text";

export function AppStatusBar() {
  const [online, setOnline] = useState(true);
  const [isApp, setIsApp] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installHint, setInstallHint] = useState("");

  useEffect(() => {
    setOnline(navigator.onLine);
    setIsApp(window.matchMedia("(display-mode: standalone)").matches);

    const textOn = localStorage.getItem(TEXT_KEY) === "large";
    setLargeText(textOn);
    document.documentElement.classList.toggle("a11y-large-text", textOn);
    document.documentElement.classList.remove("a11y-contrast");

    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    const onBip = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setInstallHint("");
    };
    window.addEventListener("beforeinstallprompt", onBip);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("beforeinstallprompt", onBip);
    };
  }, []);

  const toggleText = () => {
    const next = !largeText;
    setLargeText(next);
    document.documentElement.classList.toggle("a11y-large-text", next);
    localStorage.setItem(TEXT_KEY, next ? "large" : "normal");
  };

  const installApp = async () => {
    if (installEvent) {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === "accepted") {
        setInstallEvent(null);
        setInstallHint("");
      }
      return;
    }

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setInstallHint(
      isIos
        ? "No iPhone: toque em Compartilhar e depois em “Adicionar à Tela de Início”."
        : isApp
          ? "O app Dahora já está instalado neste dispositivo."
          : "Use o menu do navegador → “Instalar app” ou “Adicionar à tela inicial”."
    );
    window.setTimeout(() => setInstallHint(""), 6000);
  };

  return (
    <div
      className="app-status-bar border-t border-dahora-line/80 bg-dahora-mist/90 text-dahora-ink backdrop-blur-md"
      role="region"
      aria-label="Barra de status e parceiros"
    >
      <div className="container-page app-status-bar__inner">
        <div className="app-status-bar__meta" aria-live="polite">
          <span
            className={`status-pill ${online ? "is-online" : "is-offline"}`}
            title={online ? "Conectado à internet" : "Sem conexão"}
          >
            <span className="status-dot" aria-hidden />
            <span>{online ? "Online" : "Offline"}</span>
          </span>
          <span className="status-pill is-mode" title="Modo de exibição">
            {isApp ? "App" : "Web"}
          </span>
        </div>

        <div
          className="app-status-bar__partners"
          role="list"
          aria-label="Parceiros de delivery"
        >
          <a
            className="partner-link"
            href="https://www.ifood.com.br"
            target="_blank"
            rel="noopener noreferrer"
            role="listitem"
          >
            <IfoodMark />
          </a>
          <a
            className="partner-link"
            href="https://99app.com/99food"
            target="_blank"
            rel="noopener noreferrer"
            role="listitem"
          >
            <NineNineFoodMark />
          </a>
          <a
            className="partner-link"
            href="https://www.ubereats.com"
            target="_blank"
            rel="noopener noreferrer"
            role="listitem"
          >
            <UberEatsMark />
          </a>
        </div>

        <div className="app-status-bar__actions" role="toolbar" aria-label="Atalhos do app">
          <button
            type="button"
            className="status-action is-install"
            onClick={() => void installApp()}
            title="Baixar ou instalar o app"
          >
            Baixar app
          </button>
          <button
            type="button"
            className={`status-action ${largeText ? "is-active" : ""}`}
            aria-pressed={largeText}
            onClick={toggleText}
          >
            Texto maior
          </button>
        </div>
      </div>

      {installHint ? (
        <div className="container-page pb-2">
          <p className="rounded-xl bg-white/90 px-3 py-2 text-xs text-dahora-slate" role="status">
            {installHint}
          </p>
        </div>
      ) : null}
    </div>
  );
}
