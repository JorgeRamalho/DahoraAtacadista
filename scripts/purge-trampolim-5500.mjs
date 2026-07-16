/**
 * Remove o PWA da porta 5500 (Trampolim) do perfil Default do Chrome
 * e instala o Dahora em http://127.0.0.1:5510/
 *
 * Pré-requisito: npm run serve:frontend
 */
import fs from "node:fs";
import path from "node:path";
import { execSync, spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import puppeteer from "puppeteer-core";

const DAHORA_URL = "http://127.0.0.1:5510/index.html?app=dahora-atacadista";
const MANIFEST_ID = "http://127.0.0.1:5510/?app=dahora-atacadista";
const DEBUG_PORT = 9341;
const USER_DATA = path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "User Data");
const DEFAULT = path.join(USER_DATA, "Default");

const BAD_MANIFEST_IDS = [
  "http://127.0.0.1:5500/",
  "http://127.0.0.1:5500/?app=trampolim",
  "http://127.0.0.1:5500/index.html",
  "http://127.0.0.1:5500/frontend/index.html",
  "http://127.0.0.1:5500/frontend/",
  "http://localhost:5500/",
  "http://localhost:5500/?app=trampolim",
  "http://localhost:5500/index.html",
  "http://localhost:5500/frontend/index.html",
];

function findChrome() {
  for (const c of [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    path.join(process.env.LOCALAPPDATA || "", "Google\\Chrome\\Application\\chrome.exe"),
  ]) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error("Chrome não encontrado");
}

function chromeCount() {
  try {
    const out = execSync('powershell -NoProfile -Command "(Get-Process chrome -ErrorAction SilentlyContinue | Measure-Object).Count"', {
      encoding: "utf8",
    });
    return Number(String(out).trim()) || 0;
  } catch {
    return 0;
  }
}

async function killChromeHard() {
  for (let round = 0; round < 10; round++) {
    for (const cmd of [
      "taskkill /F /IM chrome.exe /T",
      "taskkill /F /IM GoogleCrashHandler.exe /T",
      "taskkill /F /IM GoogleCrashHandler64.exe /T",
    ]) {
      try {
        execSync(cmd, { stdio: "ignore" });
      } catch {
        // ok
      }
    }
    await sleep(800);
    const n = chromeCount();
    console.log(`→ Chrome processos restantes: ${n}`);
    if (n === 0) return;
  }
}

function disableBackgroundMode() {
  const localState = path.join(USER_DATA, "Local State");
  if (!fs.existsSync(localState)) return;
  try {
    const j = JSON.parse(fs.readFileSync(localState, "utf8"));
    j.background_mode = j.background_mode || {};
    j.background_mode.enabled = false;
    fs.writeFileSync(localState, JSON.stringify(j));
    console.log("→ Background mode do Chrome desligado");
  } catch (e) {
    console.log("→ Não foi possível editar Local State:", e.message);
  }
}

function scrubPreferencesMetrics() {
  const prefsPath = path.join(DEFAULT, "Preferences");
  if (!fs.existsSync(prefsPath)) return;
  try {
    const j = JSON.parse(fs.readFileSync(prefsPath, "utf8"));
    if (j.web_apps?.daily_metrics) {
      for (const key of Object.keys(j.web_apps.daily_metrics)) {
        if (/:5500|:3000/.test(key) && /trampolim|carona|5500|3000/i.test(key + JSON.stringify(j.web_apps.daily_metrics[key]))) {
          // keep structure but mark uninstalled for 5500
        }
        if (key.includes(":5500")) {
          delete j.web_apps.daily_metrics[key];
          console.log("→ Removido daily_metrics:", key);
        }
      }
    }
    // intent picker / link capturing hints for 5500
    const scrubObj = (obj) => {
      if (!obj || typeof obj !== "object") return;
      for (const key of Object.keys(obj)) {
        if (String(key).includes(":5500")) {
          delete obj[key];
          console.log("→ Removido pref key:", key);
        } else if (typeof obj[key] === "object") {
          scrubObj(obj[key]);
        }
      }
    };
    scrubObj(j.intent_picker_auto_display);
    scrubObj(j.profile?.content_settings?.exceptions);
    fs.writeFileSync(prefsPath, JSON.stringify(j));
    console.log("→ Preferences limpas de referências 5500");
  } catch (e) {
    console.log("→ Preferences skip:", e.message);
  }
}

function purgeSw() {
  for (const rel of [
    ["Service Worker", "CacheStorage"],
    ["Service Worker", "ScriptCache"],
    ["Cache"],
    ["Code Cache"],
  ]) {
    const p = path.join(DEFAULT, ...rel);
    try {
      if (fs.existsSync(p)) {
        fs.rmSync(p, { recursive: true, force: true });
        console.log("→ Apagado:", p);
      }
    } catch (e) {
      console.log("→ Skip:", p, e.message);
    }
  }
  const swDb = path.join(DEFAULT, "Service Worker", "Database");
  if (fs.existsSync(swDb)) {
    for (const name of fs.readdirSync(swDb)) {
      if (name === "LOCK") continue;
      try {
        fs.rmSync(path.join(swDb, name), { recursive: true, force: true });
      } catch {
        // ok
      }
    }
  }
  for (const name of ["SingletonLock", "SingletonCookie", "SingletonSocket"]) {
    try {
      fs.rmSync(path.join(USER_DATA, name), { force: true });
    } catch {
      // ok
    }
  }
}

async function waitDebugger(port) {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return await res.json();
    } catch {
      // retry
    }
    await sleep(500);
  }
  throw new Error("DevTools não subiu. Feche o Chrome manualmente (incluindo ícone da bandeja) e rode de novo.");
}

async function main() {
  const r = await fetch("http://127.0.0.1:5510/");
  if (!r.ok) throw new Error("Servidor 5510 offline — rode: npm run serve:frontend");
  const html = await (await fetch(DAHORA_URL)).text();
  if (!/Dahora Atacadista/i.test(html) || /Radar Trampolim/i.test(html)) {
    throw new Error("Porta 5510 não está servindo o Dahora");
  }
  console.log("→ Servidor 5510 OK");

  console.log("→ Encerrando Chrome por completo…");
  await killChromeHard();
  await sleep(2000);
  if (chromeCount() > 0) {
    throw new Error("Ainda há Chrome aberto. Feche pelo Gerenciador de Tarefas (e ícone da bandeja) e rode de novo.");
  }

  disableBackgroundMode();
  scrubPreferencesMetrics();
  purgeSw();

  const chrome = findChrome();
  console.log("→ Abrindo Chrome Default com debugging…");
  const child = spawn(
    chrome,
    [
      `--remote-debugging-port=${DEBUG_PORT}`,
      `--user-data-dir=${USER_DATA}`,
      "--profile-directory=Default",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-mode",
      "--new-window",
      "about:blank",
    ],
    { detached: true, stdio: "ignore" },
  );
  child.unref();

  const ver = await waitDebugger(DEBUG_PORT);
  console.log("→ DevTools OK:", ver.Browser || "chrome");

  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${DEBUG_PORT}`,
    defaultViewport: null,
    protocolTimeout: 120000,
  });

  try {
    const page = (await browser.pages())[0] || (await browser.newPage());
    const client = await page.createCDPSession();

    for (const origin of ["http://127.0.0.1:5500", "http://localhost:5500"]) {
      try {
        await client.send("Storage.clearDataForOrigin", {
          origin,
          storageTypes:
            "appcache,cookies,file_systems,indexeddb,local_storage,shader_cache,websql,service_workers,cache_storage",
        });
        console.log("→ Storage limpo:", origin);
      } catch {
        // ok
      }
    }

    for (const id of BAD_MANIFEST_IDS) {
      try {
        await client.send("PWA.uninstall", { manifestId: id });
        console.log("→ PWA removido:", id);
      } catch {
        // ok
      }
    }

    await page.goto(DAHORA_URL, { waitUntil: "networkidle2", timeout: 90000 });
    await sleep(4000);
    const title = await page.title();
    console.log("→ Título na 5510:", title);
    if (/trampolim/i.test(title)) {
      throw new Error("Ainda Trampolim na 5510 — origem errada no servidor");
    }

    try {
      await client.send("PWA.uninstall", { manifestId: MANIFEST_ID });
    } catch {
      // ok
    }
    await client.send("PWA.install", {
      manifestId: MANIFEST_ID,
      installUrlOrBundleUrl: DAHORA_URL,
    });
    console.log("✓ Dahora instalado no perfil Default →", MANIFEST_ID);

    try {
      await client.send("PWA.changeAppUserSettings", {
        manifestId: MANIFEST_ID,
        displayMode: "standalone",
      });
      await client.send("PWA.launch", { manifestId: MANIFEST_ID, url: DAHORA_URL });
    } catch (e) {
      console.log("→ launch:", e.message);
    }

    console.log("");
    console.log("PRONTO.");
    console.log("Use sempre: http://127.0.0.1:5510/");
    console.log("Se a 5500 ainda abrir app: chrome://apps → remova qualquer app da porta 5500.");
  } finally {
    browser.disconnect();
  }
}

main().catch((err) => {
  console.error("✗", err.message || err);
  process.exit(1);
});
