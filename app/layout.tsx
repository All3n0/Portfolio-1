import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Allan K ",
  description: "Showcasing my software projects and designs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playwrite+AU+TAS:wght@100..400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0d0d0d] text-white">
        {children}
        
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid #2a2a2a",
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
      </body>
    </html>
  );
}
