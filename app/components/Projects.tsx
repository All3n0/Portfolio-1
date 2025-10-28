'use client';
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "Skeeps Collection E-Commerce Platform",
      description:
        "Full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.",
      tags: ["NEXTjs", "Node.js", "postgreSQL"],
      gradient: "from-orange-500 to-pink-500",
      image: "/1.png", // 🖼️ optional image
    },
    {
      title: "Blaze Food Ordering and Delivery Tracker App",
      description:
        "Cross-platform food ordering and delivery tracking app with live driver updates and secure payments.",
      tags: ["NEXTjs", "Node.js", "postgreSQL"],
      gradient: "from-pink-500 to-purple-500",
      image: "/3.png", // 🖼️ optional image
    },
    
    {
      title: "TIKITI ticketing system",
      description:
        "An online ticketing system with advanced features, including seat selection, payment processing, and real-time updates.",
      tags: ["NEXTjs", "Node.js", "postgreSQL"],
      gradient: "from-pink-500 to-purple-500",
      image: "/4.png", // 🖼️ optional image
    },
    {
      title: "News Tracking Mobile App",
      description:
        "Intuitive news tracker with offline support, reminders, and collaborative features.",
      tags: ["Android", "Room DB", "MVVM", "Coroutines"],
      gradient: "from-pink-500 to-orange-500",
      image: "/2.png", // ❌ no image → fallback to gradient
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
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* 🔹 Top Section: Image or Gradient */}
              <div className="relative h-48 overflow-hidden">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className={`h-full w-full bg-gradient-to-br ${project.gradient}`}
                  />
                )}
              </div>

              {/* 🔹 Text Content */}
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3 text-gray-100 hover:text-orange-500 transition-colors duration-300">
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

                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 border border-orange-500/50 rounded-lg py-2 hover:bg-orange-500/10 transition-all duration-300">
                    <ExternalLink className="w-4 h-4" />
                    Demo
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 border border-orange-500/50 rounded-lg py-2 hover:bg-orange-500/10 transition-all duration-300">
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
