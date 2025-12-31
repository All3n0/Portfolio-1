'use client';
import { useState, useEffect, useRef } from "react";
import { Menu, X, Home, User, Briefcase, Mail, Download, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [showCVModal, setShowCVModal] = useState(false);
  const [cvFormData, setCvFormData] = useState({
    name: "",
    email: "",
    company: "",
    purpose: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

    window.addEventListener("scroll", handleScroll);
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

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowCVModal(false);
      }
    };

    if (showCVModal) {
      document.addEventListener("mousedown", handleClickOutsideModal);
    }
    
    return () => document.removeEventListener("mousedown", handleClickOutsideModal);
  }, [showCVModal]);

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

  const handleCVFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCvFormData({ ...cvFormData, [e.target.id]: e.target.value });
  };

  const handleCVFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "405affda-13a8-43dc-a84d-ec49bb0c19e9",
          subject: `CV Request from ${cvFormData.name} - ${cvFormData.company}`,
          from_name: cvFormData.name,
          from_email: cvFormData.email,
          message: `CV Request Details:
Name: ${cvFormData.name}
Email: ${cvFormData.email}
Company: ${cvFormData.company}
Purpose: ${cvFormData.purpose}
          
Please send the CV to this email address.`,
          replyto: cvFormData.email,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("✅ CV request sent successfully! I'll get back to you soon.");
        setCvFormData({ name: "", email: "", company: "", purpose: "" });
        setShowCVModal(false);
      } else {
        console.error(result);
        toast.error("❌ Failed to send request. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("⚠️ Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems = [
    { label: "Home", id: "hero", icon: Home },
    { label: "About", id: "about", icon: User },
    { label: "Projects", id: "projects", icon: Briefcase },
    { label: "Contact", id: "contact", icon: Mail },
  ];

  return (
    <>
      {/* Toast Container */}
      <div id="toast-container" />
      
      {/* Blur overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* CV Request Modal */}
      {showCVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div 
            ref={modalRef}
            className="relative bg-[#1a1a1a] border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Request My CV</h3>
                  <p className="text-sm text-gray-400 mt-1">Enter your details and I'll send my CV to your email</p>
                </div>
                <button
                  onClick={() => setShowCVModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCVFormSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={cvFormData.name}
                  onChange={handleCVFormChange}
                  required
                  placeholder="John Doe"
                  className="w-full bg-[#111] text-white border border-gray-800 rounded-lg px-4 py-3 text-sm focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={cvFormData.email}
                  onChange={handleCVFormChange}
                  required
                  placeholder="john@company.com"
                  className="w-full bg-[#111] text-white border border-gray-800 rounded-lg px-4 py-3 text-sm focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2 text-gray-300">
                  Company / Organization
                </label>
                <input
                  id="company"
                  type="text"
                  value={cvFormData.company}
                  onChange={handleCVFormChange}
                  placeholder="Your company name"
                  className="w-full bg-[#111] text-white border border-gray-800 rounded-lg px-4 py-3 text-sm focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="purpose" className="block text-sm font-medium mb-2 text-gray-300">
                  Purpose of Request *
                </label>
                <textarea
                  id="purpose"
                  rows={3}
                  value={cvFormData.purpose}
                  onChange={handleCVFormChange}
                  required
                  placeholder="Tell me why you need my CV (e.g., job opportunity, collaboration, etc.)"
                  className="w-full bg-[#111] text-white border border-gray-800 rounded-lg px-4 py-3 text-sm focus:border-orange-500 outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Request CV</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  I'll review your request and send my CV to your email within 24 hours.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-gray-800/50 py-2"
            : "bg-transparent py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo - Simplified */}
            <button
              onClick={() => scrollToSection("hero")}
              className="group relative"
            >
              <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1a1a1a] transition-all duration-300">
                <span className="text-lg font-bold text-orange-500 group-hover:scale-105 transition-transform">
                  &lt;AK/&gt;
                </span>
              </div>
            </button>

            {/* Desktop Navigation - Minimal */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative px-4 py-2 group"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-orange-500 transition-colors duration-300" />
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      activeSection === item.id
                        ? "text-white"
                        : "text-gray-400 group-hover:text-gray-300"
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Small dash indicator */}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full transition-all duration-300 ${
                    activeSection === item.id
                      ? "bg-orange-500 opacity-100"
                      : "bg-orange-500/0 group-hover:bg-orange-500/30 opacity-0 group-hover:opacity-100"
                  }`} />
                </button>
              ))}
            </div>

            {/* Request CV Button - Minimal */}
            <button
              onClick={() => setShowCVModal(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-800 text-sm font-medium text-gray-300 hover:text-white hover:border-orange-500/50 hover:bg-[#222] transition-all duration-300"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Request CV</span>
            </button>

            {/* Mobile Menu Button - Minimal */}
            <button
              className="md:hidden relative z-50 w-10 h-10 rounded-lg bg-[#1a1a1a] border border-gray-800 flex items-center justify-center hover:border-orange-500 hover:bg-[#222] transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-orange-500" />
              ) : (
                <Menu className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Minimal */}
        <div className={`md:hidden fixed inset-0 z-40 bg-[#0d0d0d] transition-all duration-500 ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}>
          <div className="flex flex-col h-full pt-16 pb-6 px-4">
            {/* Mobile Logo - Minimal */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-800">
                <span className="text-xl font-bold text-orange-500">
                  &lt;AK/&gt;
                </span>
              </div>
            </div>

            {/* Mobile Navigation Items - Minimal */}
            <div className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === item.id
                      ? "bg-orange-500/10 text-white border-l-2 border-orange-500"
                      : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                >
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${
                    activeSection === item.id 
                      ? "text-orange-400" 
                      : "text-gray-500"
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-base font-medium">{item.label}</span>
                  {activeSection === item.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
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
              className="mt-6 px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white font-medium text-center hover:border-orange-500 hover:bg-[#222] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Request CV</span>
            </button>

            {/* Social Links - Minimal */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex justify-center gap-4">
                {['github', 'linkedin', 'mail'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-gray-800 flex items-center justify-center hover:border-orange-500 hover:bg-[#222] transition-all duration-300"
                  >
                    <span className="text-xs text-gray-400 hover:text-orange-400 font-medium">
                      {social.charAt(0).toUpperCase()}
                    </span>
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