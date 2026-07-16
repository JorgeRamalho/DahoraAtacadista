"use client";

import { usePwa } from "@/components/pwa/PwaProvider";
import { OpenInAppButton } from "@/components/pwa/OpenInAppButton";

type OpenInAppTriggerProps = {
  size?: "compact" | "default" | "large";
  className?: string;
};

/** Botão estilo Chrome — apresenta o Dahora Atacadista e instala ou orienta o usuário. */
export function OpenInAppTrigger({ size = "default", className = "" }: OpenInAppTriggerProps) {
  const { isStandalone, requestInstall } = usePwa();

  if (isStandalone) return null;

  return (
    <OpenInAppButton
      size={size}
      className={className}
      onClick={() => void requestInstall()}
    />
  );
}
