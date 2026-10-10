import { NextResponse } from "next/server";
import { getFaqItems } from "@/lib/faq/get-faq-items";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get("categoria")?.trim();
  const q = searchParams.get("q")?.trim().toLowerCase();

  let items = await getFaqItems();

  if (categoria) {
    items = items.filter((item) => item.categoria === categoria);
  }
  if (q) {
    items = items.filter(
      (item) =>
        item.pergunta.toLowerCase().includes(q) ||
        item.resposta.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ ok: true, total: items.length, items });
}
