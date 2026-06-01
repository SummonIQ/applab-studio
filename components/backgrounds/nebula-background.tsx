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
    density: number;
    swirl: number;
    speed: number;
    alpha: number;
  }
> = {
  1: {
    a: [0.1, 0.12, 0.24],
    b: [0.55, 0.45, 0.95],
    c: [0.85, 0.85, 0.95],
    density: 2.4,
    swirl: 1.2,
    speed: 0.22,
    alpha: 0.55,
  },
  2: {
    a: [0.06, 0.16, 0.2],
    b: [0.25, 0.85, 0.75],
    c: [0.8, 0.95, 0.95],
    density: 2.1,
    swirl: 1.0,
    speed: 0.18,
    alpha: 0.5,
  },
  3: {
    a: [0.12, 0.06, 0.2],
    b: [0.95, 0.45, 0.85],
    c: [0.98, 0.85, 0.98],
    density: 2.8,
    swirl: 1.5,
    speed: 0.26,
    alpha: 0.6,
  },
  4: {
    a: [0.05, 0.06, 0.1],
    b: [0.7, 0.75, 0.85],
    c: [0.92, 0.92, 0.96],
    density: 1.9,
    swirl: 0.7,
    speed: 0.14,
    alpha: 0.4,
  },
  5: {
    a: [0.12, 0.08, 0.08],
    b: [0.98, 0.75, 0.35],
    c: [0.98, 0.92, 0.75],
    density: 2.6,
    swirl: 1.3,
    speed: 0.28,
    alpha: 0.58,
  },
  6: {
    a: [0.04, 0.1, 0.08],
    b: [0.45, 0.9, 0.45],
    c: [0.85, 0.98, 0.85],
    density: 2.2,
    swirl: 1.1,
    speed: 0.2,
    alpha: 0.52,
  },
};

export function HeroNebulaCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.density.value = preset.density;
    material.uniforms.swirl.value = preset.swirl;
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
        colorC: { value: new THREE.Vector3() },
        density: { value: 2.4 },
        swirl: { value: 1.2 },
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
        uniform vec3 colorC;
        uniform float density;
        uniform float swirl;
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
            p = p * 2.02 + vec2(1.7, 9.2);
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2, 1.6);
          vec2 m = vec2(mouseX, mouseY);

          float t = time * speed;

          float r = length(p);
          float ang = atan(p.y, p.x);
          ang += swirl * (0.25 * r) + 0.25 * m.x;

          vec2 q = vec2(cos(ang), sin(ang)) * r;
          q += 0.25 * m;

          float f1 = fbm(q * density + vec2(t * 0.7, -t * 0.4));
          float f2 = fbm(q * (density * 1.4) + vec2(-t * 0.3, t * 0.6));
          float f = mix(f1, f2, 0.5);

          float core = smoothstep(0.65, 0.1, r);
          float clouds = smoothstep(0.25, 0.85, f) * (0.6 + 0.4 * core);

          float filaments = smoothstep(0.60, 0.95, f2) * 0.6;

          vec3 col = mix(colorA, colorB, clouds);
          col = mix(col, colorC, filaments * core);

          float vignette = smoothstep(1.25, 0.35, r);

          // Edge fade
          float edgeFadeX = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
          float edgeFadeY = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.7, uv.y);
          float edgeFade = edgeFadeX * edgeFadeY;

          float a = alpha * vignette * edgeFade * (0.35 + 0.65 * clouds);

          gl_FragColor = vec4(col, a);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.colorC.value.set(...preset.c);
    material.uniforms.density.value = preset.density;
    material.uniforms.swirl.value = preset.swirl;
    material.uniforms.speed.value = preset.speed;
    material.uniforms.alpha.value = preset.alpha;

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
