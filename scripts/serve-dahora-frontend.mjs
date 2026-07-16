/**
 * Servidor estático EXCLUSIVO do Dahora Atacadista.
 * Porta 5510 — isolada do Live Server 5500 (Trampolim/outros).
 *
 * Uso: node scripts/serve-dahora-frontend.mjs
 * URL:  http://127.0.0.1:5510/
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../frontend");
const PORT = Number(process.env.DAHORA_FRONTEND_PORT || 5510);
const HOST = "127.0.0.1";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

function safeJoin(root, reqPath) {
  const decoded = decodeURIComponent(reqPath.split("?")[0]);
  const clean = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const full = path.join(root, clean);
  if (!full.startsWith(root)) return null;
  return full;
}

const server = http.createServer((req, res) => {
  const urlPath = req.url === "/" ? "/index.html" : req.url || "/index.html";
  let filePath = safeJoin(ROOT, urlPath);

  if (!filePath) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Não encontrado · Dahora Atacadista");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const type = TYPES[ext] || "application/octet-stream";
  const headers = {
    "Content-Type": type,
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "X-Dahora-App": "Dahora Atacadista",
  };

  if (ext === ".js" && path.basename(filePath).startsWith("sw-")) {
    headers["Service-Worker-Allowed"] = "/";
  }

  res.writeHead(200, headers);
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log("");
  console.log("  Dahora Atacadista (front exclusivo)");
  console.log(`  → http://${HOST}:${PORT}/`);
  console.log(`  → http://${HOST}:${PORT}/index.html`);
  console.log("");
  console.log("  NÃO use a porta 5500 (contaminada por outros apps no Chrome).");
  console.log("");
});
