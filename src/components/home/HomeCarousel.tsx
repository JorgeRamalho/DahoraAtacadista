"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HOME_CAROUSEL_SLIDES } from "@/lib/media/carousel-images";

const slides = [...HOME_CAROUSEL_SLIDES];

export function HomeCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = (next: number) => {
    setIndex((next + slides.length) % slides.length);
  };

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      className="relative overflow-hidden bg-dahora-ink"
      aria-roledescription="carousel"
      aria-label="Imagens das lojas Dahora"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) {
          goTo(index + (delta < 0 ? 1 : -1));
        }
        touchStartX.current = null;
      }}
    >
      <div className="relative h-[var(--carousel-height)] w-full">
        {slides.map((slide, i) => (
          <figure
            key={slide.src}
            className={`absolute inset-0 m-0 transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="100vw"
              quality={75}
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1210]/75 via-[#1c1210]/20 to-transparent" />
            <figcaption className="absolute bottom-5 left-0 right-0 px-4 text-center md:bottom-8">
              <span className="inline-block rounded-full bg-black/35 px-4 py-2 text-sm font-medium text-white backdrop-blur-md md:text-base">
                {slide.caption}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <button
        type="button"
        className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55 md:left-5"
        aria-label="Imagem anterior"
        onClick={() => goTo(index - 1)}
      >
        ‹
      </button>
      <button
        type="button"
        className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55 md:right-5"
        aria-label="Próxima imagem"
        onClick={() => goTo(index + 1)}
      >
        ›
      </button>

      <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-2 md:bottom-4">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-7 bg-dahora-amber" : "w-2.5 bg-white/55 hover:bg-white/80"
            }`}
            aria-label={`Ir para slide ${i + 1}: ${slide.caption}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
