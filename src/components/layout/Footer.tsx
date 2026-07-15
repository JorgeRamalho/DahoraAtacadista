import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { brand, navLinks } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-dahora-line bg-gradient-to-b from-dahora-mist/40 via-dahora-cream to-dahora-sand/60 text-dahora-ink">
      <div className="container-page section-pad !py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-dahora-slate">
              {brand.slogan}
            </p>
            <p className="text-sm text-dahora-slate/80">{brand.tagline}</p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-dahora-forest">
              Navegação
            </h2>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-dahora-slate transition hover:text-dahora-forest"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-dahora-forest">
              Dahora Card
            </h2>
            <ul className="space-y-2.5 text-sm text-dahora-slate">
              <li>
                <Link href="/#cadastro" className="hover:text-dahora-forest">
                  Solicitar cartão
                </Link>
              </li>
              <li>
                <Link href="/area-cliente" className="hover:text-dahora-forest">
                  Área do Cliente
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-dahora-forest">
                  Perguntas frequentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-dahora-forest">
              SAC 24 horas
            </h2>
            <ul className="space-y-2.5 text-sm text-dahora-slate">
              <li>{brand.supportPhone}</li>
              <li>{brand.supportEmail}</li>
              <li>{brand.hours}</li>
              <li>
                <Link href="/sac" className="font-medium text-dahora-forest hover:underline">
                  Abrir chamado →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-dahora-line pt-6 text-xs text-dahora-slate/80 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {brand.fullName}. Todos os direitos reservados.</p>
          <p>Dados tratados conforme LGPD · Experiência pensada para todos.</p>
        </div>
      </div>
    </footer>
  );
}
