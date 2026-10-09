/**
 * Rode DEPOIS de reiniciar o Windows (WSL/Docker).
 * Uso: npm run after:reboot
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    ...opts,
  });
}

console.log("→ Verificando WSL…");
const wsl = run("wsl", ["--status"]);
if (wsl.status !== 0) {
  console.error("WSL ainda não está pronto. Confirme o reboot e rode: wsl --install -d Ubuntu");
  process.exit(1);
}

console.log("→ Verificando Docker…");
const info = run("docker", ["info"], { stdio: "pipe" });
if (info.status !== 0) {
  console.log("Abrindo Docker Desktop…");
  run(
    `"${process.env.ProgramFiles}\\Docker\\Docker\\Docker Desktop.exe"`,
    [],
    { shell: true }
  );
  console.log("Aguarde o Docker ficar verde e rode de novo: npm run after:reboot");
  process.exit(1);
}

console.log("→ Subindo container PostgreSQL…");
const up = run("docker", ["compose", "up", "-d"]);
if (up.status !== 0) process.exit(up.status ?? 1);

console.log("→ Migrations + seed…");
run("npm", ["run", "db:ready"]);

console.log("→ Health check…");
run("npm", ["run", "db:check"]);

console.log("");
console.log("✓ Docker + PostgreSQL prontos. Suba o app com: npm run dev:lan");
console.log("  ou tudo junto: npm run start:all");
