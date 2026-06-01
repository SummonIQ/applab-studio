'use client';

import { useEffect, useRef } from 'react';

interface Burst {
  x: number;
  y: number;
  particles: BurstParticle[];
  life: number;
}

interface BurstParticle {
  angle: number;
  speed: number;
  hue: number;
  size: number;
  distance: number;
  decay: number;
}

export function ColorBurstBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const bursts: Burst[] = [];
    let nextBurstTime = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createBurst = (x: number, y: number): Burst => {
      const particleCount = 40 + Math.floor(Math.random() * 30);
      const baseHue = Math.random() * 360;
      const particles: BurstParticle[] = [];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          angle: (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
          speed: 3 + Math.random() * 8,
          hue: (baseHue + Math.random() * 60 - 30 + 360) % 360,
          size: 3 + Math.random() * 8,
          distance: 0,
          decay: 0.96 + Math.random() * 0.03,
        });
      }

      return { x, y, particles, life: 1 };
    };

    const drawBurst = (burst: Burst) => {
      const { x, y, particles, life } = burst;

      for (const p of particles) {
        const px = x + Math.cos(p.angle) * p.distance;
        const py = y + Math.sin(p.angle) * p.distance;

        const trailLength = p.speed * 3;
        const trailX = px - Math.cos(p.angle) * trailLength;
        const trailY = py - Math.sin(p.angle) * trailLength;

        const trailGradient = ctx.createLinearGradient(trailX, trailY, px, py);
        trailGradient.addColorStop(0, `hsla(${p.hue}, 90%, 60%, 0)`);
        trailGradient.addColorStop(1, `hsla(${p.hue}, 90%, 60%, ${life * 0.5})`);

        ctx.beginPath();
        ctx.moveTo(trailX, trailY);
        ctx.lineTo(px, py);
        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = p.size * life * 0.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px, py, p.size * life, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(px, py, 0, px, py, p.size * life);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 80%, ${life})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 90%, 60%, ${life * 0.8})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 80%, 50%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      if (life > 0.8) {
        const flashSize = (1 - (life - 0.8) / 0.2) * 100;
        const flashGradient = ctx.createRadialGradient(x, y, 0, x, y, flashSize);
        flashGradient.addColorStop(0, `rgba(255, 255, 255, ${(life - 0.8) * 2})`);
        flashGradient.addColorStop(0.3, `rgba(255, 255, 200, ${(life - 0.8) * 1})`);
        flashGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = flashGradient;
        ctx.beginPath();
        ctx.arc(x, y, flashSize, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      time += 0.016;

      ctx.fillStyle = 'rgba(5, 5, 15, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (time > nextBurstTime) {
        bursts.push(createBurst(
          canvas.width * 0.15 + Math.random() * canvas.width * 0.7,
          canvas.height * 0.15 + Math.random() * canvas.height * 0.7
        ));
        nextBurstTime = time + 0.3 + Math.random() * 0.8;
      }

      for (let i = bursts.length - 1; i >= 0; i--) {
        const burst = bursts[i];
        burst.life -= 0.008;

        if (burst.life <= 0) {
          bursts.splice(i, 1);
          continue;
        }

        for (const p of burst.particles) {
          p.distance += p.speed;
          p.speed *= p.decay;
        }

        drawBurst(burst);
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let i = 0; i < 3; i++) {
        const gx = (Math.sin(time * 0.5 + i * 2) * 0.4 + 0.5) * canvas.width;
        const gy = (Math.cos(time * 0.3 + i * 1.5) * 0.4 + 0.5) * canvas.height;
        ctx.beginPath();
        ctx.arc(gx, gy, 100 + Math.sin(time + i) * 30, 0, Math.PI * 2);
        ctx.fill();
      }

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
