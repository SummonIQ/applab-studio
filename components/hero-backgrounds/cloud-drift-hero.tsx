'use client';

import { useEffect, useRef } from 'react';

export function CloudDriftHero() {
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

    const clouds = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: canvas.height * (0.2 + Math.random() * 0.5),
      width: 150 + Math.random() * 100,
      speed: 0.15 + Math.random() * 0.1,
      alpha: 0.04 + Math.random() * 0.03,
    }));

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > canvas.width + cloud.width) {
          cloud.x = -cloud.width;
        }

        const gradient = ctx.createRadialGradient(
          cloud.x,
          cloud.y,
          0,
          cloud.x,
          cloud.y,
          cloud.width,
        );
        gradient.addColorStop(0, `rgba(148, 163, 184, ${cloud.alpha})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(
          cloud.x,
          cloud.y,
          cloud.width,
          cloud.width * 0.4,
          0,
          0,
          Math.PI * 2,
        );
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
