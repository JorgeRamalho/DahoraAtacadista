import { z } from "zod";

export const cadastroSchema = z
  .object({
    nomeCompleto: z.string().min(3, "Informe o nome completo"),
    cpf: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length === 11, "CPF deve ter 11 dígitos"),
    email: z.string().email("E-mail inválido"),
    telefone: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length >= 10 && v.length <= 11, "Telefone inválido"),
    dataNascimento: z.string().min(1, "Informe a data de nascimento"),
    cep: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length === 8, "CEP deve ter 8 dígitos"),
    endereco: z.string().min(3, "Informe o endereço"),
    numero: z.string().min(1, "Informe o número"),
    complemento: z.string().optional(),
    bairro: z.string().min(2, "Informe o bairro"),
    cidade: z.string().min(2, "Informe a cidade"),
    estado: z.string().length(2, "Use a UF com 2 letras"),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirme a senha"),
    aceiteTermos: z.literal(true, {
      errorMap: () => ({ message: "É necessário aceitar os termos" }),
    }),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(1, "Informe a senha"),
});

export const ticketSchema = z.object({
  nome: z.string().min(3, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().optional(),
  assunto: z.string().min(3, "Informe o assunto"),
  mensagem: z.string().min(10, "Descreva sua solicitação com mais detalhes"),
  prioridade: z.enum(["baixa", "normal", "alta"]).default("normal"),
});

export const duvidaSchema = z.object({
  nome: z.string().min(3, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  pergunta: z.string().min(10, "Descreva sua dúvida com mais detalhes"),
});

export type CadastroInput = z.infer<typeof cadastroSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TicketInput = z.infer<typeof ticketSchema>;
export type DuvidaInput = z.infer<typeof duvidaSchema>;
