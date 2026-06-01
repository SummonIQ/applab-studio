'use client';

import { useEffect, useRef } from 'react';

export function DnaHelixHero() {
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

      ctx.fillStyle = '#0a0e14';
      ctx.fillRect(0, 0, w, h);

      // Multiple wave lines with depth
      for (let layer = 0; layer < 6; layer++) {
        const alpha = 0.04 - layer * 0.005;
        const amplitude = 15 - layer * 2;
        ctx.strokeStyle = `rgba(80, 140, 200, ${alpha})`;
        ctx.lineWidth = 1.5 - layer * 0.2;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const y =
            h * (0.25 + layer * 0.1) +
            Math.sin(x * 0.012 + time + layer * 0.5) * amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Nodes along the waves
      for (let i = 0; i < 12; i++) {
        const waveIndex = i % 4;
        const xPos = (i / 12) * w + Math.sin(time + i) * 20;
        const y =
          h * (0.3 + waveIndex * 0.12) +
          Math.sin(xPos * 0.012 + time + waveIndex * 0.5) *
            (12 - waveIndex * 2);
        const size = 2 + Math.sin(time * 2 + i) * 0.5;

        ctx.beginPath();
        ctx.arc(xPos, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 180, 220, ${0.06 + Math.sin(time + i) * 0.02})`;
        ctx.fill();
      }

      // Center glow
      const glow = ctx.createRadialGradient(
        w * 0.5,
        h * 0.5,
        0,
        w * 0.5,
        h * 0.5,
        w * 0.4,
      );
      glow.addColorStop(0, 'rgba(60, 120, 180, 0.08)');
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
      style={{ background: '#0a0e14' }}
    />
  );
}
