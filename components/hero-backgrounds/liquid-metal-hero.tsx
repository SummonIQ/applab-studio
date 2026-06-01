'use client';

import { useEffect, useRef } from 'react';

export function LiquidMetalHero() {
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

      ctx.fillStyle = '#0a0a10';
      ctx.fillRect(0, 0, w, h);

      // Metallic blobs with highlights
      for (let i = 0; i < 5; i++) {
        const x = (Math.sin(time * 0.2 + i * 1.5) * 0.3 + 0.5) * w;
        const y = (Math.cos(time * 0.15 + i * 2) * 0.3 + 0.5) * h;
        const size = 80 + i * 25 + Math.sin(time + i) * 20;

        // Main blob
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, 'rgba(160, 170, 200, 0.1)');
        gradient.addColorStop(0.4, 'rgba(130, 140, 170, 0.06)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Highlight
        const hx = x - size * 0.3;
        const hy = y - size * 0.3;
        const highlight = ctx.createRadialGradient(
          hx,
          hy,
          0,
          hx,
          hy,
          size * 0.4,
        );
        highlight.addColorStop(0, 'rgba(200, 210, 240, 0.08)');
        highlight.addColorStop(1, 'transparent');
        ctx.fillStyle = highlight;
        ctx.fillRect(0, 0, w, h);
      }

      // Reflection lines
      ctx.strokeStyle = 'rgba(160, 170, 200, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const y = h * (0.3 + i * 0.1) + Math.sin(time + i) * 10;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= w; x += 20) {
          ctx.lineTo(x, y + Math.sin(x * 0.02 + time) * 5);
        }
        ctx.stroke();
      }

      time += 0.01;
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
      style={{ background: '#0a0a10' }}
    />
  );
}
