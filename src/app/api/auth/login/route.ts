import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validations/schemas";
import { setSession } from "@/lib/auth/session";
import { optionsCors, withCors } from "@/lib/api/cors";

export async function OPTIONS(request: Request) {
  return optionsCors(request);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return withCors(
        request,
        NextResponse.json(
          { message: "Informe e-mail e senha válidos." },
          { status: 400 }
        )
      );
    }

    const cliente = await prisma.cliente.findUnique({
      where: { email: parsed.data.email.toLowerCase().trim() },
    });

    if (!cliente) {
      return withCors(
        request,
        NextResponse.json(
          { message: "E-mail ou senha incorretos." },
          { status: 401 }
        )
      );
    }

    const ok = await bcrypt.compare(parsed.data.senha, cliente.senhaHash);
    if (!ok) {
      return withCors(
        request,
        NextResponse.json(
          { message: "E-mail ou senha incorretos." },
          { status: 401 }
        )
      );
    }

    await setSession(cliente.id);

    return withCors(
      request,
      NextResponse.json({ message: "Login realizado." })
    );
  } catch (error) {
    console.error("login:", error);
    return withCors(
      request,
      NextResponse.json({ message: "Erro interno." }, { status: 500 })
    );
  }
}
