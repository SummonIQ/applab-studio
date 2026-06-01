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
    grid: number;
    pulse: number;
    speed: number;
    alpha: number;
  }
> = {
  1: {
    a: [0.7, 0.78, 0.98],
    b: [0.06, 0.06, 0.1],
    grid: 11.0,
    pulse: 0.65,
    speed: 0.2,
    alpha: 0.52,
  },
  2: {
    a: [0.1, 0.75, 0.85],
    b: [0.03, 0.06, 0.08],
    grid: 10.0,
    pulse: 0.55,
    speed: 0.18,
    alpha: 0.48,
  },
  3: {
    a: [0.95, 0.55, 0.95],
    b: [0.1, 0.03, 0.12],
    grid: 12.5,
    pulse: 0.75,
    speed: 0.24,
    alpha: 0.58,
  },
  4: {
    a: [0.8, 0.82, 0.9],
    b: [0.04, 0.04, 0.07],
    grid: 8.5,
    pulse: 0.42,
    speed: 0.14,
    alpha: 0.4,
  },
  5: {
    a: [0.98, 0.75, 0.35],
    b: [0.08, 0.05, 0.04],
    grid: 13.5,
    pulse: 0.8,
    speed: 0.26,
    alpha: 0.56,
  },
  6: {
    a: [0.7, 0.98, 0.78],
    b: [0.03, 0.06, 0.05],
    grid: 11.5,
    pulse: 0.62,
    speed: 0.2,
    alpha: 0.5,
  },
};

export function HeroCircuitsCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.grid.value = preset.grid;
    material.uniforms.pulse.value = preset.pulse;
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
        grid: { value: 11.0 },
        pulse: { value: 0.65 },
        speed: { value: 0.2 },
        alpha: { value: 0.52 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float mouseX;
        uniform float mouseY;
        uniform vec3 colorA;
        uniform vec3 colorB;
        uniform float grid;
        uniform float pulse;
        uniform float speed;
        uniform float alpha;
        varying vec2 vUv;

        float hash(vec2 p){
          return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123);
        }

        float line(float x, float w){
          return smoothstep(w, 0.0, abs(x));
        }

        void main(){
          vec2 uv = vUv;
          vec2 p = (uv - 0.5);
          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          vec2 q = (p + 0.12*m) * grid;
          vec2 g = fract(q) - 0.5;
          vec2 id = floor(q);

          float base = max(line(g.x, 0.06), line(g.y, 0.06));

          float n = hash(id);
          float dir = step(0.5, hash(id + 3.1));
          float along = dir > 0.5 ? fract(q.x) : fract(q.y);
          float pulseMask = smoothstep(0.0, 0.2, along) * smoothstep(1.0, 0.8, along);
          float pulseWave = 0.5 + 0.5 * sin(t * 4.0 + n * 6.2831 + along * 6.0);

          float node = smoothstep(0.20, 0.0, length(g));
          float glow = base * (0.35 + pulse * pulseMask * pulseWave) + node * 0.25;

          vec3 col = mix(colorB, colorA, glow);

          float vignette = smoothstep(0.9, 0.2, length(p*vec2(2.2,1.6)));

          // Edge fade
          float edgeFadeX = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
          float edgeFadeY = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.7, uv.y);
          float edgeFade = edgeFadeX * edgeFadeY;

          float aout = alpha * vignette * edgeFade * glow;
          gl_FragColor = vec4(col, aout);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.grid.value = preset.grid;
    material.uniforms.pulse.value = preset.pulse;
    material.uniforms.speed.value = preset.speed;
    material.uniforms.alpha.value = preset.alpha;

    scene.add(new THREE.Mesh(geometry, material));

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
