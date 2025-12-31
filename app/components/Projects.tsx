'use client';

import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { useEffect, useState } from "react";

/* ---------- Types ---------- */
interface DemoLink {
  label: string;
  url: string;
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  images: string[];
  demoLinks: DemoLink[];
}

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
          className={`object-cover transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};

/* ---------- Projects Component ---------- */
const Projects: React.FC = () => {
  const projects: Project[] = [
    {
      title: "Skeeps Collection E-Commerce Platform",
      description:
        "Full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.",
      tags: ["NEXTjs", "Node.js", "postgreSQL"],
      gradient: "from-orange-500 to-pink-500",
      images: ["/1.png"],
      demoLinks: [
        { label: "Live Demo", url: "https://skeepscollection.vercel.app/" },
      ],
    },
    {
      title: "Blaze Food Ordering and Delivery Tracker App",
      description:
        "Cross-platform food ordering and delivery tracking app with live driver updates and secure payments.",
      tags: ["NEXTjs", "Node.js", "postgreSQL"],
      gradient: "from-pink-500 to-purple-500",
      images: ["/3.png"],
      demoLinks: [
        { label: "Live Demo", url: "https://example.com/blaze" },
      ],
    },
    {
      title: "TIKITI ticketing system",
      description:
        "An online ticketing system with advanced features, including seat selection, payment processing, and real-time updates.",
      tags: ["NEXTjs", "Node.js", "postgreSQL"],
      gradient: "from-pink-500 to-purple-500",
      images: ["/4.png"],
      demoLinks: [
        { label: "Live Demo", url: "https://example.com/tikiti" },
      ],
    },
    {
      title: "News Tracking Mobile App",
      description:
        "Intuitive news tracker with offline support, reminders, and collaborative features.",
      tags: ["Android", "Room DB", "MVVM", "Coroutines"],
      gradient: "from-pink-500 to-orange-500",
      images: ["/2.png"],
      demoLinks: [
        { label: "Play Store", url: "https://example.com/news-app" },
      ],
    },
    {
      title: "Portfolio Website",
      description:
        "A portfolio website to showcase skills, projects and experience of clients.",
      tags: ["NEXTjs", "Node.js", "postgreSQL"],
      gradient: "from-orange-500 to-pink-500",
      images: [
        "https://res.cloudinary.com/dwft5hafl/image/upload/v1767199832/Screenshot_2025-12-31_193212_j3ana0.png",
        "https://res.cloudinary.com/dwft5hafl/image/upload/v1767199832/Screenshot_2025-12-31_193155_z7uknz.png",
      ],
      demoLinks: [
        { label: "Live Demo 1", url: "https://oredi-eugene.vercel.app/" },
        { label: "Live Demo 2", url: "https://eugene-oredi.vercel.app/" },
        // { label: "Client Preview", url: "https://preview.your-portfolio-link.com" },
      ],
    },
  ];

  return (
    <section id="projects" className="py-24 px-6 bg-[#0d0d0d] text-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A showcase of my recent work across development and design
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg border border-gray-800 hover:shadow-orange-500/20 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Carousel */}
              <div className="relative h-48 overflow-hidden">
                <ImageCarousel
                  images={project.images}
                  title={project.title}
                  gradient={project.gradient}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3 text-gray-100">
                  {project.title}
                </h3>

                <p className="text-gray-400 mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Demo Links */}
                <div className="flex flex-wrap gap-2">
                  {project.demoLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[120px]"
                    >
                      <button className="w-full flex items-center justify-center gap-2 border border-orange-500/50 rounded-lg py-2 hover:bg-orange-500/10 transition-all duration-300">
                        <ExternalLink className="w-4 h-4" />
                        {link.label}
                      </button>
                    </a>
                  ))}

                  <button className="flex-1 min-w-[120px] flex items-center justify-center gap-2 border border-orange-500/50 rounded-lg py-2 hover:bg-orange-500/10 transition-all duration-300">
                    <Github className="w-4 h-4" />
                    Code
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
