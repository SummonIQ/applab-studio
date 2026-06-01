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
    edge: number;
    cells: number;
    drift: number;
    speed: number;
    alpha: number;
  }
> = {
  1: {
    a: [0.7, 0.78, 0.98],
    b: [0.06, 0.06, 0.1],
    edge: 0.08,
    cells: 7.5,
    drift: 0.35,
    speed: 0.22,
    alpha: 0.55,
  },
  2: {
    a: [0.45, 0.9, 0.75],
    b: [0.03, 0.06, 0.08],
    edge: 0.09,
    cells: 6.8,
    drift: 0.3,
    speed: 0.18,
    alpha: 0.5,
  },
  3: {
    a: [0.95, 0.55, 0.95],
    b: [0.1, 0.03, 0.12],
    edge: 0.07,
    cells: 8.2,
    drift: 0.42,
    speed: 0.26,
    alpha: 0.6,
  },
  4: {
    a: [0.8, 0.82, 0.9],
    b: [0.04, 0.04, 0.07],
    edge: 0.1,
    cells: 5.8,
    drift: 0.22,
    speed: 0.14,
    alpha: 0.42,
  },
  5: {
    a: [0.98, 0.9, 0.65],
    b: [0.08, 0.05, 0.04],
    edge: 0.07,
    cells: 8.8,
    drift: 0.48,
    speed: 0.28,
    alpha: 0.58,
  },
  6: {
    a: [0.7, 0.98, 0.78],
    b: [0.03, 0.06, 0.05],
    edge: 0.08,
    cells: 7.2,
    drift: 0.34,
    speed: 0.2,
    alpha: 0.52,
  },
};

export function HeroVoronoiCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.edge.value = preset.edge;
    material.uniforms.cells.value = preset.cells;
    material.uniforms.drift.value = preset.drift;
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
        edge: { value: 0.08 },
        cells: { value: 7.5 },
        drift: { value: 0.35 },
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
        uniform float edge;
        uniform float cells;
        uniform float drift;
        uniform float speed;
        uniform float alpha;
        varying vec2 vUv;

        vec2 hash2(vec2 p) {
          float n = sin(dot(p, vec2(127.1, 311.7)));
          float m = sin(dot(p, vec2(269.5, 183.3)));
          return fract(vec2(n, m) * 43758.5453123);
        }

        void main() {
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2, 1.6);
          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          vec2 q = p + 0.18 * m;
          q += drift * 0.12 * vec2(sin(t * 0.7), cos(t * 0.6));

          q *= cells;
          vec2 i = floor(q);
          vec2 f = fract(q);

          float md = 10.0;
          float md2 = 10.0;

          for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
              vec2 g = vec2(float(x), float(y));
              vec2 o = hash2(i + g);
              o = 0.5 + 0.5 * sin(6.2831 * (o + vec2(t * 0.20, -t * 0.18)));
              vec2 r = g + o - f;
              float d = dot(r, r);
              if (d < md) {
                md2 = md;
                md = d;
              } else if (d < md2) {
                md2 = d;
              }
            }
          }

          float dist = sqrt(md);
          float edgeDist = sqrt(md2) - dist;

          float lines = smoothstep(edge * 0.65, 0.0, edgeDist);
          float cellsFill = smoothstep(0.85, 0.05, dist);

          vec3 col = mix(colorB, colorA, lines);
          col = mix(col, colorA, cellsFill * 0.08);

          float vignette = smoothstep(1.25, 0.35, length(p));

          // Edge fade
          float edgeFadeX = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
          float edgeFadeY = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.7, uv.y);
          float edgeFade = edgeFadeX * edgeFadeY;

          float a = alpha * vignette * edgeFade * (0.15 + 0.85 * lines);

          gl_FragColor = vec4(col, a);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.edge.value = preset.edge;
    material.uniforms.cells.value = preset.cells;
    material.uniforms.drift.value = preset.drift;
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
