"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import CVRequestModal from "../CVRequestModal";
import ThemeToggle from "../ThemeToggle";
import WorldSwitch from "../WorldSwitch";
import Logo from "../Logo";

const LINKS = [
  { label: "Overview", href: "/aerospace" },
  { label: "Simulations", href: "/aerospace#simulations" },
  { label: "Projects", href: "/aerospace#projects" },
  { label: "Contact", href: "/aerospace#contact" },
];

export default function AeroNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [cv, setCv] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open || cv ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open, cv]);

  const isActive = (href: string) => (href === "/aerospace" ? pathname === "/aerospace" : false);

  return (
    <>
      <CVRequestModal open={cv} onClose={() => setCv(false)} />
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-bg/85 backdrop-blur-xl border-b border-line py-2" : "bg-transparent py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link href="/aerospace" className="px-3 py-2 rounded-lg hover:bg-surface-2 transition-colors" aria-label="Aerospace overview">
            <Logo className="h-8 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Aerospace sections">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 text-sm font-medium transition-colors ${isActive(l.href) ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <WorldSwitch />
            <ThemeToggle />
            <button
              onClick={() => setCv(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-2 border border-line text-sm font-medium text-ink-2 hover:text-ink hover:border-accent/50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Request CV
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle className="md:hidden" />
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="w-10 h-10 rounded-lg bg-surface-2 border border-line flex items-center justify-center text-muted hover:text-accent"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`lg:hidden fixed inset-0 z-40 bg-bg transition-all duration-500 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-5 gap-6">
          <WorldSwitch compact />
          <nav className="flex flex-col gap-1" aria-label="Aerospace sections">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-lg text-ink-2 hover:bg-surface-2 hover:text-ink">
                {l.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => {
              setCv(true);
              setOpen(false);
            }}
            className="mt-auto px-4 py-3 rounded-lg bg-surface-2 border border-line text-ink flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Request CV
          </button>
        </div>
      </div>
    </>
  );
}
