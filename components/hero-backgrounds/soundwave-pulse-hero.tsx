'use client';

import { useEffect, useRef } from 'react';

export function SoundwavePulseHero() {
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
      time += 0.03;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height * 0.5;
      const bars = 60;

      for (let i = 0; i < bars; i++) {
        const x = (canvas.width / bars) * i + canvas.width / bars / 2;
        const height =
          Math.abs(Math.sin(i * 0.2 + time) * Math.sin(i * 0.1 + time * 0.5)) *
            100 +
          5;
        const alpha = 0.15 + Math.sin(i * 0.2 + time) * 0.1;

        ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.fillRect(x - 2, centerY - height / 2, 4, height);
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
