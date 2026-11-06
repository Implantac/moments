import { Star } from "lucide-react";
import { cx } from "@/lib/format";

export function RatingStars({
  rating,
  size = 14,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const stars = [0, 1, 2, 3, 4];
  return (
    <span
      className={cx("relative inline-flex align-middle", className)}
      aria-label={`Avaliação ${rating.toFixed(1)} de 5`}
    >
      <span className="flex gap-0.5 text-rose-300">
        {stars.map((i) => (
          <Star key={i} size={size} strokeWidth={2} className="fill-none" />
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-gold-500"
        style={{ width: `${pct}%` }}
      >
        {stars.map((i) => (
          <Star
            key={i}
            size={size}
            strokeWidth={0}
            className="shrink-0 fill-current"
          />
        ))}
      </span>
    </span>
  );
}
