"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { mascararCartao } from "@/lib/utils/format";
import {
  buildSuggestions,
  CURATED_OFFERS,
  displayName,
  formatClienteCpf,
  formatClienteDesde,
  formatClientePhone,
  formatVencimentoCartao,
  greetingByHour,
  maskCpf,
  nextReward,
  REWARD_TIERS,
  type DashboardCliente,
  type DashboardDuvida,
  type DashboardTicket,
} from "@/lib/cliente/dashboard";

type TabId = "inicio" | "cartao" | "pontos" | "ofertas" | "perfil" | "atendimento";

const TABS: { id: TabId; label: string }[] = [
  { id: "inicio", label: "Início" },
  { id: "cartao", label: "Cartão" },
  { id: "pontos", label: "Pontos" },
  { id: "ofertas", label: "Ofertas" },
  { id: "perfil", label: "Perfil" },
  { id: "atendimento", label: "Atendimento" },
];

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    ativo: "Ativo",
    aberto: "Aberto",
    em_andamento: "Em andamento",
    resolvido: "Resolvido",
    pendente: "Pendente",
    respondida: "Respondida",
  };
  return map[status] ?? status;
}

export function ClienteDashboard({
  cliente,
  tickets,
  duvidas,
}: {
  cliente: DashboardCliente;
  tickets: DashboardTicket[];
  duvidas: DashboardDuvida[];
}) {
  const router = useRouter();
  const navId = useId();
  const [tab, setTab] = useState<TabId>("inicio");
  const [revealCard, setRevealCard] = useState(false);
  const [revealCpf, setRevealCpf] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [copied, setCopied] = useState(false);

  const nome = displayName(cliente);
  const saudacao = greetingByHour();
  const reward = useMemo(() => nextReward(cliente.pontos), [cliente.pontos]);
  const suggestions = useMemo(
    () => buildSuggestions(cliente, tickets, duvidas),
    [cliente, tickets, duvidas]
  );

  useEffect(() => {
    document.documentElement.classList.toggle("a11y-large-text", largeText);
    return () => document.documentElement.classList.remove("a11y-large-text");
  }, [largeText]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as TabId | "";
    if (hash && TABS.some((t) => t.id === hash)) {
      setTab(hash);
    }
  }, []);

  function goTab(id: TabId) {
    setTab(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/area-cliente");
    router.refresh();
  }

  async function copyCard() {
    try {
      await navigator.clipboard.writeText(cliente.numeroCartao);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="dash">
      <a href={`#${navId}`} className="dash-skip">
        Ir para o menu do dashboard
      </a>

      <header className="dash-hero">
        <div className="container-page dash-hero__inner">
          <div>
            <p className="dash-eyebrow">Área do Cliente · Dahora Card</p>
            <h1 className="dash-title">
              {saudacao}, {nome}
            </h1>
            <p className="dash-subtitle">
              Painel personalizado para {cliente.cidade}/{cliente.estado}. Cartão, pontos,
              ofertas e atendimento em um só lugar.
            </p>
          </div>
          <div className="dash-hero__actions">
            <button
              type="button"
              className={`dash-chip ${largeText ? "is-active" : ""}`}
              aria-pressed={largeText}
              onClick={() => setLargeText((v) => !v)}
            >
              Texto maior
            </button>
            <button type="button" className="btn-secondary !px-4 !py-2.5 text-sm" onClick={() => void logout()}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container-page dash-body">
        <nav
          id={navId}
          className="dash-nav"
          aria-label="Seções do dashboard"
          role="tablist"
        >
          {TABS.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                className={`dash-nav__item ${selected ? "is-active" : ""}`}
                onClick={() => goTab(item.id)}
                onKeyDown={(e) => {
                  const idx = TABS.findIndex((t) => t.id === item.id);
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    goTab(TABS[(idx + 1) % TABS.length].id);
                  }
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    goTab(TABS[(idx - 1 + TABS.length) % TABS.length].id);
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="dash-layout">
          <aside className="dash-rail" aria-label="Resumo rápido">
            <div className="dash-rail__card">
              <p className="dash-rail__label">Saldo</p>
              <p className="dash-rail__points">
                {cliente.pontos.toLocaleString("pt-BR")}
              </p>
              <p className="dash-rail__hint">pontos ativos</p>
              <div
                className="dash-progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={reward.progresso}
                aria-label={`Progresso para ${reward.proximo.label}`}
              >
                <span style={{ width: `${reward.progresso}%` }} />
              </div>
              <p className="dash-rail__next">
                {reward.faltam > 0
                  ? `Faltam ${reward.faltam} pts · ${reward.proximo.label}`
                  : `Nível alcançado · ${reward.proximo.label}`}
              </p>
            </div>

            <ul className="dash-quick">
              {[
                { id: "cartao" as const, label: "Ver cartão digital" },
                { id: "ofertas" as const, label: "Ofertas da semana" },
                { id: "atendimento" as const, label: "Central de ajuda" },
              ].map((q) => (
                <li key={q.id}>
                  <button type="button" className="dash-quick__btn" onClick={() => goTab(q.id)}>
                    {q.label}
                    <span aria-hidden>→</span>
                  </button>
                </li>
              ))}
              <li>
                <Link href="/sac" className="dash-quick__btn">
                  Abrir SAC 24h
                  <span aria-hidden>→</span>
                </Link>
              </li>
            </ul>
          </aside>

          <div className="dash-main">
            {tab === "inicio" && (
              <section
                id="panel-inicio"
                role="tabpanel"
                aria-labelledby="tab-inicio"
                className="dash-panel space-y-6"
              >
                <div className="dash-grid-2">
                  <article className="dash-card-visual" aria-label="Dahora Card digital">
                    <div className="dash-card-visual__top">
                      <div>
                        <p className="dash-card-visual__eyebrow">Dahora Card</p>
                        <p className="dash-card-visual__tier">Digital</p>
                      </div>
                      <span className="dash-badge">{statusLabel(cliente.status)}</span>
                    </div>
                    <p className="dash-card-visual__number font-mono">
                      {revealCard
                        ? cliente.numeroCartao
                        : mascararCartao(cliente.numeroCartao)}
                    </p>
                    <div className="dash-card-visual__meta">
                      <div>
                        <p>Titular</p>
                        <strong>{cliente.nomeCompleto}</strong>
                      </div>
                      <div>
                        <p>Vencimento</p>
                        <strong>{formatVencimentoCartao(cliente.createdAt)}</strong>
                      </div>
                    </div>
                    <div className="dash-card-visual__actions">
                      <button
                        type="button"
                        className="dash-ghost-btn"
                        onClick={() => setRevealCard((v) => !v)}
                      >
                        {revealCard ? "Ocultar número" : "Mostrar número"}
                      </button>
                      <button type="button" className="dash-ghost-btn" onClick={() => void copyCard()}>
                        {copied ? "Copiado!" : "Copiar"}
                      </button>
                    </div>
                  </article>

                  <article className="dash-surface">
                    <h2 className="dash-h2">Sugestões para você</h2>
                    <p className="dash-muted mt-1">
                      Atalhos inteligentes com base no seu perfil e atividades.
                    </p>
                    <ul className="mt-4 space-y-3">
                      {suggestions.map((s) => (
                        <li key={s.id} className="dash-suggest">
                          <div>
                            <p className="font-semibold text-dahora-ink">{s.titulo}</p>
                            <p className="mt-1 text-sm text-dahora-slate">{s.texto}</p>
                          </div>
                          {s.href.startsWith("#") ? (
                            <button
                              type="button"
                              className="dash-link-btn"
                              onClick={() => goTab(s.href.slice(1) as TabId)}
                            >
                              {s.cta}
                            </button>
                          ) : (
                            <Link href={s.href} className="dash-link-btn">
                              {s.cta}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>

                <article className="dash-surface">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h2 className="dash-h2">Ofertas em destaque</h2>
                      <p className="dash-muted mt-1">
                        Seleção da rede para quem compra em {cliente.cidade}.
                      </p>
                    </div>
                    <button type="button" className="dash-link-btn" onClick={() => goTab("ofertas")}>
                      Ver todas
                    </button>
                  </div>
                  <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                    {CURATED_OFFERS.slice(0, 2).map((o) => (
                      <li key={o.id} className="dash-offer">
                        <span className="dash-offer__tag">{o.tag}</span>
                        <h3 className="mt-2 font-display text-lg font-semibold">{o.titulo}</h3>
                        <p className="mt-1 text-sm text-dahora-slate">{o.descricao}</p>
                        <p className="mt-3 text-xs font-semibold text-dahora-forest">
                          {o.validade}
                          {o.pontosBonus ? ` · +${o.pontosBonus} pts` : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                </article>
              </section>
            )}

            {tab === "cartao" && (
              <section
                id="panel-cartao"
                role="tabpanel"
                aria-labelledby="tab-cartao"
                className="dash-panel space-y-6"
              >
                <article className="dash-card-visual dash-card-visual--wide">
                  <div className="dash-card-visual__top">
                    <div>
                      <p className="dash-card-visual__eyebrow">Dahora Card</p>
                      <p className="dash-card-visual__tier">Platinum digital</p>
                    </div>
                    <span className="dash-badge">{statusLabel(cliente.status)}</span>
                  </div>
                  <p className="dash-card-visual__number font-mono text-3xl md:text-4xl">
                    {revealCard
                      ? cliente.numeroCartao
                      : mascararCartao(cliente.numeroCartao)}
                  </p>
                  <div className="dash-card-visual__meta">
                    <div>
                      <p>Titular</p>
                      <strong>{cliente.nomeCompleto}</strong>
                    </div>
                    <div>
                      <p>Vencimento</p>
                      <strong>{formatVencimentoCartao(cliente.createdAt)}</strong>
                    </div>
                  </div>
                  <div className="dash-card-visual__actions">
                    <button
                      type="button"
                      className="dash-ghost-btn"
                      onClick={() => setRevealCard((v) => !v)}
                    >
                      {revealCard ? "Ocultar cartão" : "Revelar cartão"}
                    </button>
                    <button
                      type="button"
                      className="dash-ghost-btn"
                      onClick={() => setRevealCpf((v) => !v)}
                    >
                      {revealCpf ? "Ocultar CPF" : "Mostrar CPF"}
                    </button>
                    <button type="button" className="dash-ghost-btn" onClick={() => void copyCard()}>
                      {copied ? "Número copiado" : "Copiar número"}
                    </button>
                  </div>
                </article>

                <div className="dash-surface">
                  <h2 className="dash-h2">Como usar na loja</h2>
                  <ol className="mt-4 grid gap-4 md:grid-cols-3">
                    {[
                      "Informe o CPF no caixa ou mostre o número do cartão.",
                      "Os pontos entram automaticamente em compras elegíveis.",
                      "Acompanhe saldo e recompensas neste painel.",
                    ].map((step, i) => (
                      <li key={step} className="rounded-2xl bg-dahora-mist/70 px-4 py-4">
                        <span className="font-display text-2xl text-dahora-amber">0{i + 1}</span>
                        <p className="mt-2 text-sm text-dahora-slate">{step}</p>
                      </li>
                    ))}
                  </ol>
                  <Link href="/dahora-card" className="dash-link-btn mt-5 inline-flex">
                    Benefícios do cartão →
                  </Link>
                </div>
              </section>
            )}

            {tab === "pontos" && (
              <section
                id="panel-pontos"
                role="tabpanel"
                aria-labelledby="tab-pontos"
                className="dash-panel space-y-6"
              >
                <article className="dash-surface">
                  <p className="dash-eyebrow">Saldo atual</p>
                  <p className="font-display mt-2 text-5xl font-semibold text-dahora-forest md:text-6xl">
                    {cliente.pontos.toLocaleString("pt-BR")}
                  </p>
                  <p className="mt-2 text-dahora-slate">
                    1 ponto a cada R$ 1,00 em compras na rede Dahora.
                  </p>
                  <div
                    className="dash-progress mt-6"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={reward.progresso}
                    aria-label={`Progresso para ${reward.proximo.label}`}
                  >
                    <span style={{ width: `${reward.progresso}%` }} />
                  </div>
                  <p className="mt-3 text-sm font-medium text-dahora-ink">
                    {reward.faltam > 0
                      ? `Próxima meta: ${reward.proximo.label} (${reward.proximo.pontos} pts) · faltam ${reward.faltam}`
                      : `Você já alcançou ${reward.proximo.label}. Continue acumulando!`}
                  </p>
                </article>

                <article className="dash-surface">
                  <h2 className="dash-h2">Catálogo de recompensas</h2>
                  <ul className="mt-4 space-y-3">
                    {REWARD_TIERS.map((tier) => {
                      const unlocked = cliente.pontos >= tier.pontos;
                      return (
                        <li
                          key={tier.id}
                          className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-4 ${
                            unlocked ? "bg-dahora-mist" : "bg-white border border-dahora-line"
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-dahora-ink">{tier.label}</p>
                            <p className="text-sm text-dahora-slate">{tier.descricao}</p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                              unlocked
                                ? "bg-dahora-forest text-white"
                                : "bg-dahora-sand text-dahora-slate"
                            }`}
                          >
                            {unlocked ? "Disponível" : `${tier.pontos} pts`}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <Link href="/faq" className="dash-link-btn mt-5 inline-flex">
                    Como trocar pontos →
                  </Link>
                </article>
              </section>
            )}

            {tab === "ofertas" && (
              <section
                id="panel-ofertas"
                role="tabpanel"
                aria-labelledby="tab-ofertas"
                className="dash-panel space-y-6"
              >
                <div>
                  <h2 className="dash-h2">Ofertas para sua rotina</h2>
                  <p className="dash-muted mt-1">
                    Sugestões da rede em {cliente.cidade}/{cliente.estado}. Use o Dahora Card
                    para pontuar e liberar bônus.
                  </p>
                </div>
                <ul className="grid gap-4 md:grid-cols-2">
                  {CURATED_OFFERS.map((o) => (
                    <li key={o.id} className="dash-offer dash-offer--lg">
                      <span className="dash-offer__tag">{o.tag}</span>
                      <h3 className="mt-3 font-display text-xl font-semibold">{o.titulo}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-dahora-slate">
                        {o.descricao}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-dahora-forest">{o.validade}</p>
                        {o.pontosBonus ? (
                          <span className="rounded-full bg-dahora-mist px-3 py-1 text-xs font-bold text-dahora-forest">
                            +{o.pontosBonus} pts bônus
                          </span>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-dahora-slate">
                  Ofertas ilustrativas da experiência digital. Condições finais valem nas lojas
                  participantes.
                </p>
              </section>
            )}

            {tab === "perfil" && (
              <section
                id="panel-perfil"
                role="tabpanel"
                aria-labelledby="tab-perfil"
                className="dash-panel space-y-6"
              >
                <article className="dash-surface">
                  <h2 className="dash-h2">Seus dados</h2>
                  <dl className="dash-dl mt-4">
                    <div>
                      <dt>Nome</dt>
                      <dd>{cliente.nomeCompleto}</dd>
                    </div>
                    {cliente.nomeSocial ? (
                      <div>
                        <dt>Nome social</dt>
                        <dd>{cliente.nomeSocial}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt>E-mail</dt>
                      <dd>{cliente.email}</dd>
                    </div>
                    <div>
                      <dt>Telefone</dt>
                      <dd>{formatClientePhone(cliente.telefone)}</dd>
                    </div>
                    <div>
                      <dt>CPF</dt>
                      <dd className="flex flex-wrap items-center justify-end gap-2">
                        <span>{revealCpf ? formatClienteCpf(cliente.cpf) : maskCpf(cliente.cpf)}</span>
                        <button
                          type="button"
                          className="dash-link-btn"
                          onClick={() => setRevealCpf((v) => !v)}
                        >
                          {revealCpf ? "Ocultar" : "Mostrar"}
                        </button>
                      </dd>
                    </div>
                    <div>
                      <dt>Endereço</dt>
                      <dd className="text-right">
                        {[cliente.endereco, cliente.numero, cliente.bairro]
                          .filter(Boolean)
                          .join(", ")}
                        <br />
                        {cliente.cidade}/{cliente.estado}
                        {cliente.cep ? ` · CEP ${cliente.cep}` : ""}
                      </dd>
                    </div>
                    <div>
                      <dt>Cliente desde</dt>
                      <dd>{formatClienteDesde(cliente.createdAt)}</dd>
                    </div>
                    <div>
                      <dt>Novidades por e-mail</dt>
                      <dd>{cliente.aceiteMarketing ? "Ativado" : "Desativado"}</dd>
                    </div>
                  </dl>
                </article>
              </section>
            )}

            {tab === "atendimento" && (
              <section
                id="panel-atendimento"
                role="tabpanel"
                aria-labelledby="tab-atendimento"
                className="dash-panel space-y-6"
              >
                <div className="flex flex-wrap gap-3">
                  <Link href="/sac" className="btn-primary">
                    Abrir chamado SAC
                  </Link>
                  <Link href="/tire-sua-duvida" className="btn-secondary">
                    Enviar dúvida
                  </Link>
                  <Link href="/faq" className="btn-secondary">
                    Ver FAQ
                  </Link>
                </div>

                <div className="dash-grid-2">
                  <article className="dash-surface">
                    <h2 className="dash-h2">Chamados SAC</h2>
                    {tickets.length === 0 ? (
                      <div className="dash-empty mt-4">
                        <p>Nenhum chamado ainda.</p>
                        <p className="mt-1 text-sm">
                          Precisa de ajuda com cartão, pontos ou loja? O SAC 24h está pronto.
                        </p>
                        <Link href="/sac" className="dash-link-btn mt-3 inline-flex">
                          Abrir primeiro chamado →
                        </Link>
                      </div>
                    ) : (
                      <ul className="mt-4 space-y-3">
                        {tickets.map((t) => (
                          <li key={t.id} className="dash-list-item">
                            <div>
                              <p className="font-mono text-xs text-dahora-forest">{t.protocolo}</p>
                              <p className="mt-1 text-sm font-medium">{t.assunto}</p>
                              <p className="mt-1 text-xs text-dahora-slate">
                                {formatClienteDesde(t.createdAt)}
                              </p>
                            </div>
                            <span className="dash-soft-badge">{statusLabel(t.status)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>

                  <article className="dash-surface">
                    <h2 className="dash-h2">Suas dúvidas</h2>
                    {duvidas.length === 0 ? (
                      <div className="dash-empty mt-4">
                        <p>Nenhuma dúvida enviada.</p>
                        <p className="mt-1 text-sm">
                          Pergunte sobre benefícios, Club ou cadastro — respondemos por aqui.
                        </p>
                        <Link href="/tire-sua-duvida" className="dash-link-btn mt-3 inline-flex">
                          Tirar uma dúvida →
                        </Link>
                      </div>
                    ) : (
                      <ul className="mt-4 space-y-3">
                        {duvidas.map((d) => (
                          <li key={d.id} className="dash-list-item">
                            <div>
                              <p className="text-sm font-medium line-clamp-2">{d.pergunta}</p>
                              <p className="mt-1 text-xs text-dahora-slate">
                                {formatClienteDesde(d.createdAt)}
                              </p>
                            </div>
                            <span className="dash-soft-badge">{statusLabel(d.status)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
