"use client";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Maps the `component` field in content/aerospace/simulations/*.md to the interactive component.
 * To add a simulation: create MySim.tsx in this folder, then add one line below.
 */
const loading = () => <div className="h-[520px] rounded-xl border border-line bg-surface animate-pulse" />;

export const SIMULATIONS: Record<string, ComponentType> = {
  airfoil: dynamic(() => import("./AirfoilSim"), { loading }),
  rocket: dynamic(() => import("./RocketSim"), { loading }),
  hohmann: dynamic(() => import("./HohmannSim"), { loading }),
  spar: dynamic(() => import("./SparSim"), { loading }),
};

export default function SimulationHost({ component }: { component: string }) {
  const Sim = SIMULATIONS[component];
  if (!Sim) {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 text-muted">
        No simulation is registered for &quot;{component}&quot;. Add it to app/components/simulations/registry.tsx.
      </div>
    );
  }
  return <Sim />;
}
