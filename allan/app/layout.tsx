import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "Allan K ",
  description: "Showcasing my software projects and designs.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Fonts: Cardo + Inter (developer side), Barlow + JetBrains Mono (aerospace side) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700&family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@500;600;700&family=JetBrains+Mono:wght@400;500&family=Playwrite+AU+TAS:wght@100..400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-ink">
        <ThemeProvider>
          {children}

          {/* Global toast notifications (colours follow the active theme and world) */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--surface-2)",
                color: "var(--ink)",
                border: "1px solid var(--line)",
                borderRadius: "12px",
                padding: "12px 16px",
              },
              success: {
                iconTheme: {
                  primary: "#f97316", // orange
                  secondary: "#1a1a1a",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444", // red
                  secondary: "#1a1a1a",
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
