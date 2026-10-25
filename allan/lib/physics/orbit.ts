/**
 * Hohmann transfer between circular orbits, with an optional plane change
 * combined into the apogee burn, plus the Tsiolkovsky rocket equation.
 */

export const MU_EARTH = 398600.4418; // km^3/s^2
export const R_EARTH = 6378.137; // km
export const G0 = 9.80665; // m/s^2

export type HohmannInput = {
  alt1: number; // km, initial circular orbit altitude
  alt2: number; // km, final circular orbit altitude
  incChangeDeg: number; // plane change performed at the second burn
  isp: number; // s
  spacecraftMass: number; // kg, mass before the first burn
};

export type HohmannResult = {
  r1: number;
  r2: number;
  a: number; // transfer semi-major axis, km
  e: number; // transfer eccentricity
  v1: number; // km/s circular speed at r1
  v2: number;
  vPeri: number; // transfer speed at periapsis
  vApo: number;
  dv1: number; // km/s
  dv2: number; // km/s (includes plane change)
  dv2NoPlane: number;
  dvTotal: number;
  dvSeparatePlaneChange: number; // total if plane change were done as a separate burn in the final orbit
  tof: number; // s
  period1: number; // s
  period2: number; // s
  propellantMass: number; // kg
  massFraction: number;
};

export function hohmann({ alt1, alt2, incChangeDeg, isp, spacecraftMass }: HohmannInput): HohmannResult {
  const r1 = R_EARTH + alt1;
  const r2 = R_EARTH + alt2;
  const a = (r1 + r2) / 2;
  const e = Math.abs(r2 - r1) / (r1 + r2);
  const v1 = Math.sqrt(MU_EARTH / r1);
  const v2 = Math.sqrt(MU_EARTH / r2);
  const vPeri = Math.sqrt(MU_EARTH * (2 / r1 - 1 / a));
  const vApo = Math.sqrt(MU_EARTH * (2 / r2 - 1 / a));
  const di = (incChangeDeg * Math.PI) / 180;
  const dv1 = Math.abs(vPeri - v1);
  const dv2NoPlane = Math.abs(v2 - vApo);
  // Combined burn: law of cosines between arrival and target velocity vectors
  const dv2 = Math.sqrt(vApo * vApo + v2 * v2 - 2 * vApo * v2 * Math.cos(di));
  const dvSeparatePlaneChange = dv1 + dv2NoPlane + 2 * v2 * Math.sin(di / 2);
  const dvTotal = dv1 + dv2;
  const tof = Math.PI * Math.sqrt((a * a * a) / MU_EARTH);
  const period = (r: number) => 2 * Math.PI * Math.sqrt((r * r * r) / MU_EARTH);
  const massFraction = 1 - Math.exp(-(dvTotal * 1000) / (isp * G0));
  return {
    r1,
    r2,
    a,
    e,
    v1,
    v2,
    vPeri,
    vApo,
    dv1,
    dv2,
    dv2NoPlane,
    dvTotal,
    dvSeparatePlaneChange,
    tof,
    period1: period(r1),
    period2: period(r2),
    propellantMass: spacecraftMass * massFraction,
    massFraction,
  };
}

/** Position on the transfer ellipse at true anomaly nu (rad), periapsis on +x, in km. */
export function transferPoint(res: HohmannResult, nu: number) {
  const p = res.a * (1 - res.e * res.e);
  const r = p / (1 + res.e * Math.cos(nu));
  const sign = res.r2 >= res.r1 ? 1 : -1; // lowering: start at apoapsis
  return { x: sign * r * Math.cos(nu), y: sign * r * Math.sin(nu), r };
}

/** Mean anomaly -> true anomaly (Newton solve of Kepler's equation). */
export function trueAnomalyFromMean(M: number, e: number) {
  let E = M;
  for (let i = 0; i < 12; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  return 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
}
