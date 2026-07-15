import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { cadastroSchema } from "@/lib/validations/schemas";
import { gerarNumeroCartao } from "@/lib/utils/format";
import { setSession } from "@/lib/auth/session";
import { optionsCors, withCors } from "@/lib/api/cors";

export async function OPTIONS(request: Request) {
  return optionsCors(request);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = cadastroSchema.safeParse({
      ...body,
      aceiteMarketing: Boolean(body?.aceiteMarketing),
      aceiteTermos: body?.aceiteTermos === true || body?.aceiteTermos === "true",
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() || "form";
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return withCors(
        request,
        NextResponse.json(
          { message: "Verifique os campos destacados.", fieldErrors },
          { status: 400 }
        )
      );
    }

    const data = parsed.data;

    const existente = await prisma.cliente.findFirst({
      where: {
        OR: [{ email: data.email.toLowerCase() }, { cpf: data.cpf }],
      },
    });

    if (existente) {
      return withCors(
        request,
        NextResponse.json(
          {
            message:
              existente.email === data.email.toLowerCase()
                ? "Este e-mail já está cadastrado."
                : "Este CPF já possui Dahora Card.",
          },
          { status: 409 }
        )
      );
    }

    let numeroCartao = gerarNumeroCartao();
    while (await prisma.cliente.findUnique({ where: { numeroCartao } })) {
      numeroCartao = gerarNumeroCartao();
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const cliente = await prisma.cliente.create({
      data: {
        nomeCompleto: data.nomeCompleto,
        nomeSocial: data.nomeSocial ?? null,
        cpf: data.cpf,
        rg: data.rg ?? null,
        email: data.email.toLowerCase(),
        telefone: data.telefone,
        telefoneAlternativo: data.telefoneAlternativo ?? null,
        dataNascimento: data.dataNascimento,
        genero: data.genero ?? null,
        estadoCivil: data.estadoCivil ?? null,
        cep: data.cep,
        endereco: data.endereco,
        numero: data.numero,
        complemento: data.complemento ?? null,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        comoConheceu: data.comoConheceu ?? null,
        senhaHash,
        numeroCartao,
        pontos: 100,
        status: "ativo",
        aceiteMarketing: data.aceiteMarketing ?? false,
        aceiteLgpdAt: new Date(),
      },
    });

    await setSession(cliente.id);

    return withCors(
      request,
      NextResponse.json({
        ok: true,
        message: "Cadastro realizado com sucesso. Dados salvos no PostgreSQL.",
        numeroCartao: cliente.numeroCartao,
        nomeCompleto: cliente.nomeCompleto,
        id: cliente.id,
      })
    );
  } catch (error) {
    console.error("cadastro:", error);
    return withCors(
      request,
      NextResponse.json(
        {
          message:
            "Erro ao gravar no PostgreSQL. Verifique se o banco está ativo (npm run db:up && npm run db:setup).",
        },
        { status: 500 }
      )
    );
  }
}
