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
    glow: number;
    density: number;
    warp: number;
    speed: number;
  }
> = {
  1: {
    a: [0.55, 0.62, 0.95],
    b: [0.1, 0.12, 0.2],
    glow: 0.35,
    density: 18,
    warp: 0.55,
    speed: 0.35,
  },
  2: {
    a: [0.25, 0.85, 0.75],
    b: [0.05, 0.1, 0.14],
    glow: 0.3,
    density: 16,
    warp: 0.7,
    speed: 0.3,
  },
  3: {
    a: [0.95, 0.45, 0.85],
    b: [0.12, 0.06, 0.18],
    glow: 0.45,
    density: 20,
    warp: 0.85,
    speed: 0.42,
  },
  4: {
    a: [0.65, 0.7, 0.78],
    b: [0.07, 0.08, 0.12],
    glow: 0.22,
    density: 14,
    warp: 0.35,
    speed: 0.22,
  },
  5: {
    a: [0.95, 0.7, 0.4],
    b: [0.1, 0.08, 0.08],
    glow: 0.38,
    density: 22,
    warp: 0.75,
    speed: 0.5,
  },
  6: {
    a: [0.45, 0.9, 0.45],
    b: [0.06, 0.1, 0.08],
    glow: 0.32,
    density: 18,
    warp: 0.6,
    speed: 0.36,
  },
};

export function HeroGridCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.glow.value = preset.glow;
    material.uniforms.density.value = preset.density;
    material.uniforms.warp.value = preset.warp;
    material.uniforms.speed.value = preset.speed;
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
        glow: { value: 0.35 },
        density: { value: 18 },
        warp: { value: 0.55 },
        speed: { value: 0.35 },
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
        uniform float glow;
        uniform float density;
        uniform float warp;
        uniform float speed;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2, 1.6);

          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          float n = noise(p * 1.2 + vec2(t * 0.7, -t * 0.4));
          float n2 = noise(p * 2.0 + vec2(-t * 0.3, t * 0.6));

          p += warp * 0.18 * vec2(n - 0.5, n2 - 0.5);
          p += 0.12 * m;

          vec2 g = p * density;
          vec2 f = abs(fract(g) - 0.5);
          float line = min(f.x, f.y);

          float w = 0.02 + 0.02 * (0.5 + 0.5 * sin(t * 0.8));
          float grid = smoothstep(w, 0.0, line);

          float pulse = 0.5 + 0.5 * sin((p.x + p.y) * 2.0 + t * 2.0);
          vec3 base = mix(colorB, colorA, grid * (0.55 + 0.45 * pulse));

          float vignette = smoothstep(1.25, 0.35, length(p));

          // Edge fade
          float edgeFadeX = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
          float edgeFadeY = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.7, uv.y);
          float edgeFade = edgeFadeX * edgeFadeY;

          float a = (0.15 + grid * glow) * vignette * edgeFade;

          gl_FragColor = vec4(base, a);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.glow.value = preset.glow;
    material.uniforms.density.value = preset.density;
    material.uniforms.warp.value = preset.warp;
    material.uniforms.speed.value = preset.speed;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId: number;
    let t = 0;

    const animate = () => {
      t += 0.01;

      mouseRef.current.x +=
        (mouseTargetRef.current.x - mouseRef.current.x) * 0.06;
      mouseRef.current.y +=
        (mouseTargetRef.current.y - mouseRef.current.y) * 0.06;

      material.uniforms.time.value = t;
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
