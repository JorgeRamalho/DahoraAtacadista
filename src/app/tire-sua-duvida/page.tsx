import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { DuvidaForm } from "@/components/sac/DuvidaForm";

export const metadata: Metadata = {
  title: "Tire sua dúvida",
  description: "Envie sua pergunta para a equipe Dahora e receba retorno por e-mail.",
};

export default function TireSuaDuvidaPage() {
  return (
    <>
      <PageHero
        eyebrow="Atendimento"
        title="Tire sua dúvida"
        description="Conte o que precisa saber sobre o Dahora Card, lojas ou benefícios. Se a resposta já estiver no FAQ, você resolve ainda mais rápido."
      />
      <section className="section-pad !pt-10">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <DuvidaForm />
          <aside className="card-surface rounded-3xl p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold">Antes de enviar</h2>
            <p className="mt-3 text-sm leading-relaxed text-dahora-slate">
              Muitas respostas estão no FAQ. Se for um problema urgente com compra,
              cartão bloqueado ou cobrança, prefira o SAC 24 horas para gerar protocolo.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/faq" className="btn-secondary w-full">
                Ver FAQ
              </Link>
              <Link href="/sac" className="btn-primary w-full">
                Ir para o SAC
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
