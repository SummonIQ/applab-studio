'use client';

import { useEffect, useRef } from 'react';

export function MorphingRingsHero() {
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
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.5;

      // Draw morphing rings
      for (let i = 0; i < 8; i++) {
        const baseRadius = 80 + i * 60;
        const hue = 250 + i * 10;

        ctx.beginPath();
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.02) {
          const wobble =
            Math.sin(angle * 3 + time + i) * 15 +
            Math.cos(angle * 2 + time * 0.7) * 10;
          const r = baseRadius + wobble;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;

          if (angle === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `hsla(${hue}, 60%, 60%, ${0.15 - i * 0.015})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Center glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 150);
      glow.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
