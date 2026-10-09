export type DeviceKind = "mobile" | "tablet" | "desktop";

export function detectDevice(width = typeof window !== "undefined" ? window.innerWidth : 1200): DeviceKind {
  if (width < 768) return "mobile";
  if (width < 1100) return "tablet";
  return "desktop";
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: window-controls-overlay)").matches ||
    // Safari iOS
    ("standalone" in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function getWhatsAppSacUrl(): string {
  const phone = "551140020024";
  const message = encodeURIComponent(
    "Olá! Preciso de atendimento do SAC 24h da Dahora Atacadista."
  );
  return `https://wa.me/${phone}?text=${message}`;
}
