import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Dahora Card",
  description:
    "Conheça o cartão de vantagens da rede Dahora: pontos, ofertas exclusivas e Área do Cliente.",
};

const beneficios = [
  {
    title: "Cashback em pontos",
    text: "Cada real vira ponto — no supermercado e no atacado.",
  },
  {
    title: "Preço de atacado",
    text: "Acesso a campanhas e tabelas especiais para clientes do cartão.",
  },
  {
    title: "Cartão digital imediato",
    text: "Após o cadastro, o número já aparece na Área do Cliente.",
  },
  {
    title: "Atendimento unificado",
    text: "FAQ, dúvidas e SAC 24h conectados à sua conta.",
  },
];

export default function DahoraCardPage() {
  return (
    <>
      <PageHero
        eyebrow="Cartão de vantagens"
        title="Dahora Card"
        description="O cartão que une o dia a dia do supermercado à inteligência do atacado — com pontos, ofertas e suporte em um só ecossistema."
      />

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Feito para quem compra com frequência e volume
            </h2>
            <p className="mt-4 leading-relaxed text-dahora-slate">
              Seja para o lar ou para o negócio, o Dahora Card transforma cada
              passagem pelo caixa em benefício acumulado. Cadastro digital,
              aprovação ágil e experiência responsiva em qualquer tela.
            </p>
            <Link href="/cadastro" className="btn-primary mt-8">
              Solicitar agora
            </Link>
          </div>

          <div
            className="relative min-h-[280px] overflow-hidden rounded-[2rem]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            role="img"
            aria-label="Prateleiras de atacado com produtos organizados"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#12201b]/70 to-transparent" />
          </div>
        </div>
      </section>

      <section className="section-pad !pt-0">
        <div className="container-page">
          <ul className="grid gap-6 sm:grid-cols-2">
            {beneficios.map((b) => (
              <li key={b.title} className="card-surface rounded-3xl p-6">
                <h3 className="font-display text-xl font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dahora-slate">{b.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
