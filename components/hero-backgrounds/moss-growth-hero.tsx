'use client';

import { useEffect, useRef } from 'react';

export function MossGrowthHero() {
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

    const patches = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 30 + Math.random() * 50,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.008;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      patches.forEach(patch => {
        const pulse = Math.sin(time + patch.phase) * 0.2 + 1;
        const size = patch.size * pulse;

        const gradient = ctx.createRadialGradient(
          patch.x,
          patch.y,
          0,
          patch.x,
          patch.y,
          size,
        );
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.12)');
        gradient.addColorStop(0.7, 'rgba(22, 163, 74, 0.06)');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(patch.x, patch.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

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
