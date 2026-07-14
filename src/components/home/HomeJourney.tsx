import Link from "next/link";

const steps = [
  {
    n: "01",
    title: "Cadastre-se",
    text: "Preencha o formulário completo do Dahora Card com dados pessoais e endereço.",
    href: "/cadastro",
  },
  {
    n: "02",
    title: "Acesse sua área",
    text: "Entre com e-mail e senha para ver cartão digital, pontos e histórico.",
    href: "/area-cliente",
  },
  {
    n: "03",
    title: "Compre e pontue",
    text: "Use o CPF nas lojas ou o login online. Em dúvida, o SAC 24h está pronto.",
    href: "/sac",
  },
];

export function HomeJourney() {
  return (
    <section className="section-pad border-t border-dahora-line bg-white/50">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dahora-forest">
            Como funciona
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Três passos para uma boa experiência
          </h2>
        </div>

        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="relative">
              <span className="font-display text-5xl font-semibold text-dahora-mint/80">
                {step.n}
              </span>
              <h3 className="font-display mt-3 text-2xl font-semibold text-dahora-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-dahora-slate">{step.text}</p>
              <Link
                href={step.href}
                className="mt-4 inline-flex text-sm font-semibold text-dahora-forest hover:underline"
              >
                Ir agora →
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
