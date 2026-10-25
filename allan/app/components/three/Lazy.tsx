"use client";
import dynamic from "next/dynamic";

/**
 * All WebGL code is loaded lazily on the client, so three.js never blocks the first paint
 * and is never part of the server render.
 */
export const HeroParticles = dynamic(() => import("./HeroParticles"), { ssr: false });
export const ModelViewer = dynamic(() => import("./ModelViewer"), {
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse bg-surface-2" />,
});
export const OrbitScene = dynamic(() => import("./OrbitScene"), {
  ssr: false,
  loading: () => <div className="w-full h-[380px] md:h-[440px] rounded-lg bg-bg-2 border border-line animate-pulse" />,
});
