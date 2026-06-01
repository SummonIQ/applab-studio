'use client';

import { useEffect, useRef } from 'react';

export function DiamondGridHero() {
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
      const size = 40;

      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, w, h);

      for (let row = -1; row < h / size + 1; row++) {
        for (let col = -1; col < w / size + 1; col++) {
          const x = col * size + (row % 2) * (size / 2);
          const y = row * size * 0.866;
          const dist = Math.hypot(x - w / 2, y - h / 2);
          const wave = Math.sin(dist * 0.02 - time * 2) * 0.5 + 0.5;
          const alpha = 0.02 + wave * 0.02;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.PI / 4);
          ctx.beginPath();
          ctx.rect(-size / 4, -size / 4, size / 2, size / 2);
          ctx.strokeStyle = `rgba(120, 140, 200, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }
      }

      const glow = ctx.createRadialGradient(
        w / 2,
        h / 2,
        0,
        w / 2,
        h / 2,
        w * 0.4,
      );
      glow.addColorStop(0, 'rgba(100, 120, 180, 0.04)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
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
      style={{ background: '#0a0a12' }}
    />
  );
}
