/**
 * Point-cloud shapes for the hero scenes. Generated once on the CPU, then morphed on the GPU.
 * Units: roughly "scene units", with the camera at z = 9.
 */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A planet (evenly spread sphere) with a tilted orbit ring. */
export function planetShape(count: number, seed = 1): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  const sphereCount = Math.floor(count * 0.62);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number;
    if (i < sphereCount) {
      const yy = 1 - (i / (sphereCount - 1)) * 2;
      const r = Math.sqrt(1 - yy * yy);
      const th = golden * i;
      const R = 2.15 + (rand() - 0.5) * 0.05;
      x = Math.cos(th) * r * R;
      y = yy * R;
      z = Math.sin(th) * r * R;
    } else {
      const th = rand() * Math.PI * 2;
      const R = 3.15 + Math.pow(rand(), 1.6) * 0.75;
      x = R * Math.cos(th);
      y = (rand() - 0.5) * 0.05;
      z = R * Math.sin(th);
      const tilt = 0.38;
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
      const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
      y = y2;
      z = z2;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

/** A swept-wing aircraft, nose pointing to +x, wings along z, up is +y. */
export function aircraftShape(count: number, seed = 2): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  const S = 0.92;
  for (let i = 0; i < count; i++) {
    const f = i / count;
    let x: number, y: number, z: number;
    if (f < 0.36) {
      // Fuselage: ogive nose, straight barrel, tapered tail cone
      x = rand() * 8 - 4;
      let r: number;
      if (x > 2.6) r = 0.46 * Math.sqrt(Math.max(0, 1 - Math.pow((x - 2.6) / 1.4, 2)));
      else if (x > -2.2) r = 0.46;
      else r = 0.46 - ((-2.2 - x) / 1.8) * 0.3;
      const t = rand() * Math.PI * 2;
      y = r * Math.cos(t) + (x < -2.2 ? ((-2.2 - x) / 1.8) * 0.2 : 0);
      z = r * Math.sin(t);
    } else if (f < 0.76) {
      // Main wing: swept, tapered, slight dihedral
      const s = Math.pow(rand(), 0.85) * 3.8;
      const side = rand() < 0.5 ? -1 : 1;
      const le = 1.0 - 0.62 * s;
      const te = -0.75 - 0.18 * s;
      x = te + rand() * (le - te);
      y = -0.18 + s * 0.06 + (rand() - 0.5) * 0.03;
      z = side * (0.4 + s);
    } else if (f < 0.83) {
      // Engines under the wings
      const side = rand() < 0.5 ? -1 : 1;
      const t = rand() * Math.PI * 2;
      x = 0.2 + rand() * 1.1;
      y = -0.42 + 0.17 * Math.cos(t);
      z = side * 1.55 + 0.17 * Math.sin(t);
    } else if (f < 0.92) {
      // Horizontal tail
      const s = rand() * 1.45;
      const side = rand() < 0.5 ? -1 : 1;
      const le = -2.85 - 0.45 * s;
      const te = -3.55 - 0.12 * s;
      x = te + rand() * (le - te);
      y = 0.12 + s * 0.05;
      z = side * (0.2 + s);
    } else {
      // Vertical fin
      const hh = rand() * 1.45;
      const le = -2.75 - 0.75 * hh;
      const te = -3.8 - 0.2 * hh;
      x = te + rand() * (le - te);
      y = 0.35 + hh;
      z = (rand() - 0.5) * 0.03;
    }
    out[i * 3] = x * S;
    out[i * 3 + 1] = y * S;
    out[i * 3 + 2] = z * S;
  }
  return out;
}

/** Per-particle random vectors used for staggered morphing, scatter and shimmer. */
export function randomVectors(count: number, seed = 3): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Random direction with random length, for an explosion-like scatter
    const u = rand() * 2 - 1;
    const t = rand() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    const len = 0.4 + rand() * 0.6;
    out[i * 3] = r * Math.cos(t) * len;
    out[i * 3 + 1] = u * len;
    out[i * 3 + 2] = r * Math.sin(t) * len;
  }
  return out;
}

/** Airflow streak particles: lanes in the y–z plane, phase along x. */
export function airflowLanes(count: number, seed = 4) {
  const rand = mulberry32(seed);
  const lanes = 64;
  const perLane = Math.max(1, Math.floor(count / lanes));
  const lane = new Float32Array(lanes * perLane * 3); // (y, z, phase)
  let k = 0;
  for (let l = 0; l < lanes; l++) {
    const z = (rand() - 0.5) * 9;
    const y = (rand() - 0.5) * 3.2;
    const offset = rand();
    for (let j = 0; j < perLane; j++) {
      lane[k++] = y;
      lane[k++] = z;
      lane[k++] = (j / perLane + offset + rand() * 0.01) % 1;
    }
  }
  return lane;
}
