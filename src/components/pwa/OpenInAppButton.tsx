"use client";

import { brand } from "@/lib/brand";

type OpenInAppButtonProps = {
  size?: "compact" | "default" | "large";
  className?: string;
  onClick?: () => void;
};

export function OpenInAppButton({
  size = "default",
  className = "",
  onClick,
}: OpenInAppButtonProps) {
  const sizeClass =
    size === "compact"
      ? "open-in-app-btn--compact"
      : size === "large"
        ? "open-in-app-btn--large"
        : "";

  return (
    <button
      type="button"
      className={`open-in-app-btn ${sizeClass} ${className}`.trim()}
      onClick={onClick}
      aria-label={`Abrir ${brand.appName}`}
    >
      <span className="open-in-app-btn__icon" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/dahora-mark.svg" alt="" width={20} height={20} />
      </span>
      <span className="open-in-app-btn__label">{brand.appName}</span>
    </button>
  );
}
