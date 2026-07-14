"use client";

import { useState } from "react";
import {
  formatCep,
  formatCpf,
  formatPhone,
} from "@/lib/utils/format";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

type FormState = {
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  senha: string;
  confirmarSenha: string;
  aceiteTermos: boolean;
};

const initial: FormState = {
  nomeCompleto: "",
  cpf: "",
  email: "",
  telefone: "",
  dataNascimento: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  senha: "",
  confirmarSenha: "",
  aceiteTermos: false,
};

export function CadastroForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{
    numeroCartao: string;
    nome: string;
  } | null>(null);
  const [apiError, setApiError] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function buscarCep(cep: string) {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          endereco: data.logradouro || prev.endereco,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          estado: data.uf || prev.estado,
        }));
      }
    } catch {
      /* ViaCEP opcional */
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setApiError("");

    try {
      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setApiError(data.message || "Não foi possível concluir o cadastro.");
        return;
      }

      setSuccess({
        numeroCartao: data.numeroCartao,
        nome: data.nomeCompleto,
      });
      setForm(initial);
    } catch {
      setApiError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="card-surface rounded-3xl p-8 text-center md:p-12">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-dahora-mist text-2xl text-dahora-forest">
          ✓
        </div>
        <h2 className="font-display text-2xl font-semibold text-dahora-ink">
          Cadastro concluído, {success.nome.split(" ")[0]}!
        </h2>
        <p className="mt-3 text-dahora-slate">
          Seu Dahora Card digital já está ativo. Número do cartão:
        </p>
        <p className="mt-4 font-mono text-xl font-semibold tracking-wider text-dahora-forest">
          {success.numeroCartao}
        </p>
        <a href="/area-cliente" className="btn-primary mt-8 inline-flex">
          Ir para Área do Cliente
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-surface space-y-8 rounded-3xl p-6 md:p-10" noValidate>
      <fieldset>
        <legend className="font-display mb-5 text-xl font-semibold text-dahora-ink">
          Dados pessoais
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label-field" htmlFor="nomeCompleto">
              Nome completo
            </label>
            <input
              id="nomeCompleto"
              className="input-field"
              value={form.nomeCompleto}
              onChange={(e) => update("nomeCompleto", e.target.value)}
              autoComplete="name"
              required
            />
            {errors.nomeCompleto && (
              <p className="mt-1 text-sm text-dahora-coral">{errors.nomeCompleto}</p>
            )}
          </div>
          <div>
            <label className="label-field" htmlFor="cpf">
              CPF
            </label>
            <input
              id="cpf"
              className="input-field"
              value={form.cpf}
              onChange={(e) => update("cpf", formatCpf(e.target.value))}
              inputMode="numeric"
              placeholder="000.000.000-00"
              required
            />
            {errors.cpf && <p className="mt-1 text-sm text-dahora-coral">{errors.cpf}</p>}
          </div>
          <div>
            <label className="label-field" htmlFor="dataNascimento">
              Data de nascimento
            </label>
            <input
              id="dataNascimento"
              type="date"
              className="input-field"
              value={form.dataNascimento}
              onChange={(e) => update("dataNascimento", e.target.value)}
              required
            />
            {errors.dataNascimento && (
              <p className="mt-1 text-sm text-dahora-coral">{errors.dataNascimento}</p>
            )}
          </div>
          <div>
            <label className="label-field" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
              required
            />
            {errors.email && <p className="mt-1 text-sm text-dahora-coral">{errors.email}</p>}
          </div>
          <div>
            <label className="label-field" htmlFor="telefone">
              Telefone / WhatsApp
            </label>
            <input
              id="telefone"
              className="input-field"
              value={form.telefone}
              onChange={(e) => update("telefone", formatPhone(e.target.value))}
              inputMode="tel"
              placeholder="(00) 00000-0000"
              required
            />
            {errors.telefone && (
              <p className="mt-1 text-sm text-dahora-coral">{errors.telefone}</p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display mb-5 text-xl font-semibold text-dahora-ink">
          Endereço
        </legend>
        <div className="grid gap-4 md:grid-cols-6">
          <div className="md:col-span-2">
            <label className="label-field" htmlFor="cep">
              CEP
            </label>
            <input
              id="cep"
              className="input-field"
              value={form.cep}
              onChange={(e) => {
                const v = formatCep(e.target.value);
                update("cep", v);
                if (v.replace(/\D/g, "").length === 8) buscarCep(v);
              }}
              inputMode="numeric"
              placeholder="00000-000"
              required
            />
            {errors.cep && <p className="mt-1 text-sm text-dahora-coral">{errors.cep}</p>}
          </div>
          <div className="md:col-span-4">
            <label className="label-field" htmlFor="endereco">
              Endereço
            </label>
            <input
              id="endereco"
              className="input-field"
              value={form.endereco}
              onChange={(e) => update("endereco", e.target.value)}
              autoComplete="street-address"
              required
            />
            {errors.endereco && (
              <p className="mt-1 text-sm text-dahora-coral">{errors.endereco}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="label-field" htmlFor="numero">
              Número
            </label>
            <input
              id="numero"
              className="input-field"
              value={form.numero}
              onChange={(e) => update("numero", e.target.value)}
              required
            />
            {errors.numero && (
              <p className="mt-1 text-sm text-dahora-coral">{errors.numero}</p>
            )}
          </div>
          <div className="md:col-span-4">
            <label className="label-field" htmlFor="complemento">
              Complemento
            </label>
            <input
              id="complemento"
              className="input-field"
              value={form.complemento}
              onChange={(e) => update("complemento", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label-field" htmlFor="bairro">
              Bairro
            </label>
            <input
              id="bairro"
              className="input-field"
              value={form.bairro}
              onChange={(e) => update("bairro", e.target.value)}
              required
            />
            {errors.bairro && (
              <p className="mt-1 text-sm text-dahora-coral">{errors.bairro}</p>
            )}
          </div>
          <div className="md:col-span-3">
            <label className="label-field" htmlFor="cidade">
              Cidade
            </label>
            <input
              id="cidade"
              className="input-field"
              value={form.cidade}
              onChange={(e) => update("cidade", e.target.value)}
              required
            />
            {errors.cidade && (
              <p className="mt-1 text-sm text-dahora-coral">{errors.cidade}</p>
            )}
          </div>
          <div className="md:col-span-1">
            <label className="label-field" htmlFor="estado">
              UF
            </label>
            <select
              id="estado"
              className="input-field"
              value={form.estado}
              onChange={(e) => update("estado", e.target.value)}
              required
            >
              <option value="">—</option>
              {ESTADOS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
            {errors.estado && (
              <p className="mt-1 text-sm text-dahora-coral">{errors.estado}</p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display mb-5 text-xl font-semibold text-dahora-ink">
          Acesso à Área do Cliente
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              className="input-field"
              value={form.senha}
              onChange={(e) => update("senha", e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
            {errors.senha && <p className="mt-1 text-sm text-dahora-coral">{errors.senha}</p>}
          </div>
          <div>
            <label className="label-field" htmlFor="confirmarSenha">
              Confirmar senha
            </label>
            <input
              id="confirmarSenha"
              type="password"
              className="input-field"
              value={form.confirmarSenha}
              onChange={(e) => update("confirmarSenha", e.target.value)}
              autoComplete="new-password"
              required
            />
            {errors.confirmarSenha && (
              <p className="mt-1 text-sm text-dahora-coral">{errors.confirmarSenha}</p>
            )}
          </div>
        </div>
      </fieldset>

      <label className="flex items-start gap-3 text-sm text-dahora-slate">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-dahora-line text-dahora-forest"
          checked={form.aceiteTermos}
          onChange={(e) => update("aceiteTermos", e.target.checked)}
          required
        />
        <span>
          Li e aceito o tratamento dos meus dados pessoais conforme a LGPD para
          emissão do Dahora Card e atendimento na Área do Cliente.
        </span>
      </label>
      {errors.aceiteTermos && (
        <p className="text-sm text-dahora-coral">{errors.aceiteTermos}</p>
      )}

      {apiError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {apiError}
        </p>
      )}

      <button type="submit" className="btn-primary w-full md:w-auto" disabled={loading}>
        {loading ? "Enviando cadastro…" : "Concluir cadastro do Dahora Card"}
      </button>
    </form>
  );
}
