'use client';

import { useEffect, useRef } from 'react';

export function PlasmaWavesHero() {
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

      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, w, h);

      // Overlapping color blobs
      for (let i = 0; i < 5; i++) {
        const x = (Math.sin(time * 0.2 + i * 1.5) * 0.35 + 0.5) * w;
        const y = (Math.cos(time * 0.15 + i * 2) * 0.35 + 0.5) * h;
        const hue = (time * 15 + i * 50) % 360;
        const size = 100 + i * 20 + Math.sin(time + i) * 25;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, `hsla(${hue}, 50%, 45%, 0.08)`);
        gradient.addColorStop(0.5, `hsla(${hue + 30}, 45%, 40%, 0.04)`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      // Wave interference pattern
      ctx.strokeStyle = 'rgba(150, 130, 180, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 10) {
          const y =
            h * (0.3 + i * 0.1) +
            Math.sin(x * 0.015 + time + i * 0.5) * 15 +
            Math.cos(x * 0.02 - time * 0.5) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

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
      style={{ background: '#0a0a12' }}
    />
  );
}
