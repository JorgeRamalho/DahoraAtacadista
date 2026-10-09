/**
 * Usado no build Vercel: popula FAQ só se a tabela estiver vazia (não apaga dados em redeploy).
 */
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  if (!process.env.DATABASE_URL) {
    console.warn("seed-faq-if-empty: DATABASE_URL ausente — ignorando.");
    process.exit(0);
  }

  const count = await prisma.faq.count();
  if (count === 0) {
    console.log("FAQ vazia — executando prisma/seed.ts …");
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env: process.env });
  } else {
    console.log(`FAQ já possui ${count} registro(s) — seed ignorado.`);
  }
} catch (error) {
  console.error("seed-faq-if-empty falhou:", error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
