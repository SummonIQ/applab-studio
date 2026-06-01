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
    density: number;
    link: number;
    speed: number;
    alpha: number;
  }
> = {
  1: {
    a: [0.7, 0.78, 0.98],
    b: [0.06, 0.06, 0.1],
    density: 7.5,
    link: 0.35,
    speed: 0.18,
    alpha: 0.5,
  },
  2: {
    a: [0.25, 0.85, 0.75],
    b: [0.03, 0.06, 0.08],
    density: 6.8,
    link: 0.3,
    speed: 0.16,
    alpha: 0.46,
  },
  3: {
    a: [0.95, 0.55, 0.95],
    b: [0.1, 0.03, 0.12],
    density: 8.6,
    link: 0.42,
    speed: 0.22,
    alpha: 0.56,
  },
  4: {
    a: [0.8, 0.82, 0.9],
    b: [0.04, 0.04, 0.07],
    density: 5.8,
    link: 0.24,
    speed: 0.12,
    alpha: 0.38,
  },
  5: {
    a: [0.98, 0.75, 0.35],
    b: [0.08, 0.05, 0.04],
    density: 9.0,
    link: 0.45,
    speed: 0.24,
    alpha: 0.54,
  },
  6: {
    a: [0.7, 0.98, 0.78],
    b: [0.03, 0.06, 0.05],
    density: 7.8,
    link: 0.36,
    speed: 0.18,
    alpha: 0.48,
  },
};

export function HeroConstellationCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.density.value = preset.density;
    material.uniforms.link.value = preset.link;
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
        density: { value: 7.5 },
        link: { value: 0.35 },
        speed: { value: 0.18 },
        alpha: { value: 0.5 },
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
        uniform float density;
        uniform float link;
        uniform float speed;
        uniform float alpha;
        varying vec2 vUv;

        vec2 hash2(vec2 p){
          float n = sin(dot(p, vec2(127.1,311.7)));
          float m = sin(dot(p, vec2(269.5,183.3)));
          return fract(vec2(n,m) * 43758.5453123);
        }

        float seg(vec2 p, vec2 a, vec2 b){
          vec2 pa = p - a;
          vec2 ba = b - a;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          return length(pa - ba*h);
        }

        void main(){
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2,1.6);
          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          vec2 q = uv * density;
          vec2 id = floor(q);
          vec2 f = fract(q) - 0.5;

          vec2 o = hash2(id);
          o = 0.5 + 0.5 * sin(6.2831 * (o + vec2(t*0.12, -t*0.10)));

          vec2 star = o - 0.5;
          star += 0.20 * m;

          float dStar = length(f - star);
          float starGlow = smoothstep(0.18, 0.0, dStar);

          float dLine = 10.0;
          for(int y=-1;y<=1;y++){
            for(int x=-1;x<=1;x++){
              vec2 gid = id + vec2(float(x), float(y));
              vec2 oo = hash2(gid);
              oo = 0.5 + 0.5 * sin(6.2831 * (oo + vec2(t*0.12, -t*0.10)));
              vec2 s2 = (oo - 0.5) + vec2(float(x), float(y)) + 0.20*m;
              float dist = length(s2 - star);
              if(dist < link){
                dLine = min(dLine, seg(f, star, s2));
              }
            }
          }

          float lineGlow = smoothstep(0.10, 0.0, dLine);
          float glow = starGlow * 0.75 + lineGlow * 0.55;

          vec3 col = mix(colorB, colorA, glow);
          float vignette = smoothstep(1.25, 0.35, length(p));
          float aout = alpha * vignette * glow;
          gl_FragColor = vec4(col, aout);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.density.value = preset.density;
    material.uniforms.link.value = preset.link;
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
