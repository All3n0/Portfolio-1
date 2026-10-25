import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSimulation, getSimulations } from "@/lib/content";
import SimulationHost from "../../../components/simulations/registry";
import SimThumb from "../../../components/aerospace/SimThumb";

export function generateStaticParams() {
  return getSimulations().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sim = getSimulation(slug);
  return sim ? { title: `${sim.title} | Allan Kiprop`, description: sim.summary } : {};
}

export default async function SimulationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sim = getSimulation(slug);
  if (!sim) notFound();
  const others = getSimulations().filter((s) => s.slug !== slug);

  return (
    <main className="pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/aerospace#simulations" className="text-sm text-muted hover:text-accent transition-colors">
          ← All simulations
        </Link>

        <header className="mt-6 mb-10 grid lg:grid-cols-[1fr_320px] gap-8 items-end">
          <div>
            <p className="text-accent font-medium mb-3">{sim.discipline}</p>
            <h1 className="text-5xl md:text-6xl font-semibold text-ink mb-4" style={{ fontFamily: "var(--font-aero-display)" }}>
              {sim.title}
            </h1>
            <p className="text-lg text-muted max-w-2xl leading-relaxed">{sim.summary}</p>
          </div>
          <dl className="grid gap-3 text-sm rounded-xl border border-line bg-surface p-5">
            <div>
              <dt className="text-faint">Method</dt>
              <dd className="text-ink-2">{sim.method}</dd>
            </div>
            <div>
              <dt className="text-faint">Validated against</dt>
              <dd className="text-ink-2">{sim.validation}</dd>
            </div>
          </dl>
        </header>

        <SimulationHost component={sim.component} />

        <section className="mt-20 grid lg:grid-cols-[1fr_300px] gap-12">
          <article className="prose-content" dangerouslySetInnerHTML={{ __html: sim.html }} />
          <aside>
            <h2 className="text-sm font-semibold text-ink mb-4">Other simulations</h2>
            <div className="space-y-3">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/aerospace/simulations/${o.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-lg border border-line bg-surface hover:border-accent/60 transition-colors"
                >
                  <div className="w-16 h-8 shrink-0 text-accent">
                    <SimThumb kind={o.thumbnail} />
                  </div>
                  <div>
                    <p className="text-xs text-faint">{o.discipline}</p>
                    <p className="text-sm text-ink group-hover:text-accent transition-colors">{o.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
