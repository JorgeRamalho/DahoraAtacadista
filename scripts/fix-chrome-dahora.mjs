/**
 * 1) Mata Chrome
 * 2) Apaga SW/cache do origin 5500 (Trampolim)
 * 3) Instala PWA do Dahora na porta 5510 (origin limpo)
 */
import fs from "node:fs";
import path from "node:path";
import { execSync, spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import puppeteer from "puppeteer-core";

const DAHORA_URL = "http://127.0.0.1:5510/index.html?app=dahora-atacadista";
const MANIFEST_ID = "http://127.0.0.1:5510/?app=dahora-atacadista";
const BAD_ORIGINS = ["http://127.0.0.1:5500", "http://localhost:5500"];
const USER_DATA = path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "User Data");
const DEFAULT = path.join(USER_DATA, "Default");
const DEBUG_PORT = 9340;

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

function killChrome() {
  for (let i = 0; i < 4; i++) {
    try {
      execSync("taskkill /F /IM chrome.exe /T", { stdio: "ignore" });
    } catch {
      // ok
    }
  }
}

function rm(p) {
  try {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log("→ Apagado:", p);
    }
  } catch (e) {
    console.log("→ Skip:", p, e.message);
  }
}

function purgeDisk() {
  rm(path.join(DEFAULT, "Service Worker", "CacheStorage"));
  rm(path.join(DEFAULT, "Service Worker", "ScriptCache"));
  const swDb = path.join(DEFAULT, "Service Worker", "Database");
  if (fs.existsSync(swDb)) {
    for (const name of fs.readdirSync(swDb)) {
      if (name !== "LOCK") rm(path.join(swDb, name));
    }
  }
  rm(path.join(DEFAULT, "Cache"));
  rm(path.join(DEFAULT, "Code Cache"));
  for (const name of ["SingletonLock", "SingletonCookie", "SingletonSocket"]) {
    rm(path.join(USER_DATA, name));
  }
}

async function waitDebugger(port) {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return;
    } catch {
      // retry
    }
    await sleep(500);
  }
  throw new Error("DevTools não subiu — feche o Chrome manualmente e rode de novo");
}

async function main() {
  // garante servidor 5510
  try {
    const r = await fetch("http://127.0.0.1:5510/");
    if (!r.ok) throw new Error("status " + r.status);
  } catch {
    throw new Error("Servidor Dahora não está em http://127.0.0.1:5510 — rode: npm run serve:frontend");
  }

  const html = await (await fetch(DAHORA_URL)).text();
  if (/impulso para o trampo|Radar Trampolim/i.test(html)) {
    throw new Error("A porta 5510 ainda não está servindo o Dahora");
  }
  if (!/Dahora Atacadista/i.test(html)) {
    throw new Error("HTML inesperado na 5510");
  }
  console.log("→ Servidor 5510 OK (Dahora Atacadista)");

  console.log("→ Fechando Chrome…");
  killChrome();
  await sleep(2500);
  console.log("→ Limpando SW/cache do Chrome…");
  purgeDisk();

  const chrome = findChrome();
  console.log("→ Abrindo Chrome no perfil Default com DevTools…");
  // launch()+userDataDir trava no perfil Default; spawn + connect funciona
  spawn(
    chrome,
    [
      `--remote-debugging-port=${DEBUG_PORT}`,
      `--user-data-dir=${USER_DATA}`,
      "--profile-directory=Default",
      "--no-first-run",
      "--no-default-browser-check",
      "--window-size=1100,800",
      DAHORA_URL,
    ],
    { detached: true, stdio: "ignore" },
  ).unref();

  await waitDebugger(DEBUG_PORT);
  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${DEBUG_PORT}`,
    defaultViewport: null,
    protocolTimeout: 120000,
  });

  try {
    const pages = await browser.pages();
    const page = pages[0] || (await browser.newPage());
    const client = await page.createCDPSession();

    for (const origin of BAD_ORIGINS) {
      try {
        await client.send("Storage.clearDataForOrigin", {
          origin,
          storageTypes:
            "appcache,cookies,file_systems,indexeddb,local_storage,shader_cache,websql,service_workers,cache_storage",
        });
        console.log("→ Limpo:", origin);
      } catch {
        // ok
      }
      for (const id of [
        `${origin}/`,
        `${origin}/?app=trampolim`,
        `${origin}/index.html`,
        `${origin}/frontend/index.html`,
      ]) {
        try {
          await client.send("PWA.uninstall", { manifestId: id });
          console.log("→ App removido:", id);
        } catch {
          // ok
        }
      }
    }

    await page.goto(DAHORA_URL, { waitUntil: "domcontentloaded", timeout: 90000 });
    await sleep(5000);
    const title = await page.title();
    console.log("→ Título:", title);
    if (/trampolim/i.test(title) || /impulso para o trampo/i.test(await page.content())) {
      throw new Error("Chrome ainda renderizou Trampolim na 5510 — pare o Live Server do Trampolim e tente de novo");
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
    console.log("✓ PWA Dahora instalado no perfil Default em 127.0.0.1:5510");

    try {
      await client.send("PWA.changeAppUserSettings", {
        manifestId: MANIFEST_ID,
        displayMode: "standalone",
      });
      await client.send("PWA.launch", { manifestId: MANIFEST_ID, url: DAHORA_URL });
      console.log("✓ App aberto");
    } catch (e) {
      console.log("→ launch:", e.message);
    }

    console.log("");
    console.log("URL DEFINITIVA DO DAHORA:");
    console.log("  http://127.0.0.1:5510/");
    console.log("Se ainda abrir Trampolim pela 5500: chrome://apps → remova Trampolim.");
    await sleep(4000);
  } finally {
    // Desconecta sem fechar o Chrome do usuário
    browser.disconnect();
  }
}

main().catch((err) => {
  console.error("✗", err.message || err);
  process.exit(1);
});
