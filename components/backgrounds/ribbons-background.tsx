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
    ribbons: number;
    amp: number;
    speed: number;
    alpha: number;
  }
> = {
  1: {
    a: [0.7, 0.78, 0.98],
    b: [0.06, 0.06, 0.1],
    ribbons: 5.0,
    amp: 0.35,
    speed: 0.18,
    alpha: 0.5,
  },
  2: {
    a: [0.25, 0.85, 0.75],
    b: [0.03, 0.06, 0.08],
    ribbons: 6.0,
    amp: 0.3,
    speed: 0.16,
    alpha: 0.46,
  },
  3: {
    a: [0.95, 0.55, 0.95],
    b: [0.1, 0.03, 0.12],
    ribbons: 4.0,
    amp: 0.42,
    speed: 0.22,
    alpha: 0.56,
  },
  4: {
    a: [0.8, 0.82, 0.9],
    b: [0.04, 0.04, 0.07],
    ribbons: 7.0,
    amp: 0.24,
    speed: 0.12,
    alpha: 0.38,
  },
  5: {
    a: [0.98, 0.75, 0.35],
    b: [0.08, 0.05, 0.04],
    ribbons: 5.0,
    amp: 0.48,
    speed: 0.24,
    alpha: 0.54,
  },
  6: {
    a: [0.7, 0.98, 0.78],
    b: [0.03, 0.06, 0.05],
    ribbons: 6.0,
    amp: 0.34,
    speed: 0.18,
    alpha: 0.48,
  },
};

export function HeroRibbonsCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.ribbons.value = preset.ribbons;
    material.uniforms.amp.value = preset.amp;
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
        ribbons: { value: 5.0 },
        amp: { value: 0.35 },
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
        uniform float ribbons;
        uniform float amp;
        uniform float speed;
        uniform float alpha;
        varying vec2 vUv;

        float ribbon(vec2 p, float k){
          float y = sin(p.x * (1.2 + 0.35*k) + p.y * (0.6 + 0.15*k)) * (0.22 + 0.08*k);
          y += 0.25 * sin(p.x * (0.65 + 0.12*k) - p.y * (1.15 + 0.25*k));
          return abs(p.y - y);
        }

        void main(){
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2, 1.6);
          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          p.x += 0.28 * m.x;
          p.y += 0.18 * m.y;

          float glow = 0.0;
          for(int i=0;i<7;i++){
            float fi = float(i);
            if(fi >= ribbons) break;
            vec2 q = p;
            q.x += (fi - ribbons * 0.5) * 0.25;
            q.x += amp * 0.35 * sin(t * (1.0 + 0.15*fi) + q.y * 1.4);
            q.y += amp * 0.25 * cos(t * (0.8 + 0.12*fi) + q.x * 1.2);
            float d = ribbon(q, fi);
            glow += smoothstep(0.12, 0.0, d) * (0.75 - 0.08*fi);
          }

          vec3 col = mix(colorB, colorA, glow);
          float vignette = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(2.2,1.6)));

          // Edge fade
          float edgeFadeX = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
          float edgeFadeY = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.7, uv.y);
          float edgeFade = edgeFadeX * edgeFadeY;

          float aout = alpha * vignette * edgeFade * (0.10 + 0.90*glow);
          gl_FragColor = vec4(col, aout);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.ribbons.value = preset.ribbons;
    material.uniforms.amp.value = preset.amp;
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56"
        style={{
          background: "linear-gradient(to bottom, transparent, rgb(10 10 14))",
        }}
      />
    </div>
  );
}
