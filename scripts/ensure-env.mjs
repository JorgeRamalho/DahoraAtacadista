/**
 * Garante .env mínimo para o Next/Prisma subir sem erro de variável ausente.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");
const examplePath = path.join(root, ".env.example");

if (fs.existsSync(envPath)) {
  process.exit(0);
}

if (fs.existsSync(examplePath)) {
  fs.copyFileSync(examplePath, envPath);
  console.log("→ Criado .env a partir de .env.example");
  process.exit(0);
}

fs.writeFileSync(
  envPath,
  `DATABASE_URL="postgresql://dahora:dahora_dev@127.0.0.1:5432/dahora?schema=public&connect_timeout=5"
SESSION_SECRET="dev-local-change-me"
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3010"
`,
  "utf8"
);
console.log("→ Criado .env padrão para desenvolvimento local");
