import Link from "next/link";
import { cx } from "@/lib/format";

/** Original Eiffel silhouette: tapered spire, two decks and an open arch. */
export const EIFFEL_PATH =
  "M40 3H41.25L41.7 17L43 31L45.1 45.4H48.5V47.7H45.6L49.6 64.5H53V67H50.35L56.1 85C58.7 93.3 64.2 99.4 71 102V105H52.5C51.9 95.8 47.7 89.6 40 89.6C32.3 89.6 28.1 95.8 27.5 105H9V102C15.8 99.4 21.3 93.3 23.9 85L29.65 67H27V64.5H30.4L34.4 47.7H31.5V45.4H34.9L37 31L38.3 17ZM40 31L37.15 44H42.85ZM36.55 50L33.5 63H46.5L43.45 50Z";

/** Bespoke geometric lettering, independent of web-font loading. */
const MOMENTS_PATH = [
  "M0 28V0L15 20L30 0V28",
  "M56 0C47.4 0 42 5.5 42 14C42 22.5 47.4 28 56 28C64.6 28 70 22.5 70 14C70 5.5 64.6 0 56 0Z",
  "M82 28V0L97 20L112 0V28",
  "M147 0H124V28H147M124 13.5H143",
  "M159 28V0L186 28V0",
  "M198 0H224M211 0V28",
  "M259 3C256.5 0.8 252.8 0 248.5 0C241.5 0 237 3.2 237 8C237 13 241.7 14 248 15.4C254.7 17 260 18.2 260 22.4C260 26.2 255.3 28 248.7 28C243.7 28 239.3 26.8 236 24.4",
].join(" ");

const PARIS_PATH = [
  "M0 11V0H4.6C7.5 0 9 1.2 9 3.4C9 5.6 7.5 6.8 4.6 6.8H0",
  "M18 11L23 0L28 11M20.1 6.8H25.9",
  "M36 11V0H40.6C43.5 0 45 1.2 45 3.4C45 5.6 43.5 6.8 40.6 6.8H36M40.5 6.8L46 11",
  "M54 0V11",
  "M73 1.3C71.5 0.4 69.8 0 68 0C64.9 0 63 1.3 63 3.2C63 5.1 65 5.7 68 6.2C71 6.7 73 7.3 73 8.8C73 10.3 71.1 11 68.2 11C66 11 64.1 10.5 62.7 9.6",
].join(" ");

export function EiffelMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 112"
      fill="currentColor"
      className={cx("h-10 w-7", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d={EIFFEL_PATH} fillRule="evenodd" />
    </svg>
  );
}

function LogoArtwork({ light }: { light: boolean }) {
  const accentClass = cx(
    "transition-colors duration-500",
    light
      ? "text-rose-300 group-hover:text-rose-200"
      : "text-rose-600 group-hover:text-rose-500",
  );

  return (
    <svg
      viewBox="0 0 280 114"
      fill="none"
      className="moments-logo-art block h-auto w-full overflow-visible"
      aria-hidden="true"
      focusable="false"
    >
      <g className={cx("moments-logo-tower", accentClass)} fill="currentColor">
        <g transform="translate(124 0) scale(.4)">
          <path d={EIFFEL_PATH} fillRule="evenodd" />
        </g>
      </g>
      <g
        transform="translate(10 54)"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        <path d={MOMENTS_PATH} />
      </g>
      <g
        className={cx("moments-logo-details", accentClass)}
        stroke="currentColor"
      >
        <path
          d="M46 102.5H88M192 102.5H234"
          strokeWidth="0.85"
          strokeLinecap="round"
        />
        <g
          transform="translate(103.5 96) scale(1 1.15)"
          strokeWidth="1.25"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          <path d={PARIS_PATH} />
        </g>
      </g>
    </svg>
  );
}

export function Logo({
  light = false,
  compact = false,
  size = "navigation",
  className,
}: {
  light?: boolean;
  compact?: boolean;
  size?: "navigation" | "signature";
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cx(
        "moments-logo group inline-flex shrink-0 items-center justify-center rounded-sm transition-colors duration-500",
        "focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-rose-500",
        light ? "text-ivory" : "text-noir-900",
        compact
          ? "p-1"
          : size === "signature"
            ? "w-[216px] sm:w-[240px]"
            : "w-[144px] min-[380px]:w-[156px] sm:w-[172px]",
        className,
      )}
      aria-label="Moments Paris — página inicial"
    >
      {compact ? (
        <EiffelMark
          className={cx(
            "moments-logo-tower h-11 w-8",
            light ? "text-rose-300" : "text-rose-600",
          )}
        />
      ) : (
        <LogoArtwork light={light} />
      )}
    </Link>
  );
}
