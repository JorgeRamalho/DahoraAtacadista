import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SacForm } from "@/components/sac/SacForm";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "SAC 24 horas",
  description:
    "Suporte ao Cliente Dahora disponível 24 horas: abra um chamado e receba protocolo automático.",
};

export default function SacPage() {
  return (
    <>
      <PageHero
        eyebrow="Suporte ao Cliente"
        title="SAC 24 horas"
        description="Estamos disponíveis todos os dias, a qualquer hora. Abra um chamado pelo formulário ou fale conosco pelos canais oficiais."
      />
      <section className="section-pad !pt-10">
        <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_0.8fr] lg:items-start">
          <SacForm />
          <aside className="space-y-4">
            <div className="card-surface rounded-3xl p-6">
              <h2 className="font-display text-xl font-semibold">Canais diretos</h2>
              <ul className="mt-4 space-y-3 text-sm text-dahora-slate">
                <li>
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-dahora-forest">
                    Telefone
                  </span>
                  {brand.supportPhone}
                </li>
                <li>
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-dahora-forest">
                    E-mail
                  </span>
                  {brand.supportEmail}
                </li>
                <li>
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-dahora-forest">
                    Horário
                  </span>
                  {brand.hours}
                </li>
              </ul>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-dahora-forest to-dahora-leaf p-6 text-white">
              <h2 className="font-display text-xl font-semibold">Já é cliente?</h2>
              <p className="mt-2 text-sm text-white/85">
                Faça login na Área do Cliente para vincular o chamado à sua conta e
                acompanhar o status.
              </p>
              <Link href="/area-cliente" className="btn-primary mt-5 !bg-white !text-dahora-forest !shadow-none">
                Área do Cliente
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
