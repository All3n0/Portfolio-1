"use client";
import { useDeferredValue, useMemo, useState } from "react";
import { MATERIALS, analyzeSpar, type SparSection } from "@/lib/physics/beam";
import { Callout, ControlGroup, Panel, Plot, Readout, ReadoutGrid, Segmented, SimShell, Slider, fmt } from "./SimUI";

type Kind = "tube" | "rect";

export default function SparSim() {
  const [semiSpan, setSemiSpan] = useState(0.75);
  const [mass, setMass] = useState(2.5);
  const [n, setN] = useState(4);
  const [kind, setKind] = useState<Kind>("tube");
  const [od, setOd] = useState(12);
  const [wall, setWall] = useState(1);
  const [w, setW] = useState(10);
  const [h, setH] = useState(16);
  const [materialId, setMaterialId] = useState("cfrp");
  const [exaggerate, setExaggerate] = useState(false);

  const input = useDeferredValue({ semiSpan, mass, n, kind, od, wall, w, h, materialId });
  const material = MATERIALS.find((m) => m.id === input.materialId)!;
  const section: SparSection =
    input.kind === "tube"
      ? { kind: "tube", outerDiameter: input.od / 1000, wall: Math.min(input.wall, input.od / 2) / 1000 }
      : { kind: "rect", width: input.w / 1000, height: input.h / 1000 };

  const res = useMemo(
    () => analyzeSpar({ semiSpan: input.semiSpan, aircraftMass: input.mass, loadFactor: input.n, section, material }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input]
  );

  const sf = res.safetyFactor;
  const sfTone = sf < 1 ? "bad" : sf < 1.5 ? "warn" : "good";
  const toPts = (arr: number[], scale = 1) => res.y.filter((_, i) => i % 4 === 0 || i === res.y.length - 1).map((y) => {
    const i = Math.round((y / input.semiSpan) * (res.y.length - 1));
    return [y, arr[i] * scale] as [number, number];
  });

  return (
    <SimShell
      controls={
        <>
          <ControlGroup title="Aircraft and manoeuvre">
            <Slider label="Semi-span" value={semiSpan} min={0.3} max={2} step={0.05} unit="m" onChange={setSemiSpan} />
            <Slider label="Aircraft mass" value={mass} min={0.5} max={15} step={0.1} unit="kg" onChange={setMass} />
            <Slider label="Load factor" value={n} min={1} max={8} step={0.1} unit="g" onChange={setN} />
          </ControlGroup>
          <ControlGroup title="Spar section">
            <Segmented
              label="Shape"
              value={kind}
              onChange={setKind}
              options={[
                { value: "tube", label: "Round tube" },
                { value: "rect", label: "Solid rectangle" },
              ]}
            />
            {kind === "tube" ? (
              <>
                <Slider label="Outer diameter" value={od} min={4} max={40} step={0.5} unit="mm" onChange={setOd} />
                <Slider label="Wall thickness" value={wall} min={0.3} max={5} step={0.1} unit="mm" onChange={setWall} />
              </>
            ) : (
              <>
                <Slider label="Width" value={w} min={3} max={40} step={0.5} unit="mm" onChange={setW} />
                <Slider label="Depth" value={h} min={3} max={60} step={0.5} unit="mm" onChange={setH} />
              </>
            )}
          </ControlGroup>
          <ControlGroup title="Material">
            <div className="space-y-2">
              {MATERIALS.map((m) => (
                <label key={m.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${materialId === m.id ? "border-accent bg-accent-soft" : "border-line hover:border-line-strong"}`}>
                  <input type="radio" name="material" className="mt-1 accent-[var(--accent)]" checked={materialId === m.id} onChange={() => setMaterialId(m.id)} />
                  <span>
                    <span className="block text-sm text-ink">{m.name}</span>
                    <span className="block text-xs text-faint mt-0.5">
                      E {fmt(m.E / 1e9, 0)} GPa, allowable {fmt(m.allowable / 1e6, 0)} MPa
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </ControlGroup>
        </>
      }
    >
      <Panel
        title="Deflected half-wing"
        aside={
          <label className="inline-flex items-center gap-2 text-xs text-muted cursor-pointer">
            <input type="checkbox" checked={exaggerate} onChange={(e) => setExaggerate(e.target.checked)} className="accent-[var(--accent)]" />
            Exaggerate 5×
          </label>
        }
      >
        <WingView y={res.y} deflection={res.deflection} load={res.load} semiSpan={input.semiSpan} factor={exaggerate ? 5 : 1} />
      </Panel>

      <ReadoutGrid>
        <Readout label="Safety factor" value={fmt(sf, 2)} tone={sfTone} large hint={sf < 1 ? "Spar fails" : sf < 1.5 ? "Below the usual 1.5" : "Meets 1.5 target"} />
        <Readout label="Peak bending stress" value={fmt(res.maxStress / 1e6, 1)} unit="MPa" />
        <Readout label="Tip deflection" value={fmt(res.tipDeflection * 1000, 1)} unit="mm" hint={`${fmt(res.tipDeflectionRatio * 100, 1)}% of semi-span`} tone={res.tipDeflectionRatio > 0.1 ? "warn" : "normal"} />
        <Readout label="Spar mass, one side" value={fmt(res.sparMass * 1000, 0)} unit="g" />
      </ReadoutGrid>

      <Callout tone={res.rootMomentError < 0.002 ? "good" : "warn"}>
        Validation: root bending moment from numerical integration is {fmt(res.rootMoment, 3)} N·m; the closed-form value for an
        elliptical load, 4Lb/3π, is {fmt(res.analyticRootMoment, 3)} N·m. Difference: {fmt(res.rootMomentError * 100, 3)}%.
      </Callout>

      <div className="grid xl:grid-cols-3 gap-6">
        <Panel title="Lift load">
          <Plot ariaLabel="Lift per unit span" xLabel="Span (m)" yLabel="N/m" series={[{ points: toPts(res.load), label: "Load" }]} height={200} />
        </Panel>
        <Panel title="Shear force">
          <Plot ariaLabel="Shear force along span" xLabel="Span (m)" yLabel="N" series={[{ points: toPts(res.shear), label: "Shear", color: "alt" }]} height={200} />
        </Panel>
        <Panel title="Bending moment">
          <Plot ariaLabel="Bending moment along span" xLabel="Span (m)" yLabel="N·m" series={[{ points: toPts(res.moment), label: "Moment" }]} height={200} />
        </Panel>
      </div>
    </SimShell>
  );
}

function WingView({
  y,
  deflection,
  load,
  semiSpan,
  factor,
}: {
  y: number[];
  deflection: number[];
  load: number[];
  semiSpan: number;
  factor: number;
}) {
  const W = 640;
  const H = 220;
  const x0 = 60;
  const x1 = W - 30;
  const baseY = 150;
  const sx = (v: number) => x0 + (v / semiSpan) * (x1 - x0);
  // True scale: same metres-per-pixel horizontally and vertically
  const pxPerM = (x1 - x0) / semiSpan;
  const sy = (d: number) => baseY - Math.min(130, d * pxPerM * factor);
  const step = 5;
  const pts = y.filter((_, i) => i % step === 0 || i === y.length - 1).map((v) => {
    const i = Math.round((v / semiSpan) * (y.length - 1));
    return [sx(v), sy(deflection[i])] as const;
  });
  const maxLoad = Math.max(...load);
  const arrows = [0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.92].map((f) => {
    const i = Math.round(f * (y.length - 1));
    const len = 12 + 34 * (load[i] / maxLoad);
    const [px, py] = [sx(y[i]), sy(deflection[i])];
    return { px, py, len };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Deflected wing spar">
      <rect x={x0 - 26} y={baseY - 40} width={20} height={70} fill="var(--line)" />
      <text x={x0 - 16} y={baseY + 48} textAnchor="middle" fontSize={11} fill="var(--faint)">
        Root
      </text>
      <line x1={x0} x2={x1} y1={baseY} y2={baseY} stroke="var(--line-strong)" strokeDasharray="4 5" />
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--accent)" strokeWidth={4} strokeLinecap="round" />
      {arrows.map((a, i) => (
        <g key={i} stroke="var(--accent-alt)" strokeWidth={1.4} fill="none" opacity={0.85}>
          <line x1={a.px} x2={a.px} y1={a.py + 4 + a.len} y2={a.py + 6} />
          <path d={`M${a.px - 4} ${a.py + 11} L${a.px} ${a.py + 5} L${a.px + 4} ${a.py + 11}`} />
        </g>
      ))}
      <text x={x1} y={H - 8} textAnchor="end" fontSize={11} fill="var(--faint)">
        {factor === 1 ? "True scale." : "Deflection shown 5× larger."} Arrows show lift.
      </text>
    </svg>
  );
}
