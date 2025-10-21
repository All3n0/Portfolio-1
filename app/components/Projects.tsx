'use client';
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "Full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      gradient: "from-orange-500 to-pink-500",
    },
    {
      title: "Fitness Tracker App",
      description:
        "Native Android application for tracking workouts, nutrition, and progress with beautiful data visualizations.",
      tags: ["Android", "Kotlin", "Firebase", "Material Design"],
      gradient: "from-pink-500 to-purple-500",
    },
    {
      title: "Brand Identity System",
      description:
        "Complete brand identity design including logo, color palette, typography, and marketing materials.",
      tags: ["Branding", "UI/UX", "Figma", "Illustration"],
      gradient: "from-purple-500 to-orange-500",
    },
    {
      title: "Real-Time Chat Application",
      description:
        "Scalable chat platform with WebSocket support, file sharing, and end-to-end encryption.",
      tags: ["React", "Socket.io", "Express", "PostgreSQL"],
      gradient: "from-orange-500 to-purple-500",
    },
    {
      title: "Task Management Mobile App",
      description:
        "Intuitive task manager with offline support, reminders, and collaborative features.",
      tags: ["Android", "Room DB", "MVVM", "Coroutines"],
      gradient: "from-pink-500 to-orange-500",
    },
    {
      title: "Portfolio Design System",
      description:
        "Comprehensive design system with reusable components, documentation, and accessibility guidelines.",
      tags: ["Design System", "Figma", "React", "Storybook"],
      gradient: "from-purple-500 to-pink-500",
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
              <div
                className={`h-48 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-black/20 backdrop-blur-xl group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>

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
