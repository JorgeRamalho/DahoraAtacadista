/**
 * Sobe banco (db:up) + migrations/seed + Next.js em LAN.
 * Uso: npm run start:all
 */
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(cmd, args, { required = true } = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  if (result.status !== 0 && required) {
    process.exit(result.status ?? 1);
  }
  return result.status === 0;
}

run("node", ["scripts/ensure-env.mjs"], { required: true });

console.log("→ 1/3 Garantindo PostgreSQL (opcional)…");
const dbUpOk = run("npm", ["run", "db:up"], { required: false });
if (!dbUpOk) {
  console.warn("");
  console.warn("⚠ PostgreSQL não subiu. O site abre com FAQ estático;");
  console.warn("  cadastro/login exigem: npm run db:embed && npm run db:ready");
  console.warn("");
}

console.log("→ 2/3 Migrations + seed (opcional)…");
const dbReadyOk = run("npm", ["run", "db:ready"], { required: false });
if (!dbReadyOk) {
  console.warn("⚠ db:ready falhou — Next.js sobe mesmo assim (modo visual + FAQ embutido).");
}

console.log("→ 3/3 Subindo Next.js (LAN)…");
const child = spawn("npm", ["run", "dev:lan"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: process.env,
});

const stop = () => {
  child.kill("SIGTERM");
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);

child.on("exit", (code) => process.exit(code ?? 0));
