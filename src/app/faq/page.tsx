import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { FaqList } from "@/components/faq/FaqList";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Perguntas e respostas sobre Dahora Card, pontos, lojas e SAC.",
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const items = await prisma.faq.findMany({
    where: { ativo: true },
    orderBy: { ordem: "asc" },
  });

  return (
    <>
      <PageHero
        eyebrow="Central de ajuda"
        title="Perguntas frequentes"
        description="Respostas claras sobre cartão, pontos, conta e atendimento. Não achou o que precisava? Envie sua dúvida ou fale com o SAC 24h."
      />
      <section className="section-pad !pt-10">
        <div className="container-page max-w-3xl">
          <FaqList items={items} />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/tire-sua-duvida" className="btn-primary">
              Tire sua dúvida
            </Link>
            <Link href="/sac" className="btn-secondary">
              Abrir chamado SAC
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
