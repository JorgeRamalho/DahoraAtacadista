import Link from "next/link";

export function HomeCardSpotlight() {
  return (
    <section className="section-pad" aria-label="Dahora Card">
      <div className="container-page">
        <div className="relative my-2 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#7f1d1d] via-[#c2410c] to-[#f59e0b] px-6 py-12 text-white md:px-12 md:py-16">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-dahora-amber/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dahora-mint">
                Dahora Card
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold md:text-4xl">
                Seu cartão de vantagens, digital e na loja
              </h2>
              <p className="mt-4 max-w-md text-white/80 leading-relaxed">
                Cadastre-se uma vez. Acompanhe pontos, abra chamados no SAC e tire
                dúvidas com a mesma conta — tudo responsivo no celular ou no desktop.
              </p>
              <Link href="/#cadastro" className="btn-primary mt-8 !bg-white !text-dahora-forest !shadow-none">
                Quero meu cartão
              </Link>
            </div>

            <div className="animate-float mx-auto w-full max-w-sm">
              <div
                className="relative aspect-[1.6/1] overflow-hidden rounded-3xl p-6 shadow-2xl"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05)), linear-gradient(135deg, #3b1410, #c2410c 50%, #f59e0b)",
                }}
              >
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
      </div>
    </section>
  );
}
