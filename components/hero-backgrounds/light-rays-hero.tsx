'use client';

import { useEffect, useRef } from 'react';

export function LightRaysHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.fillStyle = '#0a0a10';
      ctx.fillRect(0, 0, w, h);

      const sourceX = w * 0.5;
      const sourceY = -h * 0.2;

      for (let i = 0; i < 12; i++) {
        const baseAngle = (i / 12) * Math.PI * 0.6 + Math.PI * 0.2;
        const angle = baseAngle + Math.sin(time + i * 0.5) * 0.05;
        const rayWidth = 0.08 + Math.sin(time * 2 + i) * 0.02;

        ctx.beginPath();
        ctx.moveTo(sourceX, sourceY);
        ctx.lineTo(
          sourceX + Math.cos(angle - rayWidth) * h * 1.5,
          sourceY + Math.sin(angle - rayWidth) * h * 1.5,
        );
        ctx.lineTo(
          sourceX + Math.cos(angle + rayWidth) * h * 1.5,
          sourceY + Math.sin(angle + rayWidth) * h * 1.5,
        );
        ctx.closePath();

        const gradient = ctx.createRadialGradient(
          sourceX,
          sourceY,
          0,
          sourceX,
          sourceY,
          h * 1.2,
        );
        gradient.addColorStop(
          0,
          `rgba(255, 240, 200, ${0.08 + Math.sin(time + i) * 0.03})`,
        );
        gradient.addColorStop(0.5, `rgba(255, 220, 180, 0.03)`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(i * 3.7) * 0.4 + 0.5) * w;
        const y = (Math.cos(i * 2.3) * 0.4 + 0.5) * h;
        const alpha = 0.1 + Math.sin(time * 2 + i) * 0.05;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 250, 230, ${alpha})`;
        ctx.fill();
      }

      time += 0.01;
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#0a0a10' }}
    />
  );
}
