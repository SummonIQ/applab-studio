'use client';

import { useEffect, useRef } from 'react';

export function AuroraShimmerHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.008;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const bands = 5;
      for (let i = 0; i < bands; i++) {
        const y = canvas.height * (0.2 + i * 0.12);
        const hue = 150 + i * 30 + Math.sin(time) * 20;

        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= canvas.width; x += 10) {
          const wave = Math.sin(x * 0.005 + time + i) * 40;
          ctx.lineTo(x, y + wave);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, y - 50, 0, y + 100);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, `hsla(${hue}, 70%, 50%, 0.08)`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
