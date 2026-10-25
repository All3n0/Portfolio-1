"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HeroParticles } from "../three/Lazy";

type Props = {
  name: string;
  title: string;
  intro: string;
  readouts: { label: string; value: string }[];
};

export default function AeroHero({ name, title, intro, readouts }: Props) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(t);
  }, []);
  const enter = `transition-all duration-1000 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`;
  const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center overflow-hidden bg-bg">
      {/* Blueprint grid */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 70% at 60% 45%, black 40%, transparent 100%)",
        }}
      />
      {/* 3D aircraft with airflow: right side on desktop, behind content on mobile */}
      <HeroParticles
        variant="aero"
        className="absolute inset-0 lg:left-[40%] opacity-40 lg:opacity-100"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-28 pb-16">
        <div className="max-w-xl">
          <p className={`text-accent font-medium mb-4 ${enter}`} style={delay(0)}>{title}</p>
          <h1
            className={`text-6xl sm:text-7xl lg:text-8xl font-semibold leading-[0.9] text-ink mb-6 ${enter}`} style={{ ...delay(120), fontFamily: "var(--font-aero-display)" }}
          >
            {name}
          </h1>
          <p className={`text-lg text-muted leading-relaxed mb-10 max-w-md ${enter}`} style={delay(240)}>{intro}</p>
          <div className={`flex flex-wrap gap-3 mb-14 ${enter}`} style={delay(360)}>
            <Link
              href="#simulations"
              className="px-6 py-3 rounded-lg bg-accent text-on-accent font-medium hover:bg-accent-strong transition-colors"
            >
              Run a simulation
            </Link>
            <Link
              href="#projects"
              className="px-6 py-3 rounded-lg border border-line-strong text-ink-2 bg-bg/40 backdrop-blur-sm hover:border-accent hover:text-ink transition-colors"
            >
              See projects
            </Link>
          </div>
          <dl className={`grid grid-cols-3 max-w-md border border-line rounded-lg bg-surface/60 backdrop-blur-sm divide-x divide-line ${enter}`} style={delay(480)}>
            {readouts.map((r) => (
              <div key={r.label} className="px-4 py-3">
                <dt className="text-xs text-faint mb-1">{r.label}</dt>
                <dd className="text-ink tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
