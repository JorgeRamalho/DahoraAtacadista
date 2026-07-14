import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { cadastroSchema } from "@/lib/validations/schemas";
import { gerarNumeroCartao } from "@/lib/utils/format";
import { setSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = cadastroSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() || "form";
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return NextResponse.json(
        { message: "Verifique os campos destacados.", fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existente = await prisma.cliente.findFirst({
      where: {
        OR: [{ email: data.email.toLowerCase() }, { cpf: data.cpf }],
      },
    });

    if (existente) {
      return NextResponse.json(
        {
          message:
            existente.email === data.email.toLowerCase()
              ? "Este e-mail já está cadastrado."
              : "Este CPF já possui Dahora Card.",
        },
        { status: 409 }
      );
    }

    let numeroCartao = gerarNumeroCartao();
    while (await prisma.cliente.findUnique({ where: { numeroCartao } })) {
      numeroCartao = gerarNumeroCartao();
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const cliente = await prisma.cliente.create({
      data: {
        nomeCompleto: data.nomeCompleto.trim(),
        cpf: data.cpf,
        email: data.email.toLowerCase().trim(),
        telefone: data.telefone,
        dataNascimento: data.dataNascimento,
        cep: data.cep,
        endereco: data.endereco.trim(),
        numero: data.numero.trim(),
        complemento: data.complemento?.trim() || null,
        bairro: data.bairro.trim(),
        cidade: data.cidade.trim(),
        estado: data.estado.toUpperCase(),
        senhaHash,
        numeroCartao,
        pontos: 100,
        status: "ativo",
      },
    });

    await setSession(cliente.id);

    return NextResponse.json({
      message: "Cadastro realizado com sucesso.",
      numeroCartao: cliente.numeroCartao,
      nomeCompleto: cliente.nomeCompleto,
    });
  } catch (error) {
    console.error("cadastro:", error);
    return NextResponse.json(
      { message: "Erro interno ao processar o cadastro." },
      { status: 500 }
    );
  }
}
