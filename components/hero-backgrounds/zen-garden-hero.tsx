'use client';

import { useEffect, useRef } from 'react';

export function ZenGardenHero() {
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

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.003;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const lines = 20;
      for (let i = 0; i < lines; i++) {
        const y = (canvas.height / lines) * i + 50;
        const wave = Math.sin(time + i * 0.2) * 5;

        ctx.beginPath();
        ctx.moveTo(0, y + wave);
        for (let x = 0; x <= canvas.width; x += 30) {
          const curve = Math.sin(x * 0.01 + i * 0.3) * 8;
          ctx.lineTo(x, y + wave + curve);
        }
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

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
