"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { R_EARTH, transferPoint, trueAnomalyFromMean, type HohmannResult } from "@/lib/physics/orbit";

/**
 * 3D view of a Hohmann transfer. 1 scene unit = 1 Earth radius.
 * The initial orbit and transfer lie in the x–z plane; the final orbit is tilted by the plane change
 * about the line of apsides (the x axis), because the plane change happens at the second burn.
 */

function useThemeColors(ref: React.RefObject<HTMLDivElement | null>) {
  const [c, setC] = useState({ accent: "#4cc3ff", alt: "#7c95ff", line: "#24476f", faint: "#5d7b9d", ink: "#e6f0fb" });
  useEffect(() => {
    const read = () => {
      const el = ref.current;
      if (!el) return;
      const cs = getComputedStyle(el);
      const g = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
      setC({
        accent: g("--accent", "#4cc3ff"),
        alt: g("--accent-alt", "#7c95ff"),
        line: g("--line-strong", "#24476f"),
        faint: g("--faint", "#5d7b9d"),
        ink: g("--ink-2", "#c2d5ea"),
      });
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-world"] });
    return () => mo.disconnect();
  }, [ref]);
  return c;
}

function circlePoints(r: number, incRad: number, n = 160) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    const v = new THREE.Vector3(r * Math.cos(t), 0, r * Math.sin(t));
    v.applyAxisAngle(new THREE.Vector3(1, 0, 0), incRad);
    pts.push(v);
  }
  return pts;
}

function Earth({ colors }: { colors: { line: string; faint: string } }) {
  const ref = useRef<THREE.Group>(null);
  const lines = useMemo(() => {
    const out: THREE.Vector3[][] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = (lat * Math.PI) / 180;
      const r = Math.cos(phi);
      const y = Math.sin(phi);
      const ring: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const t = (i / 64) * Math.PI * 2;
        ring.push(new THREE.Vector3(r * Math.cos(t), y, r * Math.sin(t)));
      }
      out.push(ring);
    }
    for (let lon = 0; lon < 180; lon += 30) {
      const t = (lon * Math.PI) / 180;
      const ring: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        ring.push(new THREE.Vector3(Math.cos(a) * Math.cos(t), Math.sin(a), Math.cos(a) * Math.sin(t)));
      }
      out.push(ring);
    }
    return out;
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.05;
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.985, 48, 32]} />
        <meshBasicMaterial color={colors.line} transparent opacity={0.35} />
      </mesh>
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color={colors.faint} lineWidth={0.8} transparent opacity={0.7} />
      ))}
    </group>
  );
}

function Scene({ res, incDeg, colors }: { res: HohmannResult; incDeg: number; colors: ReturnType<typeof useThemeColors> }) {
  const inc = (incDeg * Math.PI) / 180;
  const r1 = res.r1 / R_EARTH;
  const r2 = res.r2 / R_EARTH;
  const orbit1 = useMemo(() => circlePoints(r1, 0), [r1]);
  const orbit2 = useMemo(() => circlePoints(r2, inc), [r2, inc]);
  const transfer = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 120; i++) {
      const p = transferPoint(res, (i / 120) * Math.PI);
      pts.push(new THREE.Vector3(p.x / R_EARTH, 0, p.y / R_EARTH));
    }
    return pts;
  }, [res]);
  const s = res.r2 >= res.r1 ? 1 : -1;
  const burn1 = new THREE.Vector3(s * r1, 0, 0);
  const burn2 = new THREE.Vector3(-s * r2, 0, 0);

  return (
    <>
      <Earth colors={colors} />
      <Line points={orbit1} color={colors.faint} lineWidth={1.2} />
      <Line points={orbit2} color={colors.alt} lineWidth={1.4} />
      <Line points={transfer} color={colors.accent} lineWidth={2} dashed dashSize={0.25} gapSize={0.15} />
      {[burn1, burn2].map((b, i) => (
        <mesh key={i} position={b}>
          <ringGeometry args={[0.14, 0.2, 24]} />
          <meshBasicMaterial color={colors.accent} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <SpacecraftWithInc res={res} colors={colors} inc={inc} />
    </>
  );
}

function SpacecraftWithInc({ res, colors, inc }: { res: HohmannResult; colors: { accent: string; ink: string }; inc: number }) {
  // Re-key on inputs so the animation restarts when the transfer changes
  return <SpacecraftInner key={`${res.r1}-${res.r2}-${inc}`} res={res} colors={colors} inc={inc} />;
}

function SpacecraftInner({ res, colors, inc }: { res: HohmannResult; colors: { accent: string; ink: string }; inc: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  const axis = useMemo(() => new THREE.Vector3(1, 0, 0), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    t.current = (t.current + Math.min(dt, 0.05)) % 7;
    const m = ref.current;
    if (!m) return;
    const phase = t.current;
    const s = res.r2 >= res.r1 ? 1 : -1;
    if (phase < 1.2) {
      const r = res.r1 / R_EARTH;
      const th = -Math.PI * 0.6 * (1 - phase / 1.2);
      tmp.set(s * r * Math.cos(th), 0, s * r * Math.sin(th));
    } else if (phase < 4.6) {
      const M = Math.PI * ((phase - 1.2) / 3.4);
      const p = transferPoint(res, trueAnomalyFromMean(M, res.e));
      tmp.set(p.x / R_EARTH, 0, p.y / R_EARTH);
    } else {
      const r = res.r2 / R_EARTH;
      const th = Math.PI + Math.PI * 0.6 * ((phase - 4.6) / 2.4);
      tmp.set(s * r * Math.cos(th), 0, s * r * Math.sin(th)).applyAxisAngle(axis, inc);
    }
    m.position.copy(tmp);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 16, 12]} />
      <meshBasicMaterial color={colors.ink} />
    </mesh>
  );
}

export default function OrbitScene({ res, incDeg }: { res: HohmannResult; incDeg: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const colors = useThemeColors(wrap);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const extent = Math.max(res.r1, res.r2) / R_EARTH;
  const dist = Math.max(5, extent * 2.4);

  return (
    <div ref={wrap} className="w-full h-[380px] md:h-[440px] rounded-lg bg-bg-2 border border-line overflow-hidden cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, dist * 0.55, dist], fov: 45, near: 0.05, far: 500 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        frameloop={inView ? "always" : "never"}
      >
        <CameraFit dist={dist} />
        <Scene res={res} incDeg={incDeg} colors={colors} />
        <OrbitControls enablePan={false} minDistance={2.5} maxDistance={dist * 2.5} enableDamping />
      </Canvas>
    </div>
  );
}

/** Eases the camera out/in when the orbit size changes a lot. */
function CameraFit({ dist }: { dist: number }) {
  useFrame(({ camera }) => {
    const cur = camera.position.length();
    const want = Math.hypot(dist, dist * 0.55);
    if (Math.abs(cur - want) / want > 0.6) camera.position.multiplyScalar(1 + (want / cur - 1) * 0.08);
  });
  return null;
}
