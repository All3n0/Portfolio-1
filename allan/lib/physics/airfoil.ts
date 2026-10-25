/**
 * Hess–Smith panel method for NACA 4-digit airfoils (inviscid, incompressible).
 * Constant-strength source panels + one uniform vortex strength, Kutta condition at the TE.
 *
 * Reference: Moran, "An Introduction to Theoretical and Computational Aerodynamics"; Katz & Plotkin.
 */

export type NacaParams = {
  m: number; // max camber, fraction of chord (e.g. 0.02)
  p: number; // location of max camber, fraction of chord (e.g. 0.4)
  t: number; // thickness, fraction of chord (e.g. 0.12)
};

export type Geometry = {
  x: number[]; // panel nodes, TE lower -> LE -> TE upper (clockwise)
  y: number[];
  n: number; // number of panels
};

/** NACA 4-digit camber line and slope at x (0..1). */
export function camber(x: number, m: number, p: number): { yc: number; dyc: number } {
  if (m === 0 || p === 0) return { yc: 0, dyc: 0 };
  if (x < p) {
    return { yc: (m / (p * p)) * (2 * p * x - x * x), dyc: ((2 * m) / (p * p)) * (p - x) };
  }
  return {
    yc: (m / ((1 - p) * (1 - p))) * (1 - 2 * p + 2 * p * x - x * x),
    dyc: ((2 * m) / ((1 - p) * (1 - p))) * (p - x),
  };
}

/** Closed-trailing-edge NACA 4-digit with cosine spacing. */
export function nacaGeometry({ m, p, t }: NacaParams, panels = 120): Geometry {
  const half = Math.floor(panels / 2);
  const xs: number[] = [];
  for (let i = 0; i <= half; i++) xs.push(0.5 * (1 - Math.cos((Math.PI * i) / half)));

  const upper: [number, number][] = [];
  const lower: [number, number][] = [];
  for (const xc of xs) {
    const yt =
      5 * t * (0.2969 * Math.sqrt(xc) - 0.126 * xc - 0.3516 * xc ** 2 + 0.2843 * xc ** 3 - 0.1036 * xc ** 4);
    const { yc, dyc } = camber(xc, m, p);
    const th = Math.atan(dyc);
    upper.push([xc - yt * Math.sin(th), yc + yt * Math.cos(th)]);
    lower.push([xc + yt * Math.sin(th), yc - yt * Math.cos(th)]);
  }
  // TE lower -> LE -> TE upper
  const pts = [...lower.reverse(), ...upper.slice(1)];
  return { x: pts.map((q) => q[0]), y: pts.map((q) => q[1]), n: pts.length - 1 };
}

/** Dense LU decomposition with partial pivoting (in place). */
function luDecompose(A: Float64Array[], perm: Int32Array) {
  const n = A.length;
  for (let i = 0; i < n; i++) perm[i] = i;
  for (let k = 0; k < n; k++) {
    let piv = k;
    let max = Math.abs(A[k][k]);
    for (let i = k + 1; i < n; i++) {
      const v = Math.abs(A[i][k]);
      if (v > max) {
        max = v;
        piv = i;
      }
    }
    if (piv !== k) {
      [A[k], A[piv]] = [A[piv], A[k]];
      [perm[k], perm[piv]] = [perm[piv], perm[k]];
    }
    const akk = A[k][k];
    for (let i = k + 1; i < n; i++) {
      const f = (A[i][k] /= akk);
      if (f === 0) continue;
      const Ai = A[i];
      const Ak = A[k];
      for (let j = k + 1; j < n; j++) Ai[j] -= f * Ak[j];
    }
  }
}

function luSolve(LU: Float64Array[], perm: Int32Array, b: number[]): number[] {
  const n = LU.length;
  const y = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    let s = b[perm[i]];
    for (let j = 0; j < i; j++) s -= LU[i][j] * y[j];
    y[i] = s;
  }
  for (let i = n - 1; i >= 0; i--) {
    let s = y[i];
    for (let j = i + 1; j < n; j++) s -= LU[i][j] * y[j];
    y[i] = s / LU[i][i];
  }
  return y;
}

export type PanelSolver = {
  geometry: Geometry;
  /** Solve at angle of attack (degrees). */
  solve: (alphaDeg: number) => PanelResult;
};

export type PanelResult = {
  alphaDeg: number;
  cl: number;
  cm: number; // about quarter chord
  xc: number[]; // control points
  yc: number[];
  cp: number[];
  upper: boolean[]; // whether control point is on upper surface
};

/**
 * Builds the influence matrices once for a given geometry, so sweeping angle of attack
 * only costs a forward/back substitution per angle.
 */
export function createPanelSolver(geometry: Geometry): PanelSolver {
  const { x, y, n } = geometry;
  const xc = new Array<number>(n);
  const yc = new Array<number>(n);
  const th = new Array<number>(n);
  const len = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    xc[i] = 0.5 * (x[i] + x[i + 1]);
    yc[i] = 0.5 * (y[i] + y[i + 1]);
    const dx = x[i + 1] - x[i];
    const dy = y[i + 1] - y[i];
    th[i] = Math.atan2(dy, dx);
    len[i] = Math.hypot(dx, dy);
  }

  // Influence coefficients: normal (An, Bn) and tangential (At, Bt) velocity at i due to panel j
  const An: Float64Array[] = [];
  const At: Float64Array[] = [];
  const Bn = new Float64Array(n);
  const Bt = new Float64Array(n);
  const inv2pi = 1 / (2 * Math.PI);
  for (let i = 0; i < n; i++) {
    const ani = new Float64Array(n);
    const ati = new Float64Array(n);
    let bn = 0;
    let bt = 0;
    for (let j = 0; j < n; j++) {
      let beta: number;
      let lnr: number;
      if (i === j) {
        beta = Math.PI;
        lnr = 0;
      } else {
        const r1 = Math.hypot(xc[i] - x[j], yc[i] - y[j]);
        const r2 = Math.hypot(xc[i] - x[j + 1], yc[i] - y[j + 1]);
        lnr = Math.log(r2 / r1);
        beta = Math.atan2(
          (yc[i] - y[j + 1]) * (xc[i] - x[j]) - (xc[i] - x[j + 1]) * (yc[i] - y[j]),
          (xc[i] - x[j + 1]) * (xc[i] - x[j]) + (yc[i] - y[j + 1]) * (yc[i] - y[j])
        );
      }
      const s = Math.sin(th[i] - th[j]);
      const c = Math.cos(th[i] - th[j]);
      ani[j] = inv2pi * (s * lnr + c * beta);
      ati[j] = inv2pi * (s * beta - c * lnr);
      bn += inv2pi * (c * lnr - s * beta);
      bt += inv2pi * (s * lnr + c * beta);
    }
    An.push(ani);
    At.push(ati);
    Bn[i] = bn;
    Bt[i] = bt;
  }

  // System: n tangency equations + 1 Kutta equation, unknowns q_1..q_n, gamma
  const A: Float64Array[] = [];
  for (let i = 0; i < n; i++) {
    const row = new Float64Array(n + 1);
    row.set(An[i]);
    row[n] = Bn[i];
    A.push(row);
  }
  const kutta = new Float64Array(n + 1);
  for (let j = 0; j < n; j++) kutta[j] = At[0][j] + At[n - 1][j];
  kutta[n] = Bt[0] + Bt[n - 1];
  A.push(kutta);

  const perm = new Int32Array(n + 1);
  luDecompose(A, perm);

  const upper = xc.map((_, i) => i >= n / 2);

  return {
    geometry,
    solve(alphaDeg: number) {
      const a = (alphaDeg * Math.PI) / 180;
      const b = new Array<number>(n + 1);
      for (let i = 0; i < n; i++) b[i] = -Math.sin(a - th[i]);
      b[n] = -Math.cos(a - th[0]) - Math.cos(a - th[n - 1]);
      const sol = luSolve(A, perm, b);
      const gamma = sol[n];

      const cp = new Array<number>(n);
      let cx = 0;
      let cy = 0;
      let cm = 0;
      for (let i = 0; i < n; i++) {
        let vt = Math.cos(a - th[i]) + gamma * Bt[i];
        for (let j = 0; j < n; j++) vt += At[i][j] * sol[j];
        cp[i] = 1 - vt * vt;
        // Pressure force on panel i: -cp * len * outward normal; outward normal for clockwise = (-sin th, cos th)
        const fx = cp[i] * len[i] * Math.sin(th[i]);
        const fy = -cp[i] * len[i] * Math.cos(th[i]);
        cx += fx;
        cy += fy;
        cm += -(xc[i] - 0.25) * fy + yc[i] * fx;
      }
      const cl = cy * Math.cos(a) - cx * Math.sin(a);
      return { alphaDeg, cl, cm, xc, yc, cp, upper };
    },
  };
}

/** Zero-lift angle from thin airfoil theory (degrees), via numerical integration. */
export function zeroLiftAngleDeg(m: number, p: number): number {
  if (m === 0) return 0;
  const N = 2000;
  let sum = 0;
  for (let k = 0; k < N; k++) {
    const t0 = ((k + 0.5) / N) * Math.PI;
    const xx = 0.5 * (1 - Math.cos(t0));
    sum += camber(xx, m, p).dyc * (Math.cos(t0) - 1);
  }
  const integral = sum * (Math.PI / N);
  return (-(1 / Math.PI) * integral * 180) / Math.PI;
}

/** Thin airfoil theory lift coefficient. */
export function thinAirfoilCl(alphaDeg: number, alphaL0Deg: number): number {
  return 2 * Math.PI * (((alphaDeg - alphaL0Deg) * Math.PI) / 180);
}

export function nacaName({ m, p, t }: NacaParams): string {
  const d1 = Math.round(m * 100);
  const d2 = Math.round(p * 10);
  const d34 = Math.round(t * 100)
    .toString()
    .padStart(2, "0");
  return `NACA ${d1}${d2}${d34}`;
}
