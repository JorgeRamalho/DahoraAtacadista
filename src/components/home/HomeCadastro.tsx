import { CadastroForm } from "@/components/card/CadastroForm";
import { FloatAnnounceBanner } from "@/components/home/FloatAnnounceBanner";

export function HomeCadastro() {
  return (
    <section
      id="cadastro"
      className="relative section-pad scroll-mt-28 border-t border-dahora-line bg-white"
      aria-labelledby="home-cadastro-title"
    >
      <FloatAnnounceBanner />
      <div className="container-page max-w-3xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dahora-forest">
            Solicitação
          </p>
          <h2
            id="home-cadastro-title"
            className="font-display mt-3 text-3xl font-semibold tracking-tight text-dahora-ink md:text-4xl"
          >
            Cadastro do Dahora Card
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-dahora-slate">
            Preencha o formulário completo. Os dados vão para o PostgreSQL e você
            já recebe o número do cartão na Área do Cliente.
          </p>
        </div>
        <CadastroForm />
      </div>
    </section>
  );
}
