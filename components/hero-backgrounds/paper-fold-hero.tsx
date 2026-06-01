'use client';

import { useEffect, useRef } from 'react';

export function PaperFoldHero() {
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
      time += 0.01;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const folds = 6;
      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;

      for (let i = 0; i < folds; i++) {
        const angle = (i / folds) * Math.PI * 2 + time * 0.2;
        const fold = Math.sin(time + i * 0.5) * 0.3;
        const size = 120 + fold * 30;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size, size * 0.3);
        ctx.lineTo(size * 0.8, size);
        ctx.closePath();
        ctx.fillStyle = `rgba(148, 163, 184, ${0.06 + fold * 0.02})`;
        ctx.fill();
        ctx.restore();
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
