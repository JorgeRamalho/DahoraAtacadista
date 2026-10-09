import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get("categoria")?.trim();
    const q = searchParams.get("q")?.trim();

    const items = await prisma.faq.findMany({
      where: {
        ativo: true,
        ...(categoria ? { categoria } : {}),
        ...(q
          ? {
              OR: [
                { pergunta: { contains: q, mode: "insensitive" } },
                { resposta: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        pergunta: true,
        resposta: true,
        categoria: true,
        ordem: true,
      },
    });

    return NextResponse.json({ ok: true, total: items.length, items });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Não foi possível carregar o FAQ." },
      { status: 500 }
    );
  }
}
