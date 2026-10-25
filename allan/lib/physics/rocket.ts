/**
 * Vertical (1-DOF) rocket flight with variable mass, ISA atmosphere and quadratic drag.
 * Integrated with classical 4th-order Runge–Kutta.
 */

export type RocketParams = {
  dryMass: number; // kg (everything except propellant)
  propMass: number; // kg
  totalImpulse: number; // N·s
  burnTime: number; // s
  diameter: number; // m
  cd: number; // drag coefficient (body, power-off approximation)
  launchAltitude: number; // m above sea level
  chuteDiameter: number; // m (0 = no recovery, ballistic descent)
  chuteCd: number;
};

export type FlightSample = { t: number; h: number; v: number; a: number; thrust: number; mass: number };

export type FlightResult = {
  samples: FlightSample[];
  apogee: number; // m above launch
  apogeeTime: number;
  maxVelocity: number;
  maxMach: number;
  maxAccelG: number;
  burnoutAltitude: number;
  burnoutVelocity: number;
  liftoffTWR: number;
  flightTime: number;
  landingVelocity: number;
  suggestedDelay: number; // s, apogee time minus burn time
};

const G0 = 9.80665;

/** International Standard Atmosphere (troposphere + lower stratosphere). */
export function isa(altitude: number) {
  const h = Math.max(0, altitude);
  if (h <= 11000) {
    const T = 288.15 - 0.0065 * h;
    const p = 101325 * Math.pow(T / 288.15, 5.25588);
    return { T, p, rho: p / (287.05 * T), a: Math.sqrt(1.4 * 287.05 * T) };
  }
  const T = 216.65;
  const p = 22632.1 * Math.exp((-G0 * (h - 11000)) / (287.05 * T));
  return { T, p, rho: p / (287.05 * T), a: Math.sqrt(1.4 * 287.05 * T) };
}

/**
 * Normalised thrust shape: short ignition peak then a regressive sustain phase,
 * scaled so its integral over the burn equals the total impulse.
 */
function thrustShape(f: number) {
  if (f < 0 || f > 1) return 0;
  if (f < 0.05) return (f / 0.05) * 1.5;
  if (f < 0.2) return 1.5 - ((f - 0.05) / 0.15) * 0.45;
  if (f < 0.9) return 1.05 - ((f - 0.2) / 0.7) * 0.15;
  return 0.9 * (1 - (f - 0.9) / 0.1);
}
let SHAPE_INTEGRAL = 0;
{
  const N = 4000;
  for (let i = 0; i < N; i++) SHAPE_INTEGRAL += thrustShape((i + 0.5) / N) / N;
}

export function thrustAt(t: number, p: RocketParams) {
  if (t < 0 || t > p.burnTime) return 0;
  const avg = p.totalImpulse / p.burnTime;
  return (avg * thrustShape(t / p.burnTime)) / SHAPE_INTEGRAL;
}

/** Fraction of impulse delivered by time t (mass is assumed to burn in proportion). */
function impulseFraction(t: number, p: RocketParams) {
  if (t <= 0) return 0;
  if (t >= p.burnTime) return 1;
  const N = 200;
  const f = t / p.burnTime;
  let s = 0;
  for (let i = 0; i < N; i++) s += thrustShape(((i + 0.5) / N) * f) * (f / N);
  return s / SHAPE_INTEGRAL;
}

export function simulateRocket(p: RocketParams, dt = 0.01): FlightResult {
  const area = Math.PI * (p.diameter / 2) ** 2;
  const chuteArea = Math.PI * (p.chuteDiameter / 2) ** 2;

  // Pre-tabulate impulse fraction for speed
  const steps = Math.max(10, Math.ceil(p.burnTime / dt) * 4);
  const fracTable = new Float64Array(steps + 1);
  for (let i = 0; i <= steps; i++) fracTable[i] = impulseFraction((i / steps) * p.burnTime, p);
  const massAt = (t: number) => {
    if (t >= p.burnTime) return p.dryMass;
    const x = (Math.max(0, t) / p.burnTime) * steps;
    const i = Math.min(steps - 1, Math.floor(x));
    const fr = fracTable[i] + (fracTable[i + 1] - fracTable[i]) * (x - i);
    return p.dryMass + p.propMass * (1 - fr);
  };

  let deployed = false;
  const accel = (t: number, h: number, v: number) => {
    const m = massAt(t);
    const atm = isa(p.launchAltitude + h);
    const F = thrustAt(t, p);
    const dragArea = deployed ? area * p.cd + chuteArea * p.chuteCd : area * p.cd;
    const D = 0.5 * atm.rho * v * Math.abs(v) * dragArea;
    let a = (F - D) / m - G0;
    // Rocket sits on the pad until thrust exceeds weight
    if (h <= 0 && v <= 0 && a < 0) a = 0;
    return a;
  };

  const samples: FlightSample[] = [];
  let t = 0;
  let h = 0;
  let v = 0;
  let apogee = 0;
  let apogeeTime = 0;
  let maxV = 0;
  let maxMach = 0;
  let maxA = 0;
  let burnoutAltitude = 0;
  let burnoutVelocity = 0;
  let passedBurnout = false;
  let leftPad = false;
  const record = (a: number) =>
    samples.push({ t, h, v, a, thrust: thrustAt(t, p), mass: massAt(t) });

  record(accel(0, 0, 0));
  const tMax = 600;
  let k = 0;
  while (t < tMax) {
    const k1v = accel(t, h, v);
    const k1h = v;
    const k2v = accel(t + dt / 2, h + (dt / 2) * k1h, v + (dt / 2) * k1v);
    const k2h = v + (dt / 2) * k1v;
    const k3v = accel(t + dt / 2, h + (dt / 2) * k2h, v + (dt / 2) * k2v);
    const k3h = v + (dt / 2) * k2v;
    const k4v = accel(t + dt, h + dt * k3h, v + dt * k3v);
    const k4h = v + dt * k3v;
    v += (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    h += (dt / 6) * (k1h + 2 * k2h + 2 * k3h + k4h);
    t += dt;
    k++;

    if (h > 0.01) leftPad = true;
    if (!passedBurnout && t >= p.burnTime) {
      passedBurnout = true;
      burnoutAltitude = h;
      burnoutVelocity = v;
    }
    if (h > apogee) {
      apogee = h;
      apogeeTime = t;
    }
    if (leftPad && !deployed && v < 0 && t > p.burnTime && p.chuteDiameter > 0) deployed = true;
    const a = accel(t, h, v);
    maxV = Math.max(maxV, Math.abs(v));
    maxMach = Math.max(maxMach, Math.abs(v) / isa(p.launchAltitude + h).a);
    if (t <= p.burnTime + dt) maxA = Math.max(maxA, a);
    if (k % Math.max(1, Math.round(0.05 / dt)) === 0) record(a);
    if (leftPad && h <= 0) {
      h = 0;
      record(a);
      break;
    }
    if (!leftPad && t > p.burnTime) break; // never lifted off
  }

  const m0 = p.dryMass + p.propMass;
  const peakThrust = thrustAt(p.burnTime * 0.05, p);
  return {
    samples,
    apogee,
    apogeeTime,
    maxVelocity: maxV,
    maxMach,
    maxAccelG: maxA / G0,
    burnoutAltitude,
    burnoutVelocity,
    liftoffTWR: peakThrust / (m0 * G0),
    flightTime: t,
    landingVelocity: Math.abs(samples[samples.length - 1]?.v ?? 0),
    suggestedDelay: Math.max(0, apogeeTime - p.burnTime),
  };
}

/** Time-step convergence: apogee difference between dt and dt/2 (analogue of a mesh study). */
export function timestepConvergence(p: RocketParams, dt = 0.02) {
  const coarse = simulateRocket(p, dt).apogee;
  const fine = simulateRocket(p, dt / 2).apogee;
  return { coarse, fine, relDiff: Math.abs(coarse - fine) / Math.max(1e-9, fine) };
}
