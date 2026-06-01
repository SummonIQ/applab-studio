'use client';

import { useEffect, useRef } from 'react';

export function FallingLeavesHero() {
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
      gradient.addColorStop(0, '#0a0c08');
      gradient.addColorStop(1, '#080a06');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 25; i++) {
        const baseX = (i / 25) * w;
        const fallSpeed = 20 + (i % 4) * 8;
        const y = ((time * fallSpeed + i * 50) % (h + 60)) - 30;
        const x = baseX + Math.sin(y * 0.02 + i) * 40 + Math.sin(time + i) * 15;
        const rotation = time * 2 + i * 0.5 + Math.sin(y * 0.01) * 2;
        const size = 6 + (i % 3) * 3;
        const hue = 30 + (i % 4) * 20;
        const alpha = 0.05 + Math.sin(time + i) * 0.02;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, size, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 60%, 45%, ${alpha})`;
        ctx.fill();
        ctx.restore();
      }

      const groundGlow = ctx.createRadialGradient(
        w / 2,
        h * 1.1,
        0,
        w / 2,
        h * 1.1,
        h * 0.5,
      );
      groundGlow.addColorStop(0, 'rgba(80, 60, 40, 0.06)');
      groundGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = groundGlow;
      ctx.fillRect(0, 0, w, h);

      time += 0.015;
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
      style={{ background: '#0a0c08' }}
    />
  );
}
