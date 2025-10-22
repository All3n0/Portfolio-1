'use client';
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import heroBg from "../assets/hero-bg.jpg";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0d0d0d] pt-20 pb-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Hero background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/80 via-[#0d0d0d]/90 to-[#0d0d0d]" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center pt-16 pb-16">
        <div className="animate-fade-in">
          
          {/* Your Name */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 drop-shadow-2xl uppercase tracking-widest mt-8">
            Allan Kiprop
          </h1>

          {/* Enhanced Orange Gradient Text */}
          <h2 className="text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 drop-shadow-2xl">
            Creative Developer
          </h2>
          
          <h3 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-300">
            Fullstack • Mobile • Design
          </h3>
          
          {/* Expanded Description */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Building exceptional digital experiences through the fusion of innovation, performance, and design excellence. 
            I'm passionate about crafting modern web and mobile solutions that don't just look great but also deliver seamless, meaningful user interactions. 
            Every line of code and every design decision reflects a commitment to quality, creativity, and the pursuit of digital perfection.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            {/* Primary Button */}
            <button
              onClick={() => scrollToSection("projects")}
              className="group px-8 py-4 rounded-lg text-black font-medium bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center text-lg"
            >
              View My Work
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Secondary Button */}
            <button
              onClick={() => scrollToSection("contact")}
              className="px-8 py-4 rounded-lg font-medium border border-orange-400 text-white bg-black hover:border-orange-300 hover:bg-orange-400/10 hover:text-orange-200 transition-all duration-300 text-lg"
            >
              Get in Touch
            </button>
          </div>

          <div className="flex gap-6 justify-center mb-12">
            <a 
              href="#" 
              className="text-gray-300 hover:text-orange-400 transition-colors duration-300 hover:scale-110 transform"
            >
              <Github className="w-6 h-6" />
            </a>
            <a 
              href="#" 
              className="text-gray-300 hover:text-orange-400 transition-colors duration-300 hover:scale-110 transform"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href="#" 
              className="text-gray-300 hover:text-orange-400 transition-colors duration-300 hover:scale-110 transform"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-orange-400 rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-orange-400 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;