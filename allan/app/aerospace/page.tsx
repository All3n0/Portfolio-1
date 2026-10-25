import Link from "next/link";
import { getAeroProjects, getSimulations } from "@/lib/content";
import { aeroProfile, focusAreas, SHOW_PLANNED_PROJECTS, toolchain } from "@/content/aerospace/profile";
import AeroHero from "../components/aerospace/AeroHero";
import ProjectsExplorer from "../components/aerospace/ProjectsExplorer";
import SimThumb from "../components/aerospace/SimThumb";
import Contact from "../components/Contact";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";

function SectionHeading({ id, title, lead }: { id?: string; title: string; lead: string }) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <h2 id={id} className="text-4xl md:text-5xl font-semibold text-ink mb-4" style={{ fontFamily: "var(--font-aero-display)" }}>
        {title}
      </h2>
      <p className="text-lg text-muted leading-relaxed">{lead}</p>
    </Reveal>
  );
}

export default function AerospacePage() {
  const simulations = getSimulations();
  const projects = getAeroProjects().filter((p) => SHOW_PLANNED_PROJECTS || p.status !== "planned");

  return (
    <main>
      <AeroHero {...aeroProfile} />

      {/* Disciplines */}
      <section className="py-24 px-6 border-t border-line">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="Disciplines" lead="Where I focus, and the tools I use for each." />
          <div className="border-t border-line">
            {focusAreas.map((f, i) => (
              <Reveal key={f.name} delay={i * 60}>
                <div className="grid md:grid-cols-[220px_1fr_auto] gap-3 md:gap-10 py-6 border-b border-line items-baseline group">
                  <h3 className="text-2xl font-semibold text-ink group-hover:text-accent transition-colors" style={{ fontFamily: "var(--font-aero-display)" }}>
                    {f.name}
                  </h3>
                  <p className="text-muted leading-relaxed max-w-xl">{f.description}</p>
                  <p className="text-sm text-ink-2 md:text-right">{f.tools.join(", ")}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Simulations */}
      <section id="simulations" className="py-24 px-6 bg-bg-2 border-y border-line scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Simulations"
            lead="Engineering models that run in your browser. Each one states its method, how it was validated, and where it stops being accurate."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {simulations.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 2) * 100} className="h-full">
                <TiltCard className="group h-full rounded-xl" max={4}>
                  <Link
                    href={`/aerospace/simulations/${s.slug}`}
                    className="flex flex-col h-full p-7 rounded-xl border border-line bg-surface hover:border-accent/60 transition-colors"
                  >
                    <div className="h-28 mb-6 text-accent">
                      <SimThumb kind={s.thumbnail} />
                    </div>
                    <p className="text-sm text-accent mb-2">{s.discipline}</p>
                    <h3 className="text-3xl font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-aero-display)" }}>
                      {s.title}
                    </h3>
                    <p className="text-muted leading-relaxed mb-6">{s.summary}</p>
                    <dl className="mt-auto grid gap-3 text-sm border-t border-line pt-5">
                      <div>
                        <dt className="text-faint">Method</dt>
                        <dd className="text-ink-2">{s.method}</dd>
                      </div>
                      <div>
                        <dt className="text-faint">Validated against</dt>
                        <dd className="text-ink-2">{s.validation}</dd>
                      </div>
                    </dl>
                    <span className="mt-6 text-sm font-medium text-accent group-hover:underline underline-offset-4">Open simulation</span>
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Projects"
            lead="Hands-on engineering work. Each project page covers the objective, my role, the approach, how results were validated, and what I learned."
          />
          <ProjectsExplorer projects={projects} />
        </div>
      </section>

      {/* Toolchain */}
      <section className="py-20 px-6 border-t border-line bg-bg-2">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_2fr] gap-10">
          <Reveal>
            <h2 className="text-4xl font-semibold text-ink" style={{ fontFamily: "var(--font-aero-display)" }}>
              Toolchain
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-8">
            {toolchain.map((g, i) => (
              <Reveal key={g.group} delay={i * 80}>
                <h3 className="text-sm font-semibold text-ink mb-3">{g.group}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full text-sm border border-line bg-surface text-ink-2">
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </main>
  );
}
