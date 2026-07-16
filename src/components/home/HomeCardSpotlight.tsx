import Link from "next/link";

export function HomeCardSpotlight() {
  return (
    <section className="section-pad" aria-label="Dahora Card">
      <div className="container-page">
        <div className="home-spotlight">
          <div className="home-spotlight__grid">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dahora-mint">
                Dahora Card
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold md:text-4xl">
                Seu cartão de vantagens, digital e na loja
              </h2>
              <p className="mt-4 max-w-md text-white/80 leading-relaxed">
                Cadastre-se uma vez. Acompanhe pontos, abra chamados no SAC e tire
                dúvidas com a mesma conta — tudo responsivo.
              </p>
              <Link
                href="/#cadastro"
                className="btn-primary mt-8 !bg-white !text-dahora-forest !shadow-none"
              >
                Quero meu cartão
              </Link>
            </div>

            <div className="home-spotlight__card" aria-hidden>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/60">
                    Dahora Card
                  </p>
                  <p className="font-display mt-1 text-2xl font-semibold">Platinum</p>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 text-sm font-bold">
                  DH
                </span>
              </div>
              <p className="mt-10 font-mono text-lg tracking-[0.2em] text-white/90">
                DH•••• •••• 4821
              </p>
              <div className="mt-6 flex justify-between text-xs text-white/70">
                <span>Cliente Dahora</span>
                <span>Pontos ativos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
