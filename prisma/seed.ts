import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const faqs = [
  {
    pergunta: "O que é o Dahora Card?",
    resposta:
      "O Dahora Card é o cartão de vantagens exclusivo da rede Dahora. Com ele você acumula pontos em todas as compras, acessa ofertas exclusivas de atacado e varejo, e participa de campanhas especiais para clientes cadastrados.",
    categoria: "Cartão",
    ordem: 1,
  },
  {
    pergunta: "Como faço para solicitar o Dahora Card?",
    resposta:
      "Basta preencher o formulário de cadastro no site, com seus dados pessoais e de endereço. Após a análise, você recebe o número do cartão digital na Área do Cliente e pode começar a pontuar imediatamente nas lojas físicas e no e-commerce.",
    categoria: "Cartão",
    ordem: 2,
  },
  {
    pergunta: "Quanto tempo leva para o cartão ser aprovado?",
    resposta:
      "A aprovação é automática na maioria dos casos. Assim que o cadastro é concluído com sucesso, o cartão digital fica disponível na Área do Cliente. Em caso de inconsistência de dados, nossa equipe entra em contato em até 48 horas úteis.",
    categoria: "Cartão",
    ordem: 3,
  },
  {
    pergunta: "Como funcionam os pontos do Dahora Card?",
    resposta:
      "A cada R$ 1,00 em compras você acumula 1 ponto. Pontos podem ser trocados por descontos, produtos selecionados e experiências exclusivas. O saldo atualizado fica sempre disponível na Área do Cliente.",
    categoria: "Pontos",
    ordem: 4,
  },
  {
    pergunta: "Posso usar o cartão em todas as lojas Dahora?",
    resposta:
      "Sim. O Dahora Card é válido em toda a rede — supermercados e atacados — e também nas compras online. Basta informar o CPF no caixa ou estar logado na Área do Cliente.",
    categoria: "Lojas",
    ordem: 5,
  },
  {
    pergunta: "Como acesso a Área do Cliente?",
    resposta:
      "Use o e-mail e a senha cadastrados no formulário do Dahora Card. Em caso de esquecimento, utilize a opção de recuperação de acesso ou fale com o SAC 24 horas.",
    categoria: "Conta",
    ordem: 6,
  },
  {
    pergunta: "O SAC funciona mesmo à noite e nos fins de semana?",
    resposta:
      "Sim. Nosso Suporte ao Cliente (SAC) opera 24 horas por dia, 7 dias por semana, por telefone, formulário no site e e-mail. Protocolos são gerados automaticamente para acompanhamento.",
    categoria: "SAC",
    ordem: 7,
  },
  {
    pergunta: "Como acompanho uma solicitação aberta no SAC?",
    resposta:
      "Ao abrir um chamado, você recebe um número de protocolo. Clientes cadastrados também visualizam o histórico de tickets na Área do Cliente.",
    categoria: "SAC",
    ordem: 8,
  },
  {
    pergunta: "Quais documentos preciso para o cadastro?",
    resposta:
      "CPF válido, e-mail ativo, telefone para contato e endereço completo com CEP. Os dados são protegidos conforme a LGPD e usados apenas para gestão do cartão e atendimento.",
    categoria: "Cadastro",
    ordem: 9,
  },
  {
    pergunta: "Posso alterar meus dados depois do cadastro?",
    resposta:
      "Sim. Após o login na Área do Cliente, você pode atualizar telefone, e-mail e endereço. Alterações de CPF ou nome completo exigem validação pelo SAC por segurança.",
    categoria: "Conta",
    ordem: 10,
  },
];

async function main() {
  await prisma.faq.deleteMany();
  for (const faq of faqs) {
    await prisma.faq.create({ data: faq });
  }
  console.log(`Seed concluído: ${faqs.length} FAQs inseridas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
