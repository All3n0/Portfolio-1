"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`relative w-9 h-9 rounded-lg border border-line bg-surface-2 flex items-center justify-center text-muted hover:text-accent hover:border-accent/50 transition-colors duration-300 ${className}`}
    >
      <Sun className={`w-4 h-4 absolute transition-all duration-500 ${isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`} />
      <Moon className={`w-4 h-4 absolute transition-all duration-500 ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`} />
    </button>
  );
}
