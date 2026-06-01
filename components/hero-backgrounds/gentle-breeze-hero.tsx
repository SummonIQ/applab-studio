'use client';

import { useEffect, useRef } from 'react';

interface GrassBlade {
  x: number;
  baseY: number;
  height: number;
  width: number;
  phase: number;
  hue: number;
}

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  glowIntensity: number;
  size: number;
}

interface Dandelion {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
}

export function GentleBreezeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const grassBlades: GrassBlade[] = [];
    const fireflies: Firefly[] = [];
    const dandelions: Dandelion[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
      initializeGrass();
    };

    const initializeGrass = () => {
      grassBlades.length = 0;
      const bladeCount = Math.floor(canvas.width / 3);

      for (let i = 0; i < bladeCount; i++) {
        grassBlades.push({
          x: (i / bladeCount) * canvas.width + (Math.random() - 0.5) * 6,
          baseY: canvas.height,
          height: 40 + Math.random() * 80,
          width: 1 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          hue: 120 + Math.random() * 40 - 20, // Green variations
        });
      }
    };

    // Initialize fireflies
    for (let i = 0; i < 15; i++) {
      fireflies.push({
        x: Math.random() * 2000,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        glowIntensity: Math.random(),
        size: 2 + Math.random() * 2,
      });
    }

    // Initialize dandelion seeds
    for (let i = 0; i < 8; i++) {
      dandelions.push({
        x: Math.random() * 2000,
        y: Math.random() * 400 + 100,
        vx: 0.3 + Math.random() * 0.4,
        vy: (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        size: 8 + Math.random() * 6,
        opacity: 0.3 + Math.random() * 0.3,
      });
    }

    resize();
    window.addEventListener('resize', resize);

    const getWindStrength = (x: number, y: number) => {
      const baseWind = Math.sin(time * 0.5) * 0.3 + 0.5;
      const localVariation = Math.sin(x * 0.005 + time) * 0.3;
      const gust = Math.sin(time * 2 + x * 0.01) * Math.max(0, Math.sin(time * 0.3)) * 0.4;
      return baseWind + localVariation + gust;
    };

    const drawGrassBlade = (blade: GrassBlade) => {
      const wind = getWindStrength(blade.x, blade.baseY);
      const sway = Math.sin(blade.phase + time * 2) * wind * 30;

      const segments = 5;
      ctx.beginPath();
      ctx.moveTo(blade.x, blade.baseY);

      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const segmentSway = sway * t * t; // More sway at the top
        const x = blade.x + segmentSway;
        const y = blade.baseY - blade.height * t;

        if (i === 1) {
          ctx.lineTo(x, y);
        } else {
          const prevT = (i - 1) / segments;
          const prevSway = sway * prevT * prevT;
          const cpX = blade.x + prevSway + (segmentSway - prevSway) * 0.5;
          const cpY = blade.baseY - blade.height * (prevT + t) * 0.5;
          ctx.quadraticCurveTo(cpX, cpY, x, y);
        }
      }

      const depthFade = Math.max(0.3, 1 - (canvas.height - blade.baseY + blade.height) / 200);
      ctx.strokeStyle = `hsla(${blade.hue}, 40%, ${20 + depthFade * 15}%, ${0.4 * depthFade})`;
      ctx.lineWidth = blade.width;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    const drawFirefly = (firefly: Firefly) => {
      const glow = (Math.sin(firefly.phase + time * 3) + 1) / 2;
      const intensity = glow * firefly.glowIntensity;

      if (intensity > 0.3) {
        // Outer glow
        const outerGlow = ctx.createRadialGradient(
          firefly.x, firefly.y, 0,
          firefly.x, firefly.y, firefly.size * 8
        );
        outerGlow.addColorStop(0, `rgba(200, 255, 100, ${intensity * 0.3})`);
        outerGlow.addColorStop(0.5, `rgba(150, 255, 50, ${intensity * 0.1})`);
        outerGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = outerGlow;
        ctx.fillRect(
          firefly.x - firefly.size * 8,
          firefly.y - firefly.size * 8,
          firefly.size * 16,
          firefly.size * 16
        );

        // Core
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.size * intensity, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 200, ${intensity})`;
        ctx.fill();
      }
    };

    const drawDandelion = (seed: Dandelion) => {
      ctx.save();
      ctx.translate(seed.x, seed.y);
      ctx.rotate(seed.rotation);

      // Stem
      ctx.strokeStyle = `rgba(255, 255, 255, ${seed.opacity * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, seed.size);
      ctx.stroke();

      // Fluffy part
      const fluffCount = 8;
      for (let i = 0; i < fluffCount; i++) {
        const angle = (i / fluffCount) * Math.PI * 2;
        const length = seed.size * 0.6;

        ctx.strokeStyle = `rgba(255, 255, 255, ${seed.opacity * 0.4})`;
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
        ctx.stroke();

        // Tiny fluff at end
        ctx.beginPath();
        ctx.arc(
          Math.cos(angle) * length,
          Math.sin(angle) * length,
          1.5,
          0, Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${seed.opacity * 0.5})`;
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      time += 0.016;

      // Sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, '#0a1628');
      skyGradient.addColorStop(0.4, '#0f1f3d');
      skyGradient.addColorStop(0.7, '#1a3352');
      skyGradient.addColorStop(1, '#0d1a0d');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Moon glow
      const moonX = canvas.width * 0.8;
      const moonY = canvas.height * 0.15;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 150);
      moonGlow.addColorStop(0, 'rgba(200, 220, 255, 0.15)');
      moonGlow.addColorStop(0.3, 'rgba(150, 180, 220, 0.08)');
      moonGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = moonGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      for (let i = 0; i < 50; i++) {
        const starX = (Math.sin(i * 127.1) * 0.5 + 0.5) * canvas.width;
        const starY = (Math.cos(i * 311.7) * 0.5 + 0.5) * canvas.height * 0.6;
        const twinkle = (Math.sin(time * 2 + i * 0.5) + 1) / 2;

        ctx.beginPath();
        ctx.arc(starX, starY, 0.5 + twinkle * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + twinkle * 0.3})`;
        ctx.fill();
      }

      // Ground gradient
      const groundY = canvas.height * 0.7;
      const groundGradient = ctx.createLinearGradient(0, groundY, 0, canvas.height);
      groundGradient.addColorStop(0, 'rgba(20, 40, 20, 0.8)');
      groundGradient.addColorStop(1, '#0a0f0a');
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

      // Wind visualization (subtle flowing lines)
      ctx.strokeStyle = 'rgba(150, 200, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const y = canvas.height * (0.3 + i * 0.1);
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 10) {
          const wind = getWindStrength(x, y);
          const waveY = y + Math.sin(x * 0.01 + time + i) * 20 * wind;
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }

      // Draw grass (back to front for depth)
      grassBlades
        .sort((a, b) => a.height - b.height)
        .forEach(drawGrassBlade);

      // Update and draw fireflies
      fireflies.forEach(firefly => {
        firefly.x += firefly.vx + getWindStrength(firefly.x, firefly.y) * 0.5;
        firefly.y += firefly.vy + Math.sin(time + firefly.phase) * 0.1;

        // Wrap around
        if (firefly.x > canvas.width + 50) firefly.x = -50;
        if (firefly.x < -50) firefly.x = canvas.width + 50;
        if (firefly.y > canvas.height * 0.8) firefly.vy = -Math.abs(firefly.vy);
        if (firefly.y < canvas.height * 0.2) firefly.vy = Math.abs(firefly.vy);

        drawFirefly(firefly);
      });

      // Update and draw dandelion seeds
      dandelions.forEach(seed => {
        const wind = getWindStrength(seed.x, seed.y);
        seed.x += seed.vx + wind * 0.8;
        seed.y += seed.vy + Math.sin(time * 2 + seed.x * 0.01) * 0.3;
        seed.rotation += seed.rotationSpeed;

        // Wrap around
        if (seed.x > canvas.width + 50) {
          seed.x = -50;
          seed.y = Math.random() * canvas.height * 0.5 + 100;
        }

        drawDandelion(seed);
      });

      // Atmospheric fog at bottom
      const fogGradient = ctx.createLinearGradient(0, canvas.height * 0.7, 0, canvas.height);
      fogGradient.addColorStop(0, 'transparent');
      fogGradient.addColorStop(1, 'rgba(100, 150, 100, 0.1)');
      ctx.fillStyle = fogGradient;
      ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
