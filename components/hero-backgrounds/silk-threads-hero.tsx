'use client';

import { useEffect, useRef } from 'react';

export function SilkThreadsHero() {
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

    // Create draped silk curves connecting top to bottom
    const threads = Array.from({ length: 6 }, (_, i) => ({
      startX: (canvas.width / 7) * (i + 1),
      endX: (canvas.width / 7) * (i + 1) + (Math.random() - 0.5) * 100,
      sag: 80 + Math.random() * 60,
      phase: Math.random() * Math.PI * 2,
    }));

    const animate = () => {
      time += 0.008;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      threads.forEach((t, i) => {
        const shimmer = Math.sin(time * 2 + t.phase) * 0.03;

        // Draw multiple layers for silk sheen effect
        for (let layer = 0; layer < 3; layer++) {
          const offset = layer * 3;
          const midX = (t.startX + t.endX) / 2;
          const controlY =
            canvas.height * 0.5 + t.sag + Math.sin(time + t.phase) * 20;

          ctx.beginPath();
          ctx.moveTo(t.startX + offset, 0);
          ctx.quadraticCurveTo(
            midX + offset,
            controlY,
            t.endX + offset,
            canvas.height,
          );
          ctx.strokeStyle = `rgba(251, 191, 36, ${0.08 - layer * 0.02 + shimmer})`;
          ctx.lineWidth = 2 - layer * 0.5;
          ctx.stroke();
        }
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
