'use client';

import { useEffect, useRef } from 'react';

export function GalaxySpiralHero() {
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
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = '#06060a';
      ctx.fillRect(0, 0, w, h);

      // Background stars
      for (let i = 0; i < 60; i++) {
        const x = (Math.sin(i * 7.3) * 0.45 + 0.5) * w;
        const y = (Math.cos(i * 5.7) * 0.45 + 0.5) * h;
        const twinkle = 0.1 + Math.sin(time * 3 + i * 2) * 0.08;
        const size = 0.5 + (i % 3) * 0.3;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 240, ${twinkle})`;
        ctx.fill();
      }

      // Spiral arm hints
      for (let arm = 0; arm < 3; arm++) {
        const armOffset = (arm / 3) * Math.PI * 2;
        ctx.beginPath();
        for (let i = 0; i < 50; i++) {
          const t = i / 50;
          const angle = t * Math.PI * 2 + armOffset + time * 0.1;
          const radius = t * Math.min(w, h) * 0.35;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius * 0.6;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(140, 120, 180, ${0.06 + Math.sin(time + arm) * 0.02})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Center core glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.25);
      glow.addColorStop(0, 'rgba(180, 140, 200, 0.06)');
      glow.addColorStop(0.3, 'rgba(120, 100, 160, 0.08)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Dust particles near center
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2 + time * 0.2;
        const radius = 30 + i * 8 + Math.sin(time + i) * 10;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * 0.5;

        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 160, 220, ${0.05 + Math.sin(time * 2 + i) * 0.02})`;
        ctx.fill();
      }

      time += 0.008;
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
      style={{ background: '#06060a' }}
    />
  );
}
