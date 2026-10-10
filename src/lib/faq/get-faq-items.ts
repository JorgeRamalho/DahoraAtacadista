import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { FAQ_FALLBACK_ITEMS, type FaqListItem } from "@/lib/faq/fallback-items";

export type { FaqListItem };

function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

async function loadFaqFromDatabase(): Promise<FaqListItem[]> {
  const items = await prisma.faq.findMany({
    where: { ativo: true },
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      pergunta: true,
      resposta: true,
      categoria: true,
    },
  });
  return items.length > 0 ? items : FAQ_FALLBACK_ITEMS;
}

const getCachedFaqFromDatabase = unstable_cache(
  loadFaqFromDatabase,
  ["dahora-faq-active"],
  { revalidate: 300, tags: ["faq"] }
);

/** Carrega FAQ do banco; se indisponível, usa conteúdo estático para a página não quebrar. */
export async function getFaqItems(): Promise<FaqListItem[]> {
  if (!hasDatabaseUrl()) {
    return FAQ_FALLBACK_ITEMS;
  }

  try {
    return await getCachedFaqFromDatabase();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[FAQ] PostgreSQL indisponível; usando FAQ embutido.", error);
    }
    return FAQ_FALLBACK_ITEMS;
  }
}
