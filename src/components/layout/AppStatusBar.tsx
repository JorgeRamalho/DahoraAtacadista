"use client";

import {
  IfoodMark,
  NineNineFoodMark,
  UberEatsMark,
} from "@/components/layout/PartnerLogos";
import { OpenInAppTrigger } from "@/components/pwa/OpenInAppTrigger";

/** Barra superior com parceiros de delivery e botão do Dahora Atacadista. */
export function AppStatusBar() {
  return (
    <div
      className="app-status-bar"
      role="region"
      aria-label="Barra do aplicativo"
    >
      <div className="container-page app-status-bar__inner">
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
            title="iFood"
            aria-label="iFood"
          >
            <IfoodMark />
          </a>
          <a
            className="partner-link"
            href="https://99app.com/99food"
            target="_blank"
            rel="noopener noreferrer"
            role="listitem"
            title="99Food"
            aria-label="99Food"
          >
            <NineNineFoodMark />
          </a>
          <a
            className="partner-link"
            href="https://www.ubereats.com"
            target="_blank"
            rel="noopener noreferrer"
            role="listitem"
            title="Uber Eats"
            aria-label="Uber Eats"
          >
            <UberEatsMark />
          </a>
        </div>

        <OpenInAppTrigger
          size="compact"
          className="app-status-bar__open-app xl:hidden"
        />
      </div>
    </div>
  );
}
