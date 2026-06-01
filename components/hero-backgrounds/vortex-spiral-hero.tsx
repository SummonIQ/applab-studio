'use client';

import { useEffect, useRef } from 'react';

export function VortexSpiralHero() {
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

      ctx.fillStyle = '#08081a';
      ctx.fillRect(0, 0, w, h);

      // Spiral arms
      for (let arm = 0; arm < 4; arm++) {
        const armOffset = (arm / 4) * Math.PI * 2;
        ctx.beginPath();
        for (let i = 0; i < 80; i++) {
          const t = i / 80;
          const angle = t * Math.PI * 4 + armOffset + time * 0.3;
          const radius = t * Math.min(w, h) * 0.4;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius * 0.6;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(140, 100, 200, ${0.06 + Math.sin(time + arm) * 0.02})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Concentric pulse rings
      for (let i = 1; i < 6; i++) {
        const baseRadius = i * 35;
        const pulse = Math.sin(time * 2 - i * 0.5) * 8;
        const radius = baseRadius + pulse;
        const alpha = 0.06 - i * 0.008;
        ctx.strokeStyle = `rgba(120, 90, 180, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Floating particles
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2 + time * 0.5;
        const radius = 50 + i * 15 + Math.sin(time + i) * 10;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 130, 220, ${0.1 + Math.sin(time * 2 + i) * 0.05})`;
        ctx.fill();
      }

      // Center glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      glow.addColorStop(0, 'rgba(140, 100, 200, 0.12)');
      glow.addColorStop(0.5, 'rgba(100, 70, 160, 0.05)');
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
      style={{ background: '#08081a' }}
    />
  );
}
