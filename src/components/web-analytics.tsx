"use client";

import { useEffect } from "react";

/**
 * Vercel Web Analytics — carregamento direto.
 *
 * O pacote @vercel/analytics deveria injetar o script sozinho no cliente,
 * mas no build do Next 16 o efeito não dispara: `window.va` existe (a fila
 * `vaq` é criada no HTML), porém nenhuma requisição para
 * /_vercel/insights/script.js sai — ou seja, nada é medido.
 *
 * Aqui montamos a tag manualmente, que é exatamente o que o pacote faz por
 * dentro. Sem cookie e sem dado pessoal: só caminho, referrer e país
 * (geolocalizado pela Vercel no servidor), por isso não exige banner de LGPD.
 */
export function WebAnalytics() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const src = "/_vercel/insights/script.js";

    // Não duplica se o pacote original resolver injetar.
    if (document.head.querySelector(`script[src*="${src}"]`)) return;

    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.dataset.sdkn = "@vercel/analytics";
    script.dataset.sdkv = "2.0.1-manual";
    document.head.appendChild(script);
  }, []);

  return null;
}
