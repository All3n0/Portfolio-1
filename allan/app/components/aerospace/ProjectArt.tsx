import Image from "next/image";
import type { AeroProject } from "@/lib/content";

/**
 * Card artwork: the project's cover image if it has one,
 * otherwise a blueprint-style drawing chosen from its first discipline.
 */
export default function ProjectArt({ project }: { project: AeroProject }) {
  if (project.cover) {
    return (
      <Image
        src={project.cover}
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
    );
  }
  const d = (project.disciplines[0] || "").toLowerCase();
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let art: React.ReactNode;
  if (d.includes("aero")) {
    art = (
      <>
        <path {...common} d="M60 92 L200 70 L340 92 L200 100 Z" />
        <path {...common} d="M200 55 L200 125" />
        <path {...common} d="M185 118 L215 118" />
        <path {...common} strokeOpacity={0.4} strokeDasharray="4 6" d="M20 60 C 120 50, 280 50, 380 62 M20 120 C 120 128, 280 128, 380 118" />
      </>
    );
  } else if (d.includes("flight")) {
    art = (
      <>
        <path {...common} d="M200 30 C 215 45, 218 70, 218 110 L182 110 C 182 70, 185 45, 200 30 Z" />
        <path {...common} d="M182 95 L165 125 L182 118 M218 95 L235 125 L218 118" />
        <path {...common} strokeOpacity={0.4} strokeDasharray="4 6" d="M40 150 C 120 20, 280 20, 360 150" />
      </>
    );
  } else if (d.includes("struct")) {
    art = (
      <>
        <rect {...common} x="140" y="35" width="120" height="120" />
        <path {...common} d="M140 35 L170 15 L290 15 L260 35 M260 155 L290 135 L290 15" />
        <path {...common} strokeOpacity={0.4} d="M160 35 L160 155 M240 35 L240 155 M140 95 L260 95" />
      </>
    );
  } else if (d.includes("propulsion")) {
    art = (
      <>
        <circle {...common} cx="200" cy="85" r="12" />
        <path {...common} d="M200 73 C 190 40, 205 20, 215 25 C 222 40, 210 60, 200 73 M200 97 C 210 130, 195 150, 185 145 C 178 130, 190 110, 200 97" />
        <path {...common} strokeOpacity={0.4} d="M100 150 L300 150 M200 97 L200 150" />
      </>
    );
  } else {
    art = (
      <>
        <rect {...common} x="140" y="45" width="120" height="80" rx="6" />
        <path {...common} d="M160 65 L240 65 M160 85 L220 85 M160 105 L200 105" strokeOpacity={0.6} />
      </>
    );
  }
  return (
    <div
      className="absolute inset-0 text-accent"
      style={{
        backgroundImage:
          "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <svg viewBox="0 0 400 170" className="w-full h-full transition-transform duration-700 group-hover:scale-105" aria-hidden>
        {art}
      </svg>
    </div>
  );
}
