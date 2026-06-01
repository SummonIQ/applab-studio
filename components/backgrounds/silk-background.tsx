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
    alpha: number;
    speed: number;
    warp: number;
    threads: number;
  }
> = {
  1: {
    a: [0.9, 0.95, 1.0],
    b: [0.04, 0.05, 0.07],
    alpha: 0.42,
    speed: 0.16,
    warp: 1.0,
    threads: 1.0,
  },
  2: {
    a: [0.8, 0.98, 0.9],
    b: [0.03, 0.06, 0.06],
    alpha: 0.4,
    speed: 0.18,
    warp: 1.15,
    threads: 1.15,
  },
  3: {
    a: [0.98, 0.75, 0.9],
    b: [0.08, 0.03, 0.09],
    alpha: 0.42,
    speed: 0.17,
    warp: 1.05,
    threads: 1.0,
  },
  4: {
    a: [0.7, 0.8, 0.98],
    b: [0.03, 0.04, 0.08],
    alpha: 0.38,
    speed: 0.2,
    warp: 1.25,
    threads: 1.25,
  },
  5: {
    a: [0.98, 0.86, 0.65],
    b: [0.07, 0.05, 0.04],
    alpha: 0.4,
    speed: 0.16,
    warp: 0.95,
    threads: 1.1,
  },
  6: {
    a: [0.7, 0.98, 0.78],
    b: [0.03, 0.06, 0.05],
    alpha: 0.4,
    speed: 0.18,
    warp: 1.05,
    threads: 1.2,
  },
};

export function HeroSilkCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.alpha.value = preset.alpha;
    material.uniforms.speed.value = preset.speed;
    material.uniforms.warp.value = preset.warp;
    material.uniforms.threads.value = preset.threads;
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
        alpha: { value: 0.4 },
        speed: { value: 0.18 },
        warp: { value: 1.0 },
        threads: { value: 1.0 },
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
        uniform float alpha;
        uniform float speed;
        uniform float warp;
        uniform float threads;
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
          mat2 m=mat2(1.8,1.2,-1.2,1.8);
          for(int i=0;i<5;i++){
            v += a*noise(p);
            p = m*p;
            a *= 0.55;
          }
          return v;
        }

        void main(){
          vec2 uv=vUv;
          vec2 p=(uv-0.5)*vec2(2.2,1.6);
          vec2 m=vec2(mouseX, mouseY);
          float t=time*speed;

          vec2 q=p;
          q += 0.18*m;
          q += vec2(sin(p.y*2.1+t*1.3), cos(p.x*1.7-t*1.1))*0.08*warp;

          float f=fbm(q*1.2);

          float stripeA = sin((p.x*8.0 + f*3.5) * threads + t*2.2);
          float stripeB = sin((p.y*6.5 - f*4.2) * threads - t*1.6);

          float weave = 0.5 + 0.25*stripeA + 0.25*stripeB;
          weave = smoothstep(0.2, 0.85, weave);

          float sheen = pow(clamp(0.5 + 0.5*sin((p.x*2.0 - p.y*1.6 + f*2.0)*threads + t*2.0), 0.0, 1.0), 2.3);

          vec3 base = mix(colorB, colorA, weave);
          vec3 col = base + sheen * vec3(0.9,0.95,1.0) * 0.25;

          float vignette = smoothstep(1.3, 0.35, length(p));
          float aout = alpha * vignette * (0.2 + 0.8*weave);

          gl_FragColor = vec4(col, aout);
        }
      `,
    });

    materialRef.current = material;
    const preset = PRESETS[variant];
    material.uniforms.colorA.value.set(...preset.a);
    material.uniforms.colorB.value.set(...preset.b);
    material.uniforms.alpha.value = preset.alpha;
    material.uniforms.speed.value = preset.speed;
    material.uniforms.warp.value = preset.warp;
    material.uniforms.threads.value = preset.threads;

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
