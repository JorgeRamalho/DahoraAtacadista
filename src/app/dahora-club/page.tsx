import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Dahora Club",
  description:
    "Pontos, milhas, ofertas exclusivas e sorteios do programa de fidelidade Dahora Club.",
};

const advantages = [
  {
    icon: "★",
    title: "Pontos em compras",
    text: "A cada compra com o Dahora Card você acumula pontos que viram descontos e vantagens.",
  },
  {
    icon: "↗",
    title: "Milhas Dahora",
    text: "Troque pontos por milhas e use em experiências, viagens e parcerias selecionadas.",
  },
  {
    icon: "◇",
    title: "Ofertas exclusivas",
    text: "Cadastre-se no Club e tenha acesso a campanhas e preços especiais para membros.",
  },
  {
    icon: "✦",
    title: "Prêmios e brindes",
    text: "Concorra a sorteios de prêmios e ganhe brindes em datas especiais da rede.",
  },
  {
    icon: "◎",
    title: "Cadastro único",
    text: "Use o mesmo cadastro do Dahora Card para ativar o Club na Área do Cliente.",
  },
  {
    icon: "☎",
    title: "SAC 24h",
    text: "Dúvidas sobre pontos, milhas ou sorteios? O atendimento está disponível a qualquer hora.",
  },
];

export default function DahoraClubPage() {
  return (
    <>
      <PageHero
        eyebrow="Programa de fidelidade"
        title="Dahora Club"
        description="Acumule pontos e milhas em cada compra, participe de sorteios e concorra a ofertas, prêmios e brindes exclusivos da rede Dahora."
      />

      <section className="section-pad !pt-10 bg-white/70">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dahora-forest">
            Como funciona
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Vantagens do Dahora Club
          </h2>
          <p className="mt-3 max-w-xl text-dahora-slate leading-relaxed">
            Ligado ao Dahora Card, o Club transforma suas compras em benefícios reais —
            no supermercado e no atacado.
          </p>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((item) => (
              <li key={item.title} className="home-feature">
                <div className="home-feature__icon" aria-hidden>
                  {item.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-dahora-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-dahora-slate">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dahora-forest">
              Participe
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Cadastre-se e concorra
            </h2>
            <p className="mt-3 text-dahora-slate leading-relaxed">
              Solicite o Dahora Card, ative o Dahora Club e já comece a acumular pontos,
              milhas e chances de ganhar prêmios e brindes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/#cadastro" className="btn-primary">
                Quero participar
              </Link>
              <Link href="/dahora-card" className="btn-secondary">
                Conhecer o Dahora Card
              </Link>
            </div>
          </div>
          <div
            className="min-h-[280px] rounded-[2rem] bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1607083206869-4c797b64eaab?auto=format&fit=crop&w=1200&q=80)",
            }}
            role="img"
            aria-label="Cliente com vantagens e recompensas"
          />
        </div>
      </section>
    </>
  );
}
