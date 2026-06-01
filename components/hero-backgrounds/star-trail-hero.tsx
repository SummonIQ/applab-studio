'use client';

import { useEffect, useRef } from 'react';

export function StarTrailHero() {
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

    let time = 0;
    let animationId: number;

    const stars = Array.from({ length: 60 }, () => ({
      angle: Math.random() * Math.PI * 2,
      distance: 100 + Math.random() * 250,
      speed: 0.002 + Math.random() * 0.003,
      size: 1 + Math.random() * 1.5,
    }));

    const animate = () => {
      time += 0.01;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;

      stars.forEach(star => {
        star.angle += star.speed;
        const x = centerX + Math.cos(star.angle) * star.distance;
        const y = centerY + Math.sin(star.angle) * star.distance;

        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
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
