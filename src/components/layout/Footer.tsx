import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { brand, navLinks } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-dahora-line bg-[#12201b] text-white">
      <div className="container-page section-pad !py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo variant="light" />
            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              {brand.slogan}
            </p>
            <p className="text-sm text-white/55">{brand.tagline}</p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-dahora-mint">
              Navegação
            </h2>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-dahora-mint">
              Dahora Card
            </h2>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>
                <Link href="/cadastro" className="hover:text-white">
                  Solicitar cartão
                </Link>
              </li>
              <li>
                <Link href="/area-cliente" className="hover:text-white">
                  Área do Cliente
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  Perguntas frequentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-dahora-mint">
              SAC 24 horas
            </h2>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>{brand.supportPhone}</li>
              <li>{brand.supportEmail}</li>
              <li>{brand.hours}</li>
              <li>
                <Link href="/sac" className="font-medium text-dahora-amber hover:underline">
                  Abrir chamado →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {brand.fullName}. Todos os direitos reservados.</p>
          <p>Dados tratados conforme LGPD · Experiência pensada para todos.</p>
        </div>
      </div>
    </footer>
  );
}
