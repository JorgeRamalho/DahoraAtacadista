import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

const SESSION_COOKIE = "dahora_session";

export async function setSession(clienteId: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, clienteId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSessionClienteId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value ?? null;
}

export async function getClienteLogado() {
  const id = await getSessionClienteId();
  if (!id) return null;

  return prisma.cliente.findUnique({
    where: { id },
    select: {
      id: true,
      nomeCompleto: true,
      email: true,
      telefone: true,
      cpf: true,
      numeroCartao: true,
      pontos: true,
      status: true,
      cidade: true,
      estado: true,
      createdAt: true,
    },
  });
}
