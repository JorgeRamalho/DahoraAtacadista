import Link from "next/link";

const clubItems = [
  { href: "/dahora-club", mark: "★", label: "Dahora Pontos", title: "Dahora Pontos" },
  { href: "/dahora-club", mark: "↗", label: "Dahora Milhas", title: "Dahora Milhas" },
  { href: "/dahora-club", mark: "◇", label: "Dahora Ofertas", title: "Dahora Ofertas" },
] as const;

/** Barra Dahora Club — espelha `.club-status-bar` do frontend/index.html */
export function HomeClubStatusBar() {
  return (
    <aside className="club-status-bar" aria-label="Dahora Club">
      <div className="container-page club-status-bar__inner">
        <div className="club-status-bar__items" role="list">
          {clubItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="club-icon"
              role="listitem"
              title={item.title}
            >
              <span className="club-icon__mark" aria-hidden>
                {item.mark}
              </span>
              <span className="club-icon__label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
