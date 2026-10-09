/**
 * Envia DATABASE_URL para a Vercel (Production + Preview + Development).
 *
 * Uso (PowerShell):
 *   $env:DATABASE_URL = "postgresql://..."   # cole a URL do Neon
 *   npm run vercel:push-database-url
 *
 * Ou crie o arquivo env/vercel.database.url (gitignored) com a URL em uma linha.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const filePath = join(root, "env", "vercel.database.url");

let databaseUrl = process.env.DATABASE_URL?.trim() ?? "";
if (!databaseUrl && existsSync(filePath)) {
  databaseUrl = readFileSync(filePath, "utf8").trim();
}

if (!databaseUrl) {
  console.error(
    "Defina DATABASE_URL no ambiente ou crie env/vercel.database.url com a connection string do Neon.",
  );
  console.error(
    "Neon (projeto dahora-atacadista): https://console.neon.tech/app/projects/gentle-resonance-13598481",
  );
  process.exit(1);
}

const project = "dahora-atacadista";
const targets = ["production", "preview", "development"];

function pushEnv(target) {
  execSync(
    `npx vercel env add DATABASE_URL ${target} --project ${project} --force`,
    {
      input: databaseUrl,
      stdio: ["pipe", "inherit", "inherit"],
      cwd: root,
      env: process.env,
    },
  );
}

for (const target of targets) {
  console.log(`→ DATABASE_URL (${target})…`);
  pushEnv(target);
}

console.log("Concluído. Rode um Redeploy na Vercel (Deployments → Redeploy).");
