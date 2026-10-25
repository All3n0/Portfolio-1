"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Developer / Aerospace switch. Going to the aerospace side from the homepage first morphs the
 * hero particles into an aircraft, then navigates, so the two worlds feel like one site.
 */
export default function WorldSwitch({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAero = pathname.startsWith("/aerospace");
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    router.prefetch(isAero ? "/" : "/aerospace");
  }, [isAero, router]);

  const goAero = (e: React.MouseEvent) => {
    if (isAero) return;
    e.preventDefault();
    const hero = document.getElementById("hero");
    const heroVisible = hero ? hero.getBoundingClientRect().bottom > window.innerHeight * 0.4 : false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!heroVisible || reduced) {
      router.push("/aerospace");
      return;
    }
    setLeaving(true);
    window.dispatchEvent(new CustomEvent("world:morph", { detail: "aero" }));
    window.setTimeout(() => router.push("/aerospace"), 1100);
  };

  const base =
    "relative px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-colors duration-300";
  return (
    <>
      <div
        role="group"
        aria-label="Choose portfolio side"
        className={`inline-flex items-center gap-1 p-1 rounded-lg border border-line bg-surface-2 ${compact ? "" : ""}`}
      >
        <Link
          href="/"
          aria-current={!isAero ? "page" : undefined}
          className={`${base} ${!isAero ? "bg-accent text-on-accent" : "text-muted hover:text-ink"}`}
        >
          Developer
        </Link>
        <Link
          href="/aerospace"
          onClick={goAero}
          aria-current={isAero ? "page" : undefined}
          className={`${base} ${isAero ? "bg-accent text-on-accent" : "text-muted hover:text-ink"}`}
        >
          Aerospace
        </Link>
      </div>
      {leaving && (
        <div
          aria-hidden
          className="fixed inset-0 z-[70] pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, transparent 30%, #050e1a 75%)",
            animation: "veil-in 1.1s ease-in forwards",
          }}
        />
      )}
    </>
  );
}
