'use client';

import { useEffect, useRef } from 'react';

export function GravityParticlesHero() {
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
      const cx = w * 0.5;
      const cy = h * 0.5;

      ctx.fillStyle = '#0a080e';
      ctx.fillRect(0, 0, w, h);

      // Drifting particles with trails
      for (let i = 0; i < 25; i++) {
        const angle = time * 0.3 + i * 0.5;
        const radius = 50 + i * 8 + Math.sin(time + i) * 20;
        const x = cx + Math.cos(angle) * radius * (0.8 + Math.sin(i) * 0.3);
        const y = cy + Math.sin(angle) * radius * 0.5;
        const size = 2 + Math.sin(time * 2 + i) * 0.8;
        const alpha = 0.12 + Math.sin(time + i) * 0.05;

        // Trail
        const prevX =
          cx + Math.cos(angle - 0.1) * radius * (0.8 + Math.sin(i) * 0.3);
        const prevY = cy + Math.sin(angle - 0.1) * radius * 0.5;
        ctx.strokeStyle = `rgba(160, 140, 200, ${alpha * 0.3})`;
        ctx.lineWidth = size * 0.5;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Particle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 140, 200, ${alpha})`;
        ctx.fill();
      }

      // Connecting lines
      ctx.strokeStyle = 'rgba(140, 120, 180, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 10; i++) {
        const a1 = time * 0.3 + i * 0.5;
        const r1 = 50 + i * 8;
        const x1 = cx + Math.cos(a1) * r1 * 0.8;
        const y1 = cy + Math.sin(a1) * r1 * 0.5;
        const a2 = time * 0.3 + (i + 1) * 0.5;
        const r2 = 50 + (i + 1) * 8;
        const x2 = cx + Math.cos(a2) * r2 * 0.8;
        const y2 = cy + Math.sin(a2) * r2 * 0.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Center glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.3);
      glow.addColorStop(0, 'rgba(120, 100, 160, 0.1)');
      glow.addColorStop(0.5, 'rgba(100, 80, 140, 0.04)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      time += 0.012;
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
      style={{ background: '#0a080e' }}
    />
  );
}
