'use client';

import { useEffect, useRef } from 'react';

export interface ConfettiBackgroundProps {
  particleCount?: number;
  colors?: string[];
  speed?: number;
  spread?: number;
}

interface ConfettiParticle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
  gravity: number;
}

export function ConfettiBackground({
  particleCount = 100,
  colors = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171'],
  speed = 2,
  spread = 3,
}: ConfettiBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: ConfettiParticle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): ConfettiParticle => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height,
      width: 8 + Math.random() * 8,
      height: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      vx: (Math.random() - 0.5) * spread,
      vy: speed * (0.5 + Math.random() * 0.5),
      gravity: 0.02,
    });

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        const p = createParticle();
        p.y = Math.random() * canvas.height; // Spread initially
        particles.push(p);
      }
    };

    const draw = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        // Update physics
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Add slight wobble
        p.vx += (Math.random() - 0.5) * 0.1;

        // Reset when off screen
        if (p.y > canvas.height + 20) {
          particles[index] = createParticle();
        }

        // Draw confetti
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        ctx.restore();
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
  }, [particleCount, colors, speed, spread]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      }}
    />
  );
}
