/**
 * Sobe PostgreSQL embutido no projeto (sem Docker).
 * Mantém o processo vivo até Ctrl+C.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import EmbeddedPostgres from "embedded-postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const databaseDir = path.join(root, "data", "pg");

// 5433 evita conflito com instalador Windows/Docker na 5432
const PORT = Number(process.env.PG_PORT || 5433);
const USER = process.env.PG_USER || "dahora";
const PASSWORD = process.env.PG_PASSWORD || "dahora_dev";
const DATABASE = process.env.PG_DATABASE || "dahora";

fs.mkdirSync(databaseDir, { recursive: true });

const pg = new EmbeddedPostgres({
  databaseDir,
  user: USER,
  password: PASSWORD,
  port: PORT,
  persistent: true,
});

const alreadyInit = fs.existsSync(path.join(databaseDir, "PG_VERSION"));

async function main() {
  if (!alreadyInit) {
    console.log("→ Inicializando cluster PostgreSQL embutido…");
    await pg.initialise();
  }

  console.log(`→ Iniciando PostgreSQL em 127.0.0.1:${PORT}…`);
  await pg.start();

  try {
    await pg.createDatabase(DATABASE);
    console.log(`→ Banco "${DATABASE}" criado.`);
  } catch (error) {
    const msg = String(error?.message || error);
    if (/already exists|já existe/i.test(msg)) {
      console.log(`→ Banco "${DATABASE}" já existe.`);
    } else {
      console.warn("→ Aviso ao criar banco:", msg);
    }
  }

  const url = `postgresql://${USER}:${PASSWORD}@127.0.0.1:${PORT}/${DATABASE}?schema=public`;
  console.log("");
  console.log("✓ PostgreSQL pronto");
  console.log(`  DATABASE_URL=${url}`);
  console.log("  Deixe este terminal aberto. Em outro: npm run db:setup && npm run dev:lan");
  console.log("");

  const stop = async () => {
    console.log("\n→ Encerrando PostgreSQL…");
    try {
      await pg.stop();
    } catch {
      /* ignore */
    }
    process.exit(0);
  };

  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

main().catch((error) => {
  console.error("Falha ao subir PostgreSQL embutido:", error);
  process.exit(1);
});
