import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ticketSchema } from "@/lib/validations/schemas";
import { gerarProtocolo } from "@/lib/utils/format";
import { getSessionClienteId } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ticketSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Dados inválidos." },
        { status: 400 }
      );
    }

    const sessionId = await getSessionClienteId();
    let clienteId: string | null = sessionId;

    if (!clienteId) {
      const porEmail = await prisma.cliente.findUnique({
        where: { email: parsed.data.email.toLowerCase().trim() },
      });
      clienteId = porEmail?.id ?? null;
    }

    let protocolo = gerarProtocolo();
    while (await prisma.ticket.findUnique({ where: { protocolo } })) {
      protocolo = gerarProtocolo();
    }

    const ticket = await prisma.ticket.create({
      data: {
        protocolo,
        nome: parsed.data.nome.trim(),
        email: parsed.data.email.toLowerCase().trim(),
        telefone: parsed.data.telefone?.replace(/\D/g, "") || null,
        assunto: parsed.data.assunto.trim(),
        mensagem: parsed.data.mensagem.trim(),
        prioridade: parsed.data.prioridade,
        clienteId,
      },
    });

    return NextResponse.json({
      message: "Chamado aberto com sucesso.",
      protocolo: ticket.protocolo,
    });
  } catch (error) {
    console.error("sac:", error);
    return NextResponse.json({ message: "Erro interno." }, { status: 500 });
  }
}
