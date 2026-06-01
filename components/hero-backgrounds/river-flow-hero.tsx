'use client';

import { useEffect, useRef } from 'react';

export function RiverFlowHero() {
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
      time += 0.006;
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const streams = 5;
      for (let s = 0; s < streams; s++) {
        const yBase = canvas.height * (0.25 + s * 0.15);

        ctx.beginPath();
        ctx.moveTo(0, yBase);

        for (let x = 0; x <= canvas.width; x += 8) {
          const meander = Math.sin(x * 0.004 + time + s) * 40;
          const ripple = Math.sin(x * 0.02 + time * 3) * 5;
          ctx.lineTo(x, yBase + meander + ripple);
        }

        ctx.strokeStyle = `rgba(56, 189, 248, ${0.06 + s * 0.01})`;
        ctx.lineWidth = 2;
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
