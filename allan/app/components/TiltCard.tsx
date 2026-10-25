"use client";
import { useRef, type ReactNode } from "react";

/**
 * Subtle 3D tilt that follows the pointer. Pure CSS transforms, updated at most once per frame,
 * and skipped for touch input and reduced-motion visitors.
 */
export default function TiltCard({
  children,
  className = "",
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-6px)`;
      el.style.setProperty("--glare-x", `${(x + 0.5) * 100}%`);
      el.style.setProperty("--glare-y", `${(y + 0.5) * 100}%`);
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d] ${className}`}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 hover-glare transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(400px circle at var(--glare-x, 50%) var(--glare-y, 50%), var(--accent-soft), transparent 45%)",
        }}
      />
    </div>
  );
}
