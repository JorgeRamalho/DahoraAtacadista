/**
 * Dahora — script.js
 * Navegação, máscaras, FAQ e utilitários do front
 */

function isLoopbackHost() {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

/**
 * null  → hospedagem estática (GitHub Pages / Netlify) sem API Next
 * ""    → mesma origem (Next na porta 3000)
 * url   → Next em outro host (local ou DAHORA_API_BASE)
 */
function resolveApiBase() {
  if (typeof window === "undefined") return "http://127.0.0.1:3000";
  if (window.DAHORA_API_BASE) return window.DAHORA_API_BASE;
  // Já no Next (porta 3000): mesma origem
  if (window.location.port === "3000") return "";

  // Front estático local (Live Server etc.): API no loopback.
  // Em outro dispositivo na Wi‑Fi, defina window.DAHORA_API_BASE antes do script.
  if (isLoopbackHost()) return "http://127.0.0.1:3000";

  // github.io, Netlify, etc.: só o HTML — sem backend nesta origem
  return null;
}

const API_BASE = resolveApiBase();
const API_AVAILABLE = API_BASE !== null;

const STATIC_APP_PATHS = {
  "/area-cliente": "area-cliente.html",
  "/cadastro": "index.html#cadastro",
  "/faq": "index.html#faq",
  "/sac": "sac.html",
  "/dahora-card": "dahora-card.html",
  "/dahora-club": "dahora-club.html",
  "/tire-sua-duvida": "tire-sua-duvida.html",
};

/** URL do app Next (com API) ou equivalente .html no site estático. */
function appUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!API_AVAILABLE) {
    return STATIC_APP_PATHS[normalized] || `${normalized.replace(/^\//, "")}.html`;
  }
  return `${API_BASE}${normalized}`;
}

function initAppLinks() {
  document.querySelectorAll("[data-app-link]").forEach((el) => {
    const path = el.getAttribute("data-app-link");
    if (path) el.setAttribute("href", appUrl(path));
  });

  // Ponte HTML → Next só quando a API local/remota existe
  if (!API_AVAILABLE) return;

  document.querySelectorAll("a[href]").forEach((el) => {
    const href = el.getAttribute("href") || "";
    if (
      href === "area-cliente.html" ||
      href.endsWith("/area-cliente.html") ||
      href === "../area-cliente.html"
    ) {
      el.setAttribute("href", appUrl("/area-cliente"));
    }
  });
}

/* ---------- Menu mobile ---------- */
function initMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const panel = document.querySelector("[data-menu-panel]");
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    panel.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    toggle.textContent = open ? "✕" : "☰";
    document.body.classList.toggle("nav-open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(!panel.classList.contains("is-open"));
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 1100px)").matches) setOpen(false);
  });
}

/* ---------- Ano no footer ---------- */
function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

/* ---------- Barra de status / acessibilidade / PWA ---------- */
function syncHeaderOffset() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const height = Math.ceil(header.getBoundingClientRect().height);
  document.documentElement.style.setProperty(
    "--header-offset",
    `${Math.max(height, 64)}px`
  );
}

function initStatusBar() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let bar = header.querySelector("[data-app-status-bar]");
  if (!bar) {
    bar = document.createElement("div");
    bar.className = "app-status-bar";
    bar.setAttribute("data-app-status-bar", "");
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Parceiros de delivery");
    header.appendChild(bar);
  }

  bar.innerHTML = `
    <div class="container app-status-bar__inner">
      <div class="app-status-bar__partners" role="list" aria-label="Parceiros de delivery">
        <a class="partner-link" href="https://www.ifood.com.br" target="_blank" rel="noopener noreferrer" role="listitem" title="iFood" aria-label="iFood">
          <span class="partner-mark partner-mark--ifood">
            <svg viewBox="0 0 86 28" width="86" height="28" aria-hidden="true"><rect width="86" height="28" rx="8" fill="#EA1D2C"/><text x="14" y="19" fill="#fff" font-family="Arial Black, Arial, sans-serif" font-size="13" font-weight="900">iFood</text></svg>
          </span>
        </a>
        <a class="partner-link" href="https://99app.com/99food" target="_blank" rel="noopener noreferrer" role="listitem" title="99Food" aria-label="99Food">
          <span class="partner-mark partner-mark--99">
            <svg viewBox="0 0 96 28" width="96" height="28" aria-hidden="true"><rect width="96" height="28" rx="8" fill="#FFDD00"/><text x="8" y="19.2" fill="#000" font-family="Arial Black, Impact, sans-serif" font-size="15" font-weight="900">99</text><text x="34" y="19" fill="#000" font-family="Arial, sans-serif" font-size="13" font-weight="800">Food</text><circle cx="88" cy="8.5" r="3.4" fill="#000"/></svg>
          </span>
        </a>
        <a class="partner-link" href="https://www.ubereats.com" target="_blank" rel="noopener noreferrer" role="listitem" title="Uber Eats" aria-label="Uber Eats">
          <span class="partner-mark partner-mark--uber">
            <svg viewBox="0 0 118 28" width="118" height="28" aria-hidden="true"><rect width="118" height="28" rx="8" fill="#000"/><circle cx="16" cy="14" r="8" fill="#06C167"/><path fill="#000" d="M16 8.4c-1.9 1.6-3.1 3.9-3.1 6.3 0 .5.1 1 .2 1.5h5.8c.1-.5.2-1 .2-1.5 0-2.4-1.2-4.7-3.1-6.3Z"/><text x="30" y="18.5" fill="#fff" font-family="Arial, sans-serif" font-size="12" font-weight="700">Uber Eats</text></svg>
          </span>
        </a>
      </div>
    </div>
    <div class="container" data-install-hint hidden>
      <p class="status-hint" role="status"></p>
    </div>
  `;

  const installBtns = document.querySelectorAll("[data-install-app]");
  const hintWrap = bar.querySelector("[data-install-hint]");
  const hintText = hintWrap?.querySelector(".status-hint");

  const isApp =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  document.documentElement.classList.remove("a11y-contrast", "a11y-large-text");

  let deferredPrompt = null;
  let hintTimer = null;

  const showHint = (message) => {
    if (!hintWrap || !hintText) return;
    hintText.textContent = message;
    hintWrap.hidden = false;
    if (hintTimer) window.clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => {
      hintWrap.hidden = true;
    }, 6000);
  };

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
  });

  installBtns.forEach((installBtn) => {
    installBtn.addEventListener("click", async (event) => {
      if (deferredPrompt) {
        event.preventDefault();
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          deferredPrompt = null;
        }
        return;
      }
      const target = installBtn.getAttribute("href");
      if (target && target.startsWith("#") && document.querySelector(target)) {
        return;
      }
      if (target && target.includes("#app-download")) {
        return;
      }
      event.preventDefault();
      const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
      showHint(
        isIos
          ? "No iPhone: toque em Compartilhar e depois em “Adicionar à Tela de Início”."
          : isApp
            ? "O app Dahora já está instalado neste dispositivo."
            : "Use o menu do navegador → “Instalar app” ou “Adicionar à tela inicial”."
      );
    });
  });

  syncHeaderOffset();
  window.addEventListener("resize", syncHeaderOffset, { passive: true });
}

/* ---------- Banner flutuante de anúncio ---------- */
function initFloatAnnounce() {
  const DISMISS_KEY = "dahora-float-banner-dismissed";
  const section = document.querySelector("#cadastro");
  if (!section || sessionStorage.getItem(DISMISS_KEY) === "1") return;
  if (section.querySelector("[data-float-announce]")) return;

  section.classList.add("is-relative");
  const aside = document.createElement("aside");
  aside.className = "float-announce";
  aside.setAttribute("data-float-announce", "");
  aside.setAttribute("aria-label", "Anúncio Dahora Card");
  aside.setAttribute("role", "complementary");
  aside.innerHTML = `
    <div class="float-announce__card">
      <p class="float-announce__eyebrow">Oferta do dia</p>
      <p class="float-announce__title">Ganhe 100 pontos no cadastro do Dahora Card</p>
      <p class="float-announce__text">Preencha o formulário abaixo e ative seu cartão digital em minutos.</p>
      <div class="float-announce__actions">
        <a class="float-announce__cta" href="#cadastro">Quero meu cartão</a>
        <button type="button" class="float-announce__close" data-float-close aria-label="Fechar anúncio">Fechar</button>
      </div>
    </div>
  `;
  section.prepend(aside);
  aside.querySelector("[data-float-close]")?.addEventListener("click", () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    aside.remove();
  });
}

/* ---------- Máscaras ---------- */
function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function maskCpf(value) {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(value) {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

function maskCep(value) {
  const d = onlyDigits(value).slice(0, 8);
  return d.replace(/(\d{5})(\d)/, "$1-$2");
}

function initMasks() {
  document.querySelectorAll("[data-mask='cpf']").forEach((input) => {
    input.addEventListener("input", () => {
      input.value = maskCpf(input.value);
    });
  });
  document.querySelectorAll("[data-mask='phone']").forEach((input) => {
    input.addEventListener("input", () => {
      input.value = maskPhone(input.value);
    });
  });
  document.querySelectorAll("[data-mask='cep']").forEach((input) => {
    input.addEventListener("input", async () => {
      input.value = maskCep(input.value);
      const cep = onlyDigits(input.value);
      if (cep.length === 8) await fillAddressByCep(cep);
    });
  });
}

async function fillAddressByCep(cep) {
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (data.erro) return;
    const map = {
      endereco: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
    };
    Object.entries(map).forEach(([name, value]) => {
      const field = document.querySelector(`[name='${name}']`);
      if (field && value) field.value = value;
    });
  } catch {
    /* ViaCEP opcional */
  }
}

/* ---------- FAQ ---------- */
const FAQ_DATA = [
  {
    categoria: "Cartão",
    pergunta: "O que é o Dahora Card?",
    resposta:
      "O Dahora Card é o cartão de vantagens exclusivo da rede Dahora. Com ele você acumula pontos em todas as compras, acessa ofertas exclusivas e participa de campanhas especiais.",
  },
  {
    categoria: "Cartão",
    pergunta: "Como faço para solicitar o Dahora Card?",
    resposta:
      "Preencha o formulário de cadastro no site com seus dados pessoais e de endereço. Após a conclusão, o cartão digital fica disponível na Área do Cliente.",
  },
  {
    categoria: "Pontos",
    pergunta: "Como funcionam os pontos do Dahora Card?",
    resposta:
      "A cada R$ 1,00 em compras você acumula 1 ponto. Os pontos podem ser trocados por descontos e produtos selecionados.",
  },
  {
    categoria: "Lojas",
    pergunta: "Posso usar o cartão em todas as lojas Dahora?",
    resposta:
      "Sim. O Dahora Card é válido em toda a rede — supermercados e atacados — e também nas compras online.",
  },
  {
    categoria: "Conta",
    pergunta: "Como acesso a Área do Cliente?",
    resposta:
      "Use o e-mail e a senha cadastrados no formulário do Dahora Card.",
  },
  {
    categoria: "SAC",
    pergunta: "O SAC funciona à noite e nos fins de semana?",
    resposta:
      "Sim. O Suporte ao Cliente opera 24 horas por dia, 7 dias por semana.",
  },
  {
    categoria: "Cadastro",
    pergunta: "Quais documentos preciso para o cadastro?",
    resposta:
      "CPF válido, e-mail ativo, telefone e endereço completo com CEP. Os dados são protegidos conforme a LGPD.",
  },
  {
    categoria: "SAC",
    pergunta: "Como acompanho uma solicitação no SAC?",
    resposta:
      "Ao abrir um chamado você recebe um protocolo. Clientes cadastrados também veem o histórico na Área do Cliente.",
  },
];

function initFaq() {
  const list = document.querySelector("[data-faq-list]");
  if (!list) return;

  const search = document.querySelector("[data-faq-search]");
  const filter = document.querySelector("[data-faq-filter]");

  const categorias = ["Todas", ...new Set(FAQ_DATA.map((f) => f.categoria))];
  if (filter) {
    filter.innerHTML = categorias
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("");
  }

  function render() {
    const q = (search?.value || "").trim().toLowerCase();
    const cat = filter?.value || "Todas";
    const items = FAQ_DATA.filter((item) => {
      const okCat = cat === "Todas" || item.categoria === cat;
      const okQ =
        !q ||
        item.pergunta.toLowerCase().includes(q) ||
        item.resposta.toLowerCase().includes(q);
      return okCat && okQ;
    });

    if (!items.length) {
      list.innerHTML =
        '<p class="surface text-center muted">Nenhuma pergunta encontrada. <a href="tire-sua-duvida.html">Envie sua dúvida</a>.</p>';
      return;
    }

    list.innerHTML = items
      .map(
        (item, i) => `
      <article class="faq-item${i === 0 ? " is-open" : ""}">
        <button type="button" aria-expanded="${i === 0}">
          <span>
            <span class="faq-cat">${item.categoria}</span>
            <span class="faq-q">${item.pergunta}</span>
          </span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-a">${item.resposta}</div>
      </article>`
      )
      .join("");

    list.querySelectorAll(".faq-item button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        const open = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
      });
    });
  }

  search?.addEventListener("input", render);
  filter?.addEventListener("change", render);
  render();
}

/* ---------- Helpers de formulário / API ---------- */
const API_TIMEOUT_MS = 15000;

async function postJson(path, body) {
  if (!API_AVAILABLE) {
    return {
      ok: false,
      status: 0,
      data: {
        message:
          "Este site está em modo visual (GitHub Pages / Netlify estático). Cadastro, login e SAC precisam do app completo com banco de dados.",
      },
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error("postJson:", path, error);
    const timedOut = error?.name === "AbortError";
    return {
      ok: false,
      status: 0,
      data: {
        message: timedOut
          ? "A API não respondeu a tempo. Confirme se o Next.js está rodando na porta 3000 (npm run start:all ou npm run dev:lan) e tente novamente."
          : "Não foi possível conectar à API. Confirme se o Next.js está ativo (npm run start:all) e tente novamente.",
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

function formToObject(form) {
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => {
    obj[key] = String(value);
  });
  obj.aceiteTermos = form.querySelector("[name='aceiteTermos']")?.checked === true;
  obj.aceiteMarketing =
    form.querySelector("[name='aceiteMarketing']")?.checked === true;
  return obj;
}

function showAlert(el, message, type = "error") {
  if (!el) return;
  el.hidden = false;
  el.className = `alert alert-${type}`;
  el.textContent = message;
}

function clearFieldErrors(form) {
  form.querySelectorAll("[data-field-error]").forEach((el) => {
    el.hidden = true;
    el.textContent = "";
  });
  form.querySelectorAll("[aria-invalid='true']").forEach((el) => {
    el.removeAttribute("aria-invalid");
    el.classList.remove("is-invalid");
  });
}

function applyFieldErrors(form, fieldErrors) {
  if (!fieldErrors) return;
  Object.entries(fieldErrors).forEach(([key, message]) => {
    const input = form.querySelector(`[name='${key}']`);
    const errEl = form.querySelector(`[data-field-error='${key}']`);
    if (input) {
      input.setAttribute("aria-invalid", "true");
      input.classList.add("is-invalid");
    }
    if (errEl) {
      errEl.hidden = false;
      errEl.textContent = String(message);
    }
  });
  const firstKey = Object.keys(fieldErrors)[0];
  if (firstKey) form.querySelector(`[name='${firstKey}']`)?.focus();
}

function initCadastroForm() {
  const form = document.querySelector("[data-form='cadastro']");
  if (!form) return;
  const alert = form.querySelector("[data-alert]");
  const success = document.querySelector("[data-success-cadastro]");

  form.addEventListener("input", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement) || !target.getAttribute("name")) return;
    const name = target.getAttribute("name");
    target.removeAttribute("aria-invalid");
    target.classList.remove("is-invalid");
    const errEl = form.querySelector(`[data-field-error='${name}']`);
    if (errEl) {
      errEl.hidden = true;
      errEl.textContent = "";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFieldErrors(form);
    const btn = form.querySelector("[type='submit']");
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Gravando no PostgreSQL…";

    try {
      const payload = formToObject(form);
      const { ok, data } = await postJson("/api/cadastro", payload);

      if (!ok) {
        applyFieldErrors(form, data.fieldErrors);
        showAlert(
          alert,
          data.message ||
            "Não foi possível concluir o cadastro. Confirme se o Next.js e o PostgreSQL estão ativos (npm run start:all)."
        );
        return;
      }

      form.hidden = true;
      if (alert) alert.hidden = true;
      if (success) {
        success.hidden = false;
        success.querySelector("[data-card-number]").textContent = data.numeroCartao;
        success.querySelector("[data-client-name]").textContent =
          (data.nomeCompleto || "").split(" ")[0] || "cliente";
        const cta = success.querySelector("[data-app-link]");
        if (cta) cta.setAttribute("href", appUrl("/area-cliente"));
      }
    } finally {
      btn.disabled = false;
      btn.textContent = label || "Concluir cadastro do Dahora Card";
    }
  });
}

function initSacForm() {
  const form = document.querySelector("[data-form='sac']");
  if (!form) return;
  const alert = form.querySelector("[data-alert]");
  const success = document.querySelector("[data-success-sac]");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("[type='submit']");
    btn.disabled = true;
    const { ok, data } = await postJson("/api/sac", formToObject(form));
    btn.disabled = false;
    if (!ok) {
      showAlert(alert, data.message || "Não foi possível abrir o chamado.");
      return;
    }
    form.hidden = true;
    if (success) {
      success.hidden = false;
      success.querySelector("[data-protocolo]").textContent = data.protocolo;
    }
  });
}

function initDuvidaForm() {
  const form = document.querySelector("[data-form='duvida']");
  if (!form) return;
  const alert = form.querySelector("[data-alert]");
  const success = document.querySelector("[data-success-duvida]");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("[type='submit']");
    btn.disabled = true;
    const { ok, data } = await postJson("/api/duvidas", formToObject(form));
    btn.disabled = false;
    if (!ok) {
      showAlert(alert, data.message || "Não foi possível enviar sua dúvida.");
      return;
    }
    form.hidden = true;
    if (success) success.hidden = false;
  });
}

function initLoginForm() {
  const form = document.querySelector("[data-form='login']");
  if (!form) return;
  const alert = form.querySelector("[data-alert]");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("[type='submit']");
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Entrando…";

    try {
      const { ok, data } = await postJson("/api/auth/login", formToObject(form));
      if (!ok) {
        showAlert(alert, data.message || "Falha no login.");
        return;
      }
      window.location.href = appUrl("/area-cliente");
    } finally {
      btn.disabled = false;
      btn.textContent = label || "Entrar";
    }
  });
}

/* ---------- Carousel ---------- */
function initCarousel() {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const slides = Array.from(root.querySelectorAll(".store-slide"));
  const dotsWrap = root.querySelector("[data-carousel-dots]");
  const prevBtn = root.querySelector("[data-carousel-prev]");
  const nextBtn = root.querySelector("[data-carousel-next]");
  if (!slides.length) return;

  let index = 0;
  let paused = false;
  let timer = null;
  let touchStartX = null;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir para slide ${i + 1}`);
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => goTo(i));
    dotsWrap?.appendChild(dot);
  });

  const dots = Array.from(dotsWrap?.querySelectorAll("button") || []);

  function render() {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-current", String(i === index));
    });
  }

  function goTo(next) {
    index = (next + slides.length) % slides.length;
    render();
  }

  function start() {
    stop();
    timer = window.setInterval(() => {
      if (!paused) goTo(index + 1);
    }, 4500);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  root.addEventListener("mouseenter", () => {
    paused = true;
  });
  root.addEventListener("mouseleave", () => {
    paused = false;
  });
  root.addEventListener("focusin", () => {
    paused = true;
  });
  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget)) paused = false;
  });

  root.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0]?.clientX ?? null;
  }, { passive: true });

  root.addEventListener("touchend", (e) => {
    if (touchStartX == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) goTo(index + (delta < 0 ? 1 : -1));
    touchStartX = null;
  });

  render();
  start();
}

function initAppQr() {
  const img = document.querySelector("[data-app-qr]");
  if (!img) return;
  const playStoreUrl =
    window.DAHORA_PLAY_STORE_URL ||
    "https://play.google.com/store/apps/details?id=br.com.dahora.app";
  img.setAttribute(
    "src",
    `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(playStoreUrl)}`
  );
  img.setAttribute("alt", "QR Code para baixar o app Dahora na Google Play");
  const caption = img.closest("figure")?.querySelector("figcaption");
  if (caption) caption.textContent = "Aponte a câmera para abrir a Google Play";
}

/* ---------- WhatsApp SAC (flutuante + header) ---------- */
const WHATSAPP_SAC = {
  phone: "551140020024",
  message: "Olá! Preciso de atendimento do SAC 24h da Dahora Atacadista.",
};

function getWhatsAppSacUrl() {
  const text = encodeURIComponent(WHATSAPP_SAC.message);
  return `https://wa.me/${WHATSAPP_SAC.phone}?text=${text}`;
}

function openWhatsAppSac() {
  window.open(getWhatsAppSacUrl(), "_blank", "noopener,noreferrer");
}

function initWhatsApp() {
  if (!document.querySelector("[data-whatsapp-fab]")) {
    const fab = document.createElement("a");
    fab.className = "whatsapp-fab";
    fab.href = getWhatsAppSacUrl();
    fab.target = "_blank";
    fab.rel = "noopener noreferrer";
    fab.setAttribute("data-whatsapp-fab", "");
    fab.setAttribute("aria-label", "Falar com o SAC 24h no WhatsApp");
    fab.title = "SAC 24h no WhatsApp";
    fab.innerHTML = `
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <path fill="currentColor" d="M16.004 3.2A12.78 12.78 0 0 0 3.2 15.98c0 2.25.6 4.44 1.74 6.37L3.2 28.8l6.64-1.74a12.76 12.76 0 0 0 6.16 1.57h.01c7.05 0 12.79-5.74 12.79-12.8S23.05 3.2 16.004 3.2zm0 23.36h-.01a10.55 10.55 0 0 1-5.38-1.47l-.39-.23-3.94 1.03 1.05-3.84-.25-.4a10.56 10.56 0 0 1-1.62-5.64c0-5.84 4.76-10.59 10.61-10.59 5.84 0 10.59 4.75 10.59 10.59-.01 5.85-4.76 10.55-10.66 10.55zm5.82-7.93c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.63-.52-.53-.71-.54h-.6c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.8.66.76.24 1.45.2 2 .12.61-.09 1.88-.77 2.15-1.51.26-.74.26-1.38.18-1.51-.08-.13-.29-.21-.61-.37z"/>
      </svg>
      <span class="whatsapp-fab__label">WhatsApp</span>
    `;
    document.body.appendChild(fab);
  }

  const headerSacLinks = document.querySelectorAll(
    ".nav-desktop a[href*='sac'], .nav-mobile a[href*='sac']"
  );
  headerSacLinks.forEach((link) => {
    link.setAttribute("data-whatsapp-sac", "");
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openWhatsAppSac();
    });
  });
}

/* ---------- Voltar ao topo ---------- */
function getScrollY() {
  return (
    window.pageYOffset ||
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function initBackToTop() {
  let btn = document.querySelector("[data-back-to-top]");
  if (!btn) {
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "back-to-top";
    btn.setAttribute("data-back-to-top", "");
    btn.setAttribute("aria-label", "Voltar ao topo");
    btn.title = "Voltar ao topo";
    btn.innerHTML = `
      <span class="back-to-top__icon" aria-hidden="true">↑</span>
      <span class="back-to-top__label">Topo</span>
    `;
  }

  document.body.appendChild(btn);

  const sync = () => {
    const show = getScrollY() > 120;
    btn.classList.toggle("is-visible", show);
    btn.hidden = false;
    btn.setAttribute("aria-hidden", show ? "false" : "true");
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      sync();
      ticking = false;
    });
  };

  btn.addEventListener("click", (event) => {
    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });

  sync();
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });
  window.addEventListener("touchmove", onScroll, { passive: true });
  window.addEventListener("resize", sync, { passive: true });
}

/* ---------- Shell responsivo (mobile / tablet / app) ---------- */
function detectDevice() {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1100) return "tablet";
  return "desktop";
}

function isStandaloneApp() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function initAppShell() {
  const root = document.documentElement;

  const applyDevice = () => {
    const device = detectDevice();
    const standalone = isStandaloneApp();
    const appShell = device !== "desktop" || standalone;

    root.dataset.device = device;
    root.classList.toggle("is-mobile", device === "mobile");
    root.classList.toggle("is-tablet", device === "tablet");
    root.classList.toggle("is-desktop", device === "desktop");
    root.classList.toggle("is-standalone", standalone);
    root.classList.toggle("is-app-shell", appShell);
    document.body.classList.toggle("has-app-nav", device !== "desktop");
  };

  const ensureBottomNav = () => {
    let nav = document.querySelector("[data-app-nav]");

    if (!document.body.classList.contains("has-app-nav")) {
      if (nav) nav.hidden = true;
      return;
    }

    if (!nav) {
      const file = window.location.pathname.split("/").pop() || "index.html";
      const isHome = file === "" || file === "index.html";
      const faq = isHome ? "#faq" : "index.html#faq";
      const app = isHome ? "#app-download" : "index.html#app-download";

      nav = document.createElement("nav");
      nav.className = "app-bottom-nav";
      nav.setAttribute("data-app-nav", "");
      nav.setAttribute("aria-label", "Navegação do aplicativo");
      nav.innerHTML = `
        <a class="app-bottom-nav__item" href="index.html" data-nav="home">
          <span class="app-bottom-nav__icon" aria-hidden="true">⌂</span>
          <span>Início</span>
        </a>
        <a class="app-bottom-nav__item" href="${app}" data-nav="app" data-install-app>
          <span class="app-bottom-nav__icon" aria-hidden="true">↓</span>
          <span>App</span>
        </a>
        <a class="app-bottom-nav__item" href="${faq}" data-nav="faq">
          <span class="app-bottom-nav__icon" aria-hidden="true">?</span>
          <span>FAQ</span>
        </a>
        <button type="button" class="app-bottom-nav__item" data-nav="sac" data-whatsapp-fab-trigger>
          <span class="app-bottom-nav__icon" aria-hidden="true">☎</span>
          <span>SAC</span>
        </button>
        <a class="app-bottom-nav__item" href="${appUrl("/area-cliente")}" data-nav="cliente">
          <span class="app-bottom-nav__icon" aria-hidden="true">◎</span>
          <span>Conta</span>
        </a>
      `;
      document.body.appendChild(nav);
      nav.querySelector("[data-whatsapp-fab-trigger]")?.addEventListener("click", () => {
        openWhatsAppSac();
      });
    }

    nav.hidden = false;

    const file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const hash = window.location.hash;
    nav.querySelectorAll(".app-bottom-nav__item").forEach((el) => el.classList.remove("is-active"));
    if (file.includes("area-cliente")) {
      nav.querySelector('[data-nav="cliente"]')?.classList.add("is-active");
    } else if (hash === "#faq") {
      nav.querySelector('[data-nav="faq"]')?.classList.add("is-active");
    } else if (hash === "#app-download") {
      nav.querySelector('[data-nav="app"]')?.classList.add("is-active");
    } else if (!file || file === "index.html") {
      nav.querySelector('[data-nav="home"]')?.classList.add("is-active");
    }
  };

  const sync = () => {
    applyDevice();
    ensureBottomNav();
    syncHeaderOffset();
  };

  sync();
  window.addEventListener("resize", sync, { passive: true });
  window.addEventListener("orientationchange", sync, { passive: true });
}

/* ---------- Orientação / acessibilidade em páginas internas ---------- */
function isHomePage() {
  const file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  return file === "" || file === "index.html" || file === "/";
}

function initPageOrientation() {
  if (isHomePage()) return;

  if (!document.querySelector(".skip-link")) {
    const skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#conteudo";
    skip.textContent = "Ir para o conteúdo";
    document.querySelector(".layout")?.prepend(skip);
  }

  const main = document.querySelector("main");
  if (main && !main.id) main.id = "conteudo";

  const hero = document.querySelector(".page-hero .container");
  if (!hero || hero.querySelector("[data-page-trail]")) return;

  const pageTitleRaw =
    document.querySelector(".page-hero h1")?.textContent?.trim() ||
    document.title.replace(/\s*·\s*Dahora.*$/i, "").trim() ||
    "Página atual";
  const pageTitle = pageTitleRaw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const trail = document.createElement("nav");
  trail.className = "page-trail";
  trail.setAttribute("data-page-trail", "");
  trail.setAttribute("aria-label", "Navegação da página");
  trail.innerHTML = `
    <a class="page-back" href="index.html">
      <span class="page-back__icon" aria-hidden="true">←</span>
      Voltar para a home
    </a>
    <ol class="page-crumbs">
      <li><a href="index.html">Home</a></li>
      <li aria-current="page">${pageTitle}</li>
    </ol>
  `;
  hero.prepend(trail);
}

/* ---------- Cookies / consentimento ---------- */
const COOKIE_KEY = "dahora-cookie-consent";

function getCookieConsent() {
  try {
    return localStorage.getItem(COOKIE_KEY);
  } catch {
    return null;
  }
}

function setCookieConsent(value) {
  try {
    localStorage.setItem(COOKIE_KEY, value);
  } catch {
    /* ignore */
  }
  document.documentElement.dataset.cookieConsent = value;
  document.dispatchEvent(
    new CustomEvent("dahora:cookie-consent", { detail: { value } })
  );
}

function hideCookieBanner() {
  document.querySelector("[data-cookie-banner]")?.remove();
}

function showCookieBanner() {
  if (document.querySelector("[data-cookie-banner]")) return;

  const banner = document.createElement("aside");
  banner.className = "cookie-banner";
  banner.setAttribute("data-cookie-banner", "");
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Preferências de cookies");
  banner.setAttribute("aria-live", "polite");
  banner.innerHTML = `
    <p class="cookie-banner__title">Cookies e privacidade</p>
    <p class="cookie-banner__text">
      Usamos cookies essenciais para o site funcionar e, com seu consentimento,
      cookies para análise e ofertas. Veja a
      <a href="cookies.html">Política de Cookies</a> e a
      <a href="privacidade.html">Política de Privacidade</a>.
    </p>
    <div class="cookie-banner__actions">
      <button type="button" class="btn btn-primary" data-cookie-accept>Aceitar todos</button>
      <button type="button" class="btn btn-secondary" data-cookie-essential>Só essenciais</button>
      <a class="btn btn-secondary" href="cookies.html">Saiba mais</a>
    </div>
  `;
  document.body.appendChild(banner);

  banner.querySelector("[data-cookie-accept]")?.addEventListener("click", () => {
    setCookieConsent("all");
    hideCookieBanner();
  });
  banner.querySelector("[data-cookie-essential]")?.addEventListener("click", () => {
    setCookieConsent("essential");
    hideCookieBanner();
  });
}

function initCookieConsent() {
  const current = getCookieConsent();
  if (current) {
    document.documentElement.dataset.cookieConsent = current;
  } else {
    showCookieBanner();
  }

  document.querySelectorAll("[data-cookie-reset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      try {
        localStorage.removeItem(COOKIE_KEY);
      } catch {
        /* ignore */
      }
      delete document.documentElement.dataset.cookieConsent;
      showCookieBanner();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAppShell();
  initAppLinks();
  initMenu();
  initYear();
  initStatusBar();
  initPageOrientation();
  initCookieConsent();
  initFloatAnnounce();
  initAppQr();
  initWhatsApp();
  initBackToTop();
  initMasks();
  initFaq();
  initCarousel();
  initCadastroForm();
  initSacForm();
  initDuvidaForm();
  initLoginForm();
});
