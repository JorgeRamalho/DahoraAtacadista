"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  detectDevice,
  isIosDevice,
  isStandaloneDisplay,
  type DeviceKind,
} from "@/lib/pwa/device";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type PwaContextValue = {
  device: DeviceKind;
  isStandalone: boolean;
  isAppShell: boolean;
  canInstall: boolean;
  installHint: string | null;
  requestInstall: () => Promise<boolean>;
  showInstallHint: () => void;
  dismissInstallHint: () => void;
};

const PwaContext = createContext<PwaContextValue | null>(null);

export function usePwa(): PwaContextValue {
  const ctx = useContext(PwaContext);
  if (!ctx) {
    throw new Error("usePwa must be used within PwaProvider");
  }
  return ctx;
}

function getInstallHintMessage(isStandalone: boolean, isInstalled: boolean): string {
  if (isIosDevice()) {
    return 'No iPhone: toque em Compartilhar (ícone ↑) e depois em "Adicionar à Tela de Início" para instalar o Dahora Atacadista.';
  }
  if (isStandalone) {
    return "O Dahora Atacadista já está aberto como aplicativo neste dispositivo.";
  }
  if (isInstalled) {
    return 'O Dahora Atacadista já está instalado. Use «Abrir na app» na barra do Chrome em localhost:3010. Se abrir Carona/Trampolim, limpe em /limpar-pwa e remova apps antigos em chrome://apps.';
  }
  return 'Para instalar o Dahora (porta 3010, isolada do Carona/Trampolim): ícone ⊕ na barra do Chrome/Edge, ou Menu → "Instalar Dahora Atacadista".';
}

export function PwaProvider({ children }: { children: ReactNode }) {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const hintTimer = useRef<number | null>(null);

  const [device, setDevice] = useState<DeviceKind>("desktop");
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [installHint, setInstallHint] = useState<string | null>(null);

  const isAppShell = device !== "desktop" || isStandalone;

  const dismissInstallHint = useCallback(() => {
    setInstallHint(null);
    if (hintTimer.current) {
      window.clearTimeout(hintTimer.current);
      hintTimer.current = null;
    }
  }, []);

  const showInstallHint = useCallback(() => {
    setInstallHint(getInstallHintMessage(isStandalone, isInstalled));
    if (hintTimer.current) window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => {
      setInstallHint(null);
      hintTimer.current = null;
    }, 8000);
  }, [isStandalone, isInstalled]);

  const requestInstall = useCallback(async (): Promise<boolean> => {
    const prompt = deferredPrompt.current;
    if (!prompt) {
      showInstallHint();
      return false;
    }

    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") {
        deferredPrompt.current = null;
        setCanInstall(false);
        return true;
      }
      return false;
    } catch {
      deferredPrompt.current = null;
      setCanInstall(false);
      showInstallHint();
      return false;
    }
  }, [showInstallHint]);

  useEffect(() => {
    const sync = () => {
      const standalone = isStandaloneDisplay();
      const nextDevice = detectDevice();
      setDevice(nextDevice);
      setIsStandalone(standalone);

      const root = document.documentElement;
      root.dataset.device = nextDevice;
      root.classList.toggle("is-mobile", nextDevice === "mobile");
      root.classList.toggle("is-tablet", nextDevice === "tablet");
      root.classList.toggle("is-desktop", nextDevice === "desktop");
      root.classList.toggle("is-standalone", standalone);
      root.classList.toggle("is-app-shell", nextDevice !== "desktop" || standalone);

      document.body.classList.toggle(
        "has-app-nav",
        nextDevice !== "desktop"
      );
    };

    sync();
    window.addEventListener("resize", sync, { passive: true });
    window.addEventListener("orientationchange", sync, { passive: true });

    const checkInstalled = async () => {
      try {
        const nav = navigator as Navigator & {
          getInstalledRelatedApps?: () => Promise<Array<{ platform?: string; id?: string }>>;
        };
        if (!nav.getInstalledRelatedApps) return;
        const apps = await nav.getInstalledRelatedApps();
        const dahora = apps.some(
          (app) =>
            app.platform === "webapp" &&
            (app.id?.includes("dahora-atacadista") || app.id?.includes("pwa=dahora"))
        );
        setIsInstalled(dahora || apps.length > 0);
      } catch {
        // API indisponível neste navegador
      }
    };
    void checkInstalled();

    const onInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt.current = event as BeforeInstallPromptEvent;
      setCanInstall(true);
    };

    const onInstalled = () => {
      deferredPrompt.current = null;
      setCanInstall(false);
      setIsInstalled(true);
      setIsStandalone(true);
      document.documentElement.classList.add("is-standalone");
    };

    window.addEventListener("beforeinstallprompt", onInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      window.removeEventListener("beforeinstallprompt", onInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      if (hintTimer.current) window.clearTimeout(hintTimer.current);
    };
  }, []);

  const value = useMemo(
    () => ({
      device,
      isStandalone,
      isAppShell,
      canInstall,
      installHint,
      requestInstall,
      showInstallHint,
      dismissInstallHint,
    }),
    [
      device,
      isStandalone,
      isAppShell,
      canInstall,
      installHint,
      requestInstall,
      showInstallHint,
      dismissInstallHint,
    ]
  );

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
}
