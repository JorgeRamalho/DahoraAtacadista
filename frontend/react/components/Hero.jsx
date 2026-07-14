function Hero() {
  return (
    <section className="hero">
      <div
        className="hero-bg"
        role="img"
        aria-label="Corredor de supermercado"
      />
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
