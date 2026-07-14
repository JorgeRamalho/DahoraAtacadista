# Histórico de registros — Dahora Atacadista

Registro das interações com a IA e alterações aplicadas no projeto (14/07/2026).

## Linha do tempo das branches

| Branch | Papel |
|--------|--------|
| `main` | Commit inicial do repositório (base estável) |
| `docs/historico-registros` | Documentação do histórico de ajustes e decisões |

## Sessão 1 — Fundação do produto

| Ação | Resultado |
|------|-----------|
| Briefing completo (site Dahora, Dahora Card, FAQ, SAC, Área do Cliente, identidade visual, DB) | App Next.js + Prisma/SQLite + front HTML/CSS/JS/React em `frontend/` |
| Pedido dos arquivos de front (`index.html`, `style.css`, `script.js`, React) | Pasta `frontend/` organizada e documentada |
| Carrossel acima do hero | Carrossel de lojas/atacado no topo da home |

## Sessão 2 — Layout e Live Server

| Ação | Resultado |
|------|-----------|
| Erro ao abrir `index.html` no Live Server | Correção em `liveServer.settings.CustomBrowser` → `chrome` (settings do Cursor) |
| Seção branca abaixo do carrossel | Introduzida `section-white` |
| Reordenar “Como funciona” abaixo do carrossel | Seção movida; CSS de intro antiga removido |
| “Por que Dahora” abaixo do carrossel | Features movidas para logo após o carrossel |
| Spotlight Dahora Card abaixo de “Por que Dahora” | Ordem final: Carrossel → Por que Dahora → Spotlight → Hero |

## Sessão 3 — Altura do carrossel

| Ação | Resultado |
|------|-----------|
| Aumentar altura ao máximo (`100dvh`) | Aplicado e depois **desfeito** a pedido |
| Nova tentativa com `100svh` | Aplicado e depois **desfeito** a pedido |
| Solução definitiva | Variável `--carousel-height: clamp(360px, 70vh, 780px)` em `:root`; track usa `var(--carousel-height)`; cache-bust em `index.html` (`?v=carousel-780`) |

## Sessão 4 — GitHub

| Ação | Resultado |
|------|-----------|
| Commit inicial profissional | `main` com foundation do app (`.env` excluído) |
| Branch de histórico | `docs/historico-registros` com este arquivo |
| Remote | `https://github.com/JorgeRamalho/DahoraAtacadista.git` |

## Arquivos sensíveis (não versionados)

- `.env` — permanece local (secrets)
- `.env.example` — template público para setup
- `node_modules/`, `.next/`, bancos Prisma locais — ignorados pelo `.gitignore`

## Estado atual relevante (front)

- Home: carrossel → Por que Dahora → Spotlight Dahora Card → Hero e demais seções
- Altura do carrossel fixa via `--carousel-height` em `frontend/css/style.css`
