'use client';
import { useEffect, useState, useRef } from "react";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { HeroParticles } from "./three/Lazy";

const Hero = () => {
  const [showScroll, setShowScroll] = useState(true);
  const [loaded, setLoaded] = useState(false);
  // Start at the real values so search engines and link previews never see "0+"
  const [years, setYears] = useState(2);
  const [projects, setProjects] = useState(20);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Counter animation
  const animateCounter = (setter: React.Dispatch<React.SetStateAction<number>>, target: number, duration: number = 2000) => {
    const startTime = Date.now();
    const startValue = 0;

    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
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
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Hide scroll indicator when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) setShowScroll(false);
      else setShowScroll(true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Counter animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          animateCounter(setProjects, 20, 1500);
          animateCounter(setYears, 2, 1500);
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg"
      >
        {/* Dark Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-bg-2" />
          
          {/* Animated grid pattern */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(90deg, var(--grid) 1px, transparent 1px),
                               linear-gradient(180deg, var(--grid) 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}
          />
          
          {/* Gothic corner accents */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-line"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-line"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-line"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-line"></div>

          {/* 3D particle planet: disperses on scroll, morphs into an aircraft on "Aerospace" */}
          <HeroParticles variant="dev" className="absolute inset-0 opacity-70 dark:opacity-80" />

          {/* Soft vignette so the name always reads clearly over the particles */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 55% 45% at 50% 50%, color-mix(in srgb, var(--bg-2) 70%, transparent), transparent 75%)" }}
          />
        </div>

        {/* Content */}
        <div className="pt-32 relative z-10 container mx-auto py-6">
          <div className="min-h-screen flex flex-col justify-center items-center">
            {/* Gothic separator line top - Animated */}
            <div className={`flex items-center justify-center gap-8 mb-8 lg:mb-16 transition-all duration-1000 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="w-12 lg:w-24 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"></div>
              <span className="text-sm text-faint tracking-widest uppercase animate-pulse">Portfolio</span>
              <div className="w-12 lg:w-24 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"></div>
            </div>

            {/* Name Container - Centered */}
            <div className="text-center mb-8 lg:mb-16 relative">
              {/* Allan - Slides from top */}
              <div className={`transition-all duration-1000 ease-out ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
              }`}>
                <h1 
                  className="text-7xl md:text-8xl lg:text-9xl text-ink font-bold italic leading-none"
                  style={{ fontFamily: "'Cardo', serif" }}
                >
                  Allan
                </h1>
              </div>

              {/* Kiprop - Slides from bottom with delay */}
              <div className={`transition-all duration-1000 ease-out delay-300 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <h1 
                  className="pb-6 text-6xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-ink-2 via-ink to-ink-2 font-bold italic leading-none"
                  style={{ fontFamily: "'Cardo', serif" }}
                >
                  Kiprop
                </h1>
              </div>
            </div>

            {/* Title - Centered */}
            <div className={`text-center mb-12 lg:mb-16 transition-all duration-1000 delay-500 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-muted tracking-wider uppercase">
                <span className="text-accent font-medium">Creative Developer</span>
                <span className="mx-4 text-faint">|</span>
                <span>Digital Craftsman</span>
              </h2>
            </div>

            {/* Description - Centered */}
            <div className={`max-w-xl lg:max-w-2xl mx-auto mb-12 lg:mb-20 transition-all duration-1000 delay-700 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <p className="text-lg lg:text-xl text-muted leading-relaxed font-light tracking-wide text-center">
                Crafting digital experiences with precision and dark elegance. 
                Where code meets artistry in the shadows of innovation.
              </p>
            </div>

            {/* Buttons - Centered */}
            <div className={`mb-12 lg:mb-16 transition-all duration-1000 delay-900 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="flex flex-wrap gap-6 justify-center">
                <button
                  onClick={() => scrollToSection("projects")}
                  className="group px-10 py-4 rounded-md font-medium bg-surface border border-line hover:border-accent-strong hover:bg-surface-2 transition-all duration-300 flex items-center justify-center text-ink hover:text-accent"
                >
                  <span className="relative">
                    View Work
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-strong group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => scrollToSection("contact")}
                  className="px-10 py-4 rounded-md font-medium border border-line-strong text-muted bg-bg/40 backdrop-blur-sm hover:text-ink hover:border-accent/50 hover:bg-gradient-to-r hover:from-accent/10 hover:to-transparent transition-all duration-300"
                >
                  Get in Touch
                </button>
              </div>
            </div>

            {/* Social Icons - Centered */}
            <div className={`mb-12 lg:mb-16 transition-all duration-1000 delay-1000 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="flex gap-8 justify-center">
                <a
                  href="https://github.com/all3n0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="GitHub"
                >
                  <div className="w-12 h-12 rounded-md bg-surface border border-line flex items-center justify-center transition-all duration-300 group-hover:border-accent-strong group-hover:bg-surface-2 group-hover:-translate-y-1">
                    <Github className="w-5 h-5 text-faint group-hover:text-accent transition-colors duration-300" />
                  </div>
                </a>

                <a
                  href="https://linkedin.com/in/allan-kiprop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="LinkedIn"
                >
                  <div className="w-12 h-12 rounded-md bg-surface border border-line flex items-center justify-center transition-all duration-300 group-hover:border-accent-strong group-hover:bg-surface-2 group-hover:-translate-y-1">
                    <Linkedin className="w-5 h-5 text-faint group-hover:text-accent transition-colors duration-300" />
                  </div>
                </a>

                <a 
                  href="mailto:allankipr6@gmail.com" 
                  className="group"
                  aria-label="Email"
                >
                  <div className="w-12 h-12 rounded-md bg-surface border border-line flex items-center justify-center transition-all duration-300 group-hover:border-accent-strong group-hover:bg-surface-2 group-hover:-translate-y-1">
                    <Mail className="w-5 h-5 text-faint group-hover:text-accent transition-colors duration-300" />
                  </div>
                </a>
              </div>
            </div>

            {/* Stats with counter - Centered */}
            <div 
              ref={statsRef}
              className={`max-w-md lg:max-w-lg mx-auto transition-all duration-1000 delay-1100 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="grid grid-cols-3 gap-4 py-6 px-4 rounded-md bg-surface/60 border border-line/60 backdrop-blur-sm">
                {[
                  { value: years, label: "Years", suffix: "+" },
                  { value: projects, label: "Projects", suffix: "+" },
                  { value: "∞", label: "Passion", suffix: "" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-accent-strong mb-1 transition-all duration-300">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-xs text-faint tracking-wider uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Minimal */}
        {showScroll && (
          <div className="hidden md:block fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
            <div className="flex flex-col items-center gap-2">
              <div className="w-px h-20 bg-gradient-to-b from-transparent via-line-strong to-transparent animate-pulse"></div>
              <span className="text-xs text-faint tracking-widest animate-pulse">SCROLL</span>
            </div>
          </div>
        )}

      </section>
    </>
  );
};

export default Hero;