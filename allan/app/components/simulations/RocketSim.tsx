"use client";
import { Pause, Play } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { simulateRocket, timestepConvergence, type RocketParams } from "@/lib/physics/rocket";
import { Callout, ControlGroup, Panel, Plot, PresetButtons, Readout, ReadoutGrid, SimShell, Slider, fmt } from "./SimUI";

// Representative values for illustration, not data for any specific commercial motor.
const PRESETS: ({ label: string } & RocketParams)[] = [
  { label: "F-class, 41 mm", dryMass: 0.45, propMass: 0.04, totalImpulse: 70, burnTime: 1.5, diameter: 0.041, cd: 0.45, launchAltitude: 1500, chuteDiameter: 0.45, chuteCd: 1.5 },
  { label: "H-class, 54 mm", dryMass: 1.4, propMass: 0.12, totalImpulse: 220, burnTime: 1.8, diameter: 0.054, cd: 0.45, launchAltitude: 1500, chuteDiameter: 0.6, chuteCd: 1.5 },
  { label: "J-class, 98 mm", dryMass: 3.2, propMass: 0.45, totalImpulse: 900, burnTime: 2.5, diameter: 0.098, cd: 0.5, launchAltitude: 1500, chuteDiameter: 1.2, chuteCd: 1.5 },
];

function downsample<T>(arr: T[], max = 400) {
  if (arr.length <= max) return arr;
  const step = arr.length / max;
  const out: T[] = [];
  for (let i = 0; i < max; i++) out.push(arr[Math.floor(i * step)]);
  out.push(arr[arr.length - 1]);
  return out;
}

export default function RocketSim() {
  const [p, setP] = useState<RocketParams>(PRESETS[1]);
  const set = (k: keyof RocketParams) => (v: number) => setP((prev) => ({ ...prev, [k]: v }));
  const params = useDeferredValue(p);

  const res = useMemo(() => simulateRocket(params), [params]);
  const conv = useMemo(() => timestepConvergence(params), [params]);

  const samples = useMemo(() => downsample(res.samples), [res]);
  const alt = samples.map((s) => [s.t, s.h] as [number, number]);
  const vel = samples.map((s) => [s.t, s.v] as [number, number]);

  // Replay animation
  const [playing, setPlaying] = useState(false);
  const [tReplay, setTReplay] = useState<number | null>(null);
  const raf = useRef(0);
  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    const speed = Math.max(4, res.flightTime / 12); // whole flight in about 12 s
    const loop = (now: number) => {
      const t = ((now - start) / 1000) * speed;
      if (t >= res.flightTime) {
        setTReplay(null);
        setPlaying(false);
        return;
      }
      setTReplay(t);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, res.flightTime]);
  useEffect(() => {
    setPlaying(false);
    setTReplay(null);
  }, [params]);

  const current = useMemo(() => {
    if (tReplay === null) return null;
    let lo = 0;
    let hi = res.samples.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (res.samples[mid].t < tReplay) lo = mid;
      else hi = mid;
    }
    return res.samples[hi];
  }, [tReplay, res]);

  const twrTone = res.liftoffTWR < 5 ? "bad" : res.liftoffTWR < 8 ? "warn" : "good";
  const landTone = res.landingVelocity > 7 ? "warn" : "good";
  const noLiftoff = res.apogee < 1;

  return (
    <SimShell
      controls={
        <>
          <ControlGroup title="Presets">
            <PresetButtons presets={PRESETS} onPick={(i) => setP(PRESETS[i])} />
          </ControlGroup>
          <ControlGroup title="Vehicle">
            <Slider label="Dry mass" value={p.dryMass} min={0.2} max={6} step={0.05} unit="kg" onChange={set("dryMass")} />
            <Slider label="Body diameter" value={p.diameter * 1000} min={25} max={160} step={1} unit="mm" onChange={(v) => set("diameter")(v / 1000)} />
            <Slider label="Drag coefficient" value={p.cd} min={0.3} max={0.8} step={0.01} onChange={set("cd")} />
          </ControlGroup>
          <ControlGroup title="Motor">
            <Slider label="Total impulse" value={p.totalImpulse} min={20} max={1500} step={5} unit="N·s" onChange={set("totalImpulse")} />
            <Slider label="Burn time" value={p.burnTime} min={0.5} max={5} step={0.1} unit="s" onChange={set("burnTime")} />
            <Slider label="Propellant mass" value={p.propMass} min={0.01} max={0.8} step={0.01} unit="kg" onChange={set("propMass")} />
          </ControlGroup>
          <ControlGroup title="Site and recovery">
            <Slider label="Launch altitude" value={p.launchAltitude} min={0} max={3000} step={50} unit="m" onChange={set("launchAltitude")} />
            <Slider label="Parachute diameter" value={p.chuteDiameter} min={0} max={2} step={0.05} unit="m" onChange={set("chuteDiameter")} />
          </ControlGroup>
        </>
      }
    >
      <ReadoutGrid>
        <Readout label="Apogee above pad" value={fmt(res.apogee, 0)} unit="m" large />
        <Readout label="Time to apogee" value={fmt(res.apogeeTime, 1)} unit="s" />
        <Readout label="Max speed" value={fmt(res.maxVelocity, 0)} unit="m/s" hint={`Mach ${fmt(res.maxMach, 2)}`} />
        <Readout label="Peak acceleration" value={fmt(res.maxAccelG, 1)} unit="g" />
        <Readout
          label="Liftoff thrust-to-weight"
          value={fmt(res.liftoffTWR, 1)}
          tone={twrTone}
          hint={res.liftoffTWR < 5 ? "Below the common 5:1 rule of thumb" : "Comfortable rail exit"}
        />
        <Readout label="Ejection delay" value={fmt(res.suggestedDelay, 1)} unit="s" hint="Burnout to apogee" />
        <Readout
          label="Landing speed"
          value={fmt(res.landingVelocity, 1)}
          unit="m/s"
          tone={landTone}
          hint={res.landingVelocity > 7 ? "Hard landing, use a larger chute" : "Gentle recovery"}
        />
        <Readout label="Flight time" value={fmt(res.flightTime, 0)} unit="s" />
      </ReadoutGrid>

      {noLiftoff ? (
        <Callout tone="bad">The motor never produces more thrust than the rocket weighs, so it does not leave the pad. Increase impulse or reduce mass.</Callout>
      ) : (
        <Callout tone={conv.relDiff < 0.001 ? "good" : "warn"}>
          Convergence check: apogee is {fmt(conv.coarse, 1)} m with a 0.02 s time step and {fmt(conv.fine, 1)} m with 0.01 s, a
          difference of {fmt(conv.relDiff * 100, 3)}%. The answer does not depend on the step size.
        </Callout>
      )}

      <Panel
        title="Altitude"
        aside={
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            disabled={noLiftoff}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs border border-line text-ink-2 hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {playing ? "Pause" : "Replay flight"}
          </button>
        }
      >
        <div className="grid grid-cols-[1fr_56px] gap-4 items-stretch">
          <Plot
            ariaLabel="Altitude against time"
            xLabel="Time (s)"
            yLabel="Altitude (m)"
            series={[{ points: alt, label: "Altitude" }]}
            markers={
              current
                ? [{ x: current.t, y: current.h, label: `${current.h.toFixed(0)} m` }]
                : [{ x: res.apogeeTime, y: res.apogee, label: "Apogee" }]
            }
            height={240}
          />
          <AltitudeGauge apogee={res.apogee} h={current?.h ?? res.apogee} thrusting={!!current && current.thrust > 0} />
        </div>
      </Panel>

      <Panel title="Vertical velocity">
        <Plot
          ariaLabel="Velocity against time"
          xLabel="Time (s)"
          yLabel="Velocity (m/s)"
          series={[{ points: vel, label: "Velocity", color: "alt" }]}
          markers={current ? [{ x: current.t, y: current.v }] : []}
          height={200}
        />
      </Panel>
    </SimShell>
  );
}

function AltitudeGauge({ apogee, h, thrusting }: { apogee: number; h: number; thrusting: boolean }) {
  const frac = apogee > 0 ? Math.min(1, Math.max(0, h / apogee)) : 0;
  return (
    <div className="relative h-full min-h-[200px] rounded-lg bg-surface-2 border border-line overflow-hidden" aria-hidden>
      <div className="absolute inset-x-0 bottom-0 bg-accent-soft" style={{ height: `${frac * 100}%` }} />
      <div className="absolute left-1/2 -translate-x-1/2 transition-[bottom] duration-75" style={{ bottom: `calc(${frac * 88}% + 4px)` }}>
        <svg width="18" height="34" viewBox="0 0 18 34">
          <path d="M9 1 C13 6 14 12 14 20 L14 27 L4 27 L4 20 C4 12 5 6 9 1 Z" fill="var(--ink-2)" />
          <path d="M4 22 L0 29 L4 27 Z M14 22 L18 29 L14 27 Z" fill="var(--accent)" />
          {thrusting && <path d="M6 28 L9 34 L12 28 Z" fill="#f59e0b" />}
        </svg>
      </div>
    </div>
  );
}
