/**
 * Sobe PostgreSQL na ordem:
 * 1) Docker Compose (se disponível)
 * 2) Serviço PostgreSQL do Windows (porta 5432)
 * 3) Orientação para o embutido (porta 5433)
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env");
const WINDOWS_URL =
  "postgresql://dahora:dahora_dev@127.0.0.1:5432/dahora?schema=public";

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    stdio: opts.silent ? "pipe" : "inherit",
    shell: opts.shell ?? false,
    encoding: "utf8",
    windowsHide: true,
  });
}

function setDatabaseUrl(url) {
  if (!fs.existsSync(envPath)) {
    console.warn("→ .env não encontrado; copie de .env.example");
    return;
  }
  let env = fs.readFileSync(envPath, "utf8");
  if (/^DATABASE_URL=/m.test(env)) {
    env = env.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL="${url}"`);
  } else {
    env = `DATABASE_URL="${url}"\n${env}`;
  }
  fs.writeFileSync(envPath, env);
  console.log("→ .env atualizado para PostgreSQL na porta 5432");
}

function dockerAvailable() {
  const ver = run("docker", ["--version"], { silent: true, shell: true });
  if (ver.status !== 0) return false;
  const info = run("docker", ["info"], { silent: true, shell: true });
  return info.status === 0;
}

function findWindowsPostgresService() {
  const ps = run(
    "powershell.exe",
    [
      "-NoProfile",
      "-Command",
      "Get-Service | Where-Object { $_.Name -like 'postgresql*' } | Select-Object -First 1 -ExpandProperty Name",
    ],
    { silent: true }
  );
  const name = (ps.stdout || "").trim();
  return name || null;
}

function ensureWindowsPostgres() {
  const name = findWindowsPostgresService();
  if (!name) return false;

  console.log(`→ Serviço PostgreSQL Windows encontrado: ${name}`);
  const start = run(
    "powershell.exe",
    [
      "-NoProfile",
      "-Command",
      `$s = Get-Service -Name '${name}'; if ($s.Status -ne 'Running') { Start-Service $s; Start-Sleep -Seconds 2 }; $s.Refresh(); $s.Status`,
    ],
    { silent: true }
  );
  const status = (start.stdout || "").trim();
  if (status !== "Running") {
    console.error(
      `✗ Não foi possível iniciar o serviço ${name} (status: ${status || "desconhecido"})`
    );
    return false;
  }

  setDatabaseUrl(WINDOWS_URL);
  console.log("");
  console.log("✓ PostgreSQL Windows pronto (porta 5432)");
  console.log("  Em seguida: npm run db:ready && npm run dev:lan");
  console.log("");
  return true;
}

if (dockerAvailable()) {
  console.log("→ Subindo PostgreSQL com Docker Compose…");
  const up = run("docker", ["compose", "up", "-d"], { shell: true });
  if (up.status === 0) {
    setDatabaseUrl(WINDOWS_URL);
    console.log("✓ Container dahora-postgres no ar");
  }
  process.exit(up.status ?? 1);
}

console.log("→ Docker indisponível; tentando PostgreSQL do Windows…");
if (ensureWindowsPostgres()) {
  process.exit(0);
}

console.error("");
console.error("✗ Docker e serviço PostgreSQL Windows indisponíveis.");
console.error("  Use o PostgreSQL embutido:");
console.error("");
console.error("    npm run db:embed");
console.error("    npm run db:ready");
console.error("    npm run dev:lan");
console.error("");
process.exit(1);
