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
    line: [number, number, number];
    fill: [number, number, number];
    levels: number;
    thickness: number;
    warp: number;
    speed: number;
    alpha: number;
  }
> = {
  1: {
    line: [0.78, 0.76, 0.95],
    fill: [0.06, 0.06, 0.1],
    levels: 12,
    thickness: 0.06,
    warp: 0.65,
    speed: 0.22,
    alpha: 0.55,
  },
  2: {
    line: [0.55, 0.95, 0.85],
    fill: [0.03, 0.06, 0.08],
    levels: 11,
    thickness: 0.06,
    warp: 0.6,
    speed: 0.18,
    alpha: 0.5,
  },
  3: {
    line: [0.95, 0.65, 0.98],
    fill: [0.08, 0.03, 0.1],
    levels: 13,
    thickness: 0.05,
    warp: 0.75,
    speed: 0.26,
    alpha: 0.6,
  },
  4: {
    line: [0.75, 0.78, 0.85],
    fill: [0.04, 0.04, 0.07],
    levels: 10,
    thickness: 0.07,
    warp: 0.4,
    speed: 0.14,
    alpha: 0.4,
  },
  5: {
    line: [0.98, 0.9, 0.7],
    fill: [0.08, 0.05, 0.04],
    levels: 14,
    thickness: 0.05,
    warp: 0.8,
    speed: 0.28,
    alpha: 0.58,
  },
  6: {
    line: [0.7, 0.98, 0.78],
    fill: [0.03, 0.06, 0.05],
    levels: 12,
    thickness: 0.06,
    warp: 0.65,
    speed: 0.2,
    alpha: 0.52,
  },
};

export function HeroTopoCanvas({ mouse, variant = 1 }: Props) {
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

    material.uniforms.lineColor.value.set(...preset.line);
    material.uniforms.fillColor.value.set(...preset.fill);
    material.uniforms.levels.value = preset.levels;
    material.uniforms.thickness.value = preset.thickness;
    material.uniforms.warp.value = preset.warp;
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
        lineColor: { value: new THREE.Vector3() },
        fillColor: { value: new THREE.Vector3() },
        levels: { value: 12 },
        thickness: { value: 0.06 },
        warp: { value: 0.65 },
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
        uniform vec3 lineColor;
        uniform vec3 fillColor;
        uniform float levels;
        uniform float thickness;
        uniform float warp;
        uniform float speed;
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
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p = p * 2.02 + vec2(3.4, 1.7);
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2, 1.6);
          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          vec2 q = p;
          q += warp * 0.25 * vec2(
            fbm(p * 1.2 + vec2(t * 0.6, -t * 0.4)) - 0.5,
            fbm(p * 1.8 + vec2(-t * 0.3, t * 0.5)) - 0.5
          );
          q += 0.18 * m;

          float h = fbm(q * 1.8 + vec2(t * 0.2, -t * 0.15));
          float lvl = floor(h * levels) / levels;

          float edge = abs(h - lvl);
          float line = smoothstep(thickness, 0.0, edge);

          vec3 col = mix(fillColor, lineColor, line);

          float vignette = smoothstep(1.25, 0.35, length(p));

          // Edge fade
          float edgeFadeX = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
          float edgeFadeY = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.7, uv.y);
          float edgeFade = edgeFadeX * edgeFadeY;

          float a = alpha * vignette * edgeFade * (0.25 + 0.75 * line);

          gl_FragColor = vec4(col, a);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.lineColor.value.set(...preset.line);
    material.uniforms.fillColor.value.set(...preset.fill);
    material.uniforms.levels.value = preset.levels;
    material.uniforms.thickness.value = preset.thickness;
    material.uniforms.warp.value = preset.warp;
    material.uniforms.speed.value = preset.speed;
    material.uniforms.alpha.value = preset.alpha;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId: number;
    let t2 = 0;

    const animate = () => {
      t2 += 0.01;

      mouseRef.current.x +=
        (mouseTargetRef.current.x - mouseRef.current.x) * 0.06;
      mouseRef.current.y +=
        (mouseTargetRef.current.y - mouseRef.current.y) * 0.06;

      material.uniforms.time.value = t2;
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
