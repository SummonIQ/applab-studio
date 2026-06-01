'use client';

import { useEffect, useRef } from 'react';

export function TopographyHero() {
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
      time += 0.004;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw topographic contour lines
      const lineCount = 25;
      const baseY = canvas.height * 0.5;

      for (let i = 0; i < lineCount; i++) {
        const yOffset = (i - lineCount / 2) * 25;
        const alpha =
          0.03 + (1 - Math.abs(i - lineCount / 2) / (lineCount / 2)) * 0.05;

        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 10) {
          const noise1 = Math.sin(x * 0.008 + i * 0.3 + time * 1.2) * 30;
          const noise2 = Math.sin(x * 0.003 + i * 0.5 + time * 0.7) * 50;
          const noise3 = Math.sin(x * 0.015 + time * 2.5) * 12;
          const y = baseY + yOffset + noise1 + noise2 + noise3;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
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
