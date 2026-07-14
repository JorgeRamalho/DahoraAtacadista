const items = [
  {
    icon: "◈",
    title: "Pontos em toda compra",
    text: "1 ponto por real no varejo e no atacado.",
  },
  {
    icon: "◇",
    title: "Ofertas exclusivas",
    text: "Campanhas só para quem tem Dahora Card.",
  },
  {
    icon: "○",
    title: "Área do Cliente",
    text: "Cartão digital, pontos e atendimento.",
  },
  {
    icon: "△",
    title: "SAC 24 horas",
    text: "Suporte com protocolo automático.",
  },
];

function Benefits() {
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Por que Dahora</p>
        <h2>Componentes React + CSS compartilhado</h2>
        <p className="muted mt-2" style={{ maxWidth: "36rem" }}>
          Os estilos vêm de <code>frontend/css/style.css</code>. Os componentes
          em JSX reutilizam as mesmas classes.
        </p>
        <div className="grid-4">
          {items.map((item) => (
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
