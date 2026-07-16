import {
  IfoodMark,
  NineNineFoodMark,
  UberEatsMark,
} from "@/components/layout/PartnerLogos";

/** Barra superior alinhada ao frontend (só parceiros de delivery). */
export function AppStatusBar() {
  return (
    <div
      className="app-status-bar"
      role="region"
      aria-label="Parceiros de delivery"
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
      </div>
    </div>
  );
}
