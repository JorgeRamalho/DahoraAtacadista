const benefits = [
  {
    title: "Pontos em toda compra",
    text: "Acumule 1 ponto por real gasto no varejo e no atacado — e troque por vantagens reais.",
    icon: "◈",
  },
  {
    title: "Ofertas exclusivas",
    text: "Preços de atacado e campanhas só para quem tem Dahora Card ativo.",
    icon: "◇",
  },
  {
    title: "Área do Cliente",
    text: "Saldo, cartão digital, histórico de atendimento e dados cadastrais em um só lugar.",
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
    <section className="section-pad">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dahora-forest">
            Por que Dahora
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-dahora-ink md:text-4xl">
            Uma experiência pensada para quem compra com estratégia
          </h2>
          <p className="mt-4 text-dahora-slate leading-relaxed">
            Do corredor do supermercado ao volume do atacado: uma identidade clara,
            navegação guiada e benefícios que aparecem no dia a dia.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <li key={item.title} className="group">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-dahora-mist text-lg text-dahora-forest transition group-hover:scale-105 group-hover:bg-dahora-leaf group-hover:text-white">
                <span aria-hidden>{item.icon}</span>
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
