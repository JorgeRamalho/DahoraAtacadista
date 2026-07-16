import { brand } from "@/lib/brand";
import { PwaInstallButton } from "@/components/pwa/PwaInstallButton";

const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL ||
  "https://play.google.com/store/apps/details?id=br.com.dahora.app";
const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL ||
  "https://apps.apple.com/app/dahora-atacadista/id000000000";

function GooglePlayBadge() {
  return (
    <svg viewBox="0 0 180 54" width="168" height="50" aria-hidden="true">
      <rect width="180" height="54" rx="8" fill="#000" />
      <rect x="1" y="1" width="178" height="52" rx="7" fill="none" stroke="#a6a6a6" strokeWidth="1" />
      <path fill="#EA4335" d="M14 12.2 28.8 27 14 41.8V12.2Z" />
      <path fill="#FBBC04" d="m14 41.8 7.8-4.5 7-10.3-14.8 14.8Z" />
      <path fill="#4285F4" d="M36.4 22.6 32.2 25l-3.4 2 3.4 2 4.2 2.4L45 36.2c.7-.5 1.2-1.3 1.2-2.3V20c0-1-.5-1.8-1.2-2.3l-8.6 4.9Z" />
      <path fill="#34A853" d="m14 12.2 14.8 14.8-7 10.3L14 12.2Z" />
      <text x="54" y="20" fill="#fff" fontFamily="Arial, sans-serif" fontSize="9">
        DISPONÍVEL NO
      </text>
      <text x="54" y="38" fill="#fff" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700">
        Google Play
      </text>
    </svg>
  );
}

function AppStoreBadge() {
  return (
    <svg viewBox="0 0 180 54" width="168" height="50" aria-hidden="true">
      <rect width="180" height="54" rx="8" fill="#000" />
      <rect x="1" y="1" width="178" height="52" rx="7" fill="none" stroke="#a6a6a6" strokeWidth="1" />
      <path
        fill="#fff"
        d="M28.2 18.2c1.1-1.3 1.8-3.1 1.6-4.9-1.6.1-3.5 1.1-4.6 2.4-1 1.2-1.9 3.1-1.6 4.9 1.8.1 3.5-1 4.6-2.4Zm4.5 8c-.1-3.1 2.5-4.6 2.6-4.7-1.4-2.1-3.7-2.4-4.5-2.4-1.9-.2-3.7 1.1-4.7 1.1s-2.5-1.1-4.1-1c-2.1.1-4.1 1.2-5.2 3.2-2.2 3.9-.6 9.6 1.6 12.7 1.1 1.5 2.4 3.2 4.1 3.2 1.6 0 2.2-1 4.2-1s2.5 1 4.2 1c1.7 0 2.9-1.6 3.9-3.1 1.2-1.8 1.7-3.5 1.7-3.6-.1 0-3.3-1.3-3.4-5.1-.1-1.9 1.4-3.2 1.6-3.3Z"
      />
      <text x="54" y="20" fill="#fff" fontFamily="Arial, sans-serif" fontSize="9">
        Baixar na
      </text>
      <text x="54" y="38" fill="#fff" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700">
        App Store
      </text>
    </svg>
  );
}

export function HomeAppDownload() {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(PLAY_STORE_URL)}`;

  return (
    <section
      id="app-download"
      className="section-pad border-b border-dahora-line bg-white"
      aria-labelledby="app-download-title"
    >
      <div className="container-page">
        <div className="app-download">
          <div className="app-download__copy">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dahora-forest">
              {brand.appName}
            </p>
            <h2
              id="app-download-title"
              className="font-display mt-3 text-3xl font-semibold tracking-tight text-dahora-ink md:text-4xl"
            >
              Baixe o {brand.appName} no bolso
            </h2>
            <p className="mt-3 text-dahora-slate leading-relaxed">
              Escaneie o QR Code com a câmera do celular ou baixe direto na
              Google Play e na App Store. Ofertas, Dahora Card e SAC 24h na palma da mão.
            </p>

            <div className="app-download__pwa mt-5 rounded-2xl border border-dahora-line bg-dahora-mist/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-dahora-forest">
                App web · {brand.appName}
              </p>
              <p className="mt-2 text-sm text-dahora-slate">
                Instale o {brand.appName} como aplicativo no Chrome, Edge ou Safari —
                aparece com o nome e ícone da rede na tela inicial.
              </p>
              <div className="mt-4">
                <PwaInstallButton size="large" />
              </div>
            </div>

            <div className="app-download__stores">
              <a
                className="app-download__badge"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Baixar na Google Play"
              >
                <GooglePlayBadge />
              </a>
              <a
                className="app-download__badge"
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Baixar na App Store"
              >
                <AppStoreBadge />
              </a>
            </div>
          </div>

          <figure className="app-download__qr">
            <div className="app-download__qr-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSrc}
                width={220}
                height={220}
                alt={`QR Code para baixar o app ${brand.name} na Google Play`}
                loading="lazy"
              />
            </div>
            <figcaption>Aponte a câmera para abrir a Google Play</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
