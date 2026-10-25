import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * Every project and simulation is its own markdown file.
 * Drop a new .md file into the right folder and it appears on the site at the next build.
 *
 *   content/dev-projects/*.md            -> developer projects (homepage)
 *   content/aerospace/projects/*.md      -> aerospace projects (/aerospace/projects/[slug])
 *   content/aerospace/simulations/*.md   -> simulations (/aerospace/simulations/[slug])
 *
 * Files starting with "_" are ignored, so _template.md files can live next to real content.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readFolder<T>(folder: string): (T & { slug: string; html: string })[] {
  const dir = path.join(CONTENT_ROOT, folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const slug = (data.slug as string) || file.replace(/\.md$/, "");
      const html = marked.parse(content, { async: false }) as string;
      return { ...(data as T), slug, html };
    })
    .sort((a, b) => ((a as { order?: number }).order ?? 999) - ((b as { order?: number }).order ?? 999));
}

/* ---------- Developer projects ---------- */

export type DevProject = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  images: string[];
  demoLinks: { label: string; url: string }[];
  repo?: string;
  order?: number;
  html: string;
};

export function getDevProjects(): DevProject[] {
  return readFolder<Omit<DevProject, "slug" | "html">>("dev-projects").map((p) => ({
    ...p,
    tags: p.tags ?? [],
    images: p.images ?? [],
    demoLinks: p.demoLinks ?? [],
    gradient: p.gradient ?? "from-orange-500 to-pink-500",
  }));
}

/* ---------- Aerospace projects ---------- */

export type ProjectStatus = "planned" | "in-progress" | "complete";

export type AeroProject = {
  slug: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  disciplines: string[];
  tools: string[];
  skills?: string[];
  role?: string;
  timeframe?: string;
  cover?: string; // image path in /public or a full URL
  model?: string; // .glb path in /public for the 3D viewer
  relatedSimulation?: string; // slug of a simulation
  links?: { label: string; url: string }[];
  featured?: boolean;
  order?: number;
  html: string;
};

export function getAeroProjects(): AeroProject[] {
  return readFolder<Omit<AeroProject, "slug" | "html">>("aerospace/projects").map((p) => ({
    ...p,
    status: p.status ?? "planned",
    disciplines: p.disciplines ?? [],
    tools: p.tools ?? [],
  }));
}

export function getAeroProject(slug: string) {
  return getAeroProjects().find((p) => p.slug === slug);
}

/* ---------- Simulations ---------- */

export type Simulation = {
  slug: string;
  title: string;
  summary: string;
  component: string; // key in app/components/simulations/registry.ts
  discipline: string;
  method: string;
  validation: string;
  thumbnail: "airfoil" | "rocket" | "orbit" | "spar" | string;
  order?: number;
  html: string;
};

export function getSimulations(): Simulation[] {
  return readFolder<Omit<Simulation, "slug" | "html">>("aerospace/simulations");
}

export function getSimulation(slug: string) {
  return getSimulations().find((s) => s.slug === slug);
}
