"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { aircraftShape, airflowLanes, planetShape, randomVectors } from "./shapes";

/**
 * One particle system, two worlds.
 *   variant="dev"  : a planet with an orbit ring that disperses as you scroll, and morphs into
 *                    an aircraft when the visitor switches to the aerospace side.
 *   variant="aero" : assembles into an aircraft on load, with airflow streaming past it,
 *                    and banks as you scroll.
 *
 * Performance notes
 *   - Morphing, scatter and shimmer all happen in the vertex shader; the CPU only sets uniforms.
 *   - The canvas stops rendering (frameloop="never") when scrolled out of view.
 *   - Pixel ratio is capped at 1.5 and particle counts drop on small screens.
 */

const particleVertex = /* glsl */ `
  uniform float uMorph;
  uniform float uScatter;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute vec3 aTarget;
  attribute vec3 aRand;
  varying float vAlpha;
  varying float vMix;
  void main() {
    float stagger = aRand.x * 0.5 + 0.5;
    float m = clamp(uMorph * 1.6 - stagger * 0.6, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 p = mix(position, aTarget, m);
    p += aRand * sin(m * 3.14159) * 1.4;
    p += aRand * uScatter * 9.0;
    p += 0.03 * vec3(
      sin(uTime * 0.9 + aRand.y * 40.0),
      cos(uTime * 0.7 + aRand.z * 40.0),
      sin(uTime * 0.8 + aRand.x * 40.0)
    );
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (9.0 / -mv.z) * (0.7 + 0.6 * fract(aRand.y * 13.7 + 0.5));
    vAlpha = 1.0 - uScatter * 0.9;
    vMix = m;
  }
`;

const particleFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vMix;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.08, d) * vAlpha * uOpacity;
    gl_FragColor = vec4(mix(uColorA, uColorB, vMix), a);
  }
`;

const flowVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uFlow;
  attribute vec3 aLane;
  varying float vAlpha;
  void main() {
    float L = 14.0;
    float x = mod(aLane.z * L - uTime * 2.4, L) - L * 0.5;
    float y = aLane.x;
    float z = aLane.y;
    float r = length(vec2(y, z));
    float body = exp(-x * x / 9.0) * smoothstep(1.4, 0.15, r);
    vec2 dir = r > 0.001 ? vec2(y, z) / r : vec2(1.0, 0.0);
    y += dir.x * body * 0.45;
    z += dir.y * body * 0.45;
    float inSpan = step(abs(z), 3.5);
    float wing = exp(-(x + 0.2) * (x + 0.2) / 1.2) * inSpan * exp(-abs(y + 0.15) * 2.5);
    y += sign(y + 0.15) * wing * 0.35;
    y -= smoothstep(0.0, -4.0, x) * 0.14 * inSpan * exp(-abs(y) * 1.5);
    vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (9.0 / -mv.z);
    float edge = smoothstep(L * 0.5, L * 0.5 - 2.5, abs(x));
    vAlpha = edge * uFlow;
  }
`;

const flowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vAlpha * uOpacity);
  }
`;

type Variant = "dev" | "aero";

function readColor(el: Element | null, name: string, fallback: string) {
  if (!el) return new THREE.Color(fallback);
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return new THREE.Color(v || fallback);
}

function lerpAngle(a: number, b: number, t: number) {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

function Scene({
  variant,
  count,
  reducedMotion,
  container,
}: {
  variant: Variant;
  count: number;
  reducedMotion: boolean;
  container: React.RefObject<HTMLDivElement | null>;
}) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const morphTarget = useRef(variant === "aero" ? 1 : 0);
  const morph = useRef(variant === "aero" && !reducedMotion ? 0 : morphTarget.current);
  const scroll = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const spin = useRef(0);
  const flow = useRef(0);

  const { geometry, flowGeometry } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(planetShape(count), 3));
    g.setAttribute("aTarget", new THREE.BufferAttribute(aircraftShape(count), 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(randomVectors(count), 3));
    let fg: THREE.BufferGeometry | null = null;
    if (variant === "aero") {
      fg = new THREE.BufferGeometry();
      const lanes = airflowLanes(Math.round(count * 0.22));
      fg.setAttribute("aLane", new THREE.BufferAttribute(lanes, 3));
      // Dummy position attribute so three.js knows the vertex count
      fg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lanes.length), 3));
      fg.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);
    }
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);
    return { geometry: g, flowGeometry: fg };
  }, [count, variant]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uMorph: { value: morph.current },
          uScatter: { value: 0 },
          uTime: { value: 0 },
          uSize: { value: variant === "aero" ? 3.0 : 3.0 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
          uColorA: { value: new THREE.Color("#f97316") },
          uColorB: { value: new THREE.Color("#4cc3ff") },
          uOpacity: { value: 0.9 },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const flowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: flowVertex,
        fragmentShader: flowFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 2.2 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
          uFlow: { value: 0 },
          uColor: { value: new THREE.Color("#4cc3ff") },
          uOpacity: { value: 0.5 },
        },
      }),
    [gl]
  );

  // Theme- and world-aware colours, re-read whenever <html> class or data-world changes
  useEffect(() => {
    const apply = () => {
      const el = container.current;
      const a = readColor(el, "--particle-a", "#f97316");
      const b = readColor(el, "--particle-b", "#4cc3ff");
      const isDark = document.documentElement.classList.contains("dark");
      material.uniforms.uColorA.value.copy(a);
      material.uniforms.uColorB.value.copy(b);
      material.uniforms.uOpacity.value = isDark ? 0.95 : 0.9;
      flowMaterial.uniforms.uColor.value.copy(b);
      flowMaterial.uniforms.uOpacity.value = isDark ? 0.45 : 0.35;
    };
    apply();
    const mo = new MutationObserver(apply);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-world"] });
    return () => mo.disconnect();
  }, [material, flowMaterial, container]);

  // Scroll progress through the hero (0 at top, 1 when the hero has scrolled away)
  useEffect(() => {
    const onScroll = () => {
      const el = container.current;
      const h = el?.offsetHeight || window.innerHeight;
      scroll.current = Math.min(1, Math.max(0, window.scrollY / (h * 0.85)));
    };
    const onPointer = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    const onMorph = (e: Event) => {
      morphTarget.current = (e as CustomEvent<string>).detail === "aero" ? 1 : 0;
      if (reducedMotion) morph.current = morphTarget.current;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("world:morph", onMorph);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("world:morph", onMorph);
    };
  }, [container, reducedMotion]);

  useEffect(() => () => {
    geometry.dispose();
    flowGeometry?.dispose();
    material.dispose();
    flowMaterial.dispose();
  }, [geometry, flowGeometry, material, flowMaterial]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const u = material.uniforms;
    if (!reducedMotion) {
      u.uTime.value += dt;
      flowMaterial.uniforms.uTime.value += dt;
      const rate = morphTarget.current > morph.current ? 0.9 : 1.2;
      morph.current += (morphTarget.current - morph.current) * Math.min(1, dt * rate * 2.2);
      if (Math.abs(morphTarget.current - morph.current) < 0.001) morph.current = morphTarget.current;
    }
    const m = morph.current;
    u.uMorph.value = m;

    const s = scroll.current;
    u.uScatter.value = variant === "dev" ? s * s : 0;

    if (flowGeometry) {
      flow.current += ((m > 0.92 ? 1 : 0) - flow.current) * Math.min(1, dt * 1.5);
      flowMaterial.uniforms.uFlow.value = flow.current;
    }

    const g = outer.current;
    const gi = inner.current;
    if (!g || !gi) return;
    const px = reducedMotion ? 0 : pointer.current.x;
    const py = reducedMotion ? 0 : pointer.current.y;

    if (m < 0.5) {
      if (!reducedMotion) spin.current += dt * 0.12;
      g.rotation.y = lerpAngle(g.rotation.y, spin.current + px * 0.5, 0.06);
      g.rotation.x += (0.18 + py * 0.3 - g.rotation.x) * 0.06;
    } else {
      const sway = reducedMotion ? 0 : Math.sin(u.uTime.value * 0.45) * 0.08;
      g.rotation.y = lerpAngle(g.rotation.y, -0.72 + sway + px * 0.35, 0.05);
      g.rotation.x += (0.38 + py * 0.2 - g.rotation.x) * 0.05;
    }
    // Aircraft banks and pitches as the visitor scrolls the aerospace hero
    const bankTarget = variant === "aero" ? s * 0.55 : 0;
    gi.rotation.x += (bankTarget - gi.rotation.x) * 0.08;
    gi.rotation.z += ((variant === "aero" ? s * 0.12 : 0) - gi.rotation.z) * 0.08;
    const scale = 1 + (variant === "dev" ? s * 0.25 : 0);
    g.scale.setScalar(g.scale.x + (scale - g.scale.x) * 0.1);
    state.camera.position.y = variant === "aero" ? -s * 0.8 : 0;
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <points geometry={geometry} material={material} frustumCulled={false} />
        {flowGeometry && <points geometry={flowGeometry} material={flowMaterial} frustumCulled={false} />}
      </group>
    </group>
  );
}

export default function HeroParticles({ variant, className = "" }: { variant: Variant; className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [config, setConfig] = useState<{ count: number; reduced: boolean } | null>(null);

  useEffect(() => {
    const small = window.innerWidth < 768;
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setConfig({ count: small || lowPower ? 2600 : 5200, reduced });
  }, []);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={container} className={className} aria-hidden="true">
      {config && (
        <Canvas
          camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 100 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          frameloop={inView ? (config.reduced ? "demand" : "always") : "never"}
          style={{ pointerEvents: "none" }}
        >
          <Scene variant={variant} count={config.count} reducedMotion={config.reduced} container={container} />
        </Canvas>
      )}
    </div>
  );
}
