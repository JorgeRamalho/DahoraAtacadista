import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CadastroForm } from "@/components/card/CadastroForm";

export const metadata: Metadata = {
  title: "Cadastro Dahora Card",
  description:
    "Preencha o formulário completo para solicitar o Dahora Card e acessar a Área do Cliente.",
};

export default function CadastroPage() {
  return (
    <>
      <PageHero
        eyebrow="Solicitação"
        title="Cadastro do Dahora Card"
        description="Informe seus dados pessoais, endereço e crie a senha de acesso. Os dados alimentam o banco da Área do Cliente com segurança."
      />
      <section className="section-pad !pt-10">
        <div className="container-page max-w-3xl">
          <CadastroForm />
        </div>
      </section>
    </>
  );
}
