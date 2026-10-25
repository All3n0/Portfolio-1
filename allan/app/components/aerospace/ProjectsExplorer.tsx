"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { AeroProject } from "@/lib/content";
import Reveal from "../Reveal";
import TiltCard from "../TiltCard";
import ProjectArt from "./ProjectArt";
import StatusBadge from "./StatusBadge";

export default function ProjectsExplorer({ projects }: { projects: AeroProject[] }) {
  const disciplines = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.disciplines))).sort(),
    [projects]
  );
  const [filter, setFilter] = useState<string | null>(null);
  const shown = filter ? projects.filter((p) => p.disciplines.includes(filter)) : projects;

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-sm border transition-colors ${
      active ? "bg-accent text-on-accent border-accent" : "border-line text-muted hover:text-ink hover:border-line-strong"
    }`;

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter projects by discipline">
        <button className={chip(filter === null)} onClick={() => setFilter(null)} aria-pressed={filter === null}>
          All
        </button>
        {disciplines.map((d) => (
          <button key={d} className={chip(filter === d)} onClick={() => setFilter(d)} aria-pressed={filter === d}>
            {d}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {shown.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 100} className="h-full">
            <TiltCard className="group h-full rounded-xl" max={4}>
              <Link
                href={`/aerospace/projects/${p.slug}`}
                className="flex flex-col h-full rounded-xl border border-line bg-surface overflow-hidden hover:border-accent/60 transition-colors"
              >
                <div className="relative h-44 bg-bg-2 border-b border-line overflow-hidden">
                  <ProjectArt project={p} />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-faint mb-2">{p.disciplines.join(", ")}</p>
                  <h3
                    className="text-2xl font-semibold text-ink mb-2 group-hover:text-accent transition-colors"
                    style={{ fontFamily: "var(--font-aero-display)" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-muted mb-5 leading-relaxed">{p.summary}</p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {p.tools.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-xs rounded bg-surface-2 border border-line text-ink-2">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </>
  );
}
