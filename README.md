# Dahora Atacadista

Aplicação web completa da rede **Dahora** — supermercados e atacado — com cadastro do **Dahora Card**, FAQ, Tire sua dúvida, SAC 24h e Área do Cliente integrada a banco de dados.

## Identidade visual

| Elemento | Definição |
|----------|-----------|
| **Marca** | Dahora |
| **Slogan** | Preço de verdade. Compra com inteligência. |
| **Tipografia** | *Fraunces* (títulos) + *Outfit* (texto) |
| **Primária** | Degradê laranja → vermelho → amarelo `#c2410c` → `#ea580c` → `#f59e0b` |
| **Acento** | Âmbar `#f59e0b` · coral `#e11d48` |
| **Fundos** | Creme `#fff8f2`, névoa `#fff3e8`, areia `#f3e6d8` |
| **Texto** | Tinta `#1c1210`, ardósia `#6b564c` |

Atmosfera com mesh gradients leves, hero full-bleed e cartão digital em degradê. Contraste e foco visível pensados para acessibilidade.

## Front clássico (HTML / CSS / JS / React)

Além do Next.js em `src/`, existe a pasta **`frontend/`** com arquivos separados:

- `frontend/index.html`
- `frontend/css/style.css`
- `frontend/js/script.js`
- `frontend/react/` (App.jsx + componentes)

Veja `frontend/README.md`.

### GitHub Pages (site visual)

O workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) publica **somente** a pasta `frontend/`.

1. No repositório: **Settings → Pages → Build and deployment → Source = GitHub Actions**
2. Faça push em `main` (ou rode o workflow manualmente em **Actions**)
3. Abra `https://jorgeramalho.github.io/DahoraAtacadista/`

Cadastro/login/SAC no Pages são só a interface — a API e o banco ficam no app Next (Vercel + Neon, por exemplo).

### Netlify (estático)

O arquivo `netlify.toml` aponta o publish para `frontend/` e desliga o plugin Next.js, para não tentar buildar a raiz.

## Stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4**
- **Prisma** + **PostgreSQL**
- **PWA** (manifest + service worker)
- **Zod** (validação) + **bcryptjs** (senha)

Detalhes: [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md)

## Estrutura de pastas (front)

```
src/
  components/
    brand/       → Logo
    layout/      → Header, Footer, SiteShell
    home/        → Seções da home
    card/        → Formulário Dahora Card
    faq/         → Lista FAQ
    sac/         → Formulários SAC e dúvidas
    cliente/     → Login e dashboard
    ui/          → PageHero e utilitários
  styles/        → globals.css (tokens e tipografia)
  lib/           → db, auth, validações, brand
  app/           → páginas e API routes
prisma/          → schema + seed
public/logo/     → marca SVG
```

## Como rodar

1. Copie o ambiente: `copy .env.example .env` (Windows) ou `cp .env.example .env`
2. Suba o PostgreSQL:

```bash
npm install
npm run db:up
npm run db:ready
npm run dev:lan
```

`npm run db:up` usa **Docker** se estiver disponível; senão usa o **PostgreSQL do Windows** (porta 5432). Alternativa sem serviço: `npm run db:embed` (porta 5433).

Abra [http://localhost:3010](http://localhost:3010) · health: [/api/health](http://localhost:3010/api/health) (deve retornar `"database":"up"`).

> **PWA:** o Dahora usa a porta **3010** de propósito — Carona fica na **3000** e Trampolim na **3020**, para o Chrome não misturar os apps. Se «Abrir na app» abrir outro projeto, limpe em [/limpar-pwa](http://localhost:3010/limpar-pwa) e em `chrome://apps`.

**Docker Desktop:** WSL + Virtual Machine Platform já foram habilitados. **Reinicie o Windows uma vez**, abra o Docker Desktop e rode `npm run after:reboot`. Enquanto isso, o app já funciona com PostgreSQL do Windows (`npm run start:all`).

### Fluxo sugerido de teste

1. Cadastre um cliente em `/cadastro`
2. Acesse `/area-cliente` (sessão já aberta após cadastro)
3. Consulte `/faq`, envie dúvida e abra chamado no `/sac`
4. Veja tickets e dúvidas no dashboard

## Banco de dados

Modelos: `Cliente`, `Ticket`, `Duvida`, `Faq` (PostgreSQL).

O cadastro grava o cliente com senha hasheada e gera `numeroCartao`. Login cria cookie `httpOnly`. Tickets/dúvidas vinculam ao cliente quando houver sessão ou e-mail cadastrado.

## Scripts

| Comando | Ação |
|---------|------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start:all` | Banco + migrate/seed + Next.js LAN (atalho) |
| `npm run db:up` | Docker (se pronto) ou PostgreSQL Windows (5432) |
| `npm run db:embed` | PostgreSQL embutido (porta 5433) |
| `npm run db:check` | Testa conexão e conta registros |
| `npm run db:setup` / `db:ready` | Migra + seed |
| `npm run db:migrate` | Aplica migrations |
| `npm run db:seed` | Popula FAQ |
| `npm run db:studio` | Interface visual do Prisma |
