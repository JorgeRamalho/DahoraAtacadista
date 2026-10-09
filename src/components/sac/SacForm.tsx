"use client";

import { useState } from "react";
import { formatPhone } from "@/lib/utils/format";
import { brand } from "@/lib/brand";

export function SacForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [prioridade, setPrioridade] = useState("normal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [protocolo, setProtocolo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone, assunto, mensagem, prioridade }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Não foi possível abrir o chamado.");
        return;
      }
      setProtocolo(data.protocolo);
      setNome("");
      setEmail("");
      setTelefone("");
      setAssunto("");
      setMensagem("");
      setPrioridade("normal");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (protocolo) {
    return (
      <div className="card-surface rounded-3xl p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dahora-forest">
          Chamado registrado
        </p>
        <h2 className="font-display mt-2 text-2xl font-semibold">Protocolo gerado</h2>
        <p className="mt-4 font-mono text-xl font-semibold text-dahora-forest">{protocolo}</p>
        <p className="mt-3 text-sm text-dahora-slate">
          Guarde este número. Clientes logados também veem o histórico na Área do Cliente.
          Em urgências, ligue {brand.supportPhone}.
        </p>
        <button type="button" className="btn-secondary mt-6" onClick={() => setProtocolo(null)}>
          Abrir outro chamado
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-surface space-y-4 rounded-3xl p-6 md:p-8" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="sac-nome">
            Nome
          </label>
          <input
            id="sac-nome"
            className="input-field"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label-field" htmlFor="sac-email">
            E-mail
          </label>
          <input
            id="sac-email"
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label-field" htmlFor="sac-telefone">
            Telefone (opcional)
          </label>
          <input
            id="sac-telefone"
            className="input-field"
            value={telefone}
            onChange={(e) => setTelefone(formatPhone(e.target.value))}
          />
        </div>
        <div>
          <label className="label-field" htmlFor="sac-prioridade">
            Prioridade
          </label>
          <select
            id="sac-prioridade"
            className="input-field"
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
          >
            <option value="baixa">Baixa</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="label-field" htmlFor="sac-assunto">
            Assunto
          </label>
          <input
            id="sac-assunto"
            className="input-field"
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="label-field" htmlFor="sac-mensagem">
            Mensagem
          </label>
          <textarea
            id="sac-mensagem"
            className="input-field min-h-40 resize-y"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            required
            minLength={10}
          />
        </div>
      </div>
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Abrindo chamado…" : "Abrir chamado no SAC"}
      </button>
    </form>
  );
}
