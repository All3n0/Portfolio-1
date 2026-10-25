'use client';

import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { useEffect, useState } from "react";
import type { DevProject } from "@/lib/content";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

interface ImageCarouselProps {
  images: string[];
  title: string;
  gradient: string;
}

/* ---------- Carousel Component ---------- */
const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  title,
  gradient,
}) => {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) {
    return <div className={`h-full w-full bg-gradient-to-br ${gradient}`} />;
  }

  return (
    <div className="relative h-full w-full">
      {images.map((img, index) => (
        <Image
          key={index}
          src={img}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className={`object-cover transition-all duration-700 group-hover:scale-105 ${index === current ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}
    </div>
  );
};

/* ---------- Projects Component ---------- */
const GITHUB_PROFILE = "https://github.com/all3n0";

const ProjectsGrid: React.FC<{ projects: DevProject[] }> = ({ projects }) => {
  return (
    <section id="projects" className="py-24 px-6 bg-bg text-ink-2">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            A showcase of my recent work across development and design
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={(index % 3) * 100} className="h-full">
              <TiltCard className="group h-full rounded-2xl">
                <div className="h-full flex flex-col bg-surface-2 rounded-2xl overflow-hidden shadow-lg border border-line hover:border-accent/40 hover:shadow-accent/20 transition-[border-color,box-shadow] duration-500">
                  {/* Carousel */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageCarousel
                      images={project.images}
                      title={project.title}
                      gradient={project.gradient}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-2xl font-semibold mb-3 text-ink">
                      {project.title}
                    </h3>

                    <p className="text-muted mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-line text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Demo Links */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.demoLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 border border-accent/50 rounded-lg py-2 text-ink-2 hover:bg-accent/10 transition-all duration-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {link.label}
                        </a>
                      ))}

                      <a
                        href={project.repo || GITHUB_PROFILE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-2 border border-accent/50 rounded-lg py-2 text-ink-2 hover:bg-accent/10 transition-all duration-300"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsGrid;
