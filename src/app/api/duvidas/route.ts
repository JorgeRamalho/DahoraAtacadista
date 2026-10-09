import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { duvidaSchema } from "@/lib/validations/schemas";
import { getSessionClienteId } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = duvidaSchema.safeParse(body);

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

    await prisma.duvida.create({
      data: {
        nome: parsed.data.nome.trim(),
        email: parsed.data.email.toLowerCase().trim(),
        pergunta: parsed.data.pergunta.trim(),
        clienteId,
      },
    });

    return NextResponse.json({ message: "Dúvida registrada." });
  } catch (error) {
    console.error("duvidas:", error);
    return NextResponse.json({ message: "Erro interno." }, { status: 500 });
  }
}
