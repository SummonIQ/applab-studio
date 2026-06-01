'use client';

import { useEffect, useRef } from 'react';

export function SunbeamHero() {
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
      time += 0.005;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const rays = 12;
      const centerX = canvas.width * 0.5;
      const centerY = -50;

      for (let i = 0; i < rays; i++) {
        const angle = (i / rays) * Math.PI * 0.6 + Math.PI * 0.2;
        const pulse = Math.sin(time + i * 0.5) * 0.02;
        const alpha = 0.03 + pulse;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const length = canvas.height * 1.5;
        const spread = 0.08;
        ctx.lineTo(
          centerX + Math.cos(angle - spread) * length,
          centerY + Math.sin(angle - spread) * length,
        );
        ctx.lineTo(
          centerX + Math.cos(angle + spread) * length,
          centerY + Math.sin(angle + spread) * length,
        );
        ctx.closePath();

        const gradient = ctx.createLinearGradient(
          centerX,
          centerY,
          centerX,
          canvas.height,
        );
        gradient.addColorStop(0, `rgba(251, 191, 36, ${alpha * 2})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
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
