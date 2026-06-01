'use client';

import { useEffect, useRef } from 'react';

export function PixelDissolveHero() {
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

    const pixels = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 4 + Math.random() * 8,
      alpha: Math.random(),
      fadeSpeed: 0.005 + Math.random() * 0.01,
      fadeDir: Math.random() > 0.5 ? 1 : -1,
    }));

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      pixels.forEach(p => {
        p.alpha += p.fadeSpeed * p.fadeDir;
        if (p.alpha >= 1 || p.alpha <= 0) {
          p.fadeDir *= -1;
          if (p.alpha <= 0) {
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
          }
        }

        ctx.fillStyle = `rgba(129, 140, 248, ${p.alpha * 0.3})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
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
