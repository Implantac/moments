import Link from "next/link";
import { cx } from "@/lib/format";

/**
 * Marca da Torre Eiffel em traço fino, dois tons:
 * estrutura em currentColor (rosa) e arco + antena em dourado.
 */
export function EiffelMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 72"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* antenna + beacon */}
      <circle cx="24" cy="2.4" r="1.8" fill="currentColor" stroke="none" className="text-gold-400" />
      <path d="M24 4.5V9" stroke="currentColor" strokeWidth="2" className="text-gold-500" />

      {/* spire */}
      <path d="M24 9 20.4 30M24 9l3.6 21" stroke="currentColor" strokeWidth="2.2" />
      <path d="M22.4 19.5h3.2" stroke="currentColor" strokeWidth="1.4" opacity={0.65} />

      {/* first platform */}
      <path d="M16.5 30h15" stroke="currentColor" strokeWidth="3.2" />

      {/* mid section */}
      <path d="M20.4 30 18.6 47M27.6 30l1.8 17" stroke="currentColor" strokeWidth="2.2" />
      <path d="M21.5 38.5h5" stroke="currentColor" strokeWidth="1.4" opacity={0.65} />

      {/* second platform */}
      <path d="M15 47h18" stroke="currentColor" strokeWidth="3.2" />

      {/* legs */}
      <path d="M18.6 47 8.5 67M29.4 47 39.5 67" stroke="currentColor" strokeWidth="2.4" />
      <path d="M21.6 47 17.2 67M26.4 47l4.4 20" stroke="currentColor" strokeWidth="1.5" opacity={0.55} />

      {/* the famous arch — gold */}
      <path
        d="M13.8 67c2.8-7.6 29.6-7.6 32.4 0"
        strokeWidth="2.6"
        stroke="currentColor"
        className="text-gold-500"
      />

      {/* base */}
      <path d="M6.5 69.5h35" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export function Logo({
  light = false,
  compact = false,
  tagline = false,
}: {
  light?: boolean;
  compact?: boolean;
  tagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3"
      aria-label="Moments Paris — página inicial"
    >
      <span className="relative inline-flex">
        <EiffelMark
          className={cx(
            "h-9 w-9 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-[4deg]",
            light ? "text-rose-300" : "text-rose-500",
          )}
        />
        {/* soft glow behind the mark on hover */}
        <span
          aria-hidden
          className={cx(
            "pointer-events-none absolute inset-0 -z-10 rounded-full blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            light ? "bg-rose-400/30" : "bg-rose-300/40",
          )}
        />
      </span>

      {!compact && (
        <span
          className={cx(
            "font-display leading-none",
            light ? "text-ivory" : "text-noir-900",
          )}
        >
          <span className="block text-[1.4rem] font-medium tracking-[0.3em]">
            MOMENTS
          </span>
          <span
            className={cx(
              "mt-2 flex items-center gap-2 text-[10px] font-medium tracking-[0.55em]",
              light ? "text-rose-300" : "text-rose-600",
            )}
          >
            <span className="h-px w-5 bg-current opacity-70 transition-all duration-500 group-hover:w-8" />
            PARIS
            <span className="h-px w-5 bg-current opacity-70 transition-all duration-500 group-hover:w-8" />
          </span>
          {tagline && (
            <span
              className={cx(
                "mt-2 block text-[8px] uppercase tracking-[0.4em]",
                light ? "text-ivory/40" : "text-noir-900/40",
              )}
            >
              Perfumes Importados
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
