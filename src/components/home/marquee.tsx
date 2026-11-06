import { Sparkles } from "lucide-react";
import { BRANDS_MARQUEE } from "@/lib/site";

export function BrandMarquee() {
  const items = [...BRANDS_MARQUEE, ...BRANDS_MARQUEE];
  return (
    <div className="relative z-10 overflow-hidden border-y border-noir-900/10 bg-noir-950 py-5">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {items.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="inline-flex items-center gap-10"
          >
            <span className="font-display text-2xl italic tracking-wide text-blush-200/90">
              {brand}
            </span>
            <Sparkles size={14} className="text-rose-400" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
