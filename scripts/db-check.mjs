/**
 * Verifica se DATABASE_URL responde (PostgreSQL).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const tables = await prisma.$queryRaw`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    const clientes = await prisma.cliente.count();
    const faqs = await prisma.faq.count();

    console.log("✓ PostgreSQL OK");
    console.log(`  latencyMs=${Date.now() - started}`);
    console.log(`  tables=${tables.map((t) => t.tablename).join(", ")}`);
    console.log(`  clientes=${clientes} faqs=${faqs}`);
    process.exit(0);
  } catch (error) {
    console.error("✗ PostgreSQL DOWN");
    console.error(`  ${error instanceof Error ? error.message : error}`);
    console.error("");
    console.error("  Suba o banco com: npm run db:embed");
    console.error("  (Docker: npm run db:up — se instalado)");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
