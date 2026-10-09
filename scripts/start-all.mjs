/**
 * Sobe banco (db:up) + migrations/seed + Next.js em LAN.
 * Uso: npm run start:all
 */
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("→ 1/3 Garantindo PostgreSQL…");
run("npm", ["run", "db:up"]);

console.log("→ 2/3 Migrations + seed…");
run("npm", ["run", "db:ready"]);

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
