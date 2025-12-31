'use client';
import { Code2, Smartphone, Palette } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const About = () => {
  const [years, setYears] = useState(0);
  const [projects, setProjects] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

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

  const animateCounter = (setter: React.Dispatch<React.SetStateAction<number>>, target: number, duration: number = 1500) => {
    const startTime = Date.now();
    const startValue = 0;

    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
      
      setter(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          animateCounter(setProjects, 20, 1500);
          animateCounter(setYears, 2, 1500);
          animateCounter(setSatisfaction, 100, 1500);
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

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

        {/* About Content with Image */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 items-start">
          {/* Image Container - Full Portrait */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-gray-800 bg-[#0a0a0a]">
              {/* Portrait Image Container - Shows full image */}
              <div className="relative w-full">
                {/* Full portrait image - no cropping */}
                <img 
                  src="https://res.cloudinary.com/dwft5hafl/image/upload/v1767203936/IMG_2436_1_jdnpod.jpg" 
                  alt="Allan Kiprop - Profile"
                  className="w-full h-auto max-h-[600px] object-contain"
                  style={{ 
                    display: 'block',
                    margin: '0 auto'
                  }}
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjIwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmOTczMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BbGxhbiBLaXByb3A8L3RleHQ+PC9zdmc+'
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                
                {/* Decorative frame */}
                <div className="absolute inset-0 border-2 border-orange-500/10 rounded-3xl pointer-events-none"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-orange-500/5 blur-xl z-0"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-orange-500/5 blur-xl z-0"></div>
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500/30 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500/30 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500/30 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500/30 rounded-br-lg"></div>
            </div>
            
            {/* Image caption */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a] border border-gray-800 backdrop-blur-sm">
                <span className="text-sm text-orange-400 font-medium">Digital Craftsman</span>
              </div>
            </div>
          </div>
          
          {/* Text Content */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white">
              Crafting Digital Solutions with Passion & Precision
            </h3>
            
            <div className="space-y-4">
              <p className="text-lg text-gray-300 leading-relaxed">
                With over 5 years of experience in the tech industry, I specialize in creating comprehensive digital solutions that bridge the gap between stunning design and robust functionality. My journey began with a curiosity for how things work, which evolved into a passion for building applications that solve real-world problems while delivering exceptional user experiences.
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                What sets me apart is my multidisciplinary approach—I don't just write code or design interfaces; I understand the complete product lifecycle. From initial concept and user research to development, testing, and deployment, I ensure every project maintains a perfect balance between aesthetic appeal and technical excellence. I believe that great digital products should not only work flawlessly but also inspire and delight users.
              </p>
            </div>
            
            {/* Stats or quick facts */}
            <div ref={statsRef} className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center p-4 rounded-xl bg-[#141414] border border-gray-800 hover:border-orange-500/50 transition-all duration-300 group">
                <div className="text-2xl font-bold text-orange-400 transition-all duration-300 group-hover:scale-110">
                  {projects}+
                </div>
                <div className="text-sm text-gray-400">Projects</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-[#141414] border border-gray-800 hover:border-orange-500/50 transition-all duration-300 group">
                <div className="text-2xl font-bold text-orange-400 transition-all duration-300 group-hover:scale-110">
                  {years}+
                </div>
                <div className="text-sm text-gray-400">Years Exp</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-[#141414] border border-gray-800 hover:border-orange-500/50 transition-all duration-300 group">
                <div className="text-2xl font-bold text-orange-400 transition-all duration-300 group-hover:scale-110">
                  {satisfaction}%
                </div>
                <div className="text-sm text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>
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