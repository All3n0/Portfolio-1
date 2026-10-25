import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAeroProject, getAeroProjects, getSimulation } from "@/lib/content";
import ProjectArt from "../../../components/aerospace/ProjectArt";
import StatusBadge from "../../../components/aerospace/StatusBadge";
import { ModelViewer } from "../../../components/three/Lazy";

export function generateStaticParams() {
  return getAeroProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getAeroProject(slug);
  return p ? { title: `${p.title} | Allan Kiprop`, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getAeroProject(slug);
  if (!project) notFound();
  const all = getAeroProjects();
  const idx = all.findIndex((p) => p.slug === slug);
  const next = all[(idx + 1) % all.length];
  const sim = project.relatedSimulation ? getSimulation(project.relatedSimulation) : undefined;

  const meta: { label: string; value?: string }[] = [
    { label: "Role", value: project.role },
    { label: "Timeframe", value: project.timeframe },
    { label: "Disciplines", value: project.disciplines.join(", ") },
  ];

  return (
    <main className="pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/aerospace#projects" className="text-sm text-muted hover:text-accent transition-colors">
          ← All projects
        </Link>

        <header className="mt-6 mb-10">
          <div className="mb-4">
            <StatusBadge status={project.status} />
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold text-ink mb-4 max-w-4xl" style={{ fontFamily: "var(--font-aero-display)" }}>
            {project.title}
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">{project.summary}</p>
        </header>

        <div className="group relative h-[300px] md:h-[440px] rounded-xl border border-line bg-bg-2 overflow-hidden mb-14">
          {project.model ? <ModelViewer url={project.model} /> : <ProjectArt project={project} />}
          {project.status === "planned" && !project.model && !project.cover && (
            <p className="absolute bottom-4 left-4 text-xs text-faint">Renders, photos and a 3D model will be added as the project progresses.</p>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-12">
          <article className="prose-content" dangerouslySetInnerHTML={{ __html: project.html }} />

          <aside className="space-y-8 lg:sticky lg:top-24 h-fit">
            <dl className="space-y-4 text-sm">
              {meta
                .filter((m) => m.value)
                .map((m) => (
                  <div key={m.label}>
                    <dt className="text-faint mb-1">{m.label}</dt>
                    <dd className="text-ink-2">{m.value}</dd>
                  </div>
                ))}
            </dl>
            <div>
              <h2 className="text-sm text-faint mb-2">Tools</h2>
              <div className="flex flex-wrap gap-1.5">
                {project.tools.map((t) => (
                  <span key={t} className="px-2 py-0.5 text-xs rounded bg-surface-2 border border-line text-ink-2">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            {project.skills && project.skills.length > 0 && (
              <div>
                <h2 className="text-sm text-faint mb-2">Skills demonstrated</h2>
                <ul className="space-y-1 text-sm text-ink-2">
                  {project.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.links && project.links.length > 0 && (
              <div className="space-y-2">
                {project.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-accent hover:underline underline-offset-4">
                    {l.label}
                  </a>
                ))}
              </div>
            )}
            {sim && (
              <Link
                href={`/aerospace/simulations/${sim.slug}`}
                className="block p-4 rounded-lg border border-accent/40 bg-accent-soft hover:border-accent transition-colors"
              >
                <p className="text-xs text-faint mb-1">Related simulation</p>
                <p className="text-sm font-medium text-ink">{sim.title}</p>
              </Link>
            )}
          </aside>
        </div>

        {next && next.slug !== slug && (
          <Link
            href={`/aerospace/projects/${next.slug}`}
            className="group mt-20 flex items-center justify-between gap-6 p-6 rounded-xl border border-line bg-surface hover:border-accent/60 transition-colors"
          >
            <div>
              <p className="text-sm text-faint mb-1">Next project</p>
              <p className="text-2xl font-semibold text-ink group-hover:text-accent transition-colors" style={{ fontFamily: "var(--font-aero-display)" }}>
                {next.title}
              </p>
            </div>
            <span className="text-accent text-2xl" aria-hidden>
              →
            </span>
          </Link>
        )}
      </div>
    </main>
  );
}
