/**
 * Remove service workers/caches do Chrome que fazem 127.0.0.1:5500
 * abrir Trampolim em vez do Dahora. Fecha o Chrome, limpa disco, reinstala.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync, spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import puppeteer from "puppeteer-core";

const ORIGIN = "http://127.0.0.1:5500";
const INSTALL_URL = `${ORIGIN}/frontend/index.html?app=dahora-atacadista`;
const MANIFEST_ID = `${ORIGIN}/frontend/?app=dahora-atacadista`;
const DEBUG_PORT = 9331;
const USER_DATA = path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "User Data");
const DEFAULT = path.join(USER_DATA, "Default");

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
  } catch (err) {
    console.log("→ Não apagou", p, "-", err.message);
  }
}

function purgeDisk() {
  console.log("→ Limpando dados do Chrome no disco…");
  rm(path.join(DEFAULT, "Service Worker", "CacheStorage"));
  rm(path.join(DEFAULT, "Service Worker", "ScriptCache"));
  // Database: apaga arquivos, mantém pasta
  const swDb = path.join(DEFAULT, "Service Worker", "Database");
  if (fs.existsSync(swDb)) {
    for (const name of fs.readdirSync(swDb)) {
      if (name === "LOCK") continue;
      rm(path.join(swDb, name));
    }
  }
  rm(path.join(DEFAULT, "Cache"));
  rm(path.join(DEFAULT, "Code Cache"));
  rm(path.join(DEFAULT, "GPUCache"));
  // Storage por origin (quando existir)
  const storage = path.join(DEFAULT, "Storage", "ext");
  if (fs.existsSync(storage)) {
    for (const name of fs.readdirSync(storage)) {
      if (/5500|trampolim/i.test(name)) rm(path.join(storage, name));
    }
  }
  // IndexedDB http origins
  const idb = path.join(DEFAULT, "IndexedDB");
  if (fs.existsSync(idb)) {
    for (const name of fs.readdirSync(idb)) {
      if (/127\.0\.0\.1_5500|localhost_5500|trampolim/i.test(name)) {
        rm(path.join(idb, name));
      }
    }
  }
  for (const name of ["SingletonLock", "SingletonCookie", "SingletonSocket"]) {
    rm(path.join(USER_DATA, name));
  }
}

async function waitDebugger(port) {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return;
    } catch {
      // retry
    }
    await sleep(500);
  }
  throw new Error("Chrome DevTools não subiu");
}

async function main() {
  const chrome = findChrome();
  console.log("→ Fechando Chrome…");
  killChrome();
  await sleep(3000);
  purgeDisk();

  console.log("→ Reabrindo Chrome limpo…");
  const child = spawn(
    chrome,
    [
      `--remote-debugging-port=${DEBUG_PORT}`,
      `--user-data-dir=${USER_DATA}`,
      "--profile-directory=Default",
      "--no-first-run",
      "--disable-session-crashed-bubble",
      INSTALL_URL,
    ],
    { detached: true, stdio: "ignore" }
  );
  child.unref();

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

    try {
      await client.send("Storage.clearDataForOrigin", {
        origin: ORIGIN,
        storageTypes:
          "appcache,cookies,file_systems,indexeddb,local_storage,shader_cache,websql,service_workers,cache_storage",
      });
      console.log("→ Origin limpo via CDP.");
    } catch (err) {
      console.log("→ CDP clear:", err.message);
    }

    await page.goto(INSTALL_URL, { waitUntil: "domcontentloaded", timeout: 90000 });
    await sleep(5000);

    const info = await page.evaluate(async () => {
      const title = document.title;
      const hasTrampolim = /trampolim/i.test(document.documentElement.innerHTML + title);
      const regs = "serviceWorker" in navigator
        ? (await navigator.serviceWorker.getRegistrations()).map(
            (r) => r.active?.scriptURL || r.scope
          )
        : [];
      return { title, hasTrampolim, regs, bodyStart: document.body?.innerText?.slice(0, 120) };
    });
    console.log("→ Título:", info.title);
    console.log("→ Contém Trampolim?", info.hasTrampolim);
    console.log("→ SWs:", info.regs);
    console.log("→ Texto:", info.bodyStart?.replace(/\s+/g, " "));

    const foreign = [
      `${ORIGIN}/`,
      `${ORIGIN}/?app=trampolim`,
      `${ORIGIN}/?app=carona`,
      `${ORIGIN}/index.html`,
      `${ORIGIN}/frontend/`,
      `${ORIGIN}/frontend/index.html`,
    ];
    for (const id of foreign) {
      try {
        await client.send("PWA.uninstall", { manifestId: id });
        console.log("→ App removido:", id);
      } catch {
        // ok
      }
    }

    try {
      await client.send("PWA.uninstall", { manifestId: MANIFEST_ID });
    } catch {
      // ok
    }

    await client.send("PWA.install", {
      manifestId: MANIFEST_ID,
      installUrlOrBundleUrl: INSTALL_URL,
    });
    console.log("✓ Dahora Atacadista instalado.");

    try {
      await client.send("PWA.changeAppUserSettings", {
        manifestId: MANIFEST_ID,
        displayMode: "standalone",
      });
      await client.send("PWA.launch", { manifestId: MANIFEST_ID, url: INSTALL_URL });
    } catch (err) {
      console.log("→ launch:", err.message);
    }

    console.log("");
    console.log("PRONTO. Se ainda ver Trampolim em chrome://apps, remova manualmente.");
    browser.disconnect();
  } catch (err) {
    try {
      browser.disconnect();
    } catch {
      // ok
    }
    throw err;
  }
}

main().catch((err) => {
  console.error("✗", err.message || err);
  process.exit(1);
});
