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
    c: [number, number, number];
    scale: number;
    speed: number;
    warp: number;
    alpha: number;
  }
> = {
  1: {
    a: [0.55, 0.45, 0.95],
    b: [0.1, 0.75, 0.85],
    c: [0.95, 0.55, 0.95],
    scale: 2.6,
    speed: 0.2,
    warp: 0.85,
    alpha: 0.55,
  },
  2: {
    a: [0.25, 0.85, 0.75],
    b: [0.7, 0.78, 0.98],
    c: [0.85, 0.98, 0.85],
    scale: 2.2,
    speed: 0.16,
    warp: 0.7,
    alpha: 0.5,
  },
  3: {
    a: [0.98, 0.75, 0.35],
    b: [0.95, 0.45, 0.85],
    c: [0.98, 0.9, 0.65],
    scale: 3.0,
    speed: 0.24,
    warp: 0.95,
    alpha: 0.6,
  },
  4: {
    a: [0.65, 0.7, 0.78],
    b: [0.8, 0.82, 0.9],
    c: [0.92, 0.92, 0.96],
    scale: 1.9,
    speed: 0.12,
    warp: 0.55,
    alpha: 0.42,
  },
  5: {
    a: [0.25, 0.95, 0.45],
    b: [0.1, 0.75, 0.85],
    c: [0.25, 0.85, 0.75],
    scale: 2.8,
    speed: 0.22,
    warp: 0.9,
    alpha: 0.58,
  },
  6: {
    a: [0.7, 0.78, 0.98],
    b: [0.55, 0.45, 0.95],
    c: [0.9, 0.92, 0.98],
    scale: 2.4,
    speed: 0.18,
    warp: 0.78,
    alpha: 0.52,
  },
};

export function HeroPlasmaCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.colorC.value.set(...preset.c);
    material.uniforms.scale.value = preset.scale;
    material.uniforms.speed.value = preset.speed;
    material.uniforms.warp.value = preset.warp;
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
        colorC: { value: new THREE.Vector3() },
        scale: { value: 2.6 },
        speed: { value: 0.2 },
        warp: { value: 0.85 },
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
        uniform vec3 colorC;
        uniform float scale;
        uniform float speed;
        uniform float warp;
        uniform float alpha;
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

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 6; i++) {
            v += a * noise(p);
            p = p * 2.01 + vec2(1.7, 9.2);
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2, 1.6);
          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          vec2 q = p * scale;
          q += warp * 0.65 * vec2(
            fbm(q + vec2(t * 0.35, -t * 0.25)) - 0.5,
            fbm(q + vec2(-t * 0.22, t * 0.18)) - 0.5
          );
          q += 0.22 * m;

          float n1 = fbm(q);
          float n2 = fbm(q * 1.35 + vec2(4.1, 1.9));
          float bands = 0.5 + 0.5 * sin((p.x + p.y) * 2.2 + n1 * 6.0 + t * 1.4);

          float mix1 = smoothstep(0.15, 0.95, n1);
          float mix2 = smoothstep(0.20, 0.98, n2);

          vec3 col = mix(colorB, colorA, mix1);
          col = mix(col, colorC, mix2 * 0.55);
          col = mix(col, col + 0.10 * vec3(1.0), bands * 0.15);

          float vignette = smoothstep(1.25, 0.35, length(p));
          float a = alpha * vignette * (0.28 + 0.72 * max(mix1, mix2));

          gl_FragColor = vec4(col, a);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.colorC.value.set(...preset.c);
    material.uniforms.scale.value = preset.scale;
    material.uniforms.speed.value = preset.speed;
    material.uniforms.warp.value = preset.warp;
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
