import Link from "next/link";
import { brand } from "@/lib/brand";

export function HomeHero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      <div
        className="bg-hero-photo absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=80')",
        }}
        role="img"
        aria-label="Corredor de supermercado com produtos frescos e organizados"
      />
      <div className="bg-hero-glow absolute inset-0" />

      <div className="container-page relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28 md:justify-center md:pb-24 md:pt-20">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-dahora-mint animate-rise">
          Rede de supermercados & atacado
        </p>
        <h1 className="font-display max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl animate-rise">
          {brand.name}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl animate-rise-delay">
          {brand.slogan}
        </p>
        <div className="mt-9 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:flex-wrap animate-rise-delay-2">
          <Link href="/#cadastro" className="btn-primary btn-stack-mobile sm:w-auto">
            Solicitar Dahora Card
          </Link>
          <Link
            href="/area-cliente"
            className="btn-stack-mobile inline-flex min-h-11 items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition hover:bg-white/20 sm:w-auto"
          >
            Área do Cliente
          </Link>
        </div>
      </div>
    </section>
  );
}
