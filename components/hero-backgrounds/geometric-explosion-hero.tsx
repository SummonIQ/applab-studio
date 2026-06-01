'use client';

import { useEffect, useRef } from 'react';

export function GeometricExplosionHero() {
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

      ctx.fillStyle = '#08080f';
      ctx.fillRect(0, 0, w, h);

      // Radiating lines with pulse
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2 + time * 0.05;
        const pulse = 0.03 + Math.sin(time * 2 + i * 0.5) * 0.015;
        ctx.strokeStyle = `rgba(100, 120, 180, ${pulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + Math.cos(angle) * w * 0.6,
          cy + Math.sin(angle) * h * 0.6,
        );
        ctx.stroke();
      }

      // Concentric rings
      for (let i = 1; i < 5; i++) {
        const radius = i * 50 + Math.sin(time + i) * 10;
        const alpha = 0.04 - i * 0.008;
        ctx.strokeStyle = `rgba(120, 140, 200, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Floating geometric shapes
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + time * 0.3;
        const dist = 80 + Math.sin(time + i) * 20;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        const size = 4 + Math.sin(time * 2 + i) * 2;
        const rotation = time + i;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          const a = (j / 6) * Math.PI * 2;
          const px = Math.cos(a) * size;
          const py = Math.sin(a) * size;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(140, 160, 220, ${0.05 + Math.sin(time + i) * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // Center glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.25);
      glow.addColorStop(0, 'rgba(120, 100, 200, 0.05)');
      glow.addColorStop(0.5, 'rgba(100, 80, 180, 0.05)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

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
