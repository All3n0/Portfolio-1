'use client';
import { useState, useEffect, useRef } from "react";
import { Menu, X, Home, User, Briefcase, Mail, Download, Github, Linkedin } from "lucide-react";
import CVRequestModal from "./CVRequestModal";
import ThemeToggle from "./ThemeToggle";
import WorldSwitch from "./WorldSwitch";
import Logo from "./Logo";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [showCVModal, setShowCVModal] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = ['hero', 'about', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu or modal is open
  useEffect(() => {
    if (isMobileMenuOpen || showCVModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, showCVModal]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      setActiveSection(sectionId);
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: "Home", id: "hero", icon: Home },
    { label: "About", id: "about", icon: User },
    { label: "Projects", id: "projects", icon: Briefcase },
    { label: "Contact", id: "contact", icon: Mail },
  ];

  const socials = [
    { label: "GitHub", href: "https://github.com/all3n0", icon: Github },
    { label: "LinkedIn", href: "https://linkedin.com/in/allan-kiprop", icon: Linkedin },
    { label: "Email", href: "mailto:allankipr6@gmail.com", icon: Mail },
  ];

  return (
    <>
      {/* Toast Container */}
      <div id="toast-container" />

      {/* Blur overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* CV Request Modal */}
      <CVRequestModal open={showCVModal} onClose={() => setShowCVModal(false)} />

      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-bg/90 backdrop-blur-xl border-b border-line/60 py-2"
            : "bg-transparent py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Logo - Simplified */}
            <button
              onClick={() => scrollToSection("hero")}
              className="group relative"
              aria-label="Back to top"
            >
              <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-2 transition-all duration-300">
                <Logo className="h-8 w-auto group-hover:scale-105 transition-transform" />
              </div>
            </button>

            {/* Desktop Navigation - Minimal */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative px-4 py-2 group"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-3.5 h-3.5 text-faint group-hover:text-accent transition-colors duration-300" />
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      activeSection === item.id
                        ? "text-ink"
                        : "text-muted group-hover:text-ink-2"
                    }`}>
                      {item.label}
                    </span>
                  </div>

                  {/* Small dash indicator */}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full transition-all duration-300 ${
                    activeSection === item.id
                      ? "bg-accent opacity-100"
                      : "bg-accent/0 group-hover:bg-accent/30 opacity-0 group-hover:opacity-100"
                  }`} />
                </button>
              ))}
            </div>

            {/* Right side: world switch, theme, CV */}
            <div className="hidden md:flex items-center gap-2">
              <WorldSwitch />
              <ThemeToggle />
              <button
                onClick={() => setShowCVModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-2 border border-line text-sm font-medium text-ink-2 hover:text-ink hover:border-accent/50 transition-all duration-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Request CV</span>
              </button>
            </div>

            {/* Mobile controls */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle className="md:hidden" />
              <button
                className="relative z-50 w-10 h-10 rounded-lg bg-surface-2 border border-line flex items-center justify-center hover:border-accent transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-accent" />
                ) : (
                  <Menu className="w-5 h-5 text-muted" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Minimal */}
        <div className={`lg:hidden fixed inset-0 z-40 bg-bg transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}>
          <div className="flex flex-col h-full pt-16 pb-6 px-4">
            {/* Mobile Logo - Minimal */}
            <div className="mb-6 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-surface-2 border border-line">
                <Logo className="h-8 w-auto" />
              </div>
            </div>

            <div className="mb-6">
              <WorldSwitch compact />
            </div>

            {/* Mobile Navigation Items - Minimal */}
            <div className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === item.id
                      ? "bg-accent/10 text-ink border-l-2 border-accent"
                      : "text-muted hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${
                    activeSection === item.id
                      ? "text-accent"
                      : "text-faint"
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-base font-medium">{item.label}</span>
                  {activeSection === item.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Request CV Button - Minimal */}
            <button
              onClick={() => {
                setShowCVModal(true);
                setIsMobileMenuOpen(false);
              }}
              className="mt-6 px-4 py-3 rounded-lg bg-surface-2 border border-line text-ink font-medium text-center hover:border-accent transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Request CV</span>
            </button>

            {/* Social Links - Minimal */}
            <div className="mt-6 pt-6 border-t border-line">
              <div className="flex justify-center gap-4">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-surface-2 border border-line flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-all duration-300"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
