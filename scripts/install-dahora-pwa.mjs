/**
 * Instala Dahora Atacadista em http://dahora.local:5500 (origin isolado do Trampolim).
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const INSTALL_URL =
  process.argv[2] ||
  "http://dahora.local:5500/frontend/index.html?app=dahora-atacadista";

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

async function main() {
  const u = new URL(INSTALL_URL);
  const manifestId = `${u.origin}/frontend/?app=dahora-atacadista`;

  console.log("→ URL:", INSTALL_URL);
  console.log("→ Manifest id:", manifestId);

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: false,
    pipe: true,
    protocolTimeout: 120000,
    defaultViewport: null,
    args: ["--window-size=1100,800"],
  });

  try {
    const page = await browser.newPage();
    const client = await page.createCDPSession();
    await page.goto(INSTALL_URL, { waitUntil: "domcontentloaded", timeout: 90000 });
    await new Promise((r) => setTimeout(r, 5000));

    const title = await page.title();
    console.log("→ Título:", title);
    if (/trampolim/i.test(title)) throw new Error("Página ainda mostra Trampolim no título");

    try {
      await client.send("PWA.uninstall", { manifestId });
    } catch {
      // ok
    }

    await client.send("PWA.install", {
      manifestId,
      installUrlOrBundleUrl: INSTALL_URL,
    });
    console.log("✓ Instalado.");

    try {
      await client.send("PWA.changeAppUserSettings", {
        manifestId,
        displayMode: "standalone",
      });
      await client.send("PWA.launch", { manifestId, url: INSTALL_URL });
      console.log("✓ App aberto.");
    } catch (err) {
      console.log("→ launch:", err.message);
    }

    console.log("");
    console.log("Use SEMPRE este link (não 127.0.0.1):");
    console.log("  http://dahora.local:5500/frontend/index.html");
    console.log("127.0.0.1:5500 fica reservado a outros projetos (ex.: Trampolim).");
    await new Promise((r) => setTimeout(r, 4000));
  } finally {
    await browser.close().catch(() => {});
  }
}

main().catch((err) => {
  console.error("✗", err.message || err);
  process.exit(1);
});
