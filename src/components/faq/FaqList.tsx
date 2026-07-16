"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type FaqItem = {
  id: string;
  pergunta: string;
  resposta: string;
  categoria: string;
};

export function FaqList({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const categorias = useMemo(
    () => ["Todas", ...Array.from(new Set(items.map((i) => i.categoria)))],
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchCat = categoria === "Todas" || item.categoria === categoria;
      const matchQ =
        !q ||
        item.pergunta.toLowerCase().includes(q) ||
        item.resposta.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [items, query, categoria]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="sr-only" htmlFor="faq-busca">
          Buscar no FAQ
        </label>
        <input
          id="faq-busca"
          className="input-field md:flex-1"
          placeholder="Buscar pergunta ou resposta…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className="sr-only" htmlFor="faq-categoria">
          Filtrar categoria
        </label>
        <select
          id="faq-categoria"
          className="input-field md:w-52"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-dahora-mist px-5 py-8 text-center text-dahora-slate">
          Nenhuma pergunta encontrada. Tente outro termo ou{" "}
          <Link href="/tire-sua-duvida" className="font-semibold text-dahora-forest underline">
            envie sua dúvida
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((item) => {
            const open = openId === item.id;
            return (
              <li key={item.id} className="card-surface overflow-hidden rounded-2xl">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : item.id)}
                >
                  <span>
                    <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-dahora-leaf">
                      {item.categoria}
                    </span>
                    <span className="font-display text-lg font-semibold text-dahora-ink">
                      {item.pergunta}
                    </span>
                  </span>
                  <span
                    className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-dahora-mist text-dahora-forest transition ${
                      open ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {open && (
                  <div className="border-t border-dahora-line px-5 py-4 text-dahora-slate leading-relaxed">
                    {item.resposta}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
