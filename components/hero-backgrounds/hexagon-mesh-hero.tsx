'use client';

import { useEffect, useRef } from 'react';

export function HexagonMeshHero() {
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

    const drawHex = (x: number, y: number, size: number, alpha: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(100, 140, 180, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const size = 30;
      const xSpacing = size * 1.75;
      const ySpacing = size * 1.5;

      ctx.fillStyle = '#080a10';
      ctx.fillRect(0, 0, w, h);

      for (let row = -1; row < h / ySpacing + 2; row++) {
        for (let col = -1; col < w / xSpacing + 2; col++) {
          const x = col * xSpacing + (row % 2) * (xSpacing / 2);
          const y = row * ySpacing;
          const dist = Math.hypot(x - w / 2, y - h / 2);
          const wave = Math.sin(dist * 0.015 - time * 2) * 0.5 + 0.5;
          const alpha = 0.04 + wave * 0.06;
          drawHex(x, y, size, alpha);
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
      glow.addColorStop(0, 'rgba(80, 120, 180, 0.1)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
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
      style={{ background: '#080a10' }}
    />
  );
}
