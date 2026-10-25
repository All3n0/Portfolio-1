'use client';

import { Github, Linkedin, Mail, Heart } from "lucide-react";
import Link from "next/link";

type FooterLink = { label: string; href: string };

const DEFAULT_LINKS: FooterLink[] = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const Footer = ({
  links = DEFAULT_LINKS,
  tagline = "Designing and developing clean, modern digital experiences with passion & precision.",
}: {
  links?: FooterLink[];
  tagline?: string;
}) => {
  return (
    <footer className="relative bg-bg border-t border-line overflow-hidden">
      {/* Subtle top gradient glow */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"></div>

      <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        {/* Left Section */}
        <div className="text-center md:text-left space-y-3">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-accent to-accent-deep bg-clip-text text-transparent tracking-wide">
            Allan Kiprop
          </h3>
          <p className="text-muted text-sm max-w-md">
            {tagline}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
            {/* <p className="text-faint text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-accent fill-accent animate-pulse" /> in Nairobi
            </p> */}
          </div>
        </div>

        {/* Center Section - Navigation / Quick Links */}
        <div className="flex flex-wrap justify-center gap-8 text-muted text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-accent transition-colors duration-300"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right Section - Socials */}
        <div className="flex gap-6">
          <a
            href="https://github.com/all3n0"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
            aria-label="GitHub"
          >
            <div className="w-11 h-11 rounded-xl bg-surface-2 border border-line flex items-center justify-center transition-all duration-300 group-hover:border-accent group-hover:shadow-[0_0_15px_var(--accent-ring)]">
              <Github className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
            </div>
          </a>

          <a
            href="https://linkedin.com/in/allan-kiprop"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
            aria-label="LinkedIn"
          >
            <div className="w-11 h-11 rounded-xl bg-surface-2 border border-line flex items-center justify-center transition-all duration-300 group-hover:border-accent group-hover:shadow-[0_0_15px_var(--accent-ring)]">
              <Linkedin className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
            </div>
          </a>

          <a
            href="mailto:allankipr6@gmail.com"
            className="group relative"
            aria-label="Email"
          >
            <div className="w-11 h-11 rounded-xl bg-surface-2 border border-line flex items-center justify-center transition-all duration-300 group-hover:border-accent group-hover:shadow-[0_0_15px_var(--accent-ring)]">
              <Mail className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
            </div>
          </a>
        </div>
      </div>

      {/* Bottom Text Line */}
      <div className="border-t border-line py-6 text-center text-faint text-sm">
        © {new Date().getFullYear()} Allan Kiprop — All Rights Reserved
      </div>

      {/* Background gradient blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-gradient-to-t from-accent/10 to-transparent blur-3xl pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
