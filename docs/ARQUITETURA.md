# Arquitetura — Dahora Atacadista

## Visão

Stack unificada em **Next.js 15 (App Router)**:

| Camada | Tecnologia |
|--------|------------|
| Front | React 19 + Tailwind 4 + `frontend/` HTML/CSS/JS |
| APIs | Route Handlers em `src/app/api/*` |
| DB | **PostgreSQL** via Prisma |
| Auth | Cookie `httpOnly` + `SESSION_SECRET` |
| PWA | `manifest-dahora-atacadista.webmanifest` + `sw-dahora-atacadista.js` (porta 3010) |

## Banco PostgreSQL

Credenciais locais: usuário/senha `dahora` / `dahora_dev`, DB `dahora`.

### Forma recomendada neste PC

```bash
npm run db:up      # Docker (se pronto) ou PostgreSQL Windows (porta 5432)
npm run db:ready   # migrations + seed
npm run dev:lan    # app em http://localhost:3010 e na rede (isolado do Carona :3000)
```

Atalho: `npm run start:all` (banco + migrate + Next.js LAN).

| Fonte | Porta | Quando usar |
|-------|-------|-------------|
| PostgreSQL Windows (`postgresql-x64-16`) | **5432** | Padrão atual — serviço automático |
| Docker Compose (`dahora-postgres`) | **5432** | Quando Docker Desktop + WSL estiverem OK |
| Embutido (`npm run db:embed`) | **5433** | Fallback sem serviço/Docker |

### Cloud

Defina `DATABASE_URL` no `.env` (Neon, Supabase, Railway etc.) e rode:

```bash
npm run db:setup
```

### Modelos

`Cliente` · `Ticket` · `Duvida` · `Faq`

## APIs

| Método | Rota | Função |
|--------|------|--------|
| `GET` | `/api/health` | Status app + PostgreSQL |
| `GET` | `/api/faq` | Lista FAQ (`?q=` · `?categoria=`) |
| `POST` | `/api/cadastro` | Cria cliente completo no PostgreSQL + Dahora Card (CORS p/ Live Server) |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/logout` | Logout |
| `POST` | `/api/sac` | Abre ticket SAC |
| `POST` | `/api/duvidas` | Envia dúvida |

## PWA

- Manifest: `/manifest-dahora-atacadista.webmanifest`
- Service Worker: `/sw-dahora-atacadista.js` (registrado só em produção)
- Porta local: `3010` (evita colisão com Carona/Trampolim no Chrome)
- Ícones: `/icons/icon-192.png`, `/icons/icon-512.png`

## Roadmap sugerido

1. ~~PostgreSQL + migrations + health~~
2. ~~PWA base (manifest + SW)~~
3. Conectar front estático (`frontend/`) às APIs em produção
4. Painel admin (FAQ/tickets)
5. Push notifications PWA
6. Deploy (Vercel + Postgres gerenciado)
