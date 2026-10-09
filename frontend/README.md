# Front-end Dahora (HTML · CSS · JS · React)

Pasta clássica do front, separada da aplicação Next.js (raiz do projeto).

## Estrutura

```
frontend/
├── index.html              ← página inicial
├── cadastro.html
├── dahora-card.html
├── faq.html               ← redireciona para index.html#faq
├── tire-sua-duvida.html
├── sac.html
├── area-cliente.html
├── css/
│   └── style.css           ← identidade visual completa
├── js/
│   └── script.js           ← menu, máscaras, FAQ, formulários → API
└── react/
    ├── index.html          ← app React (CDN)
    ├── App.jsx
    └── components/
        ├── Header.jsx
        ├── Hero.jsx
        ├── Benefits.jsx
        └── Footer.jsx
```

## Como abrir

1. Mantenha o Next.js rodando (`npm run dev` na raiz) para os formulários salvarem no banco.
2. Abra os HTML no navegador, por exemplo:
   - `frontend/index.html`
   - `frontend/react/index.html`

Ou use um servidor estático na pasta `frontend`:

```bash
npx serve frontend
```

## GitHub Pages

A pasta `frontend/` é a origem do site em `https://jorgeramalho.github.io/DahoraAtacadista/`.

No GitHub: **Settings → Pages → Source = GitHub Actions**. O workflow na raiz do repo faz o deploy automático a cada push em `main` que altere `frontend/`.

Em produção estática, `script.js` **não** chama `127.0.0.1:3000`. Formulários mostram aviso até existir API pública (Next + banco).

## Relação com o Next.js

| Pasta | Função |
|-------|--------|
| `frontend/` | Front clássico (HTML/CSS/JS/React) |
| `src/` (raiz) | App Next.js + API + Prisma |

Os formulários em `script.js` chamam `http://localhost:3000/api/...`.
