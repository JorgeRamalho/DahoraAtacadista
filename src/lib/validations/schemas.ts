import { z } from "zod";
import { isValidCpf } from "@/lib/validations/cpf";

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const cadastroSchema = z
  .object({
    nomeCompleto: z.string().trim().min(3, "Informe o nome completo"),
    nomeSocial: z.preprocess(emptyToUndefined, z.string().trim().min(2).optional()),
    cpf: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length === 11, "CPF deve ter 11 dígitos")
      .refine(isValidCpf, "CPF inválido"),
    rg: z.preprocess(emptyToUndefined, z.string().trim().min(4, "RG inválido").optional()),
    email: z.string().trim().email("E-mail inválido"),
    telefone: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length >= 10 && v.length <= 11, "Telefone inválido"),
    telefoneAlternativo: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .transform((v) => v.replace(/\D/g, ""))
        .refine((v) => v.length >= 10 && v.length <= 11, "Telefone alternativo inválido")
        .optional()
    ),
    dataNascimento: z
      .string()
      .min(1, "Informe a data de nascimento")
      .refine((v) => !Number.isNaN(Date.parse(v)), "Data inválida")
      .refine((v) => {
        const birth = new Date(v);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
        return age >= 18;
      }, "É necessário ter 18 anos ou mais"),
    genero: z.preprocess(
      emptyToUndefined,
      z.enum(["feminino", "masculino", "outro", "prefiro_nao_informar"]).optional()
    ),
    estadoCivil: z.preprocess(
      emptyToUndefined,
      z
        .enum(["solteiro", "casado", "uniao_estavel", "divorciado", "viuvo", "outro"])
        .optional()
    ),
    cep: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length === 8, "CEP deve ter 8 dígitos"),
    endereco: z.string().trim().min(3, "Informe o endereço"),
    numero: z.string().trim().min(1, "Informe o número"),
    complemento: z.preprocess(emptyToUndefined, z.string().trim().optional()),
    bairro: z.string().trim().min(2, "Informe o bairro"),
    cidade: z.string().trim().min(2, "Informe a cidade"),
    estado: z
      .string()
      .trim()
      .length(2, "Use a UF com 2 letras")
      .transform((v) => v.toUpperCase()),
    comoConheceu: z.preprocess(
      emptyToUndefined,
      z
        .enum(["loja", "indicacao", "redes_sociais", "google", "anuncio", "outro"])
        .optional()
    ),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirme a senha"),
    aceiteTermos: z.literal(true, {
      errorMap: () => ({ message: "É necessário aceitar os termos e a LGPD" }),
    }),
    aceiteMarketing: z.boolean().optional().default(false),
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
