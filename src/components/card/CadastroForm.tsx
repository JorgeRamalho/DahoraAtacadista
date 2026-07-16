"use client";

import { useState } from "react";
import Link from "next/link";
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
  nomeSocial: string;
  cpf: string;
  rg: string;
  email: string;
  telefone: string;
  telefoneAlternativo: string;
  dataNascimento: string;
  genero: string;
  estadoCivil: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  comoConheceu: string;
  senha: string;
  confirmarSenha: string;
  aceiteTermos: boolean;
  aceiteMarketing: boolean;
};

const initial: FormState = {
  nomeCompleto: "",
  nomeSocial: "",
  cpf: "",
  rg: "",
  email: "",
  telefone: "",
  telefoneAlternativo: "",
  dataNascimento: "",
  genero: "",
  estadoCivil: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  comoConheceu: "",
  senha: "",
  confirmarSenha: "",
  aceiteTermos: false,
  aceiteMarketing: false,
};

const STEPS = [
  { id: 1, label: "Dados pessoais" },
  { id: 2, label: "Endereço" },
  { id: 3, label: "Acesso" },
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-sm text-dahora-coral" role="alert">
      {message}
    </p>
  );
}

function fieldClass(hasError?: string) {
  return hasError
    ? "input-field border-dahora-coral focus:border-dahora-coral"
    : "input-field";
}

export function CadastroForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [success, setSuccess] = useState<{
    numeroCartao: string;
    nome: string;
  } | null>(null);
  const [apiError, setApiError] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  async function buscarCep(cep: string) {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
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
    } finally {
      setCepLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setApiError("");

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
        signal: controller.signal,
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setApiError(data.message || "Não foi possível concluir o cadastro.");
        const firstKey = data.fieldErrors
          ? Object.keys(data.fieldErrors)[0]
          : null;
        if (firstKey) {
          document.getElementById(firstKey)?.focus();
        }
        return;
      }

      setSuccess({
        numeroCartao: data.numeroCartao,
        nome: data.nomeCompleto,
      });
      setForm(initial);
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === "AbortError";
      setApiError(
        timedOut
          ? "A API não respondeu a tempo. Confirme se o Next.js e o PostgreSQL estão ativos (npm run start:all)."
          : "Erro de conexão com a API. Confirme se o servidor e o PostgreSQL estão ativos (npm run start:all)."
      );
    } finally {
      window.clearTimeout(timer);
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
          Seus dados foram gravados na tabela <strong>Cliente</strong> do
          PostgreSQL. Número do Dahora Card:
        </p>
        <p className="mt-4 font-mono text-xl font-semibold tracking-wider text-dahora-forest">
          {success.numeroCartao}
        </p>
        <p className="mt-2 text-sm text-dahora-slate">
          Bônus de boas-vindas: 100 pontos · status ativo
        </p>
        <Link href="/area-cliente" className="btn-primary mt-8 inline-flex">
          Ir para Área do Cliente
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="card-surface space-y-8 rounded-3xl p-6 md:p-10"
      noValidate
    >
      <div>
        <p className="rounded-xl bg-dahora-mist/80 px-4 py-3 text-sm text-dahora-slate">
          Formulário completo do Dahora Card. Os dados vão para o PostgreSQL
          via <code className="text-dahora-forest">/api/cadastro</code>. Campos
          com * são obrigatórios.
        </p>

        <ol className="mt-5 grid grid-cols-3 gap-2" aria-label="Etapas do cadastro">
          {STEPS.map((step) => (
            <li
              key={step.id}
              className="rounded-xl border border-dahora-line bg-white px-2 py-2 text-center text-xs font-semibold text-dahora-slate md:text-sm"
            >
              <span className="text-dahora-forest">{step.id}.</span> {step.label}
            </li>
          ))}
        </ol>
      </div>

      <fieldset>
        <legend className="font-display mb-5 text-xl font-semibold text-dahora-ink">
          1. Dados pessoais
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label-field" htmlFor="nomeCompleto">
              Nome completo *
            </label>
            <input
              id="nomeCompleto"
              className={fieldClass(errors.nomeCompleto)}
              value={form.nomeCompleto}
              onChange={(e) => update("nomeCompleto", e.target.value)}
              autoComplete="name"
              aria-invalid={Boolean(errors.nomeCompleto)}
              required
            />
            <FieldError message={errors.nomeCompleto} />
          </div>
          <div>
            <label className="label-field" htmlFor="nomeSocial">
              Nome social
            </label>
            <input
              id="nomeSocial"
              className={fieldClass(errors.nomeSocial)}
              value={form.nomeSocial}
              onChange={(e) => update("nomeSocial", e.target.value)}
            />
            <FieldError message={errors.nomeSocial} />
          </div>
          <div>
            <label className="label-field" htmlFor="cpf">
              CPF *
            </label>
            <input
              id="cpf"
              className={fieldClass(errors.cpf)}
              value={form.cpf}
              onChange={(e) => update("cpf", formatCpf(e.target.value))}
              inputMode="numeric"
              placeholder="000.000.000-00"
              aria-invalid={Boolean(errors.cpf)}
              required
            />
            <FieldError message={errors.cpf} />
          </div>
          <div>
            <label className="label-field" htmlFor="rg">
              RG
            </label>
            <input
              id="rg"
              className={fieldClass(errors.rg)}
              value={form.rg}
              onChange={(e) => update("rg", e.target.value)}
            />
            <FieldError message={errors.rg} />
          </div>
          <div>
            <label className="label-field" htmlFor="dataNascimento">
              Data de nascimento *
            </label>
            <input
              id="dataNascimento"
              type="date"
              className={fieldClass(errors.dataNascimento)}
              value={form.dataNascimento}
              onChange={(e) => update("dataNascimento", e.target.value)}
              aria-invalid={Boolean(errors.dataNascimento)}
              required
            />
            <FieldError message={errors.dataNascimento} />
          </div>
          <div>
            <label className="label-field" htmlFor="genero">
              Gênero
            </label>
            <select
              id="genero"
              className="input-field"
              value={form.genero}
              onChange={(e) => update("genero", e.target.value)}
            >
              <option value="">Prefiro não informar agora</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
              <option value="outro">Outro</option>
              <option value="prefiro_nao_informar">Prefiro não informar</option>
            </select>
          </div>
          <div>
            <label className="label-field" htmlFor="estadoCivil">
              Estado civil
            </label>
            <select
              id="estadoCivil"
              className="input-field"
              value={form.estadoCivil}
              onChange={(e) => update("estadoCivil", e.target.value)}
            >
              <option value="">—</option>
              <option value="solteiro">Solteiro(a)</option>
              <option value="casado">Casado(a)</option>
              <option value="uniao_estavel">União estável</option>
              <option value="divorciado">Divorciado(a)</option>
              <option value="viuvo">Viúvo(a)</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="label-field" htmlFor="email">
              E-mail *
            </label>
            <input
              id="email"
              type="email"
              className={fieldClass(errors.email)}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              required
            />
            <FieldError message={errors.email} />
          </div>
          <div>
            <label className="label-field" htmlFor="telefone">
              Telefone / WhatsApp *
            </label>
            <input
              id="telefone"
              className={fieldClass(errors.telefone)}
              value={form.telefone}
              onChange={(e) => update("telefone", formatPhone(e.target.value))}
              inputMode="tel"
              placeholder="(00) 00000-0000"
              aria-invalid={Boolean(errors.telefone)}
              required
            />
            <FieldError message={errors.telefone} />
          </div>
          <div>
            <label className="label-field" htmlFor="telefoneAlternativo">
              Telefone alternativo
            </label>
            <input
              id="telefoneAlternativo"
              className={fieldClass(errors.telefoneAlternativo)}
              value={form.telefoneAlternativo}
              onChange={(e) =>
                update("telefoneAlternativo", formatPhone(e.target.value))
              }
              inputMode="tel"
              placeholder="(00) 00000-0000"
            />
            <FieldError message={errors.telefoneAlternativo} />
          </div>
          <div>
            <label className="label-field" htmlFor="comoConheceu">
              Como conheceu a Dahora?
            </label>
            <select
              id="comoConheceu"
              className="input-field"
              value={form.comoConheceu}
              onChange={(e) => update("comoConheceu", e.target.value)}
            >
              <option value="">—</option>
              <option value="loja">Loja física</option>
              <option value="indicacao">Indicação</option>
              <option value="redes_sociais">Redes sociais</option>
              <option value="google">Google</option>
              <option value="anuncio">Anúncio</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display mb-5 text-xl font-semibold text-dahora-ink">
          2. Endereço
        </legend>
        <div className="grid gap-4 md:grid-cols-6">
          <div className="md:col-span-2">
            <label className="label-field" htmlFor="cep">
              CEP * {cepLoading ? <span className="font-normal">(buscando…)</span> : null}
            </label>
            <input
              id="cep"
              className={fieldClass(errors.cep)}
              value={form.cep}
              onChange={(e) => {
                const v = formatCep(e.target.value);
                update("cep", v);
                if (v.replace(/\D/g, "").length === 8) void buscarCep(v);
              }}
              inputMode="numeric"
              placeholder="00000-000"
              aria-invalid={Boolean(errors.cep)}
              required
            />
            <FieldError message={errors.cep} />
          </div>
          <div className="md:col-span-4">
            <label className="label-field" htmlFor="endereco">
              Endereço *
            </label>
            <input
              id="endereco"
              className={fieldClass(errors.endereco)}
              value={form.endereco}
              onChange={(e) => update("endereco", e.target.value)}
              autoComplete="street-address"
              aria-invalid={Boolean(errors.endereco)}
              required
            />
            <FieldError message={errors.endereco} />
          </div>
          <div className="md:col-span-2">
            <label className="label-field" htmlFor="numero">
              Número *
            </label>
            <input
              id="numero"
              className={fieldClass(errors.numero)}
              value={form.numero}
              onChange={(e) => update("numero", e.target.value)}
              aria-invalid={Boolean(errors.numero)}
              required
            />
            <FieldError message={errors.numero} />
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
              placeholder="Apto, bloco, referência…"
            />
          </div>
          <div className="md:col-span-2">
            <label className="label-field" htmlFor="bairro">
              Bairro *
            </label>
            <input
              id="bairro"
              className={fieldClass(errors.bairro)}
              value={form.bairro}
              onChange={(e) => update("bairro", e.target.value)}
              aria-invalid={Boolean(errors.bairro)}
              required
            />
            <FieldError message={errors.bairro} />
          </div>
          <div className="md:col-span-3">
            <label className="label-field" htmlFor="cidade">
              Cidade *
            </label>
            <input
              id="cidade"
              className={fieldClass(errors.cidade)}
              value={form.cidade}
              onChange={(e) => update("cidade", e.target.value)}
              aria-invalid={Boolean(errors.cidade)}
              required
            />
            <FieldError message={errors.cidade} />
          </div>
          <div className="md:col-span-1">
            <label className="label-field" htmlFor="estado">
              UF *
            </label>
            <select
              id="estado"
              className={fieldClass(errors.estado)}
              value={form.estado}
              onChange={(e) => update("estado", e.target.value)}
              aria-invalid={Boolean(errors.estado)}
              required
            >
              <option value="">—</option>
              {ESTADOS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
            <FieldError message={errors.estado} />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display mb-5 text-xl font-semibold text-dahora-ink">
          3. Acesso à Área do Cliente
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="senha">
              Senha * (mín. 6 caracteres)
            </label>
            <input
              id="senha"
              type="password"
              className={fieldClass(errors.senha)}
              value={form.senha}
              onChange={(e) => update("senha", e.target.value)}
              autoComplete="new-password"
              minLength={6}
              aria-invalid={Boolean(errors.senha)}
              required
            />
            <FieldError message={errors.senha} />
          </div>
          <div>
            <label className="label-field" htmlFor="confirmarSenha">
              Confirmar senha *
            </label>
            <input
              id="confirmarSenha"
              type="password"
              className={fieldClass(errors.confirmarSenha)}
              value={form.confirmarSenha}
              onChange={(e) => update("confirmarSenha", e.target.value)}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmarSenha)}
              required
            />
            <FieldError message={errors.confirmarSenha} />
          </div>
        </div>
      </fieldset>

      <div className="space-y-3">
        <label className="flex items-start gap-3 text-sm text-dahora-slate">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-dahora-line text-dahora-forest"
            checked={form.aceiteTermos}
            onChange={(e) => update("aceiteTermos", e.target.checked)}
            required
          />
          <span>
            Li e aceito o tratamento dos meus dados pessoais conforme a LGPD
            para emissão do Dahora Card e atendimento na Área do Cliente. *
          </span>
        </label>
        <FieldError message={errors.aceiteTermos} />

        <label className="flex items-start gap-3 text-sm text-dahora-slate">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-dahora-line text-dahora-forest"
            checked={form.aceiteMarketing}
            onChange={(e) => update("aceiteMarketing", e.target.checked)}
          />
          <span>
            Quero receber ofertas e novidades da Dahora por e-mail/WhatsApp
            (opcional).
          </span>
        </label>
      </div>

      {apiError && (
        <p
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {apiError}
        </p>
      )}

      <button
        type="submit"
        className="btn-primary w-full md:w-auto"
        disabled={loading}
      >
        {loading ? "Gravando no PostgreSQL…" : "Concluir cadastro do Dahora Card"}
      </button>
    </form>
  );
}
