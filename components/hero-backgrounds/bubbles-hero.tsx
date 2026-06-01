'use client';

import { useEffect, useRef } from 'react';

export function BubblesHero() {
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

      ctx.fillStyle = '#080810';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 20; i++) {
        const x =
          (Math.sin(i * 2.4) * 0.4 + 0.5) * w + Math.sin(time * 0.5 + i) * 20;
        const baseY = h + 50 - ((time * 30 + i * 60) % (h + 100));
        const size = 15 + (i % 5) * 8;
        const alpha = 0.04 + Math.sin(time + i) * 0.02;

        ctx.beginPath();
        ctx.arc(x, baseY, size, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 150, 200, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const highlight = ctx.createRadialGradient(
          x - size * 0.3,
          baseY - size * 0.3,
          0,
          x,
          baseY,
          size,
        );
        highlight.addColorStop(0, `rgba(150, 200, 255, ${alpha * 0.3})`);
        highlight.addColorStop(1, 'transparent');
        ctx.fillStyle = highlight;
        ctx.fill();
      }

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
      style={{ background: '#080810' }}
    />
  );
}
