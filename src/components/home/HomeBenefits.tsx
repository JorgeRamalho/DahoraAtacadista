const benefits = [
  {
    title: "Pontos em toda compra",
    text: "1 ponto por real no varejo e no atacado — troque por vantagens reais.",
    icon: "◈",
  },
  {
    title: "Ofertas exclusivas",
    text: "Preços de atacado e campanhas só para quem tem Dahora Card.",
    icon: "◇",
  },
  {
    title: "Área do Cliente",
    text: "Saldo, cartão digital e histórico de atendimento em um só lugar.",
    icon: "○",
  },
  {
    title: "SAC 24 horas",
    text: "Suporte humano e digital a qualquer hora, com protocolo automático.",
    icon: "△",
  },
];

export function HomeBenefits() {
  return (
    <section className="section-pad bg-white" aria-label="Por que Dahora">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dahora-forest">
            Por que Dahora
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-dahora-ink md:text-4xl">
            Uma experiência pensada para quem compra com estratégia
          </h2>
          <p className="mt-4 max-w-xl text-dahora-slate leading-relaxed">
            Do corredor do supermercado ao volume do atacado: identidade clara,
            navegação guiada e benefícios no dia a dia.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
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
  );
}
