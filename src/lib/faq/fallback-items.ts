/** FAQ embutido — usado quando o PostgreSQL não está disponível (dev local, build). */
export type FaqListItem = {
  id: string;
  pergunta: string;
  resposta: string;
  categoria: string;
};

export const FAQ_FALLBACK_ITEMS: FaqListItem[] = [
  {
    id: "fallback-1",
    categoria: "Cartão",
    pergunta: "O que é o Dahora Card?",
    resposta:
      "O Dahora Card é o cartão de vantagens exclusivo da rede Dahora. Com ele você acumula pontos em todas as compras, acessa ofertas exclusivas de atacado e varejo, e participa de campanhas especiais para clientes cadastrados.",
  },
  {
    id: "fallback-2",
    categoria: "Cartão",
    pergunta: "Como faço para solicitar o Dahora Card?",
    resposta:
      "Basta preencher o formulário de cadastro no site, com seus dados pessoais e de endereço. Após a análise, você recebe o número do cartão digital na Área do Cliente e pode começar a pontuar imediatamente nas lojas físicas e no e-commerce.",
  },
  {
    id: "fallback-3",
    categoria: "Cartão",
    pergunta: "Quanto tempo leva para o cartão ser aprovado?",
    resposta:
      "A aprovação é automática na maioria dos casos. Assim que o cadastro é concluído com sucesso, o cartão digital fica disponível na Área do Cliente. Em caso de inconsistência de dados, nossa equipe entra em contato em até 48 horas úteis.",
  },
  {
    id: "fallback-4",
    categoria: "Pontos",
    pergunta: "Como funcionam os pontos do Dahora Card?",
    resposta:
      "A cada R$ 1,00 em compras você acumula 1 ponto. Pontos podem ser trocados por descontos, produtos selecionados e experiências exclusivas. O saldo atualizado fica sempre disponível na Área do Cliente.",
  },
  {
    id: "fallback-5",
    categoria: "Lojas",
    pergunta: "Posso usar o cartão em todas as lojas Dahora?",
    resposta:
      "Sim. O Dahora Card é válido em toda a rede — supermercados e atacados — e também nas compras online. Basta informar o CPF no caixa ou estar logado na Área do Cliente.",
  },
  {
    id: "fallback-6",
    categoria: "Conta",
    pergunta: "Como acesso a Área do Cliente?",
    resposta:
      "Use o e-mail e a senha cadastrados no formulário do Dahora Card. Em caso de esquecimento, utilize a opção de recuperação de acesso ou fale com o SAC 24 horas.",
  },
  {
    id: "fallback-7",
    categoria: "SAC",
    pergunta: "O SAC funciona mesmo à noite e nos fins de semana?",
    resposta:
      "Sim. Nosso Suporte ao Cliente (SAC) opera 24 horas por dia, 7 dias por semana, por telefone, formulário no site e e-mail. Protocolos são gerados automaticamente para acompanhamento.",
  },
  {
    id: "fallback-8",
    categoria: "SAC",
    pergunta: "Como acompanho uma solicitação aberta no SAC?",
    resposta:
      "Ao abrir um chamado, você recebe um número de protocolo. Clientes cadastrados também visualizam o histórico de tickets na Área do Cliente.",
  },
  {
    id: "fallback-9",
    categoria: "Cadastro",
    pergunta: "Quais documentos preciso para o cadastro?",
    resposta:
      "CPF válido, e-mail ativo, telefone para contato e endereço completo com CEP. Os dados são protegidos conforme a LGPD e usados apenas para gestão do cartão e atendimento.",
  },
  {
    id: "fallback-10",
    categoria: "Conta",
    pergunta: "Posso alterar meus dados depois do cadastro?",
    resposta:
      "Sim. Após o login na Área do Cliente, você pode atualizar telefone, e-mail e endereço. Alterações de CPF ou nome completo exigem validação pelo SAC por segurança.",
  },
];
