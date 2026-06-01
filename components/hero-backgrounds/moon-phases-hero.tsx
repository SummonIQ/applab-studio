'use client';

import { useEffect, useRef } from 'react';

export function MoonPhasesHero() {
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

      const phases = 7;
      const centerY = canvas.height * 0.4;
      const spacing = canvas.width / (phases + 1);

      for (let i = 0; i < phases; i++) {
        const x = spacing * (i + 1);
        const radius = 25;
        const phase = (i / phases + time * 0.1) % 1;

        ctx.beginPath();
        ctx.arc(x, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(226, 232, 240, 0.08)';
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, centerY, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.beginPath();
        ctx.arc(
          x + radius * 2 * (phase - 0.5),
          centerY,
          radius,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = '#0a0a0f';
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
