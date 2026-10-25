/**
 * The AK monogram: the A is a delta-wing aircraft (aerospace), the K is built from
 * "/" and "<" (code). Colours adapt to light and dark mode.
 */
export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="-3 4 70 56"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label="Allan Kiprop"
    >
      <path d="M2 52 L18 10 L34 52 L18 44.5 Z" className="fill-[#0b6bcb] dark:fill-[#4cc3ff]" />
      <path d="M38 54 L48 10 M62 14 L49 32 L62 50" strokeWidth={5} className="stroke-[#ea580c] dark:stroke-[#f97316]" />
    </svg>
  );
}
