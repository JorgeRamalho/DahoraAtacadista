"use client";

import { useState } from "react";

export function DuvidaForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [pergunta, setPergunta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/duvidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, pergunta }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Não foi possível enviar sua dúvida.");
        return;
      }
      setDone(true);
      setNome("");
      setEmail("");
      setPergunta("");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="card-surface rounded-3xl p-8 text-center">
        <p className="text-2xl text-dahora-forest">✓</p>
        <h2 className="font-display mt-2 text-2xl font-semibold">Dúvida enviada</h2>
        <p className="mt-2 text-dahora-slate">
          Nossa equipe responde em até 24 horas no e-mail informado. Enquanto isso,
          confira o{" "}
          <a href="/faq" className="font-semibold text-dahora-forest underline">
            FAQ
          </a>
          .
        </p>
        <button type="button" className="btn-secondary mt-6" onClick={() => setDone(false)}>
          Enviar outra dúvida
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-surface space-y-4 rounded-3xl p-6 md:p-8" noValidate>
      <div>
        <label className="label-field" htmlFor="duvida-nome">
          Nome
        </label>
        <input
          id="duvida-nome"
          className="input-field"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="label-field" htmlFor="duvida-email">
          E-mail
        </label>
        <input
          id="duvida-email"
          type="email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="label-field" htmlFor="duvida-pergunta">
          Sua dúvida
        </label>
        <textarea
          id="duvida-pergunta"
          className="input-field min-h-36 resize-y"
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          required
          minLength={10}
        />
      </div>
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Enviando…" : "Enviar dúvida"}
      </button>
    </form>
  );
}
