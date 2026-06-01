'use client';

import { useEffect, useRef } from 'react';

export function DewdropHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement; canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drops = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 8 + Math.random() * 12,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.02;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach(drop => {
        const shimmer = (Math.sin(time + drop.phase) + 1) * 0.5;
        const gradient = ctx.createRadialGradient(
          drop.x - drop.size * 0.3,
          drop.y - drop.size * 0.3,
          0,
          drop.x,
          drop.y,
          drop.size,
        );
        gradient.addColorStop(
          0,
          `rgba(255, 255, 255, ${0.06 + shimmer * 0.03})`,
        );
        gradient.addColorStop(
          0.5,
          `rgba(147, 197, 253, ${0.04 + shimmer * 0.02})`,
        );
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
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
