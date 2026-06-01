'use client';

import { useEffect, useRef } from 'react';

export function FireEmbersHero() {
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

      // Warm dark gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#0f0a0a');
      gradient.addColorStop(0.7, '#120a08');
      gradient.addColorStop(1, '#0a0606');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Warm glow at bottom
      const glow = ctx.createRadialGradient(
        w * 0.5,
        h * 1.1,
        0,
        w * 0.5,
        h * 1.1,
        h * 0.7,
      );
      glow.addColorStop(0, 'rgba(200, 80, 30, 0.06)');
      glow.addColorStop(0.5, 'rgba(180, 60, 20, 0.06)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Rising ember particles
      for (let i = 0; i < 20; i++) {
        const baseX = (i / 20) * w;
        const x = baseX + Math.sin(time * 0.5 + i * 2) * 30;
        const y = h - ((time * 15 + i * 50) % (h + 100));
        const size = 1.5 + Math.sin(i) * 0.8;
        const alpha = 0.06 + Math.sin(time * 2 + i) * 0.03;
        const hue = 20 + Math.sin(i) * 15;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 80%, 55%, ${alpha * 0.5})`;
        ctx.fill();

        // Ember glow
        ctx.beginPath();
        ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 80%, 50%, ${alpha * 0.1})`;
        ctx.fill();
      }

      // Heat shimmer lines
      ctx.strokeStyle = 'rgba(200, 100, 50, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 10) {
          const y =
            h * (0.7 + i * 0.06) + Math.sin(x * 0.02 + time * 2 + i) * 5;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

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
      style={{ background: '#0f0a0a' }}
    />
  );
}
