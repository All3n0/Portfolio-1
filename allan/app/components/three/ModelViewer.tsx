"use client";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";

/**
 * Interactive viewer for a .glb model in /public (set `model:` in a project's markdown file).
 * See README for exporting CAD to a compressed .glb.
 */
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ModelViewer({ url }: { url: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [3, 2, 4], fov: 40 }} dpr={[1, 1.5]} frameloop={inView ? "always" : "never"}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} />
        <directionalLight position={[-6, -2, -4]} intensity={0.4} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.15}>
            <Center>
              <Model url={url} />
            </Center>
          </Bounds>
        </Suspense>
        <OrbitControls makeDefault enablePan={false} autoRotate autoRotateSpeed={0.6} enableDamping />
      </Canvas>
    </div>
  );
}
