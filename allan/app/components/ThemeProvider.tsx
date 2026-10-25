"use client";
import { ThemeProvider as NextThemes } from "next-themes";

/** Dark is the default (the original look); visitors can switch, and the choice is remembered. */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}
