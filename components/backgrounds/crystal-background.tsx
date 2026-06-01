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
    facets: number;
    sparkle: number;
    speed: number;
    alpha: number;
  }
> = {
  1: {
    a: [0.7, 0.78, 0.98],
    b: [0.06, 0.06, 0.1],
    facets: 9.0,
    sparkle: 0.35,
    speed: 0.18,
    alpha: 0.46,
  },
  2: {
    a: [0.55, 0.85, 1.0],
    b: [0.06, 0.08, 0.12],
    facets: 11.0,
    sparkle: 0.42,
    speed: 0.2,
    alpha: 0.48,
  },
  3: {
    a: [0.95, 0.55, 0.95],
    b: [0.1, 0.03, 0.12],
    facets: 8.0,
    sparkle: 0.55,
    speed: 0.22,
    alpha: 0.52,
  },
  4: {
    a: [0.8, 0.82, 0.9],
    b: [0.04, 0.04, 0.07],
    facets: 7.0,
    sparkle: 0.25,
    speed: 0.12,
    alpha: 0.36,
  },
  5: {
    a: [0.98, 0.75, 0.35],
    b: [0.08, 0.05, 0.04],
    facets: 10.0,
    sparkle: 0.5,
    speed: 0.24,
    alpha: 0.5,
  },
  6: {
    a: [0.25, 0.85, 0.75],
    b: [0.03, 0.06, 0.08],
    facets: 12.0,
    sparkle: 0.38,
    speed: 0.18,
    alpha: 0.44,
  },
};

export function HeroCrystalCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.facets.value = preset.facets;
    material.uniforms.sparkle.value = preset.sparkle;
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
        facets: { value: 9.0 },
        sparkle: { value: 0.35 },
        speed: { value: 0.18 },
        alpha: { value: 0.46 },
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
        uniform float facets;
        uniform float sparkle;
        uniform float speed;
        uniform float alpha;
        varying vec2 vUv;

        float hash(vec2 p){
          return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123);
        }

        vec2 rot(vec2 p, float a){
          float s = sin(a); float c = cos(a);
          return vec2(c*p.x - s*p.y, s*p.x + c*p.y);
        }

        float vor(vec2 p){
          vec2 i = floor(p);
          vec2 f = fract(p);
          float md = 10.0;
          for(int y=-1;y<=1;y++){
            for(int x=-1;x<=1;x++){
              vec2 g = vec2(float(x), float(y));
              vec2 o = vec2(hash(i+g), hash(i+g+13.1));
              vec2 r = g + o - f;
              float d = dot(r,r);
              md = min(md, d);
            }
          }
          return md;
        }

        void main(){
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2, 1.6);
          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          vec2 q = p;
          q += 0.25 * m;
          q = rot(q, 0.15 * sin(t*0.8));
          q *= facets;

          float v = vor(q + vec2(t*0.15, -t*0.12));
          float facetsMask = smoothstep(0.18, 0.02, sqrt(v));

          float n = hash(floor(q));
          float tw = 0.5 + 0.5 * sin(t*3.0 + n*6.2831);
          float sparks = step(0.92, n) * tw;

          vec3 col = mix(colorB, colorA, facetsMask);
          col += sparkle * sparks * colorA;

          float edge = smoothstep(1.25, 0.35, length(p));

          // Edge fade
          float edgeFadeX = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
          float edgeFadeY = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.7, uv.y);
          float edgeFade = edgeFadeX * edgeFadeY;

          float aout = alpha * edge * edgeFade * (0.14 + 0.86*facetsMask);
          aout += alpha * 0.18 * sparkle * sparks * edgeFade;

          gl_FragColor = vec4(col, aout);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.facets.value = preset.facets;
    material.uniforms.sparkle.value = preset.sparkle;
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
