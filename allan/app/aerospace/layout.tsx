import type { Metadata } from "next";
import AeroNav from "../components/aerospace/AeroNav";
import WorldMarker from "../components/aerospace/WorldMarker";
import ScrollProgress from "../components/ScrollProgress";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Allan Kiprop | Aerospace engineering",
  description: "Aerospace engineering projects and interactive simulations: airfoils, rocket flight, orbit transfers and wing structures.",
};

export default function AerospaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-world="aero" className="min-h-screen bg-bg text-ink">
      <WorldMarker />
      <ScrollProgress />
      <AeroNav />
      {children}
      <Footer
        tagline="Aerospace engineering and software: simulations, analysis and hardware that flies."
        links={[
          { label: "Simulations", href: "/aerospace#simulations" },
          { label: "Projects", href: "/aerospace#projects" },
          { label: "Developer side", href: "/" },
        ]}
      />
    </div>
  );
}
