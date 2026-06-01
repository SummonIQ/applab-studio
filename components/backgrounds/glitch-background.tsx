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
    amount: number;
    scan: number;
    speed: number;
    alpha: number;
  }
> = {
  1: {
    a: [0.7, 0.78, 0.98],
    b: [0.06, 0.06, 0.1],
    amount: 0.22,
    scan: 350.0,
    speed: 0.22,
    alpha: 0.55,
  },
  2: {
    a: [0.45, 0.9, 0.75],
    b: [0.03, 0.06, 0.08],
    amount: 0.18,
    scan: 320.0,
    speed: 0.18,
    alpha: 0.5,
  },
  3: {
    a: [0.95, 0.55, 0.95],
    b: [0.1, 0.03, 0.12],
    amount: 0.28,
    scan: 420.0,
    speed: 0.26,
    alpha: 0.6,
  },
  4: {
    a: [0.8, 0.82, 0.9],
    b: [0.04, 0.04, 0.07],
    amount: 0.12,
    scan: 280.0,
    speed: 0.14,
    alpha: 0.42,
  },
  5: {
    a: [0.98, 0.9, 0.65],
    b: [0.08, 0.05, 0.04],
    amount: 0.3,
    scan: 460.0,
    speed: 0.28,
    alpha: 0.58,
  },
  6: {
    a: [0.7, 0.98, 0.78],
    b: [0.03, 0.06, 0.05],
    amount: 0.2,
    scan: 360.0,
    speed: 0.2,
    alpha: 0.52,
  },
};

export function HeroGlitchCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.amount.value = preset.amount;
    material.uniforms.scan.value = preset.scan;
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
        amount: { value: 0.22 },
        scan: { value: 350.0 },
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
        uniform float amount;
        uniform float scan;
        uniform float speed;
        uniform float alpha;
        varying vec2 vUv;

        float hash(float n) {
          return fract(sin(n) * 43758.5453123);
        }

        float noise(float x) {
          float i = floor(x);
          float f = fract(x);
          float a = hash(i);
          float b = hash(i + 1.0);
          return mix(a, b, f * f * (3.0 - 2.0 * f));
        }

        void main() {
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2, 1.6);
          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          float scanline = 0.5 + 0.5 * sin((uv.y * scan) + t * 8.0);
          float n = noise(uv.y * 40.0 + t * 10.0);

          float slice = step(0.82, noise(floor(uv.y * 12.0) + t * 2.0));
          float shift = (n - 0.5) * amount * slice;

          vec2 uvR = uv + vec2(shift + 0.010 * amount, 0.0);
          vec2 uvG = uv + vec2(shift, 0.0);
          vec2 uvB = uv + vec2(shift - 0.010 * amount, 0.0);

          float band = smoothstep(0.95, 0.2, abs(sin((uv.x + uv.y) * 2.6 + t * 0.6)));
          float glow = band * (0.25 + 0.75 * scanline);

          vec3 col = mix(colorB, colorA, glow);
          col += 0.05 * vec3(noise(uv.x * 120.0 + t * 30.0), noise(uv.x * 90.0 - t * 24.0), noise(uv.x * 70.0 + t * 18.0));

          vec3 aberr = vec3(
            mix(colorB, colorA, glow + (uvR.x - uv.x) * 3.0).r,
            mix(colorB, colorA, glow + (uvG.x - uv.x) * 3.0).g,
            mix(colorB, colorA, glow + (uvB.x - uv.x) * 3.0).b
          );

          col = mix(col, aberr, 0.65);

          float vignette = smoothstep(1.25, 0.35, length(p + 0.15 * m));

          // Edge fade
          float edgeFadeX = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
          float edgeFadeY = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.7, uv.y);
          float edgeFade = edgeFadeX * edgeFadeY;

          float a = alpha * vignette * edgeFade * (0.25 + 0.75 * glow);

          gl_FragColor = vec4(col, a);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.amount.value = preset.amount;
    material.uniforms.scan.value = preset.scan;
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
