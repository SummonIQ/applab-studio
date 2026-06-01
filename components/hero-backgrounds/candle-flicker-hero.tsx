'use client';

import { useEffect, useRef } from 'react';

export function CandleFlickerHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement; canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const candles = Array.from({ length: 6 }, (_, i) => ({
      x: (canvas.width / 7) * (i + 1),
      y: canvas.height * 0.7,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.1;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      candles.forEach(candle => {
        const flicker =
          Math.sin(time + candle.phase) * 0.3 +
          Math.sin(time * 2.3 + candle.phase) * 0.2;
        const size = 30 + flicker * 15;

        const gradient = ctx.createRadialGradient(
          candle.x,
          candle.y - size,
          0,
          candle.x,
          candle.y - size,
          size * 2,
        );
        gradient.addColorStop(
          0,
          `rgba(251, 191, 36, ${0.12 + flicker * 0.04})`,
        );
        gradient.addColorStop(0.5, 'rgba(251, 146, 60, 0.04)');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(candle.x, candle.y - size, size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
