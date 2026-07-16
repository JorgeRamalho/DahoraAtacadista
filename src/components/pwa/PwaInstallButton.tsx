"use client";

import { usePwa } from "@/components/pwa/PwaProvider";
import { OpenInAppTrigger } from "@/components/pwa/OpenInAppTrigger";
import { brand } from "@/lib/brand";

export function PwaInstallButton({
  size = "large",
  className = "",
}: {
  size?: "compact" | "default" | "large";
  className?: string;
}) {
  const { isStandalone } = usePwa();

  if (isStandalone) {
    return (
      <p className="text-sm font-medium text-dahora-forest">
        {brand.appName} instalado neste dispositivo.
      </p>
    );
  }

  return <OpenInAppTrigger size={size} className={className} />;
}
