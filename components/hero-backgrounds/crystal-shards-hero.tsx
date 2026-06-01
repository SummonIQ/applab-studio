'use client';

import { useEffect, useRef } from 'react';

export function CrystalShardsHero() {
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

      ctx.fillStyle = '#08080f';
      ctx.fillRect(0, 0, w, h);

      // Corner glows
      const glow1 = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.6);
      glow1.addColorStop(0, 'rgba(100, 120, 180, 0.06)');
      glow1.addColorStop(0.5, 'rgba(80, 100, 160, 0.05)');
      glow1.addColorStop(1, 'transparent');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, w, h);

      const glow2 = ctx.createRadialGradient(w, h, 0, w, h, w * 0.5);
      glow2.addColorStop(0, 'rgba(160, 100, 180, 0.05)');
      glow2.addColorStop(0.5, 'rgba(140, 80, 160, 0.04)');
      glow2.addColorStop(1, 'transparent');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, w, h);

      // Diagonal lines with varying opacity
      for (let i = 0; i < 12; i++) {
        const offset = Math.sin(time * 0.3 + i * 0.5) * 30;
        const alpha = 0.06 + Math.sin(time + i) * 0.03;
        ctx.strokeStyle = `rgba(120, 140, 200, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w * 0.1 + i * 60 + offset, 0);
        ctx.lineTo(w * -0.1 + i * 60 + offset, h);
        ctx.stroke();
      }

      // Small floating crystals
      for (let i = 0; i < 8; i++) {
        const x = (Math.sin(i * 2.1 + time * 0.2) * 0.35 + 0.5) * w;
        const y = (Math.cos(i * 1.7 + time * 0.15) * 0.35 + 0.5) * h;
        const size = 3 + Math.sin(time + i) * 1;
        const rotation = time * 0.5 + i;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.7, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(-size * 0.7, 0);
        ctx.closePath();
        ctx.fillStyle = `rgba(140, 160, 220, ${0.04 + Math.sin(time * 2 + i) * 0.02})`;
        ctx.fill();
        ctx.restore();
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
      style={{ background: '#08080f' }}
    />
  );
}
