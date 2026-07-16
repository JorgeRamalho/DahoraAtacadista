import { formatCpf, formatDateBr, formatPhone } from "@/lib/utils/format";

export type DashboardCliente = {
  id: string;
  nomeCompleto: string;
  nomeSocial?: string | null;
  email: string;
  telefone: string;
  telefoneAlternativo?: string | null;
  cpf: string;
  rg?: string | null;
  dataNascimento?: string | null;
  genero?: string | null;
  estadoCivil?: string | null;
  cep?: string | null;
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade: string;
  estado: string;
  comoConheceu?: string | null;
  numeroCartao: string;
  pontos: number;
  status: string;
  aceiteMarketing?: boolean;
  createdAt: string | Date;
};

export type DashboardTicket = {
  id: string;
  protocolo: string;
  assunto: string;
  status: string;
  createdAt: string | Date;
};

export type DashboardDuvida = {
  id: string;
  pergunta: string;
  status: string;
  createdAt: string | Date;
};

export type RewardTier = {
  id: string;
  label: string;
  pontos: number;
  descricao: string;
};

export type OfferItem = {
  id: string;
  titulo: string;
  descricao: string;
  tag: string;
  validade: string;
  pontosBonus?: number;
};

export type Suggestion = {
  id: string;
  titulo: string;
  texto: string;
  href: string;
  cta: string;
  prioridade: number;
};

export const REWARD_TIERS: RewardTier[] = [
  {
    id: "cafe",
    label: "Café da manhã",
    pontos: 150,
    descricao: "Troque por um kit café nas lojas participantes.",
  },
  {
    id: "desconto10",
    label: "R$ 10 em compras",
    pontos: 300,
    descricao: "Vale-desconto para usar no caixa ou no app.",
  },
  {
    id: "cesta",
    label: "Cesta especial",
    pontos: 600,
    descricao: "Seleção de produtos da casa com preço de atacado.",
  },
  {
    id: "experiencia",
    label: "Experiência Club",
    pontos: 1200,
    descricao: "Convite para campanhas e sorteios exclusivos.",
  },
];

export const CURATED_OFFERS: OfferItem[] = [
  {
    id: "hortifruti",
    titulo: "Hortifruti da semana",
    descricao: "Até 25% off em frutas e verduras selecionadas com Dahora Card.",
    tag: "Varejo",
    validade: "Válido até domingo",
    pontosBonus: 20,
  },
  {
    id: "atacado",
    titulo: "Atacado inteligente",
    descricao: "Leve 3 e pague 2 em itens de limpeza e higiene.",
    tag: "Atacado",
    validade: "Enquanto durar o estoque",
    pontosBonus: 40,
  },
  {
    id: "padaria",
    titulo: "Padaria quentinha",
    descricao: "Pães e bolos com 15% de desconto no período da manhã.",
    tag: "Loja",
    validade: "Seg–Sex · 7h–11h",
  },
  {
    id: "club",
    titulo: "Dobro de milhas Club",
    descricao: "Compras acima de R$ 150 geram milhas em dobro no Dahora Club.",
    tag: "Club",
    validade: "Campanha do mês",
    pontosBonus: 50,
  },
];

export function displayName(cliente: DashboardCliente): string {
  const social = cliente.nomeSocial?.trim();
  if (social) return social.split(" ")[0];
  return cliente.nomeCompleto.split(" ")[0] || "cliente";
}

export function greetingByHour(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function nextReward(pontos: number): {
  atual: RewardTier | null;
  proximo: RewardTier;
  progresso: number;
  faltam: number;
} {
  const sorted = [...REWARD_TIERS].sort((a, b) => a.pontos - b.pontos);
  const proximo = sorted.find((t) => t.pontos > pontos) ?? sorted[sorted.length - 1];
  const atual =
    [...sorted].reverse().find((t) => pontos >= t.pontos) ?? null;
  const base = atual?.pontos ?? 0;
  const span = Math.max(proximo.pontos - base, 1);
  const progresso = Math.min(100, Math.round(((pontos - base) / span) * 100));
  const faltam = Math.max(proximo.pontos - pontos, 0);
  return { atual, proximo, progresso, faltam };
}

export function buildSuggestions(
  cliente: DashboardCliente,
  tickets: DashboardTicket[],
  duvidas: DashboardDuvida[]
): Suggestion[] {
  const items: Suggestion[] = [];
  const { faltam, proximo } = nextReward(cliente.pontos);

  if (faltam > 0 && faltam <= 80) {
    items.push({
      id: "quase-premio",
      titulo: `Faltam ${faltam} pontos para ${proximo.label}`,
      texto: "Uma compra na rede esta semana pode liberar sua próxima recompensa.",
      href: "#ofertas",
      cta: "Ver ofertas",
      prioridade: 1,
    });
  } else if (cliente.pontos < 150) {
    items.push({
      id: "comece-pontuar",
      titulo: "Comece a pontuar nas lojas",
      texto: "Informe seu CPF no caixa e transforme cada real em pontos Dahora.",
      href: "/dahora-card",
      cta: "Como funciona",
      prioridade: 1,
    });
  }

  if (!cliente.aceiteMarketing) {
    items.push({
      id: "ofertas-push",
      titulo: "Ative novidades da sua região",
      texto: `Receba ofertas de ${cliente.cidade}/${cliente.estado} e campanhas do Dahora Club.`,
      href: "#perfil",
      cta: "Ver perfil",
      prioridade: 2,
    });
  }

  const abertos = tickets.filter((t) => t.status === "aberto" || t.status === "em_andamento");
  if (abertos.length > 0) {
    items.push({
      id: "ticket-aberto",
      titulo: "Você tem atendimento em andamento",
      texto: `Acompanhe o protocolo ${abertos[0].protocolo} na central de ajuda.`,
      href: "#atendimento",
      cta: "Ver chamados",
      prioridade: 0,
    });
  } else if (tickets.length === 0 && duvidas.length === 0) {
    items.push({
      id: "conheca-sac",
      titulo: "SAC 24h sempre disponível",
      texto: "Dúvidas sobre cartão, pontos ou lojas? Abra um chamado em poucos toques.",
      href: "/sac",
      cta: "Abrir SAC",
      prioridade: 3,
    });
  }

  items.push({
    id: "club",
    titulo: "Explore o Dahora Club",
    texto: "Pontos, milhas e sorteios exclusivos para quem compra na rede.",
    href: "/dahora-club",
    cta: "Conhecer Club",
    prioridade: 4,
  });

  return items.sort((a, b) => a.prioridade - b.prioridade).slice(0, 4);
}

export function formatClienteCpf(cpf: string): string {
  return formatCpf(cpf);
}

export function formatClientePhone(telefone: string): string {
  return formatPhone(telefone);
}

export function formatClienteDesde(createdAt: string | Date): string {
  return formatDateBr(createdAt);
}

/** Validade do cartão no formato MM/AA (5 anos a partir do cadastro). */
export function formatVencimentoCartao(
  createdAt: string | Date,
  validadeAnos = 5
): string {
  const d = typeof createdAt === "string" ? new Date(createdAt) : new Date(createdAt);
  d.setFullYear(d.getFullYear() + validadeAnos);
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = String(d.getFullYear()).slice(-2);
  return `${mes}/${ano}`;
}

export function maskCpf(cpf: string): string {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**`;
}
