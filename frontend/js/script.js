/**
 * Dahora — script.js
 * Navegação, máscaras, FAQ e utilitários do front
 */

const API_BASE = "http://localhost:3000";

/* ---------- Menu mobile ---------- */
function initMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const panel = document.querySelector("[data-menu-panel]");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* ---------- Ano no footer ---------- */
function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
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
    if (key === "aceiteTermos") obj[key] = true;
    else obj[key] = String(value);
  });
  if (form.querySelector("[name='aceiteTermos']") && !obj.aceiteTermos) {
    obj.aceiteTermos = false;
  }
  return obj;
}

function showAlert(el, message, type = "error") {
  if (!el) return;
  el.hidden = false;
  el.className = `alert alert-${type}`;
  el.textContent = message;
}

function initCadastroForm() {
  const form = document.querySelector("[data-form='cadastro']");
  if (!form) return;
  const alert = form.querySelector("[data-alert]");
  const success = document.querySelector("[data-success-cadastro]");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("[type='submit']");
    btn.disabled = true;
    btn.textContent = "Enviando cadastro…";

    const payload = formToObject(form);
    payload.aceiteTermos = form.querySelector("[name='aceiteTermos']")?.checked === true;

    const { ok, data } = await postJson("/api/cadastro", payload);
    btn.disabled = false;
    btn.textContent = "Concluir cadastro do Dahora Card";

    if (!ok) {
      showAlert(alert, data.message || "Não foi possível concluir o cadastro.");
      return;
    }

    form.hidden = true;
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

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initYear();
  initMasks();
  initFaq();
  initCarousel();
  initCadastroForm();
  initSacForm();
  initDuvidaForm();
  initLoginForm();
});
