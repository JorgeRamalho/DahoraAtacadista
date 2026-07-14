"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Falha no login.");
        return;
      }
      router.push("/area-cliente");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-surface mx-auto max-w-md space-y-4 rounded-3xl p-6 md:p-8">
      <div>
        <label className="label-field" htmlFor="login-email">
          E-mail
        </label>
        <input
          id="login-email"
          type="email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label className="label-field" htmlFor="login-senha">
          Senha
        </label>
        <input
          id="login-senha"
          type="password"
          className="input-field"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Entrando…" : "Entrar na Área do Cliente"}
      </button>
      <p className="text-center text-sm text-dahora-slate">
        Ainda não tem cartão?{" "}
        <a href="/cadastro" className="font-semibold text-dahora-forest underline">
          Cadastre-se
        </a>
      </p>
    </form>
  );
}
