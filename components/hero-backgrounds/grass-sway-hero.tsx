'use client';

import { useEffect, useRef } from 'react';

export function GrassSwayHero() {
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
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const blades = 80;
      const baseY = canvas.height * 0.85;

      for (let i = 0; i < blades; i++) {
        const x = (canvas.width / blades) * i + 10;
        const height = 60 + Math.random() * 40;
        const sway = Math.sin(time + i * 0.2) * 15;

        ctx.beginPath();
        ctx.moveTo(x, baseY);
        ctx.quadraticCurveTo(
          x + sway * 0.5,
          baseY - height * 0.5,
          x + sway,
          baseY - height,
        );
        ctx.strokeStyle = `rgba(34, 197, 94, ${0.15 + Math.random() * 0.05})`;
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
