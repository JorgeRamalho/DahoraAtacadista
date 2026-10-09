/** Marcas parceiras de delivery — cores oficiais e símbolos reconhecíveis. */

export function IfoodMark({ className = "" }: { className?: string }) {
  return (
    <span className={`partner-mark partner-mark--ifood ${className}`}>
      <svg viewBox="0 0 86 28" width="86" height="28" aria-hidden="true">
        <rect width="86" height="28" rx="8" fill="#EA1D2C" />
        <text
          x="14"
          y="19"
          fill="#fff"
          fontFamily="Arial Black, Arial, sans-serif"
          fontSize="13"
          fontWeight="900"
        >
          iFood
        </text>
      </svg>
    </span>
  );
}

export function NineNineFoodMark({ className = "" }: { className?: string }) {
  return (
    <span className={`partner-mark partner-mark--99 ${className}`} title="99Food" aria-label="99Food">
      <svg viewBox="0 0 96 28" width="96" height="28" aria-hidden="true">
        <rect width="96" height="28" rx="8" fill="#FFDD00" />
        <text
          x="8"
          y="19.2"
          fill="#000000"
          fontFamily="Arial Black, Impact, sans-serif"
          fontSize="15"
          fontWeight="900"
        >
          99
        </text>
        <text
          x="34"
          y="19"
          fill="#000000"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="13"
          fontWeight="800"
        >
          Food
        </text>
        <circle cx="88" cy="8.5" r="3.4" fill="#000000" />
      </svg>
    </span>
  );
}

export function UberEatsMark({ className = "" }: { className?: string }) {
  return (
    <span className={`partner-mark partner-mark--uber ${className}`} title="Uber Eats" aria-label="Uber Eats">
      <svg viewBox="0 0 118 28" width="118" height="28" aria-hidden="true">
        <rect width="118" height="28" rx="8" fill="#000000" />
        <circle cx="16" cy="14" r="8" fill="#06C167" />
        <path
          fill="#000000"
          d="M16 8.4c-1.9 1.6-3.1 3.9-3.1 6.3 0 .5.1 1 .2 1.5h5.8c.1-.5.2-1 .2-1.5 0-2.4-1.2-4.7-3.1-6.3Z"
        />
        <text
          x="30"
          y="18.5"
          fill="#FFFFFF"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="12"
          fontWeight="700"
        >
          Uber Eats
        </text>
      </svg>
    </span>
  );
}
