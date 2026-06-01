'use client';

import { useEffect, useRef } from 'react';

export function LineWeaveHero() {
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
      time += 0.006;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Interlocking diagonal weave pattern
      const spacing = 60;

      // Draw diagonal lines going one direction
      for (let i = -10; i < 20; i++) {
        const offset = i * spacing;
        ctx.beginPath();
        ctx.moveTo(offset - canvas.height, 0);
        ctx.lineTo(offset + canvas.width, canvas.height);
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 + Math.sin(time + i * 0.3) * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw diagonal lines going other direction
      for (let i = -10; i < 20; i++) {
        const offset = i * spacing;
        ctx.beginPath();
        ctx.moveTo(canvas.width + offset - canvas.height, 0);
        ctx.lineTo(offset, canvas.height);
        ctx.strokeStyle = `rgba(147, 51, 234, ${0.06 + Math.sin(time * 1.3 + i * 0.3) * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw intersection highlights
      for (let x = 0; x < canvas.width + spacing; x += spacing) {
        for (let y = 0; y < canvas.height + spacing; y += spacing) {
          const pulse = Math.sin(time * 2 + x * 0.01 + y * 0.01) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167, 139, 250, ${0.1 * pulse})`;
          ctx.fill();
        }
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
