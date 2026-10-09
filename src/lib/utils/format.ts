export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, "$1-$2");
}

export function gerarNumeroCartao(): string {
  const bloco = () =>
    Math.floor(1000 + Math.random() * 9000).toString();
  return `DH${bloco()}${bloco()}${bloco()}`;
}

export function gerarProtocolo(): string {
  const agora = Date.now().toString().slice(-8);
  const rand = Math.floor(100 + Math.random() * 900);
  return `SAC-${agora}-${rand}`;
}

export function mascararCartao(numero: string): string {
  if (numero.length < 6) return numero;
  return `${numero.slice(0, 4)} •••• ${numero.slice(-4)}`;
}

export function formatDateBr(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
