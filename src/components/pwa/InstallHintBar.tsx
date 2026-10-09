"use client";

import { usePwa } from "@/components/pwa/PwaProvider";

export function InstallHintBar() {
  const { installHint, dismissInstallHint } = usePwa();

  if (!installHint) return null;

  return (
    <div className="container-page pb-2">
      <div className="install-hint" role="alert" aria-live="polite">
        <p className="install-hint__text">{installHint}</p>
        <button
          type="button"
          className="install-hint__close"
          onClick={dismissInstallHint}
          aria-label="Fechar instruções de instalação"
        >
          ×
        </button>
      </div>
    </div>
  );
}
