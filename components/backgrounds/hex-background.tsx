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
    scale: number;
    glow: number;
    drift: number;
    speed: number;
    alpha: number;
  }
> = {
  1: {
    a: [0.7, 0.78, 0.98],
    b: [0.06, 0.06, 0.1],
    scale: 10.0,
    glow: 0.35,
    drift: 0.3,
    speed: 0.22,
    alpha: 0.55,
  },
  2: {
    a: [0.45, 0.9, 0.75],
    b: [0.03, 0.06, 0.08],
    scale: 9.0,
    glow: 0.3,
    drift: 0.26,
    speed: 0.18,
    alpha: 0.5,
  },
  3: {
    a: [0.95, 0.55, 0.95],
    b: [0.1, 0.03, 0.12],
    scale: 11.0,
    glow: 0.42,
    drift: 0.38,
    speed: 0.26,
    alpha: 0.6,
  },
  4: {
    a: [0.8, 0.82, 0.9],
    b: [0.04, 0.04, 0.07],
    scale: 8.0,
    glow: 0.22,
    drift: 0.18,
    speed: 0.14,
    alpha: 0.42,
  },
  5: {
    a: [0.98, 0.9, 0.65],
    b: [0.08, 0.05, 0.04],
    scale: 12.0,
    glow: 0.38,
    drift: 0.42,
    speed: 0.28,
    alpha: 0.58,
  },
  6: {
    a: [0.7, 0.98, 0.78],
    b: [0.03, 0.06, 0.05],
    scale: 10.0,
    glow: 0.32,
    drift: 0.3,
    speed: 0.2,
    alpha: 0.52,
  },
};

export function HeroHexCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.scale.value = preset.scale;
    material.uniforms.glow.value = preset.glow;
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
        scale: { value: 10.0 },
        glow: { value: 0.35 },
        drift: { value: 0.3 },
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
        uniform float scale;
        uniform float glow;
        uniform float drift;
        uniform float speed;
        uniform float alpha;
        varying vec2 vUv;

        float hexDist(vec2 p) {
          p = abs(p);
          return max(dot(p, normalize(vec2(1.0, 1.7320508))), p.x);
        }

        vec2 hexCoord(vec2 p) {
          float s = 1.7320508;
          vec2 q = vec2(p.x * 2.0 / 3.0, (-p.x / 3.0 + s / 3.0 * p.y));
          vec2 r = vec2(p.x * 2.0 / 3.0, (-p.x / 3.0 - s / 3.0 * p.y));
          return vec2(q.x, q.y);
        }

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void main() {
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2, 1.6);
          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          p += 0.18 * m;
          p += drift * 0.06 * vec2(sin(t * 0.7), cos(t * 0.6));

          vec2 gp = p * scale;
          vec2 id = floor(gp);
          vec2 f = fract(gp) - 0.5;

          float d = hexDist(f);
          float line = smoothstep(0.46, 0.38, d);

          float rnd = hash(id);
          float pulse = 0.5 + 0.5 * sin(t * 2.0 + rnd * 6.2831);
          float lit = line * (0.35 + 0.65 * pulse);

          vec3 col = mix(colorB, colorA, lit);
          float vignette = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(2.2, 1.6)));
          float a = alpha * vignette * (0.18 + glow * lit);

          gl_FragColor = vec4(col, a);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.scale.value = preset.scale;
    material.uniforms.glow.value = preset.glow;
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
