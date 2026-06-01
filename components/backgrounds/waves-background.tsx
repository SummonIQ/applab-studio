'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Variant = 1 | 2 | 3 | 4 | 5 | 6;

type Props = {
  mouse?: { x: number; y: number };
  variant?: Variant;
};

const PRESETS: Record<
  Variant,
  {
    deep: [number, number, number];
    mid: [number, number, number];
    high: [number, number, number];
    speed: number;
    alpha: number;
  }
> = {
  1: {
    deep: [0.03, 0.04, 0.07],
    mid: [0.1, 0.14, 0.2],
    high: [0.32, 0.4, 0.55],
    speed: 1.0,
    alpha: 0.55,
  },
  2: {
    deep: [0.04, 0.06, 0.08],
    mid: [0.08, 0.18, 0.22],
    high: [0.25, 0.5, 0.55],
    speed: 0.8,
    alpha: 0.5,
  },
  3: {
    deep: [0.06, 0.03, 0.08],
    mid: [0.18, 0.1, 0.22],
    high: [0.45, 0.3, 0.55],
    speed: 1.2,
    alpha: 0.6,
  },
  4: {
    deep: [0.02, 0.05, 0.05],
    mid: [0.08, 0.16, 0.16],
    high: [0.3, 0.5, 0.45],
    speed: 0.6,
    alpha: 0.45,
  },
  5: {
    deep: [0.06, 0.04, 0.03],
    mid: [0.18, 0.12, 0.08],
    high: [0.55, 0.4, 0.3],
    speed: 1.1,
    alpha: 0.55,
  },
  6: {
    deep: [0.03, 0.06, 0.04],
    mid: [0.1, 0.18, 0.12],
    high: [0.35, 0.55, 0.4],
    speed: 0.9,
    alpha: 0.5,
  },
};

export function HeroWavesCanvas({ variant = 1 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    const preset = PRESETS[variant];
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.deepColor.value.set(...preset.deep);
    material.uniforms.midColor.value.set(...preset.mid);
    material.uniforms.highColor.value.set(...preset.high);
    material.uniforms.speed.value = preset.speed;
    material.uniforms.alpha.value = preset.alpha;
  }, [variant]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    const geometry = new THREE.PlaneGeometry(120, 80, 160, 160);

    const preset = PRESETS[variant];

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        deepColor: { value: new THREE.Vector3(...preset.deep) },
        midColor: { value: new THREE.Vector3(...preset.mid) },
        highColor: { value: new THREE.Vector3(...preset.high) },
        speed: { value: preset.speed },
        alpha: { value: preset.alpha },
      },
      vertexShader: `
        uniform float time;
        uniform float speed;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vUv = uv;
          vec3 pos = position;

          float t = time * speed;
          float wave1 = sin(pos.x * 0.18 + t * 0.45) * cos(pos.y * 0.12 + t * 0.35) * 2.0;
          float wave2 = sin(pos.x * 0.09 - t * 0.30) * sin(pos.y * 0.18 + t * 0.25) * 1.6;
          float wave3 = cos(pos.x * 0.25 + pos.y * 0.22 + t * 0.32) * 1.2;

          float elevation = (wave1 + wave2 + wave3) * 0.7;
          pos.z = elevation;
          vElevation = elevation;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float speed;
        uniform float alpha;
        uniform vec3 deepColor;
        uniform vec3 midColor;
        uniform vec3 highColor;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          float brightness = smoothstep(-3.5, 3.8, vElevation);

          vec3 color = mix(deepColor, midColor, brightness);
          color = mix(color, highColor, brightness * brightness * 0.55);

          float t = time * speed;
          float colorWave = sin(vUv.x * 2.5 + vUv.y * 1.8 + t * 0.35) * 0.5 + 0.5;
          color += vec3(0.05, 0.06, 0.10) * colorWave * brightness;

          float ridge = smoothstep(2.2, 4.2, vElevation);
          color += highColor * ridge * 0.25;

          float edgeFade = smoothstep(0.0, 0.12, vUv.x) *
                          smoothstep(1.0, 0.88, vUv.x) *
                          smoothstep(0.0, 0.18, vUv.y) *
                          smoothstep(1.0, 0.65, vUv.y);

          float a = alpha * edgeFade;
          gl_FragColor = vec4(color, a);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.35;
    mesh.position.y = -6;
    scene.add(mesh);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.004;

      material.uniforms.time.value = time;
      mesh.rotation.z = Math.sin(time * 0.15) * 0.02;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      materialRef.current = null;
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      <div ref={containerRef} className="absolute inset-0 opacity-70" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 60% at 35% 20%, rgba(120, 140, 220, 0.12), transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgb(10 10 14))',
        }}
      />
    </div>
  );
}
