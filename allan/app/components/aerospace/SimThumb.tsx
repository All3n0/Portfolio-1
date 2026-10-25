/** Small line drawings that identify each simulation. Stroke uses currentColor. */
export default function SimThumb({ kind }: { kind: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (kind === "airfoil") {
    return (
      <svg viewBox="0 0 200 80" className="w-full h-full" aria-hidden>
        <path {...common} d="M20 44 C 40 18, 90 14, 180 40 C 110 46, 50 52, 20 44 Z" />
        <path {...common} strokeOpacity={0.35} d="M5 30 C 40 22, 100 20, 195 30" />
        <path {...common} strokeOpacity={0.35} d="M5 58 C 60 60, 120 56, 195 48" />
        <path {...common} strokeOpacity={0.6} d="M30 34 l0 -12 M55 27 l0 -14 M85 24 l0 -12 M120 27 l0 -8" />
      </svg>
    );
  }
  if (kind === "rocket") {
    return (
      <svg viewBox="0 0 200 80" className="w-full h-full" aria-hidden>
        <path {...common} strokeOpacity={0.35} d="M10 72 L190 72" />
        <path {...common} d="M20 72 C 60 -6, 120 -6, 170 72" />
        <circle cx="95" cy="13" r="3" fill="currentColor" />
        <path {...common} strokeOpacity={0.5} strokeDasharray="3 4" d="M95 18 L95 72" />
      </svg>
    );
  }
  if (kind === "orbit") {
    return (
      <svg viewBox="0 0 200 80" className="w-full h-full" aria-hidden>
        <circle cx="70" cy="40" r="10" {...common} />
        <circle cx="70" cy="40" r="20" {...common} strokeOpacity={0.4} />
        <ellipse cx="105" cy="40" rx="55" ry="34" {...common} strokeDasharray="4 4" />
        <circle cx="160" cy="40" r="3" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "spar") {
    return (
      <svg viewBox="0 0 200 80" className="w-full h-full" aria-hidden>
        <path {...common} strokeWidth={3} d="M18 20 L18 64" />
        <path {...common} d="M20 46 C 80 46, 140 40, 185 26" />
        <path {...common} strokeOpacity={0.35} d="M20 46 L185 46" />
        <path {...common} strokeOpacity={0.6} d="M40 60 l0 -10 M80 60 l0 -11 M120 58 l0 -12 M160 54 l0 -14" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full" aria-hidden>
      <path {...common} d="M10 60 L60 30 L110 45 L190 15" />
    </svg>
  );
}
