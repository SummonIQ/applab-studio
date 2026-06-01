'use client';

import { useEffect, useRef } from 'react';

export function MorningMistHero() {
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
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let layer = 0; layer < 4; layer++) {
        const y = canvas.height * (0.4 + layer * 0.15);
        const gradient = ctx.createLinearGradient(0, y - 100, 0, y + 100);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(
          0.5,
          `rgba(148, 163, 184, ${0.04 - layer * 0.008})`,
        );
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, y - 100);

        for (let x = 0; x <= canvas.width; x += 20) {
          const wave = Math.sin(x * 0.003 + time + layer) * 30;
          ctx.lineTo(x, y + wave);
        }

        ctx.lineTo(canvas.width, y + 100);
        ctx.lineTo(0, y + 100);
        ctx.closePath();
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
