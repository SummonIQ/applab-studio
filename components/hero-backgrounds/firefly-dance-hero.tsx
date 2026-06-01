'use client';

import { useEffect, useRef } from 'react';

export function FireflyDanceHero() {
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

    const fireflies = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      phase: Math.random() * Math.PI * 2,
      size: 2 + Math.random() * 2,
    }));

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.02;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fireflies.forEach(f => {
        f.x += f.vx + Math.sin(time + f.phase) * 0.3;
        f.y += f.vy + Math.cos(time + f.phase) * 0.3;

        if (f.x < 0) f.x = canvas.width;
        if (f.x > canvas.width) f.x = 0;
        if (f.y < 0) f.y = canvas.height;
        if (f.y > canvas.height) f.y = 0;

        const glow = (Math.sin(time * 2 + f.phase) + 1) * 0.5;
        const alpha = 0.08 + glow * 0.12;

        const gradient = ctx.createRadialGradient(
          f.x,
          f.y,
          0,
          f.x,
          f.y,
          f.size * 4,
        );
        gradient.addColorStop(0, `rgba(250, 204, 21, ${alpha * 0.5})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 4, 0, Math.PI * 2);
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
