"use client";

import Link from "next/link";
import { useCallback, type ComponentProps } from "react";
import { usePwa } from "@/components/pwa/PwaProvider";

type InstallAppLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href?: string;
  scrollToSection?: boolean;
};

/**
 * Link que dispara a instalação PWA quando o navegador permite;
 * caso contrário, rola até #app-download ou exibe instruções manuais.
 */
export function InstallAppLink({
  href = "/#app-download",
  scrollToSection = true,
  onClick,
  ...props
}: InstallAppLinkProps) {
  const { canInstall, requestInstall, isStandalone } = usePwa();

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;

      if (canInstall) {
        event.preventDefault();
        await requestInstall();
        return;
      }

      if (isStandalone) {
        event.preventDefault();
        await requestInstall();
        return;
      }

      const hash = href.includes("#") ? href.split("#")[1] : "";
      if (scrollToSection && hash && document.getElementById(hash)) {
        return;
      }

      if (href.includes("#app-download") || href.endsWith("#app-download")) {
        return;
      }

      event.preventDefault();
      await requestInstall();
    },
    [canInstall, href, isStandalone, onClick, requestInstall, scrollToSection]
  );

  return <Link href={href} onClick={handleClick} {...props} />;
}
