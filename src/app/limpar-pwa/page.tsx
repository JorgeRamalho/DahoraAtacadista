"use client";

import { useState } from "react";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { PWA_CACHE_PREFIX, PWA_PORT, PWA_SW_PATH } from "@/lib/pwa/identity";

export default function LimparPwaPage() {
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const push = (line: string) => setLog((prev) => [...prev, line]);

  const purge = async () => {
    setLog([]);
    setDone(false);

    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          const url =
            reg.active?.scriptURL ||
            reg.waiting?.scriptURL ||
            reg.installing?.scriptURL ||
            "(sem script)";
          await reg.unregister();
          push(`SW removido: ${url}`);
        }
        if (regs.length === 0) push("Nenhum service worker encontrado.");
      }

      if ("caches" in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
          push(`Cache removido: ${key}`);
        }
        if (keys.length === 0) push("Nenhum cache encontrado.");
      }

      push(`Pronto. O SW correto do Dahora é ${PWA_SW_PATH}.`);
      push(`Use sempre a porta ${PWA_PORT} (não a 3000 do Carona).`);
      setDone(true);
    } catch (error) {
      push(`Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="container-page section-pad max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dahora-forest">
        Manutenção PWA
      </p>
      <h1 className="font-display mt-3 text-3xl font-semibold text-dahora-ink">
        Limpar confusão entre apps
      </h1>
      <p className="mt-3 text-dahora-slate leading-relaxed">
        O Chrome misturava <strong>Carona</strong>, <strong>Trampolim</strong> e{" "}
        <strong>{brand.fullName}</strong> porque os três rodavam em{" "}
        <code className="rounded bg-dahora-mist px-1">localhost:3000</code> com o
        mesmo <code className="rounded bg-dahora-mist px-1">/sw.js</code>.
      </p>
      <p className="mt-2 text-dahora-slate leading-relaxed">
        Agora o Dahora usa a porta <strong>{PWA_PORT}</strong> e arquivos exclusivos.
        Use este botão para limpar resíduos neste origin e depois reinstale o app.
      </p>

      <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-dahora-slate">
        <li>
          Abra <code className="rounded bg-dahora-mist px-1">chrome://apps</code> e
          remova Carona, Trampolim e qualquer Dahora antigo.
        </li>
        <li>Clique em «Limpar agora» abaixo.</li>
        <li>
          Acesse{" "}
          <Link className="text-dahora-forest underline" href="/">
            http://localhost:{PWA_PORT}
          </Link>{" "}
          e instale de novo pelo ícone ⊕ da barra de endereço.
        </li>
      </ol>

      <button type="button" className="btn-primary mt-6" onClick={() => void purge()}>
        Limpar agora
      </button>

      {log.length > 0 && (
        <pre className="mt-4 overflow-x-auto rounded-xl border border-dahora-line bg-white p-4 text-xs text-dahora-ink">
          {log.join("\n")}
        </pre>
      )}

      {done && (
        <p className="mt-4 text-sm font-medium text-dahora-forest">
          Limpeza concluída. Prefixo de cache válido: {PWA_CACHE_PREFIX}*
        </p>
      )}
    </div>
  );
}
