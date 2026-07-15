function Header() {
  const [open, setOpen] = React.useState(false);

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
          <a href="index.html" aria-current="page">React</a>
        </nav>

        <div className="header-actions">
          <a className="btn btn-secondary" href="../area-cliente.html">Entrar</a>
          <a className="btn btn-primary" href="../area-cliente.html">Área do Cliente</a>
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
              <a className="btn btn-primary" href="../area-cliente.html">Área do Cliente</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
