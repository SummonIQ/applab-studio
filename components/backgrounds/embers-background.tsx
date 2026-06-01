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
    speed: number;
    alpha: number;
    glow: number;
    density: number;
  }
> = {
  1: {
    a: [1.0, 0.55, 0.2],
    b: [0.05, 0.04, 0.06],
    speed: 0.28,
    alpha: 0.55,
    glow: 1.15,
    density: 1.0,
  },
  2: {
    a: [0.9, 0.9, 0.98],
    b: [0.06, 0.05, 0.08],
    speed: 0.22,
    alpha: 0.42,
    glow: 0.9,
    density: 0.9,
  },
  3: {
    a: [0.6, 0.9, 0.65],
    b: [0.03, 0.05, 0.06],
    speed: 0.24,
    alpha: 0.44,
    glow: 0.95,
    density: 1.1,
  },
  4: {
    a: [0.95, 0.45, 0.8],
    b: [0.08, 0.03, 0.1],
    speed: 0.3,
    alpha: 0.5,
    glow: 1.1,
    density: 1.25,
  },
  5: {
    a: [0.85, 0.75, 0.25],
    b: [0.07, 0.06, 0.04],
    speed: 0.2,
    alpha: 0.46,
    glow: 1.0,
    density: 0.95,
  },
  6: {
    a: [0.35, 0.7, 0.95],
    b: [0.03, 0.05, 0.08],
    speed: 0.22,
    alpha: 0.42,
    glow: 0.95,
    density: 1.0,
  },
};

export function HeroEmbersCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.speed.value = preset.speed;
    material.uniforms.alpha.value = preset.alpha;
    material.uniforms.glow.value = preset.glow;
    material.uniforms.density.value = preset.density;
  }, [variant]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
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
        speed: { value: 0.25 },
        alpha: { value: 0.5 },
        glow: { value: 1.0 },
        density: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv=uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float mouseX;
        uniform float mouseY;
        uniform vec3 colorA;
        uniform vec3 colorB;
        uniform float speed;
        uniform float alpha;
        uniform float glow;
        uniform float density;
        varying vec2 vUv;

        float hash(vec2 p){
          return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123);
        }

        float noise(vec2 p){
          vec2 i=floor(p);
          vec2 f=fract(p);
          float a=hash(i);
          float b=hash(i+vec2(1.0,0.0));
          float c=hash(i+vec2(0.0,1.0));
          float d=hash(i+vec2(1.0,1.0));
          vec2 u=f*f*(3.0-2.0*f);
          return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
        }

        float fbm(vec2 p){
          float v=0.0;
          float a=0.55;
          mat2 m=mat2(1.6,1.2,-1.2,1.6);
          for(int i=0;i<5;i++){
            v += a*noise(p);
            p = m*p;
            a *= 0.55;
          }
          return v;
        }

        void main(){
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2,1.6);
          vec2 m = vec2(mouseX, mouseY);

          float t = time * speed;
          vec2 flow = p;
          flow += 0.22*m;
          flow.y += t*0.35;
          flow.x += sin(t*0.6 + p.y*1.2) * 0.08;

          float f = fbm(flow*1.25);
          float sparks = noise(flow*6.0 + vec2(0.0, t*2.0));

          float mask = smoothstep(0.35, 0.9, f);
          float sp = smoothstep(0.82, 0.98, sparks);

          float heat = mask + sp * 0.85;
          heat *= 0.7 + 0.3*sin(t*1.2 + p.x*1.8);

          vec3 col = mix(colorB, colorA, clamp(heat*glow, 0.0, 1.0));

          float vignette = smoothstep(1.3, 0.35, length(p));
          float aout = alpha * vignette * clamp(heat * (0.25 + 0.75*density), 0.0, 1.0);

          gl_FragColor = vec4(col, aout);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.speed.value = preset.speed;
    material.uniforms.alpha.value = preset.alpha;
    material.uniforms.glow.value = preset.glow;
    material.uniforms.density.value = preset.density;

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
    </div>
  );
}
