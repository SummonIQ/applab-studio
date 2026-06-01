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
    freq1: number;
    freq2: number;
    twist: number;
    speed: number;
    alpha: number;
  }
> = {
  1: {
    a: [0.7, 0.78, 0.98],
    b: [0.06, 0.06, 0.1],
    freq1: 26.0,
    freq2: 24.0,
    twist: 0.9,
    speed: 0.18,
    alpha: 0.5,
  },
  2: {
    a: [0.25, 0.85, 0.75],
    b: [0.03, 0.06, 0.08],
    freq1: 22.0,
    freq2: 28.0,
    twist: 0.7,
    speed: 0.15,
    alpha: 0.46,
  },
  3: {
    a: [0.95, 0.55, 0.95],
    b: [0.1, 0.03, 0.12],
    freq1: 30.0,
    freq2: 21.0,
    twist: 1.1,
    speed: 0.22,
    alpha: 0.56,
  },
  4: {
    a: [0.8, 0.82, 0.9],
    b: [0.04, 0.04, 0.07],
    freq1: 18.0,
    freq2: 19.0,
    twist: 0.5,
    speed: 0.12,
    alpha: 0.38,
  },
  5: {
    a: [0.98, 0.75, 0.35],
    b: [0.08, 0.05, 0.04],
    freq1: 34.0,
    freq2: 29.0,
    twist: 1.2,
    speed: 0.24,
    alpha: 0.54,
  },
  6: {
    a: [0.7, 0.98, 0.78],
    b: [0.03, 0.06, 0.05],
    freq1: 28.0,
    freq2: 26.0,
    twist: 0.85,
    speed: 0.18,
    alpha: 0.48,
  },
};

export function HeroMoireCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.freq1.value = preset.freq1;
    material.uniforms.freq2.value = preset.freq2;
    material.uniforms.twist.value = preset.twist;
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
        freq1: { value: 26.0 },
        freq2: { value: 24.0 },
        twist: { value: 0.9 },
        speed: { value: 0.18 },
        alpha: { value: 0.5 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
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
        uniform float freq1;
        uniform float freq2;
        uniform float twist;
        uniform float speed;
        uniform float alpha;
        varying vec2 vUv;

        mat2 rot(float a){
          float s = sin(a), c = cos(a);
          return mat2(c, -s, s, c);
        }

        void main(){
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2, 1.6);
          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          float a1 = t * 0.55 + twist * 0.35 * m.x;
          float a2 = -t * 0.45 + twist * 0.25 * m.y;

          vec2 p1 = rot(a1) * p;
          vec2 p2 = rot(a2) * p;

          float s1 = sin(p1.x * freq1 + t * 1.6) * sin(p1.y * (freq1 * 0.85) - t * 1.2);
          float s2 = sin(p2.x * freq2 - t * 1.4) * sin(p2.y * (freq2 * 0.92) + t * 1.1);

          float inter = 0.5 + 0.5 * sin((s1 - s2) * 6.0);
          float lines = smoothstep(0.35, 0.90, inter);

          vec3 col = mix(colorB, colorA, lines);
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
    material.uniforms.freq1.value = preset.freq1;
    material.uniforms.freq2.value = preset.freq2;
    material.uniforms.twist.value = preset.twist;
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
