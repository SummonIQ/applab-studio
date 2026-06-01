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
    thickness: number;
    freq: number;
    wobble: number;
    speed: number;
    alpha: number;
  }
> = {
  1: {
    a: [0.85, 0.88, 0.98],
    b: [0.1, 0.12, 0.2],
    thickness: 0.028,
    freq: 10.0,
    wobble: 0.25,
    speed: 0.22,
    alpha: 0.55,
  },
  2: {
    a: [0.8, 0.95, 0.9],
    b: [0.05, 0.1, 0.14],
    thickness: 0.03,
    freq: 9.0,
    wobble: 0.2,
    speed: 0.18,
    alpha: 0.5,
  },
  3: {
    a: [0.98, 0.85, 0.98],
    b: [0.12, 0.06, 0.18],
    thickness: 0.026,
    freq: 12.0,
    wobble: 0.35,
    speed: 0.26,
    alpha: 0.6,
  },
  4: {
    a: [0.85, 0.88, 0.94],
    b: [0.06, 0.06, 0.1],
    thickness: 0.022,
    freq: 8.0,
    wobble: 0.14,
    speed: 0.14,
    alpha: 0.4,
  },
  5: {
    a: [0.98, 0.95, 0.8],
    b: [0.1, 0.08, 0.08],
    thickness: 0.03,
    freq: 13.0,
    wobble: 0.32,
    speed: 0.28,
    alpha: 0.58,
  },
  6: {
    a: [0.88, 0.98, 0.88],
    b: [0.04, 0.1, 0.08],
    thickness: 0.028,
    freq: 11.0,
    wobble: 0.22,
    speed: 0.2,
    alpha: 0.52,
  },
};

export function HeroRingsCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.thickness.value = preset.thickness;
    material.uniforms.freq.value = preset.freq;
    material.uniforms.wobble.value = preset.wobble;
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
        thickness: { value: 0.028 },
        freq: { value: 10.0 },
        wobble: { value: 0.25 },
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
        uniform float thickness;
        uniform float freq;
        uniform float wobble;
        uniform float speed;
        uniform float alpha;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2, 1.6);
          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          float r = length(p + 0.22 * m);
          float ang = atan(p.y, p.x);

          float w = wobble * (0.35 + 0.65 * sin(ang * 3.0 + t * 2.0));
          float rr = r + 0.06 * w * sin(r * 8.0 - t * 1.6);

          float rings = abs(sin(rr * freq - t * 1.8));
          rings = smoothstep(1.0, 1.0 - thickness, rings);

          float sweep = 0.5 + 0.5 * sin(ang * 2.0 - t * 1.5);
          vec3 col = mix(colorB, colorA, rings * (0.35 + 0.65 * sweep));

          float vignette = smoothstep(1.25, 0.35, r);

          // Edge fade
          float edgeFadeX = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
          float edgeFadeY = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.7, uv.y);
          float edgeFade = edgeFadeX * edgeFadeY;

          float a = alpha * vignette * edgeFade * (0.20 + 0.80 * rings);
          gl_FragColor = vec4(col, a);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.thickness.value = preset.thickness;
    material.uniforms.freq.value = preset.freq;
    material.uniforms.wobble.value = preset.wobble;
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
