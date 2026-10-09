# Auditoria Completa — Dahora Atacadista

**Data:** 07 de agosto de 2026  
**Ferramenta:** Playwright MCP (varredura automatizada)  
**Ambiente:** `http://127.0.0.1:5500/frontend/` (Live Server)  
**API local:** `http://127.0.0.1:3010` (Next.js — referência)  
**Repositório:** `Projeto-DahoraAtacadista`  
**Auditor:** Cursor AI + Playwright

---

## Sumário executivo

O site **Dahora Atacadista** (`frontend/`) apresenta identidade visual consistente, boa base de acessibilidade (skip link, ARIA, labels em formulários) e arquitetura responsiva funcional. Os principais problemas encontrados são:

| Severidade | Problema | Impacto |
|------------|----------|---------|
| 🔴 Crítico | `script.js` sobrescreve `<title>` de **todas** as páginas | SEO e abas do navegador |
| 🔴 Crítico | Zero tags Open Graph e JSON-LD em 13/13 páginas | Compartilhamento social e rich results |
| 🟠 Alto | H1 da home aparece **depois** de 4 H2s | SEO e acessibilidade |
| 🟠 Alto | 35 elementos com touch target &lt; 44px na home | WCAG 2.5.5 (mobile) |
| 🟠 Alto | Imagens do carrossel via Unsplash (~2000px) | LCP e dependência externa |
| 🟡 Médio | Cookie banner visível em todos os viewports | UX na primeira visita |
| 🟡 Médio | Nav desktop oculta até ~1100px (tablet usa menu mobile) | Usabilidade tablet |
| 🟡 Médio | Títulos únicos no HTML ignorados pelo JS | Consistência SEO |
| 🟢 Baixo | 12 elementos com `style` inline na home | Manutenibilidade |
| 🟢 Baixo | App Store com ID placeholder `id000000000` | Credibilidade |

**Pontuação estimada (sem Lighthouse formal):**

| Área | Estimativa | Observação |
|------|------------|------------|
| SEO | 55/100 | Meta básica OK; OG, canonical, sitemap ausentes |
| Acessibilidade | 72/100 | Labels OK; touch targets e hierarquia H1 |
| Performance | 70/100 | Load rápido local; imagens externas pesadas |
| Usabilidade | 78/100 | Fluxo claro; cookie banner e ordem de seções |
| Identidade visual | 90/100 | Tokens, tipografia e paleta consistentes |
| Responsividade | 82/100 | Sem overflow horizontal; tablet como mobile |

---

## 1. Metodologia

### 1.1 Escopo

- **13 páginas HTML** em `frontend/` (incluindo `react/index.html`)
- **4 viewports:** 320×568, 375×812, 768×1024, 1440×900
- **Critérios:** SEO, acessibilidade (WCAG 2.1), responsividade, layout, identidade visual, tipografia, performance, PWA, formulários, console

### 1.2 Ferramentas

```
Playwright MCP
├── browser_navigate
├── browser_snapshot (accessibility tree)
├── browser_evaluate (métricas DOM)
├── browser_run_code_unsafe (auditoria em lote)
├── browser_resize
└── browser_console_messages
```

### 1.3 Limitações

- Auditoria em ambiente **local** (Live Server 5500), não em produção (GitHub Pages)
- Lighthouse formal não executado (estimativas baseadas em heurísticas)
- Testes de contraste de cor não automatizados pixel a pixel
- Formulários não submetidos (API Next pode estar offline)
- Cookie consent não resetado entre páginas (localStorage persistente)

---

## 2. Mapa do projeto

### 2.1 Estrutura da raiz

```
Projeto-DahoraAtacadista/
├── frontend/           ← Site estático auditado (GitHub Pages / Netlify)
├── src/                ← Next.js 15 App Router (porta 3010)
├── public/             ← Assets Next + PWA
├── prisma/             ← PostgreSQL schema + migrations
├── scripts/            ← Automação (DB, PWA, serve)
├── docs/               ← Documentação
├── .github/workflows/  ← deploy-pages.yml
├── index.html          ← Redirect → frontend/index.html
├── package.json
├── netlify.toml
├── docker-compose.yml
└── README.md
```

### 2.2 Contexto externo (fora da raiz)

| Caminho | Conteúdo |
|---------|----------|
| `Fron_End/Projetos/` | ~55 projetos do ecossistema Jorge Ramalho |
| `Projeto-Carona` | App na porta **3000** (colisão PWA Chrome) |
| `Projeto-Trampolim` | App na porta **3020** (colisão PWA Chrome) |
| `Fron_End/Arquivos/` | Arquivos gerais |

### 2.3 Portas reservadas

| Porta | Serviço |
|-------|---------|
| 3000 | Carona |
| **3010** | **Dahora Next.js** |
| 3020 | Trampolim |
| 5500 | Live Server (front estático) |

### 2.4 Duplicação dual-stack

| Estático (`frontend/`) | Next (`src/`) |
|------------------------|---------------|
| `index.html` | `src/app/page.tsx` + `components/home/*` |
| `css/style.css` | `src/styles/globals.css` |
| `js/script.js` | API routes + React components |
| `manifest.webmanifest` | `public/manifest-dahora-atacadista.webmanifest` |

---

## 3. Inventário de páginas

| Página | Tipo | Header | Footer | Main | Redirect |
|--------|------|--------|--------|------|----------|
| `index.html` | Home completa | ✅ | ✅ | ✅ | — |
| `cadastro.html` | Redirect | — | — | — | → `index.html#cadastro` |
| `faq.html` | Redirect | — | — | — | → `index.html#faq` |
| `dahora-card.html` | Conteúdo | ✅ | ✅ | ✅ | — |
| `dahora-club.html` | Conteúdo | ✅ | ✅ | ✅ | — |
| `sac.html` | Formulário | ✅ | ✅ | ✅ | — |
| `area-cliente.html` | Login | ✅ | ✅ | ✅ | — |
| `tire-sua-duvida.html` | Formulário | ✅ | ✅ | ✅ | — |
| `privacidade.html` | Legal | ✅ | ✅ | ✅ | — |
| `cookies.html` | Legal | ✅ | ✅ | ✅ | — |
| `offline.html` | PWA fallback | ❌ | ❌ | ✅ | — |
| `limpar-pwa.html` | Utilitário PWA | ❌ | ❌ | ❌ | — |
| `react/index.html` | Protótipo React | ✅ | ✅ | ✅ | — |

---

## 4. Auditoria por página (Playwright)

> **Nota:** Os títulos reportados abaixo refletem o DOM **após** `script.js` executar. O HTML-fonte de várias páginas define títulos únicos que são **substituídos** (ver seção 5.1).

### 4.1 `index.html` — Home

| Métrica | Valor |
|---------|-------|
| URL | `/frontend/index.html` |
| Title (DOM) | Dahora Atacadista — Preço de verdade. Compra com inteligência. |
| Title (HTML-fonte) | Idem |
| `lang` | `pt-BR` ✅ |
| `meta description` | ✅ (~90 chars) |
| `canonical` | ❌ |
| `theme-color` | `#c2410c` ✅ |
| `manifest` | ✅ `manifest.webmanifest` |
| Open Graph | ❌ 0 tags |
| JSON-LD | ❌ 0 |
| H1 | `Dahora` (1) — **após 4 H2s** ⚠️ |
| H2 | 10 |
| Imagens | 7 (0 sem alt) ✅ |
| Imagens externas | 6 Unsplash + 1 QR (api.qrserver.com) |
| Links | 55 (0 sem texto) |
| Formulário | 1 (24 campos, 24 labelados) ✅ |
| Skip link | ✅ |
| ARIA labels | 31 |
| Touch &lt; 44px | **35** ⚠️ |
| Inline styles | 12 |
| Load time | 366 ms |
| DCL | 357 ms |

**Ordem de seções (fluxo visual):**

1. Header + parceiros delivery (iFood, 99Food, Uber Eats)
2. Carrossel (6 slides)
3. Dahora Club (barra de ícones)
4. App Download (QR + Google Play / App Store)
5. Por que Dahora (4 features)
6. Spotlight Dahora Card
7. Como funciona (3 passos)
8. **Hero "Dahora" (H1)** ← posição tardia
9. FAQ (busca + accordion 8 itens)
10. Banner flutuante + Cadastro (formulário completo)
11. Footer + WhatsApp flutuante + Cookie dialog

### 4.2 `cadastro.html` — Redirect

| Métrica | Valor |
|---------|-------|
| HTML-fonte title | `Cadastro · Dahora` |
| Redirect | `index.html#cadastro` (meta refresh + JS) |
| Após redirect | Conteúdo idêntico à home |

### 4.3 `faq.html` — Redirect

| Métrica | Valor |
|---------|-------|
| HTML-fonte title | `FAQ · Dahora` |
| `canonical` (HTML-fonte) | `index.html#faq` ✅ (única página com canonical) |
| Redirect | `index.html#faq` |

### 4.4 `dahora-card.html`

| Métrica | Valor |
|---------|-------|
| HTML-fonte title | `Dahora Card · Dahora` |
| Title (DOM) | Substituído pelo script.js ⚠️ |
| `meta description` | ❌ |
| `theme-color` | ❌ |
| `manifest` | ❌ |
| H1 | `Dahora Card` ✅ (antes de H2) |
| H2 | 1 |
| Imagens | 0 |
| Formulário | 0 |
| Touch &lt; 44px | 13 |
| Load time | 100 ms |

### 4.5 `dahora-club.html`

| Métrica | Valor |
|---------|-------|
| HTML-fonte title | `Dahora Club · Dahora` |
| Title (DOM) | Substituído ⚠️ |
| `theme-color` | `#c2410c` ✅ |
| H1 | `Dahora Club` ✅ |
| H2 | 2 |
| Touch &lt; 44px | 13 |
| Load time | 545 ms |

### 4.6 `sac.html`

| Métrica | Valor |
|---------|-------|
| HTML-fonte title | `SAC 24 horas · Dahora` |
| Title (DOM) | Substituído ⚠️ |
| `meta description` | ❌ |
| H1 | `SAC 24 horas` ✅ |
| Formulário | 1 (6 campos, 6 labelados) ✅ |
| Touch &lt; 44px | 14 |
| Load time | 71 ms |

### 4.7 `area-cliente.html`

| Métrica | Valor |
|---------|-------|
| HTML-fonte title | `Área do Cliente · Dahora` |
| Title (DOM) | Substituído ⚠️ |
| `theme-color` | `#c2410c` ✅ |
| H1 | `Área do Cliente` ✅ |
| Formulário | 1 (2 campos login, 2 labelados) ✅ |
| Touch &lt; 44px | 15 |
| Load time | 87 ms |

### 4.8 `tire-sua-duvida.html`

| Métrica | Valor |
|---------|-------|
| HTML-fonte title | `Tire sua dúvida · Dahora` (inferido) |
| Title (DOM) | Substituído ⚠️ |
| H1 | `Tire sua dúvida` ✅ |
| Formulário | 1 (3 campos, 3 labelados) ✅ |
| Links | 21 |
| Touch &lt; 44px | 10 |
| Load time | 75 ms |

### 4.9 `privacidade.html`

| Métrica | Valor |
|---------|-------|
| HTML-fonte title | `Política de Privacidade · Dahora` |
| Title (DOM) | Substituído ⚠️ |
| `meta description` | ✅ LGPD |
| `theme-color` | `#c2410c` ✅ |
| H1 | `Política de Privacidade` ✅ |
| H2 | 11 (estrutura legal completa) |
| Inline styles | 1 |
| Load time | 83 ms |

### 4.10 `cookies.html`

| Métrica | Valor |
|---------|-------|
| HTML-fonte title | `Política de Cookies · Dahora` |
| Title (DOM) | Substituído ⚠️ |
| `meta description` | ✅ |
| H1 | `Política de Cookies` ✅ |
| H2 | 7 |
| Load time | 74 ms |

### 4.11 `offline.html`

| Métrica | Valor |
|---------|-------|
| Title | `Sem conexão · Dahora Atacadista` ✅ (não alterado — sem script.js) |
| Header/Footer | ❌ |
| Skip link | ❌ |
| Stylesheet | ❌ (inline mínimo) |
| H1 | `Você está offline` |
| Load time | 32 ms |

### 4.12 `limpar-pwa.html`

| Métrica | Valor |
|---------|-------|
| Title | `Limpar PWA · Dahora Atacadista` ✅ |
| Utilitário | Limpeza colisão Trampolim/Carona |
| Manifest | Presente |
| Links | 2 |

### 4.13 `react/index.html`

| Métrica | Valor |
|---------|-------|
| Title | `Dahora · React App` ✅ |
| Scripts externos | unpkg.com (React 18 dev, Babel) ⚠️ |
| H1 | `Dahora` ✅ (antes de H2) |
| Imagens | 6 Unsplash |
| Skip link | ❌ |
| Load time | 665 ms (CDN React) |
| Console | 1 warning |

---

## 5. SEO — Análise detalhada

### 5.1 🔴 Bug crítico: sobrescrita de título

**Arquivo:** `frontend/js/script.js` linha 1142

```javascript
document.title = "Dahora Atacadista — Preço de verdade. Compra com inteligência.";
```

Executado em `initDahoraPwa()` no `DOMContentLoaded` de **todas** as páginas que carregam `script.js`. Resultado:

| Página | Title no HTML | Title no DOM (após JS) |
|--------|---------------|------------------------|
| `sac.html` | SAC 24 horas · Dahora | Dahora Atacadista — Preço de verdade... |
| `area-cliente.html` | Área do Cliente · Dahora | Dahora Atacadista — Preço de verdade... |
| `dahora-card.html` | Dahora Card · Dahora | Dahora Atacadista — Preço de verdade... |
| `privacidade.html` | Política de Privacidade · Dahora | Dahora Atacadista — Preço de verdade... |

**Correção recomendada:** Remover a linha ou aplicar só em `index.html`:

```javascript
if (location.pathname.endsWith("index.html") || location.pathname.endsWith("/")) {
  document.title = "Dahora Atacadista — Preço de verdade. Compra com inteligência.";
}
```

### 5.2 Checklist SEO global

| Item | Status | Páginas afetadas |
|------|--------|------------------|
| `lang="pt-BR"` | ✅ | 13/13 |
| `<title>` único | ❌ | 10/13 (substituídos pelo JS) |
| `meta description` | ⚠️ | 4/13 (index, privacidade, cookies, redirect→index) |
| `link rel="canonical"` | ❌ | 0/13 (faq.html tem no HTML mas redirect) |
| `meta robots` | ❌ | 0/13 |
| Open Graph (`og:*`) | ❌ | 0/13 |
| Twitter Cards | ❌ | 0/13 |
| JSON-LD | ❌ | 0/13 |
| `sitemap.xml` | ❌ | Ausente |
| `robots.txt` | ❌ | Ausente |
| H1 único por página | ✅ | 13/13 |
| H1 antes de H2 | ⚠️ | 4/13 (index, cadastro→index, faq→index, react) |
| Alt em imagens | ✅ | 0 imagens sem alt |
| `loading="lazy"` | ✅ | Carrossel (exceto slide 1) |
| Links internos | ✅ | Navegação coerente |
| `href` vazios | ✅ | 0 links sem texto/aria-label |

### 5.3 Meta tags recomendadas (template)

```html
<!-- Todas as páginas públicas -->
<link rel="canonical" href="https://jorgeramalho.github.io/DahoraAtacadista/index.html" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:site_name" content="Dahora Atacadista" />
<meta property="og:title" content="Dahora Atacadista — Preço de verdade" />
<meta property="og:description" content="Rede de supermercados e atacado." />
<meta property="og:image" content="https://jorgeramalho.github.io/DahoraAtacadista/icons/icon-512.png" />
<meta property="og:url" content="https://jorgeramalho.github.io/DahoraAtacadista/" />
<meta name="twitter:card" content="summary_large_image" />
```

### 5.4 JSON-LD recomendado

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dahora Atacadista",
  "url": "https://jorgeramalho.github.io/DahoraAtacadista/",
  "logo": "https://jorgeramalho.github.io/DahoraAtacadista/icons/icon-512.png",
  "description": "Rede de supermercados e atacado.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+55-800-400-2024",
    "contactType": "customer service",
    "availableLanguage": "Portuguese",
    "hoursAvailable": "24/7"
  }
}
```

---

## 6. Acessibilidade (WCAG 2.1)

### 6.1 Pontos positivos

| Critério | Evidência |
|----------|-----------|
| Skip link | `Ir para o conteúdo` → `#conteudo` (10/13 páginas) |
| Landmarks | `header`, `main`, `footer`, `nav` com `aria-label` |
| Form labels | 100% dos inputs com label (35 campos total) |
| `focus-visible` | Outline 3px laranja (`--dahora-leaf`) |
| `prefers-reduced-motion` | CSS desativa animações |
| Carrossel | `aria-roledescription="carousel"`, botões prev/next |
| FAQ accordion | `button` com `expanded` state |
| Cookie banner | `role="dialog"`, `aria-label`, `aria-live="polite"` |
| Idioma | `lang="pt-BR"` em todas as páginas |
| Contraste texto | Tinta `#1c1210` sobre creme `#fff8f2` (alto) |

### 6.2 Problemas

| Critério WCAG | Severidade | Detalhe |
|---------------|------------|---------|
| 1.3.1 Info and Relationships | 🟠 | H1 após H2 na home |
| 2.4.2 Page Titled | 🔴 | Títulos únicos destruídos pelo JS |
| 2.5.5 Target Size | 🟠 | 35+ elementos &lt; 44×44px na home |
| 2.4.1 Bypass Blocks | 🟡 | `offline.html`, `limpar-pwa.html`, `react/` sem skip |
| 1.1.1 Non-text Content | 🟢 | Hero usa `role="img"` + `aria-label` (sem img real) |
| 2.4.4 Link Purpose | 🟢 | 0 links sem texto discernível |

### 6.3 Touch targets (home, viewport 1440px)

| Elemento | Quantidade &lt; 44px |
|----------|----------------------|
| Links + botões total | 35 |
| Club status icons | ~3 |
| Carousel dots | 6 |
| Carousel nav (‹ ›) | 2 |
| Footer links | ~8 |
| Cookie banner buttons | 3 |

**Variável CSS existente:** `--touch: 2.75rem` (44px) — não aplicada universalmente.

### 6.4 Formulários auditados

| Página | Campos | Labelados | Validação JS | API |
|--------|--------|-----------|--------------|-----|
| `index.html` (cadastro) | 24 | 24 ✅ | Zod-like masks | `POST /api/cadastro` |
| `sac.html` | 6 | 6 ✅ | — | `POST /api/sac` |
| `area-cliente.html` | 2 | 2 ✅ | — | `POST /api/auth/login` |
| `tire-sua-duvida.html` | 3 | 3 ✅ | — | `POST /api/duvidas` |

**LGPD:** Checkbox obrigatório com link à `privacidade.html` ✅

---

## 7. Responsividade

### 7.1 Breakpoints CSS (`style.css`)

```
379px → 480px → 767px → 768px → 900px → 1100px → 1280px
```

### 7.2 Teste multi-viewport (`index.html`)

| Viewport | Largura | Menu mobile | Nav desktop | Carrossel | Overflow horizontal | Cookie banner |
|----------|---------|-------------|---------------|-----------|---------------------|---------------|
| mobile-xs | 320px | ✅ visível | ❌ oculto | 329px | ❌ não | ✅ visível |
| mobile | 375px | ✅ visível | ❌ oculto | 471px | ❌ não | ✅ visível |
| tablet | 768px | ✅ visível | ❌ oculto | 720px | ❌ não | ✅ visível |
| desktop | 1440px | ❌ oculto | ✅ visível | 738px | ❌ não | ✅ visível |

### 7.3 Observações

- **Sem overflow horizontal** em todos os viewports ✅
- Nav desktop só aparece em **≥ 1100px** — tablet (768px) usa menu hambúrguer
- Carrossel altura: `clamp(280px, 62vh, 560px)` — proporcional ao viewport
- Container: `min(1120px, calc(100% - 1.25rem))`
- `100dvh` / `viewport-fit=cover` para iOS safe areas ✅
- `@media (hover: none)` para dispositivos touch ✅

### 7.4 Grid responsivo

| Componente | Mobile | Tablet | Desktop |
|------------|--------|--------|---------|
| Features (Por que Dahora) | 1 col | 2 col | 4 col |
| Passos (Como funciona) | 1 col | 1 col | 3 col |
| App download | stack | stack | 2 col |
| Footer | stack | 2 col | 4 col |

---

## 8. Layout e composição

### 8.1 Header

- Logo mark "DH" + wordmark "Dahora Atacadista"
- Nav: Baixar app, Nossa História, FAQ, Dahora Card, Dahora Club
- CTAs: Cadastrar (secondary) + Área do Cliente (primary)
- Barra de parceiros delivery (iFood, 99Food, Uber Eats) — SVG inline
- Menu hambúrguer com `aria-expanded` e `aria-controls`

### 8.2 Footer

- 4 colunas: Marca, Navegação, Dahora Card, SAC 24h
- Telefone: 0800 400 2024
- E-mail: sac@dahora.com.br
- Links legais: Privacidade, Cookies, Gerenciar cookies
- Copyright © 2026

### 8.3 Elementos flutuantes

| Elemento | Posição | Função |
|----------|---------|--------|
| WhatsApp SAC | Fixo inferior direito | `wa.me/551140020024` |
| Cookie banner | Fixo inferior | Consentimento LGPD |
| Float announce | Flutuante | Promo 100 pontos cadastro |
| Carousel nav | Sobre carrossel | ‹ › |

### 8.4 Problema de hierarquia visual

O **hero principal** (H1 "Dahora" + slogan) está na **posição 8** da página, após carrossel, club bar, app download, features, spotlight e passos. Para SEO e primeira impressão, o slogan deveria aparecer no topo ou integrado ao carrossel.

---

## 9. Identidade visual

### 9.1 Marca

| Elemento | Valor |
|----------|-------|
| Nome | Dahora |
| Segmento | Atacadista (supermercados + atacado) |
| Slogan | Preço de verdade. Compra com inteligência. |
| Logo | Mark "DH" (gradiente) + wordmark |

### 9.2 Tipografia

| Uso | Família | Fallback | Fonte |
|-----|---------|----------|-------|
| Títulos (h1–h3) | Fraunces | Georgia, serif | Google Fonts |
| Corpo | Outfit | system-ui, sans-serif | Google Fonts |
| Peso títulos | 600 | — | — |
| Line-height corpo | 1.5 | — | — |
| Letter-spacing títulos | -0.02em | — | — |

**Verificação Playwright:** `body` → `Outfit, system-ui, sans-serif` ✅ | `h1` → `Fraunces, Georgia, serif` ✅

### 9.3 Paleta de cores (CSS tokens)

| Token | Hex | Uso |
|-------|-----|-----|
| `--dahora-ink` | `#1c1210` | Texto principal |
| `--dahora-forest` | `#c2410c` | Primária (laranja) |
| `--dahora-leaf` | `#ea580c` | Primária (vermelho-laranja) |
| `--dahora-mint` | `#fbbf24` | Destaque amarelo |
| `--dahora-mist` | `#fff3e8` | Fundo névoa |
| `--dahora-cream` | `#fff8f2` | Fundo creme |
| `--dahora-sand` | `#f3e6d8` | Fundo areia |
| `--dahora-amber` | `#f59e0b` | Acento âmbar |
| `--dahora-coral` | `#e11d48` | Acento coral |
| `--dahora-slate` | `#6b564c` | Texto secundário |
| `--dahora-line` | `#f0d5c0` | Bordas |

### 9.4 Gradientes e atmosfera

- Body: mesh gradients radiais (amarelo, laranja, coral) + linear gradient
- Botões primary: `linear-gradient(135deg, forest → leaf → amber)`
- Cartão visual: degradê Platinum mock
- `--shadow`: `0 10px 28px rgba(194, 65, 12, 0.28)`
- `--radius`: `1rem`

### 9.5 Componentes visuais

| Componente | Descrição |
|------------|-----------|
| `.btn-primary` | Gradiente laranja, texto branco |
| `.btn-secondary` | Borda, fundo transparente |
| `.btn-ghost` | Sem borda, texto |
| `.feature` | Ícone unicode + título + texto |
| `.card-visual` | Mock cartão Dahora Card Platinum |
| `.store-carousel` | Full-bleed com dots e nav |
| `.club-status-bar` | Ícones Dahora Pontos/Milhas/Ofertas |
| `.cookie-banner` | Dialog fixo inferior |

### 9.6 Consistência cross-page

- Todas as páginas de conteúdo usam `css/style.css?v=topo-all-1` ✅
- Header/footer idênticos (exceto `aria-current`) ✅
- `offline.html` e `limpar-pwa.html` sem identidade visual ⚠️

---

## 10. Estratégia de desenvolvimento

### 10.1 Arquitetura dual-stack

```
┌─────────────────────┐     ┌─────────────────────┐
│  frontend/ (HTML)   │     │  src/ (Next.js)     │
│  GitHub Pages       │     │  Vercel + Neon      │
│  Porta 5500 (dev)   │────▶│  Porta 3010         │
│  Sem API em prod    │ API │  PostgreSQL + Auth  │
└─────────────────────┘     └─────────────────────┘
         script.js
    resolveApiBase()
    ├── null → GitHub Pages (sem backend)
    ├── "" → mesma origem (porta 3010)
    └── "http://127.0.0.1:3010" → local dev
```

### 10.2 APIs disponíveis (Next.js)

| Método | Rota | Função |
|--------|------|--------|
| GET | `/api/health` | Status app + DB |
| GET | `/api/faq` | Lista FAQ |
| POST | `/api/cadastro` | Cria cliente + Dahora Card |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/sac` | Abre ticket SAC |
| POST | `/api/duvidas` | Envia dúvida |

### 10.3 PWA

| Item | Valor |
|------|-------|
| Manifest | `manifest.webmanifest` |
| SW | `sw-dahora-atacadista.js` (só produção) |
| `theme_color` | `#c2410c` |
| `background_color` | `#fff8f2` |
| Ícones | 192, 512, maskable-512 |
| `display` | standalone |
| Porta isolada | 3010 (evita Carona/Trampolim) |

### 10.4 Deploy

| Canal | Origem | Build |
|-------|--------|-------|
| GitHub Pages | `frontend/` | Upload direto (workflow) |
| Netlify | `frontend/` | Estático (`NETLIFY_NEXT_PLUGIN_SKIP`) |
| Vercel | `src/` | `next build` |

### 10.5 Cache-busting

| Arquivo | Query string |
|---------|--------------|
| `style.css` | `?v=topo-all-1` |
| `script.js` | `?v=pwa-5510-1` ou `?v=topo-all-1` |
| `favicon.svg` | `?v=dh-4` ou `?v=dh-1` |

---

## 11. Performance

### 11.1 Tempos de carregamento (DOM, local)

| Página | Load (ms) | DCL (ms) |
|--------|-----------|----------|
| index.html | 366 | 357 |
| dahora-card.html | 100 | 73 |
| dahora-club.html | 545 | 73 |
| sac.html | 71 | 70 |
| area-cliente.html | 87 | 87 |
| tire-sua-duvida.html | 75 | 74 |
| privacidade.html | 83 | 83 |
| cookies.html | 74 | 74 |
| offline.html | 32 | 31 |
| limpar-pwa.html | 27 | 27 |
| react/index.html | 665 | 664 |

### 11.2 Recursos externos (impacto LCP)

| Recurso | Origem | Páginas | Risco |
|---------|--------|---------|-------|
| Google Fonts | fonts.googleapis.com | Todas (CSS) | Latência CDN |
| Unsplash images | images.unsplash.com | index, react | ~2000px, LCP |
| QR Code API | api.qrserver.com | index | Terceiro |
| React CDN | unpkg.com | react/ | Dev only, 665ms |
| App Store link | apps.apple.com | index | Placeholder ID |

### 11.3 Otimizações existentes

- `loading="lazy"` no carrossel (slides 2–6) ✅
- 1 CSS + 1 JS por página ✅
- Sem jQuery ou libs pesadas (exceto react/) ✅
- Service Worker com cache estático (produção) ✅

### 11.4 Recomendações performance

1. Hospedar imagens do carrossel em `frontend/assets/images/` (WebP, max 1200px)
2. Self-host Google Fonts ou `font-display: swap` (já tem `display=swap`)
3. Preconnect: `fonts.googleapis.com`, `fonts.gstatic.com`
4. Substituir QR API por SVG/Canvas local
5. `react/` não deve ir para produção (CDN dev)

---

## 12. Console e erros

### 12.1 Mensagens (index.html)

| Tipo | Mensagem |
|------|----------|
| LOG | Live reload enabled (Live Server) |
| INFO | `[Dahora PWA] SW removido: sw.js` (dev esperado) |
| INFO | `beforeinstallprompt` preventDefault (banner nativo suprimido) |

**Erros JavaScript:** 0 ✅

### 12.2 react/index.html

| Tipo | Mensagem |
|------|----------|
| WARNING | 1 (Babel in-browser compilation) |

---

## 13. Conteúdo e copywriting

### 13.1 Voz da marca

- Tom: direto, confiante, regional brasileiro
- Foco: preço real, inteligência na compra, atacado + varejo
- CTAs: "Quero meu cartão", "Ir agora →", "Solicitar Dahora Card"

### 13.2 Textos por seção

| Seção | Eyebrow | Heading | Observação |
|-------|---------|---------|------------|
| App | App Dahora | Baixe o app e leve a Dahora no bolso | QR + stores |
| Features | Por que Dahora | Uma experiência pensada... | 4 benefícios |
| Card | Dahora Card | Seu cartão de vantagens... | Mock visual |
| Passos | Como funciona | Três passos... | 01–03 |
| Hero | Rede de supermercados & atacado | Dahora | H1 + slogan |
| FAQ | Central de ajuda | FAQ Perguntas e Respostas | 8 perguntas |
| Cadastro | Solicitação | Cadastro do Dahora Card | 24 campos |

### 13.3 Links externos

| Destino | URL | Status |
|---------|-----|--------|
| Google Play | `play.google.com/store/apps/details?id=br.com.dahora.app` | ✅ |
| App Store | `apps.apple.com/app/dahora-atacadista/id000000000` | ⚠️ Placeholder |
| WhatsApp SAC | `wa.me/551140020024` | ✅ |
| Unsplash (6 imgs) | `images.unsplash.com` | ⚠️ Licença/dev |

---

## 14. Matriz de conformidade

| Critério | index | card | club | sac | cliente | duvida | priv | cookies | offline | react |
|----------|-------|------|------|-----|---------|--------|------|---------|---------|-------|
| lang pt-BR | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| viewport | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| title único | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | ✅ |
| description | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| canonical | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| OG tags | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| H1 antes H2 | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| skip link | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| header | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| footer | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| forms labeled | ✅ | — | — | ✅ | ✅ | ✅ | — | — | — | — |
| imgs alt | ✅ | — | — | — | — | — | — | — | — | ✅ |
| theme-color | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| manifest | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 15. Plano de ação priorizado

### 🔴 Prioridade 1 — Crítico (esta semana)

| # | Ação | Arquivo | Esforço |
|---|------|---------|---------|
| 1 | Remover/corrigir sobrescrita de `document.title` | `js/script.js:1142` | 5 min |
| 2 | Adicionar `meta description` em todas as páginas | `*.html` | 30 min |
| 3 | Adicionar OG tags + imagem social | `index.html` + template | 1h |
| 4 | Mover H1/slogan antes do carrossel ou overlay no carrossel | `index.html` + CSS | 2h |
| 5 | Criar `robots.txt` + `sitemap.xml` | `frontend/` | 30 min |

### 🟠 Prioridade 2 — Alto (próximas 2 semanas)

| # | Ação | Esforço |
|---|------|---------|
| 6 | JSON-LD Organization + WebSite | 1h |
| 7 | `link rel="canonical"` em cada página | 1h |
| 8 | Aumentar touch targets (club icons, dots, footer) | 2h |
| 9 | Localizar imagens carrossel (WebP) | 3h |
| 10 | Cookie banner: não bloquear conteúdo (bottom sheet menor) | 2h |
| 11 | Nav desktop em tablet (breakpoint 768px) | 1h |
| 12 | Corrigir App Store URL placeholder | 5 min |

### 🟡 Prioridade 3 — Médio (mês)

| # | Ação | Esforço |
|---|------|---------|
| 13 | `manifest` + `theme-color` em todas as páginas | 1h |
| 14 | Skip link em `offline.html`, `react/` | 30 min |
| 15 | Identidade visual em `offline.html` | 1h |
| 16 | Remover inline styles (mover ao CSS) | 3h |
| 17 | QR Code local (sem api.qrserver.com) | 1h |
| 18 | Documentar design system (`DESIGN-SYSTEM.md`) | 4h |
| 19 | Lighthouse CI no GitHub Actions | 2h |

### 🟢 Prioridade 4 — Baixo (backlog)

| # | Ação |
|---|------|
| 20 | Unificar dual-stack (Next como fonte única) |
| 21 | Painel admin FAQ/tickets |
| 22 | Push notifications PWA |
| 23 | Testes E2E Playwright automatizados |
| 24 | `react/` como Storybook ou remover de produção |

---

## 16. Anexos

### A. Scripts de auditoria reproduzível

Para reexecutar esta auditoria:

```bash
# 1. Subir Live Server na pasta frontend (porta 5500)
# 2. Usar Playwright MCP com browser_run_code_unsafe
# 3. URL base: http://127.0.0.1:5500/frontend/
```

### B. Arquivos-chave referenciados

| Arquivo | Linhas | Função |
|---------|--------|--------|
| `frontend/index.html` | 622 | Home |
| `frontend/css/style.css` | ~2300 | Design system |
| `frontend/js/script.js` | ~1165 | Lógica + PWA + API |
| `frontend/manifest.webmanifest` | 40 | PWA manifest |
| `docs/ARQUITETURA.md` | 74 | Arquitetura |
| `docs/HISTORICO.md` | 80 | Histórico |

### C. URLs de produção

| Ambiente | URL |
|----------|-----|
| GitHub Pages | `https://jorgeramalho.github.io/DahoraAtacadista/` |
| Next local | `http://localhost:3010` |
| Health check | `http://localhost:3010/api/health` |

---

## Changelog desta auditoria

| Versão | Data | Alteração |
|--------|------|-----------|
| 1.0 | 2026-08-07 | Auditoria inicial completa (13 páginas, 4 viewports) |

---

*Documento gerado por varredura Playwright automatizada. Para correções, consultar seção 15 (Plano de ação).*
