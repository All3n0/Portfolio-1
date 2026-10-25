/**
 * Wing spar as a cantilever (Euler–Bernoulli) beam under an elliptical lift distribution.
 * Root at y = 0, tip at y = semiSpan.
 */

export type Material = {
  id: string;
  name: string;
  E: number; // Pa
  allowable: number; // Pa (yield for metals, design allowable for composites/wood)
  density: number; // kg/m^3
  note: string;
};

export const MATERIALS: Material[] = [
  {
    id: "al6061",
    name: "Aluminium 6061-T6",
    E: 68.9e9,
    allowable: 276e6,
    density: 2700,
    note: "Tensile yield strength.",
  },
  {
    id: "cfrp",
    name: "Pultruded carbon tube",
    E: 110e9,
    allowable: 600e6,
    density: 1550,
    note: "Typical value; varies a lot by layup and supplier.",
  },
  {
    id: "spruce",
    name: "Sitka spruce",
    E: 10e9,
    allowable: 60e6,
    density: 420,
    note: "Approximate modulus of rupture along the grain.",
  },
];

export type SparSection =
  | { kind: "tube"; outerDiameter: number; wall: number } // m
  | { kind: "rect"; width: number; height: number }; // m

export type SparInput = {
  semiSpan: number; // m
  aircraftMass: number; // kg
  loadFactor: number; // n
  section: SparSection;
  material: Material;
};

export function sectionProps(s: SparSection) {
  if (s.kind === "tube") {
    const ro = s.outerDiameter / 2;
    const ri = Math.max(0, ro - s.wall);
    return {
      I: (Math.PI / 4) * (ro ** 4 - ri ** 4),
      c: ro,
      A: Math.PI * (ro ** 2 - ri ** 2),
    };
  }
  return { I: (s.width * s.height ** 3) / 12, c: s.height / 2, A: s.width * s.height };
}

export type SparResult = {
  y: number[];
  load: number[]; // N/m
  shear: number[]; // N
  moment: number[]; // N·m
  deflection: number[]; // m
  slope: number[]; // rad
  liftPerWing: number; // N
  rootMoment: number;
  analyticRootMoment: number;
  rootMomentError: number;
  maxStress: number; // Pa
  safetyFactor: number;
  tipDeflection: number;
  tipDeflectionRatio: number; // tip deflection / semi-span
  sparMass: number; // kg (one side)
};

export function analyzeSpar({ semiSpan: b, aircraftMass, loadFactor, section, material }: SparInput, N = 200): SparResult {
  const g = 9.80665;
  const L = (loadFactor * aircraftMass * g) / 2;
  const w0 = (4 * L) / (Math.PI * b);
  const y = Array.from({ length: N + 1 }, (_, i) => (i / N) * b);
  const load = y.map((yy) => w0 * Math.sqrt(Math.max(0, 1 - (yy / b) ** 2)));
  const dy = b / N;

  // Integrate from tip (free end) to root: V' = -w, M' = -V
  const shear = new Array<number>(N + 1).fill(0);
  const moment = new Array<number>(N + 1).fill(0);
  for (let i = N - 1; i >= 0; i--) {
    shear[i] = shear[i + 1] + 0.5 * (load[i] + load[i + 1]) * dy;
    moment[i] = moment[i + 1] + 0.5 * (shear[i] + shear[i + 1]) * dy;
  }

  const { I, c, A } = sectionProps(section);
  const EI = material.E * I;
  // Integrate from root (clamped) to tip: theta' = M/EI, v' = theta
  const slope = new Array<number>(N + 1).fill(0);
  const deflection = new Array<number>(N + 1).fill(0);
  for (let i = 1; i <= N; i++) {
    slope[i] = slope[i - 1] + 0.5 * (moment[i - 1] + moment[i]) * (dy / EI);
    deflection[i] = deflection[i - 1] + 0.5 * (slope[i - 1] + slope[i]) * dy;
  }

  const rootMoment = moment[0];
  const analyticRootMoment = (4 * L * b) / (3 * Math.PI);
  const maxStress = (rootMoment * c) / I;
  return {
    y,
    load,
    shear,
    moment,
    deflection,
    slope,
    liftPerWing: L,
    rootMoment,
    analyticRootMoment,
    rootMomentError: Math.abs(rootMoment - analyticRootMoment) / analyticRootMoment,
    maxStress,
    safetyFactor: material.allowable / maxStress,
    tipDeflection: deflection[N],
    tipDeflectionRatio: deflection[N] / b,
    sparMass: material.density * A * b,
  };
}
