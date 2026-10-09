import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { LoginForm } from "@/components/cliente/LoginForm";
import { ClienteDashboard } from "@/components/cliente/ClienteDashboard";
import { getClienteLogado } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Área do Cliente",
  description:
    "Dashboard do Dahora Card: cartão digital, pontos, ofertas, perfil e atendimento.",
};

export const dynamic = "force-dynamic";

export default async function AreaClientePage() {
  const cliente = await getClienteLogado();

  if (!cliente) {
    return (
      <>
        <PageHero
          eyebrow="Acesso seguro"
          title="Área do Cliente"
          description="Entre com o e-mail e a senha do cadastro do Dahora Card para ver cartão, pontos e atendimentos."
        />
        <section className="section-pad !pt-10">
          <div className="container-page">
            <LoginForm />
          </div>
        </section>
      </>
    );
  }

  const [tickets, duvidas] = await Promise.all([
    prisma.ticket.findMany({
      where: { clienteId: cliente.id },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        protocolo: true,
        assunto: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.duvida.findMany({
      where: { clienteId: cliente.id },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        pergunta: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <ClienteDashboard
      cliente={cliente}
      tickets={tickets}
      duvidas={duvidas}
    />
  );
}
