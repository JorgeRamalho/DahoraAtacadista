# Dahora Atacadista

Aplicação web completa da rede **Dahora** — supermercados e atacado — com cadastro do **Dahora Card**, FAQ, Tire sua dúvida, SAC 24h e Área do Cliente integrada a banco de dados.

## Identidade visual

| Elemento | Definição |
|----------|-----------|
| **Marca** | Dahora |
| **Slogan** | Preço de verdade. Compra com inteligência. |
| **Tipografia** | *Fraunces* (títulos) + *Outfit* (texto) |
| **Primária** | Verde floresta `#1a6b4a` → folha `#2d9b6a` |
| **Acento** | Âmbar `#e8a317` |
| **Fundos** | Creme `#f6faf7`, névoa `#e8f5ee`, areia `#f0ebe3` |
| **Texto** | Tinta `#14241f`, ardósia `#5a6b64` |

Atmosfera com mesh gradients leves, hero full-bleed e cartão digital em degradê. Contraste e foco visível pensados para acessibilidade.

## Front clássico (HTML / CSS / JS / React)

Além do Next.js em `src/`, existe a pasta **`frontend/`** com arquivos separados:

- `frontend/index.html`
- `frontend/css/style.css`
- `frontend/js/script.js`
- `frontend/react/` (App.jsx + componentes)

Veja `frontend/README.md`.

## Stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4**
- **Prisma** + **SQLite** (pronto para migrar a PostgreSQL)
- **Zod** (validação) + **bcryptjs** (senha)

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

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Fluxo sugerido de teste

1. Cadastre um cliente em `/cadastro`
2. Acesse `/area-cliente` (sessão já aberta após cadastro)
3. Consulte `/faq`, envie dúvida e abra chamado no `/sac`
4. Veja tickets e dúvidas no dashboard

## Banco de dados

Modelos: `Cliente`, `Ticket`, `Duvida`, `Faq`.

O cadastro grava o cliente com senha hasheada e gera `numeroCartao`. Login cria cookie `httpOnly`. Tickets/dúvidas vinculam ao cliente quando houver sessão ou e-mail cadastrado.

Para produção, troque `DATABASE_URL` no `.env` por PostgreSQL e rode `npx prisma db push`.

## Scripts

| Comando | Ação |
|---------|------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run db:push` | Sincroniza schema |
| `npm run db:seed` | Popula FAQ |
| `npm run db:studio` | Interface visual do Prisma |
