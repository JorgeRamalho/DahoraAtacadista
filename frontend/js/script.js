/**
 * Dahora — script.js
 * Navegação, máscaras, FAQ e utilitários do front
 */

function resolveApiBase() {
  if (typeof window === "undefined") return "http://localhost:3000";
  if (window.DAHORA_API_BASE) return window.DAHORA_API_BASE;
  // Mesmo host do dispositivo (útil na rede Wi‑Fi: 192.168.x.x)
  if (window.location.port === "3000") return "";
  return `http://${window.location.hostname}:3000`;
}

const API_BASE = resolveApiBase();

/* ---------- Menu mobile ---------- */
function initMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const panel = document.querySelector("[data-menu-panel]");
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    panel.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
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
function initStatusBar() {
  const TEXT_KEY = "dahora-a11y-text";
  const header = document.querySelector(".site-header");
  if (!header) return;

  let bar = header.querySelector("[data-app-status-bar]");
  if (!bar) {
    bar = document.createElement("div");
    bar.className = "app-status-bar";
    bar.setAttribute("data-app-status-bar", "");
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Barra de status e navegação");
    header.appendChild(bar);
  }

  bar.innerHTML = `
    <div class="container app-status-bar__inner">
      <div class="app-status-bar__meta" aria-live="polite">
        <span class="status-pill is-online" data-status-online title="Status da conexão">
          <span class="status-dot" aria-hidden="true"></span>
          <span data-status-online-label>Online</span>
        </span>
        <span class="status-pill is-mode" data-status-mode title="Modo de exibição">Web</span>
      </div>
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
      <div class="app-status-bar__actions" role="toolbar" aria-label="Atalhos do app">
        <button type="button" class="status-action is-install" data-install-app title="Baixar ou instalar o app">Baixar app</button>
        <button type="button" class="status-action" data-a11y-text aria-pressed="false">Texto maior</button>
      </div>
    </div>
    <div class="container" data-install-hint hidden>
      <p class="status-hint" role="status"></p>
    </div>
  `;

  const onlinePill = bar.querySelector("[data-status-online]");
  const onlineLabel = bar.querySelector("[data-status-online-label]");
  const modePill = bar.querySelector("[data-status-mode]");
  const textBtn = bar.querySelector("[data-a11y-text]");
  const installBtn = bar.querySelector("[data-install-app]");
  const hintWrap = bar.querySelector("[data-install-hint]");
  const hintText = hintWrap?.querySelector(".status-hint");

  const setOnline = (online) => {
    onlinePill.classList.toggle("is-online", online);
    onlinePill.classList.toggle("is-offline", !online);
    onlineLabel.textContent = online ? "Online" : "Offline";
    onlinePill.title = online ? "Conectado à internet" : "Sem conexão";
  };

  setOnline(navigator.onLine);
  window.addEventListener("online", () => setOnline(true));
  window.addEventListener("offline", () => setOnline(false));

  const isApp =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  modePill.textContent = isApp ? "App" : "Web";

  const applyText = (on) => {
    document.documentElement.classList.toggle("a11y-large-text", on);
    textBtn.classList.toggle("is-active", on);
    textBtn.setAttribute("aria-pressed", String(on));
    localStorage.setItem(TEXT_KEY, on ? "large" : "normal");
  };

  document.documentElement.classList.remove("a11y-contrast");
  applyText(localStorage.getItem(TEXT_KEY) === "large");

  textBtn.addEventListener("click", () => {
    applyText(!document.documentElement.classList.contains("a11y-large-text"));
  });

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

  installBtn.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        deferredPrompt = null;
      }
      return;
    }
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    showHint(
      isIos
        ? "No iPhone: toque em Compartilhar e depois em “Adicionar à Tela de Início”."
        : isApp
          ? "O app Dahora já está instalado neste dispositivo."
          : "Use o menu do navegador → “Instalar app” ou “Adicionar à tela inicial”."
    );
  });
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
async function postJson(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
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
    btn.disabled = true;
    btn.textContent = "Gravando no PostgreSQL…";

    const payload = formToObject(form);
    const { ok, data } = await postJson("/api/cadastro", payload);
    btn.disabled = false;
    btn.textContent = "Concluir cadastro do Dahora Card";

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
    btn.disabled = true;
    const { ok, data } = await postJson("/api/auth/login", formToObject(form));
    btn.disabled = false;
    if (!ok) {
      showAlert(alert, data.message || "Falha no login.");
      return;
    }
    window.location.href = "http://localhost:3000/area-cliente";
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
  const target = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}`;
  const url = target.endsWith("/") ? target : `${target}/`;
  img.setAttribute(
    "src",
    `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(url)}`
  );
}

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initYear();
  initStatusBar();
  initFloatAnnounce();
  initAppQr();
  initMasks();
  initFaq();
  initCarousel();
  initCadastroForm();
  initSacForm();
  initDuvidaForm();
  initLoginForm();
});
