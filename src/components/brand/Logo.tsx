import Link from "next/link";

type LogoProps = {
  variant?: "default" | "light" | "compact";
  className?: string;
};

export function Logo({ variant = "default", className = "" }: LogoProps) {
  const light = variant === "light";
  const compact = variant === "compact";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 no-underline ${className}`}
      aria-label="Dahora — página inicial"
    >
      <span
        className="relative grid h-10 w-10 place-items-center rounded-2xl shadow-md"
        style={{
          background: "linear-gradient(145deg, #1a6b4a 0%, #2d9b6a 55%, #e8a317 160%)",
        }}
        aria-hidden
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 14.5c0-3.2 2.2-6 5.5-7.2C9.2 5.5 7.8 4 6.2 4 4.4 4 3 5.5 3 7.4c0 2.8 2 5.4 4.8 6.5C5.9 14.2 5 14.3 5 14.5Z"
            fill="white"
            fillOpacity="0.95"
          />
          <path
            d="M12.2 6.2c3.8 0 6.8 3.2 6.8 7.1 0 .4 0 .8-.1 1.2 1.7-.9 2.9-2.7 2.9-4.8C21.8 6.8 19 4.5 15.6 4.5c-1.8 0-3.4.8-4.4 2 .3-.1.7-.2 1-.3Z"
            fill="#F6E7A8"
          />
          <path
            d="M8.5 13.2c0 3.4 2.6 6.2 5.8 6.2 2.2 0 4.1-1.3 5.1-3.2-1 .4-2.1.6-3.2.6-4.2 0-7.7-3.2-7.7-7.2 0-.5.1-1 .2-1.5-.1.4-.2.9-.2 1.3v4Z"
            fill="white"
            fillOpacity="0.9"
          />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display text-[1.35rem] font-semibold tracking-tight ${
              light ? "text-white" : "text-dahora-ink"
            }`}
          >
            Dahora
          </span>
          <span
            className={`mt-0.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] ${
              light ? "text-white/75" : "text-dahora-slate"
            }`}
          >
            Atacadista
          </span>
        </span>
      )}
    </Link>
  );
}
