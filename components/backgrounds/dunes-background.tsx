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
    ridges: number;
    drift: number;
    speed: number;
    alpha: number;
  }
> = {
  1: {
    a: [0.98, 0.9, 0.65],
    b: [0.06, 0.06, 0.1],
    ridges: 7.5,
    drift: 0.55,
    speed: 0.12,
    alpha: 0.48,
  },
  2: {
    a: [0.98, 0.75, 0.35],
    b: [0.08, 0.05, 0.04],
    ridges: 8.5,
    drift: 0.6,
    speed: 0.14,
    alpha: 0.52,
  },
  3: {
    a: [0.7, 0.78, 0.98],
    b: [0.06, 0.06, 0.1],
    ridges: 6.5,
    drift: 0.45,
    speed: 0.1,
    alpha: 0.44,
  },
  4: {
    a: [0.8, 0.82, 0.9],
    b: [0.04, 0.04, 0.07],
    ridges: 5.5,
    drift: 0.35,
    speed: 0.08,
    alpha: 0.38,
  },
  5: {
    a: [0.25, 0.85, 0.75],
    b: [0.03, 0.06, 0.08],
    ridges: 7.0,
    drift: 0.5,
    speed: 0.11,
    alpha: 0.46,
  },
  6: {
    a: [0.95, 0.55, 0.95],
    b: [0.1, 0.03, 0.12],
    ridges: 8.0,
    drift: 0.62,
    speed: 0.13,
    alpha: 0.5,
  },
};

export function HeroDunesCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.ridges.value = preset.ridges;
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
        ridges: { value: 7.5 },
        drift: { value: 0.55 },
        speed: { value: 0.12 },
        alpha: { value: 0.48 },
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
        uniform float ridges;
        uniform float drift;
        uniform float speed;
        uniform float alpha;
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
          return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
        }

        float fbm(vec2 p){
          float v=0.0;
          float a=0.5;
          for(int i=0;i<5;i++){
            v += a*noise(p);
            p = p*2.01 + vec2(1.7,9.2);
            a *= 0.5;
          }
          return v;
        }

        void main(){
          vec2 uv=vUv;
          vec2 p=(uv-0.5)*vec2(2.2,1.6);
          vec2 m=vec2(mouseX, mouseY);
          float t=time*speed;

          vec2 q=p;
          q.x += drift * 0.35 * sin((p.y + t) * 1.6);
          q.y += drift * 0.18 * cos((p.x - t) * 1.2);
          q += 0.16 * m;

          float n = fbm(q*1.4 + vec2(t*0.25, -t*0.18));
          float s = sin((q.y + 0.55*n) * ridges + t*1.6);
          float ridge = smoothstep(0.15, 0.85, s*0.5+0.5);
          ridge *= smoothstep(0.95, 0.05, abs(q.x));

          float shade = 0.55 + 0.45 * smoothstep(0.25, 0.95, n);
          vec3 col = mix(colorB, colorA, ridge * shade);

          float vignette = smoothstep(1.25, 0.35, length(p));
          float aout = alpha * vignette * (0.15 + 0.85 * ridge);
          gl_FragColor = vec4(col, aout);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.ridges.value = preset.ridges;
    material.uniforms.drift.value = preset.drift;
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
