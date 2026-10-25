import Link from "next/link";
import { getSimulations } from "@/lib/content";
import Reveal from "./Reveal";
import SimThumb from "./aerospace/SimThumb";

/**
 * A band on the developer homepage that previews the aerospace side.
 * It sets data-world="aero" locally, so it renders in the blue theme inside the orange site.
 */
export default function AerospaceTeaser() {
  const sims = getSimulations();
  return (
    <section data-world="aero" className="relative py-20 px-6 bg-bg border-y border-line overflow-hidden" style={{ fontFamily: "var(--font-aero)" }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-12 items-center">
        <Reveal>
          <p className="text-accent font-medium mb-3">The other half of my work</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-ink mb-5 leading-tight" style={{ fontFamily: "var(--font-aero-display)" }}>
            I also build things that fly.
          </h2>
          <p className="text-muted text-lg mb-8 max-w-md">
            Aerospace engineering projects and interactive simulations of airfoils, rockets, orbits and wing structures, all running in your browser.
          </p>
          <Link
            href="/aerospace"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-on-accent font-medium hover:bg-accent-strong transition-colors"
          >
            Explore the aerospace side
          </Link>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-4">
          {sims.map((sim, i) => (
            <Reveal key={sim.slug} delay={i * 90}>
              <Link
                href={`/aerospace/simulations/${sim.slug}`}
                className="group block h-full p-5 rounded-xl bg-surface border border-line hover:border-accent/60 transition-colors"
              >
                <div className="h-20 mb-4 text-accent">
                  <SimThumb kind={sim.thumbnail} />
                </div>
                <p className="text-xs text-faint mb-1">{sim.discipline}</p>
                <p className="font-semibold text-ink group-hover:text-accent transition-colors">{sim.title}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
