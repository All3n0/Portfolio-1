'use client';
import { Code2, Smartphone, Palette } from "lucide-react";

const About = () => {
  const skills = [
    {
      icon: Code2,
      title: "Fullstack Development",
      description: "Building robust web applications with modern frameworks and technologies. Expert in both frontend and backend development.",
      tech: ["React", "Node.js", "TypeScript", "PostgreSQL"]
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      description: "Creating native Android applications with exceptional performance and user experience.",
      tech: ["Android", "Kotlin", "Java", "Material Design"]
    },
    {
      icon: Palette,
      title: "Graphic Design",
      description: "Crafting beautiful, user-centric designs that blend aesthetics with functionality.",
      tech: ["UI/UX", "Figma", "Adobe Suite", "Branding"]
    }
  ];

  return (
    <section className="py-24 px-6 bg-background" id="about">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-foreground">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A passionate developer and designer who loves creating seamless digital experiences
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl bg-[#141414] border border-gray-800 hover:border-orange-500/50 transition-all duration-500 group hover:-translate-y-2"
            >
              {/* Icon Container */}
              <div className="mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <skill.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-orange-400 transition-colors">
                {skill.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-400 mb-6 leading-relaxed">
                {skill.description}
              </p>
              
              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2">
                {skill.tech.map((tech, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;