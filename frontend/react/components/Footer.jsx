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
            <li><a href="../index.html">index.html</a></li>
            <li><a href="../css/style.css">style.css</a></li>
            <li><a href="../js/script.js">script.js</a></li>
          </ul>
        </div>
        <div>
          <h2>Páginas</h2>
          <ul>
            <li><a href="../cadastro.html">Cadastro</a></li>
            <li><a href="../index.html#faq">FAQ</a></li>
            <li><a href="../sac.html">SAC</a></li>
          </ul>
        </div>
        <div>
          <h2>App completo</h2>
          <ul>
            <li><a href="http://localhost:3000">Next.js + Banco</a></li>
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
