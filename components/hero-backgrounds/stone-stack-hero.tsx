'use client';

import { useEffect, useRef } from 'react';

export function StoneStackHero() {
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

    const stacks = [
      { x: canvas.width * 0.25, stones: 4 },
      { x: canvas.width * 0.5, stones: 5 },
      { x: canvas.width * 0.75, stones: 3 },
    ];

    const animate = () => {
      time += 0.01;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stacks.forEach(stack => {
        let y = canvas.height * 0.75;
        for (let i = 0; i < stack.stones; i++) {
          const width = 50 - i * 8;
          const height = 20 - i * 2;
          const wobble = Math.sin(time + i * 0.5) * (i * 0.5);

          ctx.beginPath();
          ctx.ellipse(stack.x + wobble, y, width, height, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(148, 163, 184, ${0.08 + i * 0.02})`;
          ctx.fill();

          y -= height * 1.5;
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
