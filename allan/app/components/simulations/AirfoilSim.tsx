"use client";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  createPanelSolver,
  nacaGeometry,
  nacaName,
  thinAirfoilCl,
  zeroLiftAngleDeg,
} from "@/lib/physics/airfoil";
import { Callout, ControlGroup, Panel, Plot, PresetButtons, Readout, ReadoutGrid, SimShell, Slider, fmt } from "./SimUI";

const PANELS = 120;
const PRESETS = [
  { label: "NACA 0012", m: 0, p: 4, t: 12 },
  { label: "NACA 2412", m: 2, p: 4, t: 12 },
  { label: "NACA 4412", m: 4, p: 4, t: 12 },
  { label: "NACA 6409", m: 6, p: 4, t: 9 },
];

export default function AirfoilSim() {
  const [m, setM] = useState(2); // % chord
  const [p, setP] = useState(4); // tenths of chord
  const [t, setT] = useState(12); // % chord
  const [alpha, setAlpha] = useState(5);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const shape = useDeferredValue({ m, p, t });
  const params = useMemo(
    () => ({ m: shape.m / 100, p: shape.m === 0 ? 0 : shape.p / 10, t: shape.t / 100 }),
    [shape.m, shape.p, shape.t]
  );

  // Geometry and LU factorisation only depend on shape, not angle of attack
  const solver = useMemo(() => {
    const t0 = performance.now();
    const s = createPanelSolver(nacaGeometry(params, PANELS));
    return { s, ms: performance.now() - t0 };
  }, [params]);

  const result = useMemo(() => solver.s.solve(alpha), [solver, alpha]);
  const alphaL0 = useMemo(() => zeroLiftAngleDeg(params.m, params.p), [params]);
  const tat = thinAirfoilCl(alpha, alphaL0);

  const sweep = useMemo(() => {
    const pts: [number, number][] = [];
    const tatPts: [number, number][] = [];
    for (let a = -6; a <= 14; a += 1) {
      pts.push([a, solver.s.solve(a).cl]);
      tatPts.push([a, thinAirfoilCl(a, alphaL0)]);
    }
    return { pts, tatPts };
  }, [solver, alphaL0]);

  const slopePerRad = ((sweep.pts[10][1] - sweep.pts[6][1]) / 4) * (180 / Math.PI);

  const cpUpper: [number, number][] = [];
  const cpLower: [number, number][] = [];
  result.xc.forEach((x, i) => (result.upper[i] ? cpUpper : cpLower).push([x, -result.cp[i]]));
  cpLower.reverse();

  const diff = Math.abs(result.cl - tat) / Math.max(0.05, Math.abs(tat));

  return (
    <SimShell
      controls={
        <>
          <ControlGroup title="Presets">
            <PresetButtons
              presets={PRESETS}
              onPick={(i) => {
                setM(PRESETS[i].m);
                setP(PRESETS[i].p);
                setT(PRESETS[i].t);
              }}
            />
          </ControlGroup>
          <ControlGroup title="Airfoil shape">
            <Slider label="Max camber" value={m} min={0} max={9} step={1} unit="% c" onChange={setM} />
            <Slider label="Camber position" value={p} min={1} max={9} step={1} unit="× 0.1 c" onChange={setP} />
            <Slider label="Thickness" value={t} min={6} max={24} step={1} unit="% c" onChange={setT} />
          </ControlGroup>
          <ControlGroup title="Flow">
            <Slider label="Angle of attack" value={alpha} min={-6} max={14} step={0.5} unit="°" onChange={setAlpha} />
          </ControlGroup>
          <p className="text-xs text-faint leading-relaxed">
            {PANELS} panels{mounted ? `, solved in ${fmt(solver.ms, 1)} ms` : ""}. Inviscid: no drag or stall.
          </p>
        </>
      }
    >
      <Panel
        title={`${nacaName(params)} at ${alpha}°`}
        aside={<span className="text-xs text-faint">Vector length shows pressure. Bright: suction. Violet: pressure.</span>}
      >
        <AirfoilView geometry={solver.s.geometry} result={result} alpha={alpha} />
      </Panel>

      <ReadoutGrid>
        <Readout label="Lift coefficient (panel)" value={fmt(result.cl, 3)} large />
        <Readout label="Lift coefficient (thin airfoil)" value={fmt(tat, 3)} />
        <Readout label="Moment coefficient, c/4" value={fmt(result.cm, 3)} />
        <Readout label="Zero-lift angle" value={fmt(alphaL0, 2)} unit="°" />
      </ReadoutGrid>

      <Callout tone={diff < 0.15 ? "good" : "warn"}>
        Validation: the panel method differs from thin airfoil theory by {fmt(diff * 100, 1)}% here. Lift slope is{" "}
        {fmt(slopePerRad, 2)} per radian versus 2π ≈ 6.28; the panel method is slightly higher because it includes thickness,
        which thin airfoil theory ignores.
      </Callout>

      <div className="grid xl:grid-cols-2 gap-6">
        <Panel title="Pressure distribution">
          <Plot
            ariaLabel="Pressure coefficient along the chord"
            xLabel="x / c"
            yLabel="−Cp"
            xDomain={[0, 1]}
            series={[
              { points: cpUpper, label: "Upper surface", color: "accent" },
              { points: cpLower, label: "Lower surface", color: "alt" },
            ]}
          />
        </Panel>
        <Panel title="Lift curve">
          <Plot
            ariaLabel="Lift coefficient against angle of attack"
            xLabel="Angle of attack (°)"
            yLabel="Cl"
            series={[
              { points: sweep.pts, label: "Panel method", color: "accent" },
              { points: sweep.tatPts, label: "Thin airfoil theory", color: "muted", dashed: true },
            ]}
            markers={[{ x: alpha, y: result.cl }]}
          />
        </Panel>
      </div>
    </SimShell>
  );
}

function AirfoilView({
  geometry,
  result,
  alpha,
}: {
  geometry: { x: number[]; y: number[] };
  result: { xc: number[]; yc: number[]; cp: number[] };
  alpha: number;
}) {
  const W = 640;
  const H = 260;
  const scale = 470;
  const ox = 85;
  const oy = H / 2;
  const a = (-alpha * Math.PI) / 180;
  // Rotate about quarter chord so the freestream stays horizontal
  const tf = (x: number, y: number): [number, number] => {
    const dx = x - 0.25;
    const rx = dx * Math.cos(a) - y * Math.sin(a) + 0.25;
    const ry = dx * Math.sin(a) + y * Math.cos(a);
    return [ox + rx * scale, oy - ry * scale];
  };
  const path = geometry.x.map((x, i) => tf(x, geometry.y[i])).map(([X, Y], i) => `${i ? "L" : "M"}${X.toFixed(1)},${Y.toFixed(1)}`).join(" ") + "Z";

  const vectors = result.xc.map((x, i) => {
    const i0 = i;
    const i1 = i + 1;
    const tx = geometry.x[i1] - geometry.x[i0];
    const ty = geometry.y[i1] - geometry.y[i0];
    const len = Math.hypot(tx, ty) || 1;
    // outward normal for clockwise ordering
    const nx = -ty / len;
    const ny = tx / len;
    const cp = result.cp[i];
    const k = 0.045 * Math.abs(Math.max(-3, Math.min(1.2, cp)));
    const start = tf(x, result.yc[i]);
    const end = tf(x + nx * k, result.yc[i] + ny * k);
    return { start, end, suction: cp < 0 };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Airfoil with pressure vectors">
      {[-60, -20, 20, 60].map((dy) => (
        <g key={dy} opacity={0.5}>
          <line x1={10} x2={60} y1={oy + dy} y2={oy + dy} stroke="var(--faint)" strokeWidth={1} />
          <path d={`M55 ${oy + dy - 4} L61 ${oy + dy} L55 ${oy + dy + 4}`} fill="none" stroke="var(--faint)" strokeWidth={1} />
        </g>
      ))}
      <text x={10} y={oy - 72} fontSize={11} fill="var(--faint)">
        Freestream
      </text>
      {vectors.map((v, i) => (
        <line
          key={i}
          x1={v.start[0]}
          y1={v.start[1]}
          x2={v.end[0]}
          y2={v.end[1]}
          stroke={v.suction ? "var(--accent)" : "var(--accent-alt)"}
          strokeWidth={1.4}
          strokeOpacity={0.85}
        />
      ))}
      <path d={path} fill="var(--surface-2)" stroke="var(--ink-2)" strokeWidth={1.5} />
    </svg>
  );
}
