import Link from "next/link";
import { FaqList } from "@/components/faq/FaqList";
import { prisma } from "@/lib/db/prisma";

/** FAQ embutido na home — espelha `#faq` do frontend/index.html */
export async function HomeFaq() {
  const items = await prisma.faq.findMany({
    where: { ativo: true },
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      pergunta: true,
      resposta: true,
      categoria: true,
    },
  });

  return (
    <section
      id="faq"
      className="section-pad scroll-mt-28 border-t border-dahora-line bg-white/60"
      aria-labelledby="faq-title"
    >
      <div className="container-page max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dahora-forest">
          Central de ajuda
        </p>
        <h2
          id="faq-title"
          className="font-display mt-3 text-3xl font-semibold tracking-tight text-dahora-ink md:text-4xl"
        >
          FAQ Perguntas e Respostas
        </h2>
        <p className="mt-3 mb-6 max-w-xl text-dahora-slate leading-relaxed">
          Respostas claras sobre cartão, pontos, conta e atendimento.
        </p>

        <FaqList items={items} />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/sac" className="btn-secondary">
            Abrir chamado SAC
          </Link>
        </div>
      </div>
    </section>
  );
}
