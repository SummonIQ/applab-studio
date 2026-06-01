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
    count: number;
    speed: number;
    alpha: number;
  }
> = {
  1: {
    a: [0.98, 0.9, 0.65],
    b: [0.06, 0.06, 0.1],
    count: 18.0,
    speed: 0.16,
    alpha: 0.44,
  },
  2: {
    a: [0.55, 0.85, 1.0],
    b: [0.06, 0.08, 0.12],
    count: 22.0,
    speed: 0.18,
    alpha: 0.46,
  },
  3: {
    a: [0.95, 0.55, 0.95],
    b: [0.1, 0.03, 0.12],
    count: 20.0,
    speed: 0.2,
    alpha: 0.48,
  },
  4: {
    a: [0.8, 0.82, 0.9],
    b: [0.04, 0.04, 0.07],
    count: 14.0,
    speed: 0.12,
    alpha: 0.34,
  },
  5: {
    a: [0.25, 0.95, 0.45],
    b: [0.03, 0.06, 0.05],
    count: 24.0,
    speed: 0.18,
    alpha: 0.44,
  },
  6: {
    a: [0.7, 0.78, 0.98],
    b: [0.06, 0.06, 0.1],
    count: 19.0,
    speed: 0.16,
    alpha: 0.42,
  },
};

export function HeroFirefliesCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.count.value = preset.count;
    material.uniforms.speed.value = preset.speed;
    material.uniforms.alpha.value = preset.alpha;
  }, [variant]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
        count: { value: 18.0 },
        speed: { value: 0.16 },
        alpha: { value: 0.44 },
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
        uniform float count;
        uniform float speed;
        uniform float alpha;
        varying vec2 vUv;

        float hash(float n){
          return fract(sin(n) * 43758.5453123);
        }

        float dotGlow(vec2 p, vec2 c, float r){
          float d = length(p - c);
          return smoothstep(r, 0.0, d);
        }

        void main(){
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2, 1.6);
          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          float g = 0.0;
          for(int i=0;i<26;i++){
            float fi = float(i);
            if(fi >= count) break;
            float s1 = hash(fi * 12.3);
            float s2 = hash(fi * 51.7);
            float s3 = hash(fi * 99.1);

            vec2 c = vec2(s1 - 0.5, s2 - 0.5);
            c *= vec2(2.2, 1.6) * 0.85;
            c += 0.22 * m;
            c += vec2(sin(t * (1.0 + s3) + fi), cos(t * (0.8 + s3) + fi*1.3)) * (0.18 + 0.12*s3);

            float r = 0.06 + 0.04 * s3;
            float pulse = 0.35 + 0.65 * sin(t*3.0 + fi*1.7);
            g += dotGlow(p, c, r) * (0.55 + 0.45*pulse);
          }

          g = clamp(g, 0.0, 1.25);
          vec3 col = mix(colorB, colorA, g);

          float edge = smoothstep(1.25, 0.35, length(p));

          // Edge fade
          float edgeFadeX = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
          float edgeFadeY = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.7, uv.y);
          float edgeFade = edgeFadeX * edgeFadeY;

          float aout = alpha * edge * edgeFade * (0.10 + 0.90 * g);

          gl_FragColor = vec4(col, aout);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.count.value = preset.count;
    material.uniforms.speed.value = preset.speed;
    material.uniforms.alpha.value = preset.alpha;

    scene.add(new THREE.Mesh(geometry, material));

    let animationId: number;
    let tt = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    resize();

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

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
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
    <div className="absolute inset-x-0 -top-24 bottom-0 -z-10">
      <div ref={containerRef} className="absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56"
        style={{
          background: "linear-gradient(to bottom, transparent, rgb(10 10 14))",
        }}
      />
    </div>
  );
}
