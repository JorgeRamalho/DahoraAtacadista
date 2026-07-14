"use client";

import { useRouter } from "next/navigation";
import { formatDateBr, mascararCartao } from "@/lib/utils/format";

type Cliente = {
  id: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  cpf: string;
  numeroCartao: string;
  pontos: number;
  status: string;
  cidade: string;
  estado: string;
  createdAt: string | Date;
};

type Ticket = {
  id: string;
  protocolo: string;
  assunto: string;
  status: string;
  createdAt: string | Date;
};

type Duvida = {
  id: string;
  pergunta: string;
  status: string;
  createdAt: string | Date;
};

export function ClienteDashboard({
  cliente,
  tickets,
  duvidas,
}: {
  cliente: Cliente;
  tickets: Ticket[];
  duvidas: Duvida[];
}) {
  const router = useRouter();
  const primeiroNome = cliente.nomeCompleto.split(" ")[0];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/area-cliente");
    router.refresh();
  }

  return (
    <div className="container-page section-pad !pt-10 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dahora-forest">
            Área do Cliente
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold md:text-4xl">
            Olá, {primeiroNome}
          </h1>
          <p className="mt-2 text-dahora-slate">
            Bem-vindo de volta. Aqui está o resumo do seu Dahora Card.
          </p>
        </div>
        <button type="button" className="btn-secondary" onClick={logout}>
          Sair
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div
          className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl lg:col-span-2"
          style={{
            background:
              "linear-gradient(145deg, #12201b 0%, #1a6b4a 55%, #c99212 140%)",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-white/60">
                Dahora Card
              </p>
              <p className="font-display mt-1 text-2xl font-semibold">Digital</p>
            </div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              {cliente.status}
            </span>
          </div>
          <p className="mt-10 font-mono text-2xl tracking-[0.18em]">
            {mascararCartao(cliente.numeroCartao)}
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/75">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Titular</p>
              <p className="mt-1 font-medium text-white">{cliente.nomeCompleto}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Número completo</p>
              <p className="mt-1 font-mono text-white">{cliente.numeroCartao}</p>
            </div>
          </div>
        </div>

        <div className="card-surface flex flex-col justify-between rounded-3xl p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-dahora-slate">
              Saldo de pontos
            </p>
            <p className="font-display mt-3 text-5xl font-semibold text-dahora-forest">
              {cliente.pontos.toLocaleString("pt-BR")}
            </p>
            <p className="mt-2 text-sm text-dahora-slate">
              1 ponto a cada R$ 1,00 em compras na rede.
            </p>
          </div>
          <a href="/faq" className="mt-6 text-sm font-semibold text-dahora-forest hover:underline">
            Como trocar pontos →
          </a>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card-surface rounded-3xl p-6">
          <h2 className="font-display text-xl font-semibold">Seus dados</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-dahora-line pb-2">
              <dt className="text-dahora-slate">E-mail</dt>
              <dd className="font-medium">{cliente.email}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-dahora-line pb-2">
              <dt className="text-dahora-slate">Telefone</dt>
              <dd className="font-medium">{cliente.telefone}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-dahora-line pb-2">
              <dt className="text-dahora-slate">CPF</dt>
              <dd className="font-medium">{cliente.cpf}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-dahora-line pb-2">
              <dt className="text-dahora-slate">Cidade</dt>
              <dd className="font-medium">
                {cliente.cidade}/{cliente.estado}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-dahora-slate">Cliente desde</dt>
              <dd className="font-medium">{formatDateBr(cliente.createdAt)}</dd>
            </div>
          </dl>
        </section>

        <section className="card-surface rounded-3xl p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">Atalhos</h2>
          </div>
          <ul className="mt-4 space-y-2">
            {[
              { href: "/sac", label: "Abrir chamado no SAC 24h" },
              { href: "/tire-sua-duvida", label: "Tirar uma dúvida" },
              { href: "/faq", label: "Consultar FAQ" },
              { href: "/dahora-card", label: "Conhecer benefícios do cartão" },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-dahora-ink transition hover:bg-dahora-mist"
                >
                  {item.label}
                  <span aria-hidden>→</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-surface rounded-3xl p-6">
          <h2 className="font-display text-xl font-semibold">Chamados SAC</h2>
          {tickets.length === 0 ? (
            <p className="mt-4 text-sm text-dahora-slate">Nenhum chamado ainda.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {tickets.map((t) => (
                <li
                  key={t.id}
                  className="flex items-start justify-between gap-3 rounded-xl bg-dahora-mist/60 px-4 py-3"
                >
                  <div>
                    <p className="font-mono text-xs text-dahora-forest">{t.protocolo}</p>
                    <p className="mt-1 text-sm font-medium">{t.assunto}</p>
                    <p className="mt-1 text-xs text-dahora-slate">{formatDateBr(t.createdAt)}</p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-dahora-slate">
                    {t.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card-surface rounded-3xl p-6">
          <h2 className="font-display text-xl font-semibold">Suas dúvidas</h2>
          {duvidas.length === 0 ? (
            <p className="mt-4 text-sm text-dahora-slate">Nenhuma dúvida enviada.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {duvidas.map((d) => (
                <li
                  key={d.id}
                  className="flex items-start justify-between gap-3 rounded-xl bg-dahora-mist/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium line-clamp-2">{d.pergunta}</p>
                    <p className="mt-1 text-xs text-dahora-slate">{formatDateBr(d.createdAt)}</p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-dahora-slate">
                    {d.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
