'use client';

import { useEffect, useRef } from 'react';

export function LightningStormHero() {
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

      // Dark gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#0a0a12');
      gradient.addColorStop(0.4, '#0c0c18');
      gradient.addColorStop(1, '#0e0e1a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Cloud shapes
      for (let i = 0; i < 8; i++) {
        const x = (Math.sin(i * 1.5 + time * 0.05) * 0.4 + 0.5) * w;
        const y = h * 0.15 + Math.sin(i * 0.7) * 40;
        const size = 100 + i * 15 + Math.sin(time + i) * 20;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, size);
        glow.addColorStop(0, 'rgba(70, 70, 120, 0.08)');
        glow.addColorStop(0.5, 'rgba(50, 50, 90, 0.04)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }

      // Occasional lightning flash hint
      if (Math.sin(time * 0.5) > 0.98) {
        ctx.fillStyle = 'rgba(150, 150, 200, 0.03)';
        ctx.fillRect(0, 0, w, h);
      }

      // Electric tendrils
      ctx.strokeStyle = 'rgba(120, 120, 200, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        let x = w * (0.2 + i * 0.2);
        let y = 0;
        ctx.moveTo(x, y);
        for (let j = 0; j < 8; j++) {
          x += Math.sin(time * 2 + i + j) * 20;
          y += h * 0.05;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Rain streaks
      ctx.strokeStyle = 'rgba(100, 100, 150, 0.03)';
      for (let i = 0; i < 15; i++) {
        const x = (i / 15) * w + Math.sin(time + i) * 10;
        const y = (time * 100 + i * 50) % h;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 3, y + 20);
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
      style={{ background: '#0a0a12' }}
    />
  );
}
