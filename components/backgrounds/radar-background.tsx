"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Variant = 1 | 2 | 3 | 4 | 5 | 6;

type Props = {
  mouse: { x: number; y: number };
  variant?: Variant;
};

const PRESETS: Record<
  Variant,
  {
    a: [number, number, number];
    b: [number, number, number];
    rings: number;
    beam: number;
    speed: number;
    alpha: number;
  }
> = {
  1: {
    a: [0.25, 0.95, 0.45],
    b: [0.06, 0.06, 0.1],
    rings: 10.0,
    beam: 0.9,
    speed: 0.22,
    alpha: 0.55,
  },
  2: {
    a: [0.1, 0.75, 0.85],
    b: [0.03, 0.06, 0.08],
    rings: 9.0,
    beam: 0.75,
    speed: 0.18,
    alpha: 0.5,
  },
  3: {
    a: [0.95, 0.45, 0.85],
    b: [0.1, 0.03, 0.12],
    rings: 12.0,
    beam: 1.0,
    speed: 0.26,
    alpha: 0.6,
  },
  4: {
    a: [0.7, 0.78, 0.98],
    b: [0.04, 0.04, 0.07],
    rings: 7.5,
    beam: 0.55,
    speed: 0.14,
    alpha: 0.42,
  },
  5: {
    a: [0.98, 0.75, 0.35],
    b: [0.08, 0.05, 0.04],
    rings: 11.0,
    beam: 0.95,
    speed: 0.28,
    alpha: 0.58,
  },
  6: {
    a: [0.25, 0.85, 0.75],
    b: [0.03, 0.06, 0.05],
    rings: 10.5,
    beam: 0.85,
    speed: 0.2,
    alpha: 0.52,
  },
};

export function HeroRadarCanvas({ mouse, variant = 1 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    mouseTargetRef.current = mouse;
  }, [mouse]);

  useEffect(() => {
    const preset = PRESETS[variant];
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.rings.value = preset.rings;
    material.uniforms.beam.value = preset.beam;
    material.uniforms.speed.value = preset.speed;
    material.uniforms.alpha.value = preset.alpha;
  }, [variant]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      10
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2.2, 1.6, 1, 1);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        time: { value: 0 },
        mouseX: { value: 0 },
        mouseY: { value: 0 },
        colorA: { value: new THREE.Vector3() },
        colorB: { value: new THREE.Vector3() },
        rings: { value: 10.0 },
        beam: { value: 0.9 },
        speed: { value: 0.22 },
        alpha: { value: 0.55 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float mouseX;
        uniform float mouseY;
        uniform vec3 colorA;
        uniform vec3 colorB;
        uniform float rings;
        uniform float beam;
        uniform float speed;
        uniform float alpha;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void main() {
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2, 1.6);
          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          vec2 center = 0.18 * m;
          vec2 d = p - center;
          float r = length(d);
          float ang = atan(d.y, d.x);

          float ring = abs(fract(r * rings - t * 0.35) - 0.5);
          float ringLine = smoothstep(0.10, 0.02, ring);

          float beamAng = t * 1.8;
          float beamMask = exp(-pow(ang - beamAng, 2.0) * 8.0);
          float beamMask2 = exp(-pow(ang - (beamAng - 6.2831), 2.0) * 8.0);
          float beamLine = beam * max(beamMask, beamMask2);

          float blip = smoothstep(0.995, 1.0, hash(floor((uv + vec2(t * 0.05, -t * 0.03)) * 120.0)));
          blip *= smoothstep(0.75, 0.05, r);

          float glow = ringLine * 0.55 + beamLine * 0.60 + blip * 0.8;
          vec3 col = mix(colorB, colorA, glow);

          float vignette = smoothstep(1.25, 0.35, length(p));

          // Edge fade
          float edgeFadeX = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
          float edgeFadeY = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.7, uv.y);
          float edgeFade = edgeFadeX * edgeFadeY;

          float a = alpha * vignette * edgeFade * (0.12 + 0.88 * glow);

          gl_FragColor = vec4(col, a);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.rings.value = preset.rings;
    material.uniforms.beam.value = preset.beam;
    material.uniforms.speed.value = preset.speed;
    material.uniforms.alpha.value = preset.alpha;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId: number;
    let tt = 0;

    const animate = () => {
      tt += 0.01;

      mouseRef.current.x +=
        (mouseTargetRef.current.x - mouseRef.current.x) * 0.06;
      mouseRef.current.y +=
        (mouseTargetRef.current.y - mouseRef.current.y) * 0.06;

      material.uniforms.time.value = tt;
      material.uniforms.mouseX.value = mouseRef.current.x;
      material.uniforms.mouseY.value = mouseRef.current.y;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      materialRef.current = null;
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      <div ref={containerRef} className="absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        style={{
          background: "linear-gradient(to bottom, transparent, rgb(10 10 14))",
        }}
      />
    </div>
  );
}
