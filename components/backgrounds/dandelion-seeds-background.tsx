'use client';

import { useEffect, useRef } from 'react';

export function DandelionSeedsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Seed {
      x: number;
      y: number;
      vx: number;
      vy: number;
      rotation: number;
      size: number;
    }

    const seeds: Seed[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.3) * 2,
      vy: -0.3 - Math.random() * 0.5,
      rotation: Math.random() * Math.PI * 2,
      size: 15 + Math.random() * 10,
    }));

    let animationId: number;
    let time = 0;

    const drawSeed = (seed: Seed) => {
      ctx.save();
      ctx.translate(seed.x, seed.y);
      ctx.rotate(seed.rotation);

      // Seed body
      ctx.beginPath();
      ctx.ellipse(0, 0, 2, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139, 119, 101, 0.8)';
      ctx.fill();

      // Fluffy top
      const fluffCount = 12;
      for (let i = 0; i < fluffCount; i++) {
        const angle = (i / fluffCount) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, -4);
        const endX = Math.cos(angle) * seed.size;
        const endY = -4 + Math.sin(angle) * seed.size * 0.5 - seed.size * 0.8;
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Tiny fluff at end
        ctx.beginPath();
        ctx.arc(endX, endY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      time += 0.016;
      ctx.fillStyle = 'rgba(135, 206, 235, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      seeds.forEach(seed => {
        seed.x += seed.vx + Math.sin(time + seed.y * 0.01) * 0.5;
        seed.y += seed.vy;
        seed.rotation += 0.01;

        if (seed.y < -seed.size * 2) {
          seed.y = canvas.height + seed.size * 2;
          seed.x = Math.random() * canvas.width;
        }
        if (seed.x < -seed.size) seed.x = canvas.width + seed.size;
        if (seed.x > canvas.width + seed.size) seed.x = -seed.size;

        drawSeed(seed);
      });

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
