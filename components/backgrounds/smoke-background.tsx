'use client';

import { useEffect, useRef } from 'react';

export interface SmokeBackgroundProps {
  smokeCount?: number;
  color?: string;
  speed?: number;
  opacity?: number;
}

interface SmokePuff {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export function SmokeBackground({
  smokeCount = 15,
  color = '#64748b',
  speed = 0.5,
  opacity = 0.3,
}: SmokeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const puffs: SmokePuff[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createPuff = (): SmokePuff => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 50,
      radius: 20 + Math.random() * 30,
      maxRadius: 100 + Math.random() * 150,
      opacity: opacity,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: -speed * (1 + Math.random()),
      life: 0,
      maxLife: 200 + Math.random() * 200,
    });

    const init = () => {
      puffs.length = 0;
      for (let i = 0; i < smokeCount; i++) {
        const p = createPuff();
        p.y = Math.random() * canvas.height;
        p.life = Math.random() * p.maxLife;
        puffs.push(p);
      }
    };

    const draw = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      puffs.forEach((p, index) => {
        // Update
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Grow radius over time
        const lifeRatio = p.life / p.maxLife;
        p.radius = p.radius + (p.maxRadius - p.radius) * 0.01;

        // Fade out (clamped to avoid negative values)
        const currentOpacity = Math.max(0, p.opacity * (1 - lifeRatio));

        // Reset when life ends
        if (p.life >= p.maxLife || p.y < -p.radius) {
          puffs[index] = createPuff();
        }

        // Draw smoke puff with gradient
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius,
        );
        gradient.addColorStop(
          0,
          color +
            Math.floor(currentOpacity * 255)
              .toString(16)
              .padStart(2, '0'),
        );
        gradient.addColorStop(
          0.4,
          color +
            Math.floor(currentOpacity * 128)
              .toString(16)
              .padStart(2, '0'),
        );
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    init();
    window.addEventListener('resize', () => {
      resize();
      init();
    });
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [smokeCount, color, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'linear-gradient(to top, #0f172a, #1e293b)' }}
    />
  );
}
