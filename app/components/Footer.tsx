'use client';

import { Github, Linkedin, Mail, Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative bg-[#0d0d0d] border-t border-[#2a2a2a] overflow-hidden">
      {/* Subtle top gradient glow */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>

      <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        {/* Left Section */}
        <div className="text-center md:text-left space-y-3">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent tracking-wide">
            Allan Kiprop
          </h3>
          <p className="text-gray-400 text-sm max-w-md">
            Designing and developing clean, modern digital experiences with passion & precision.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
            {/* <p className="text-gray-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" /> in Nairobi
            </p> */}
          </div>
        </div>

        {/* Center Section - Navigation / Quick Links */}
        <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
          <Link
            href="#about"
            className="hover:text-orange-500 transition-colors duration-300"
          >
            About
          </Link>
          <Link
            href="#projects"
            className="hover:text-orange-500 transition-colors duration-300"
          >
            Projects
          </Link>
          <Link
            href="#contact"
            className="hover:text-orange-500 transition-colors duration-300"
          >
            Contact
          </Link>
        </div>

        {/* Right Section - Socials */}
        <div className="flex gap-6">
          <a
            href="https://github.com/all3n0"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center transition-all duration-300 group-hover:border-orange-500 group-hover:shadow-[0_0_15px_#f97316aa]">
              <Github className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </div>
          </a>

          <a
            href="https://linkedin.com/in/allan-kiprop"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center transition-all duration-300 group-hover:border-orange-500 group-hover:shadow-[0_0_15px_#f97316aa]">
              <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </div>
          </a>

          <a
            href="mailto:allankipr6@gmail.com"
            className="group relative"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center transition-all duration-300 group-hover:border-orange-500 group-hover:shadow-[0_0_15px_#f97316aa]">
              <Mail className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </div>
          </a>
        </div>
      </div>

      {/* Bottom Text Line */}
      <div className="border-t border-[#2a2a2a] py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Allan Kiprop — All Rights Reserved
      </div>

      {/* Background gradient blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-gradient-to-t from-orange-500/10 to-transparent blur-3xl pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
