/* eslint-disable no-undef */
const { useState, useEffect, useRef } = React;

const carouselSlides = [
  {
    src: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=2000&q=80",
    alt: "Corredor de atacado com carrinhos e prateleiras altas",
    caption: "Corredores amplos de atacado",
  },
  {
    src: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=2000&q=80",
    alt: "Prateleiras de produtos em estoque de supermercado",
    caption: "Estoque organizado para o seu negócio",
  },
  {
    src: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=2000&q=80",
    alt: "Pessoa escolhendo frutas e verduras frescas",
    caption: "Clientes escolhendo com tranquilidade",
  },
  {
    src: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=80",
    alt: "Corredor de supermercado com produtos frescos",
    caption: "Experiência completa no varejo",
  },
  {
    src: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=2000&q=80",
    alt: "Pessoas fazendo compras em supermercado",
    caption: "Movimento real nas lojas Dahora",
  },
  {
    src: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=2000&q=80",
    alt: "Interior de loja com produtos e clientes circulando",
    caption: "Do atacado ao dia a dia",
  },
];

function StoreCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (paused) return undefined;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % carouselSlides.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused]);

  const goTo = (next) => {
    setIndex((next + carouselSlides.length) % carouselSlides.length);
  };

  return (
    <section
      className="store-carousel"
      aria-roledescription="carousel"
      aria-label="Imagens das lojas Dahora"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) goTo(index + (delta < 0 ? 1 : -1));
        touchStartX.current = null;
      }}
    >
      <div className="store-carousel-track">
        {carouselSlides.map((slide, i) => (
          <figure
            key={slide.src}
            className={`store-slide${i === index ? " is-active" : ""}`}
            aria-hidden={i !== index}
          >
            <img src={slide.src} alt={slide.alt} loading={i === 0 ? "eager" : "lazy"} />
            <figcaption>{slide.caption}</figcaption>
          </figure>
        ))}
      </div>
      <button
        className="carousel-nav carousel-prev"
        type="button"
        aria-label="Imagem anterior"
        onClick={() => goTo(index - 1)}
      >
        ‹
      </button>
      <button
        className="carousel-nav carousel-next"
        type="button"
        aria-label="Próxima imagem"
        onClick={() => goTo(index + 1)}
      >
        ›
      </button>
      <div className="carousel-dots">
        {carouselSlides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            className={i === index ? "is-active" : ""}
            aria-label={`Ir para slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="logo" href="../index.html" aria-label="Dahora">
          <span className="logo-mark">DH</span>
          <span className="logo-text">
            <strong>Dahora</strong>
            <span>Atacadista</span>
          </span>
        </a>

        <nav className="nav-desktop" aria-label="Principal">
          <a href="../index.html">Início HTML</a>
          <a href="../cadastro.html">Cadastro</a>
          <a href="../index.html#faq">FAQ</a>
          <a href="../sac.html">SAC 24h</a>
          <a href="index.html" aria-current="page">
            React
          </a>
        </nav>

        <div className="header-actions">
          <a className="btn btn-secondary" href="../area-cliente.html">
            Entrar
          </a>
          <a className="btn btn-primary" href="../area-cliente.html">
            Área do Cliente
          </a>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="nav-mobile is-open">
          <div className="container">
            <a href="../index.html">Início HTML</a>
            <a href="../cadastro.html">Cadastro</a>
            <a href="../index.html#faq">FAQ</a>
            <a href="../sac.html">SAC</a>
            <div className="mobile-actions">
              <a className="btn btn-primary" href="../area-cliente.html">
                Área do Cliente
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" role="img" aria-label="Corredor de supermercado" />
      <div className="container hero-content">
        <p className="eyebrow">Versão React · frontend/react</p>
        <h1>Dahora</h1>
        <p>Preço de verdade. Compra com inteligência.</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="../cadastro.html">
            Solicitar Dahora Card
          </a>
          <a className="btn btn-ghost" href="../area-cliente.html">
            Área do Cliente
          </a>
        </div>
      </div>
    </section>
  );
}

const benefits = [
  { icon: "◈", title: "Pontos em toda compra", text: "1 ponto por real no varejo e no atacado." },
  { icon: "◇", title: "Ofertas exclusivas", text: "Campanhas só para quem tem Dahora Card." },
  { icon: "○", title: "Área do Cliente", text: "Cartão digital, pontos e atendimento." },
  { icon: "△", title: "SAC 24 horas", text: "Suporte com protocolo automático." },
];

function Benefits() {
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Por que Dahora</p>
        <h2>Componentes React + CSS compartilhado</h2>
        <p className="muted mt-2" style={{ maxWidth: "36rem" }}>
          Os estilos vêm de <code>frontend/css/style.css</code>. Os componentes em JSX
          reutilizam as mesmas classes.
        </p>
        <div className="grid-4">
          {benefits.map((item) => (
            <article className="feature" key={item.title}>
              <div className="feature-icon" aria-hidden="true">
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <a className="logo" href="../index.html">
            <span className="logo-mark">DH</span>
            <span className="logo-text">
              <strong style={{ color: "#fff" }}>Dahora</strong>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Atacadista</span>
            </span>
          </a>
          <p className="mt-2">Preço de verdade. Compra com inteligência.</p>
        </div>
        <div>
          <h2>Front clássico</h2>
          <ul>
            <li>
              <a href="../index.html">index.html</a>
            </li>
            <li>
              <a href="../css/style.css">style.css</a>
            </li>
            <li>
              <a href="../js/script.js">script.js</a>
            </li>
          </ul>
        </div>
        <div>
          <h2>Páginas</h2>
          <ul>
            <li>
              <a href="../cadastro.html">Cadastro</a>
            </li>
            <li>
              <a href="../index.html#faq">FAQ</a>
            </li>
            <li>
              <a href="../sac.html">SAC</a>
            </li>
          </ul>
        </div>
        <div>
          <h2>App completo</h2>
          <ul>
            <li>
              <a href="http://localhost:3000">Next.js + Banco</a>
            </li>
            <li>0800 400 2024</li>
            <li>sac@dahora.com.br</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Dahora Atacadista · pasta frontend/react</p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="layout">
      <Header />
      <main>
        <StoreCarousel />
        <Hero />
        <Benefits />
        <section className="section section-spotlight" aria-label="Dahora Card">
          <div className="container">
            <div className="spotlight">
              <div className="spotlight-grid">
                <div>
                  <span className="react-badge">React · componentes</span>
                  <p className="eyebrow" style={{ marginTop: "1rem", color: "var(--dahora-mint)" }}>
                    Dahora Card
                  </p>
                  <h2>Front em React com a mesma identidade visual</h2>
                  <p style={{ color: "rgba(255,255,255,0.85)" }}>
                    Esta pasta demonstra a home em React (JSX). O site completo em HTML/CSS/JS
                    está em <code>frontend/</code>. A aplicação com banco roda em Next.js na
                    raiz.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                      marginTop: "1.5rem",
                    }}
                  >
                    <a
                      className="btn btn-primary"
                      href="../cadastro.html"
                      style={{
                        background: "#fff",
                        color: "var(--dahora-forest)",
                        boxShadow: "none",
                      }}
                    >
                      Ir ao cadastro HTML
                    </a>
                    <a className="btn btn-ghost" href="http://localhost:3000">
                      Abrir app Next.js
                    </a>
                  </div>
                </div>
                <div className="card-visual" aria-hidden="true">
                  <div className="top">
                    <div>
                      <div className="label">Dahora Card</div>
                      <div className="title">React</div>
                    </div>
                    <div className="chip">DH</div>
                  </div>
                  <div className="number">DH•••• •••• 2024</div>
                  <div className="meta">
                    <span>Componente JSX</span>
                    <span>style.css</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
