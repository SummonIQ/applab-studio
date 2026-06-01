'use client';

import { useEffect, useRef } from 'react';

export function TidePoolHero() {
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
      time += 0.015;
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const layers = 4;
      for (let l = 0; l < layers; l++) {
        const y = canvas.height * (0.5 + l * 0.12);

        ctx.beginPath();
        ctx.moveTo(0, y);

        for (let x = 0; x <= canvas.width; x += 10) {
          const wave1 = Math.sin(x * 0.01 + time + l * 0.5) * 20;
          const wave2 = Math.sin(x * 0.02 + time * 1.5) * 10;
          ctx.lineTo(x, y + wave1 + wave2);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = `rgba(14, 165, 233, ${0.04 - l * 0.008})`;
        ctx.fill();
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
