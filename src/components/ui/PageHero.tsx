type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="border-b border-dahora-line/80 bg-gradient-to-br from-dahora-mist via-dahora-cream to-dahora-sand">
      <div className="container-page py-14 md:py-20">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-dahora-forest animate-rise">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display max-w-3xl text-4xl font-semibold tracking-tight text-dahora-ink md:text-5xl animate-rise">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-dahora-slate animate-rise-delay">
          {description}
        </p>
      </div>
    </section>
  );
}
