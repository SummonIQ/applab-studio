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
    streaks: number;
    chroma: number;
    depth: number;
  }
> = {
  1: {
    a: [0.75, 0.9, 1.0],
    b: [0.06, 0.06, 0.1],
    speed: 0.28,
    alpha: 0.62,
    streaks: 1.0,
    chroma: 0.55,
    depth: 1.0,
  },
  2: {
    a: [0.9, 0.65, 1.0],
    b: [0.06, 0.03, 0.1],
    speed: 0.26,
    alpha: 0.6,
    streaks: 1.1,
    chroma: 0.7,
    depth: 1.05,
  },
  3: {
    a: [0.55, 1.0, 0.85],
    b: [0.03, 0.06, 0.06],
    speed: 0.24,
    alpha: 0.58,
    streaks: 0.95,
    chroma: 0.45,
    depth: 1.15,
  },
  4: {
    a: [1.0, 0.85, 0.55],
    b: [0.07, 0.05, 0.04],
    speed: 0.25,
    alpha: 0.56,
    streaks: 1.2,
    chroma: 0.35,
    depth: 0.95,
  },
  5: {
    a: [0.85, 0.95, 1.0],
    b: [0.04, 0.04, 0.08],
    speed: 0.22,
    alpha: 0.54,
    streaks: 0.85,
    chroma: 0.6,
    depth: 1.25,
  },
  6: {
    a: [0.6, 0.8, 1.0],
    b: [0.05, 0.05, 0.09],
    speed: 0.3,
    alpha: 0.6,
    streaks: 1.35,
    chroma: 0.8,
    depth: 1.1,
  },
};

export function HeroHyperdriveCanvas({ mouse, variant = 1 }: Props) {
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
    material.uniforms.streaks.value = preset.streaks;
    material.uniforms.chroma.value = preset.chroma;
    material.uniforms.depth.value = preset.depth;
  }, [variant]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      10
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
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
        speed: { value: 0.26 },
        alpha: { value: 0.6 },
        streaks: { value: 1.0 },
        chroma: { value: 0.6 },
        depth: { value: 1.0 },
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
        uniform float streaks;
        uniform float chroma;
        uniform float depth;
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

        float starLayer(vec2 p, float t, float scale, float thin){
          vec2 q = p;
          q *= scale;
          vec2 id = floor(q);
          vec2 f = fract(q) - 0.5;
          float h = hash(id);
          float ang = h * 6.2831;
          float r = length(f);
          float core = smoothstep(0.22, 0.0, r);

          float along = dot(normalize(vec2(cos(ang), sin(ang))), f);
          float streak = smoothstep(thin, 0.0, abs(along)) * smoothstep(0.45, 0.0, r);
          float pulse = 0.75 + 0.25*sin(t*2.0 + h*6.0);

          return (core*0.65 + streak*0.9) * pulse;
        }

        vec3 sampleColor(float k){
          return mix(colorB, colorA, clamp(k, 0.0, 1.0));
        }

        void main(){
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * vec2(2.2, 1.6);

          vec2 m = vec2(mouseX, mouseY);
          float t = time * speed;

          vec2 warp = p;
          warp += 0.35*m;
          float rad = length(warp);
          float ang = atan(warp.y, warp.x);

          float tunnel = 1.0 / (0.18 + rad);
          float z = (t * 1.4) * depth;

          float twist = 0.18*sin(z*0.65) + 0.08*sin(z*1.3);
          ang += twist;

          float ring = sin((tunnel*0.65 + z)*1.2 + ang*2.0);
          ring = 0.5 + 0.5*ring;

          vec2 dir = vec2(cos(ang), sin(ang));
          vec2 travel = dir * (z * 0.35);

          float thin = mix(0.12, 0.04, clamp(tunnel*0.25, 0.0, 1.0));
          float s1 = starLayer(warp + travel, z, 6.0 * streaks, thin);
          float s2 = starLayer(warp + travel*1.7, z+12.3, 11.0 * streaks, thin*0.8);
          float s3 = starLayer(warp + travel*2.4, z+31.7, 18.0 * streaks, thin*0.65);

          float grain = noise(warp*3.0 + vec2(z*0.3, -z*0.2));
          grain = 0.75 + 0.25*grain;

          float energy = (s1*0.55 + s2*0.35 + s3*0.28);
          energy += ring * 0.12 * smoothstep(0.0, 1.2, tunnel);

          float centerBoost = smoothstep(0.95, 0.0, rad);
          energy += centerBoost * 0.15;

          vec2 ca = vec2(0.02, 0.0) * chroma * smoothstep(0.0, 1.0, tunnel);
          float eR = energy + 0.25*noise((warp+ca)*5.0 + z);
          float eB = energy + 0.25*noise((warp-ca)*5.0 + z);

          vec3 col = sampleColor(energy);
          col.r = sampleColor(eR).r;
          col.b = sampleColor(eB).b;
          col *= grain;

          float vignette = smoothstep(1.35, 0.25, length(p));
          float aout = alpha * vignette * clamp(energy, 0.0, 1.0);

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
    material.uniforms.streaks.value = preset.streaks;
    material.uniforms.chroma.value = preset.chroma;
    material.uniforms.depth.value = preset.depth;

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
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
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
