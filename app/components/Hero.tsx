'use client';
import { useEffect, useState, useRef } from "react";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import heroBg from "../assets/hero-bg.jpg";

const Hero = () => {
  const [showScroll, setShowScroll] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [years, setYears] = useState(0);
  const [projects, setProjects] = useState(0);
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

    window.addEventListener("scroll", handleScroll);
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
      {/* Font imports */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0d0d0d]"
      >
        {/* Dark Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          
          {/* Animated grid pattern */}
          <div 
            className="pt-32 absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(90deg, #1a1a1a 1px, transparent 1px),
                               linear-gradient(180deg, #1a1a1a 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}
          />
          
          {/* Gothic corner accents */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-gray-800"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-gray-800"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-gray-800"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-gray-800"></div>

          {/* Animated floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-[1px] h-[1px] bg-gray-600 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${15 + Math.random() * 10}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="pt-32 relative z-10 container mx-auto px-6">
          <div className="min-h-screen flex flex-col justify-center">
            {/* Gothic separator line top - Animated */}
            <div className={`flex items-center justify-center gap-8 mb-8 lg:mb-16 transition-all duration-1000 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="w-12 lg:w-24 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              <span className="text-sm text-gray-500 tracking-widest uppercase animate-pulse">Portfolio</span>
              <div className="w-12 lg:w-24 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            </div>

            {/* Name Container - PC layout */}
            <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-start lg:max-w-5xl lg:mx-auto mb-8 lg:mb-16 relative">
              {/* Allan - Slides from left */}
              <div className={`transition-all duration-1000 ease-out ${
                loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
              }`}>
                <h1 
                  className="text-7xl md:text-8xl lg:text-9xl text-white font-bold italic leading-none"
                  style={{ fontFamily: "'Cardo', serif" }}
                >
                  Allan
                </h1>
              </div>

              {/* Spacer for PC layout */}
              <div className="lg:ml-12"></div>

              {/* Kiprop - Slides from right (positioned below and to the right on PC) */}
              <div className={`mt-4 lg:mt-auto lg:ml-12 transition-all duration-1000 ease-out delay-300 ${
                loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
              }`}>
                <h1 
                  className="text-6xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 font-bold italic leading-none pb-6"
                  style={{ fontFamily: "'Cardo', serif" }}
                >
                  Kiprop
                </h1>
              </div>
            </div>

            {/* Title - Fades in */}
            <div className={`text-center lg:text-left lg:pl-4 mb-12 lg:mb-16 transition-all duration-1000 delay-500 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-400 tracking-wider uppercase">
                <span className="text-orange-500 font-medium">Creative Developer</span>
                <span className="mx-4 text-gray-600 hidden lg:inline">|</span>
                <span className="block lg:inline mt-2 lg:mt-0">Digital Craftsman</span>
              </h2>
            </div>

            {/* Description - Slides up */}
            <div className={`max-w-xl lg:max-w-2xl mx-auto lg:mx-0 lg:pl-4 mb-12 lg:mb-20 transition-all duration-1000 delay-700 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <p className="text-lg lg:text-xl text-gray-500 leading-relaxed font-light tracking-wide text-center lg:text-left">
                Crafting digital experiences with precision and dark elegance. 
                Where code meets artistry in the shadows of innovation.
              </p>
            </div>

            {/* Buttons and Social - Staggered animation */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
              {/* Buttons - Fade in */}
              <div className={`transition-all duration-1000 delay-900 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                  <button
                    onClick={() => scrollToSection("projects")}
                    className="group px-10 py-4 rounded-md font-medium bg-[#111] border border-gray-800 hover:border-orange-600 hover:bg-[#1a1a1a] transition-all duration-300 flex items-center justify-center text-white hover:text-orange-300"
                  >
                    <span className="relative">
                      View Work
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-orange-600 group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => scrollToSection("contact")}
                    className="px-10 py-4 rounded-md font-medium border border-gray-700 text-gray-400 hover:text-white hover:border-orange-500/50 hover:bg-gradient-to-r hover:from-orange-900/10 hover:to-transparent transition-all duration-300"
                  >
                    Get in Touch
                  </button>
                </div>
              </div>

              {/* Social Icons - Fade in with delay */}
              <div className={`transition-all duration-1000 delay-1000 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div className="flex gap-8 justify-center lg:justify-start">
                  <a
                    href="https://github.com/all3n0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="w-12 h-12 rounded-md bg-[#111] border border-gray-800 flex items-center justify-center transition-all duration-300 group-hover:border-orange-600 group-hover:bg-[#1a1a1a] group-hover:-translate-y-1">
                      <Github className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors duration-300" />
                    </div>
                  </a>

                  <a
                    href="https://linkedin.com/in/allan-kiprop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="w-12 h-12 rounded-md bg-[#111] border border-gray-800 flex items-center justify-center transition-all duration-300 group-hover:border-orange-600 group-hover:bg-[#1a1a1a] group-hover:-translate-y-1">
                      <Linkedin className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors duration-300" />
                    </div>
                  </a>

                  <a 
                    href="mailto:allankipr6@gmail.com" 
                    className="group"
                  >
                    <div className="w-12 h-12 rounded-md bg-[#111] border border-gray-800 flex items-center justify-center transition-all duration-300 group-hover:border-orange-600 group-hover:bg-[#1a1a1a] group-hover:-translate-y-1">
                      <Mail className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors duration-300" />
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Stats with counter - Slides up with delay */}
            <div 
              ref={statsRef}
              className={`max-w-md lg:max-w-lg mx-auto lg:mx-0 lg:pl-4 mt-12 lg:mt-16 transition-all duration-1000 delay-1100 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="grid grid-cols-3 gap-4 py-6 px-4 rounded-md bg-[#111]/50 border border-gray-800/50 backdrop-blur-sm">
                {[
                  { value: years, label: "Years", suffix: "+" },
                  { value: projects, label: "Projects", suffix: "+" },
                  { value: "∞", label: "Passion", suffix: "" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-orange-600 mb-1 transition-all duration-300">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-xs text-gray-500 tracking-wider uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Minimal */}
        {showScroll && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
            <div className="flex flex-col items-center gap-2">
              <div className="w-px h-20 bg-gradient-to-b from-transparent via-gray-700 to-transparent animate-pulse"></div>
              <span className="text-xs text-gray-600 tracking-widest animate-pulse">SCROLL</span>
            </div>
          </div>
        )}

        {/* Add CSS animations */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-40px) translateX(-10px); }
            75% { transform: translateY(-20px) translateX(10px); }
          }
          
          .animate-float {
            animation: float linear infinite;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
          }
        `}</style>
      </section>
    </>
  );
};

export default Hero;