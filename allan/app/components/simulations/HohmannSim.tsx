"use client";
import { useDeferredValue, useMemo, useState } from "react";
import { hohmann } from "@/lib/physics/orbit";
import { OrbitScene } from "../three/Lazy";
import { Callout, ControlGroup, Panel, PresetButtons, Readout, ReadoutGrid, SimShell, Slider, fmt } from "./SimUI";

const PRESETS = [
  { label: "Malindi to GEO", alt1: 300, alt2: 35786, inc: 2.9 },
  { label: "Cape Canaveral to GEO", alt1: 300, alt2: 35786, inc: 28.5 },
  { label: "LEO to GPS orbit", alt1: 300, alt2: 20200, inc: 0 },
  { label: "Orbit raise, 400 to 800 km", alt1: 400, alt2: 800, inc: 0 },
];

function hours(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
}

export default function HohmannSim() {
  const [alt1, setAlt1] = useState(300);
  const [alt2, setAlt2] = useState(35786);
  const [inc, setInc] = useState(2.9);
  const [isp, setIsp] = useState(320);
  const [mass, setMass] = useState(1000);

  const input = useDeferredValue({ alt1, alt2, inc, isp, mass });
  const res = useMemo(
    () => hohmann({ alt1: input.alt1, alt2: input.alt2, incChangeDeg: input.inc, isp: input.isp, spacecraftMass: input.mass }),
    [input]
  );
  const cape = useMemo(() => hohmann({ alt1, alt2, incChangeDeg: 28.5, isp, spacecraftMass: mass }), [alt1, alt2, isp, mass]);
  const malindi = useMemo(() => hohmann({ alt1, alt2, incChangeDeg: 2.9, isp, spacecraftMass: mass }), [alt1, alt2, isp, mass]);
  const combinedSaving = res.dvSeparatePlaneChange - res.dvTotal;

  return (
    <SimShell
      controls={
        <>
          <ControlGroup title="Presets">
            <PresetButtons
              presets={PRESETS}
              onPick={(i) => {
                setAlt1(PRESETS[i].alt1);
                setAlt2(PRESETS[i].alt2);
                setInc(PRESETS[i].inc);
              }}
            />
          </ControlGroup>
          <ControlGroup title="Orbits">
            <Slider label="Initial altitude" value={alt1} min={160} max={2000} step={10} unit="km" onChange={setAlt1} />
            <Slider label="Target altitude" value={alt2} min={200} max={40000} step={50} unit="km" onChange={setAlt2} />
            <Slider label="Plane change" value={inc} min={0} max={60} step={0.1} unit="°" onChange={setInc} />
          </ControlGroup>
          <ControlGroup title="Spacecraft">
            <Slider label="Specific impulse" value={isp} min={200} max={460} step={5} unit="s" onChange={setIsp} />
            <Slider label="Initial mass" value={mass} min={50} max={6000} step={10} unit="kg" onChange={setMass} />
          </ControlGroup>
        </>
      }
    >
      <Panel title="Transfer geometry" aside={<span className="text-xs text-faint">Drag to rotate, scroll to zoom</span>}>
        <OrbitScene res={res} incDeg={input.inc} />
        <div className="flex flex-wrap gap-5 mt-3 text-xs text-muted">
          <Legend color="var(--faint)" label="Initial orbit" />
          <Legend color="var(--accent)" dashed label="Transfer ellipse" />
          <Legend color="var(--accent-alt)" label="Target orbit (tilted by plane change)" />
        </div>
      </Panel>

      <ReadoutGrid>
        <Readout label="Total Δv" value={fmt(res.dvTotal, 3)} unit="km/s" large />
        <Readout label="First burn" value={fmt(res.dv1, 3)} unit="km/s" />
        <Readout label="Second burn + plane change" value={fmt(res.dv2, 3)} unit="km/s" />
        <Readout label="Transfer time" value={hours(res.tof)} />
        <Readout label="Propellant needed" value={fmt(res.propellantMass, 0)} unit="kg" hint={`${fmt(res.massFraction * 100, 1)}% of initial mass`} />
        <Readout label="Transfer eccentricity" value={fmt(res.e, 3)} />
        <Readout label="Initial orbit period" value={hours(res.period1)} />
        <Readout label="Target orbit period" value={hours(res.period2)} />
      </ReadoutGrid>

      {inc > 0 && (
        <Callout>
          Combining the plane change with the second burn saves {fmt(combinedSaving * 1000, 0)} m/s compared with doing it as a
          separate manoeuvre, because the spacecraft is moving slowest at the top of the transfer.
        </Callout>
      )}

      <Panel title="Why launch site latitude matters">
        <div className="grid sm:grid-cols-2 gap-3">
          <Readout label="From Cape Canaveral (28.5° plane change)" value={fmt(cape.dvTotal, 3)} unit="km/s" hint={`${fmt(cape.propellantMass, 0)} kg propellant`} />
          <Readout label="From Malindi, Kenya (2.9° plane change)" value={fmt(malindi.dvTotal, 3)} unit="km/s" hint={`${fmt(malindi.propellantMass, 0)} kg propellant`} tone="good" />
        </div>
        <p className="text-sm text-muted mt-3 leading-relaxed">
          For this transfer, launching near the equator saves {fmt((cape.dvTotal - malindi.dvTotal) * 1000, 0)} m/s and{" "}
          {fmt(cape.propellantMass - malindi.propellantMass, 0)} kg of propellant.
        </p>
      </Panel>
    </SimShell>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width="22" height="6" aria-hidden>
        <line x1="0" x2="22" y1="3" y2="3" stroke={color} strokeWidth={2} strokeDasharray={dashed ? "5 4" : undefined} />
      </svg>
      {label}
    </span>
  );
}
