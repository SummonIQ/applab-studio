'use client';

import { useEffect, useRef } from 'react';

export function BinaryRainHero() {
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

      ctx.fillStyle = '#0a0f14';
      ctx.fillRect(0, 0, w, h);

      // Gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, 'rgba(20, 50, 80, 0.15)');
      gradient.addColorStop(1, 'rgba(10, 20, 30, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Floating particles at different depths
      for (let i = 0; i < 25; i++) {
        const depth = (i % 3) + 1;
        const speed = 0.15 / depth;
        const x = (Math.sin(i * 1.7 + time * speed) * 0.4 + 0.5) * w;
        const y = (Math.cos(i * 2.3 + time * speed * 0.8) * 0.4 + 0.5) * h;
        const size = 1.5 + (3 - depth);
        const alpha = 0.06 + Math.sin(time * 2 + i) * 0.03;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 180, 220, ${alpha})`;
        ctx.fill();
      }

      // Connecting lines between nearby particles
      ctx.strokeStyle = 'rgba(100, 180, 220, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 15; i++) {
        const x1 = (Math.sin(i * 1.7 + time * 0.15) * 0.4 + 0.5) * w;
        const y1 = (Math.cos(i * 2.3 + time * 0.12) * 0.4 + 0.5) * h;
        const x2 = (Math.sin((i + 1) * 1.7 + time * 0.15) * 0.4 + 0.5) * w;
        const y2 = (Math.cos((i + 1) * 2.3 + time * 0.12) * 0.4 + 0.5) * h;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
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
      style={{ background: '#0a0f14' }}
    />
  );
}
