"use client";

/**
 * Último recurso: falha no próprio layout raiz.
 * Precisa declarar <html> e <body> por conta própria.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          background: "#fdf8f6",
          color: "#1a1a1a",
        }}
      >
        <div style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 26, margin: 0 }}>Site temporariamente fora</h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#666" }}>
            Estamos resolvendo. Você pode chamar a loja no WhatsApp (43)
            99954-2246 enquanto isso.
          </p>
          {error.digest && (
            <p style={{ fontSize: 11, color: "#999", fontFamily: "monospace" }}>
              {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: 12,
              padding: "12px 24px",
              borderRadius: 999,
              border: 0,
              background: "#1a1a1a",
              color: "#fff",
              fontSize: 12,
              letterSpacing: ".15em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
