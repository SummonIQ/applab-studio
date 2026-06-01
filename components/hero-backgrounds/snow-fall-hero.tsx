'use client';

import { useEffect, useRef } from 'react';

export function SnowFallHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#0a0c12');
      gradient.addColorStop(1, '#0c0e16');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 50; i++) {
        const depth = (i % 3) + 1;
        const speed = 15 / depth;
        const size = 1 + (3 - depth) * 0.8;
        const sway = 30 / depth;

        const baseX = (i / 50) * w + Math.sin(i * 3.7) * w * 0.2;
        const y = ((time * speed + i * 30) % (h + 20)) - 10;
        const x = baseX + Math.sin(y * 0.01 + time + i) * sway;
        const alpha = (0.15 + Math.sin(time + i) * 0.05) / depth;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 230, 250, ${alpha})`;
        ctx.fill();
      }

      const groundGlow = ctx.createRadialGradient(
        w / 2,
        h * 1.2,
        0,
        w / 2,
        h * 1.2,
        h * 0.6,
      );
      groundGlow.addColorStop(0, 'rgba(150, 170, 200, 0.05)');
      groundGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = groundGlow;
      ctx.fillRect(0, 0, w, h);

      time += 0.02;
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#0a0c12' }}
    />
  );
}
