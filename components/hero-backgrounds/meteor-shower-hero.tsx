'use client';

import { useEffect, useRef } from 'react';

export function MeteorShowerHero() {
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

      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 40; i++) {
        const x = (Math.sin(i * 5.3) * 0.45 + 0.5) * w;
        const y = (Math.cos(i * 4.1) * 0.45 + 0.5) * h;
        const alpha = 0.15 + Math.sin(time * 3 + i * 2) * 0.1;
        ctx.beginPath();
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 230, ${alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < 8; i++) {
        const progress = (time * 0.5 + i * 0.4) % 1.5;
        if (progress < 1) {
          const startX = (Math.sin(i * 7.3) * 0.3 + 0.7) * w;
          const startY = Math.cos(i * 5.1) * 0.2 * h;
          const x = startX - progress * w * 0.4;
          const y = startY + progress * h * 0.6;
          const length = 40 + i * 10;
          const alpha = (1 - progress) * 0.3;

          const gradient = ctx.createLinearGradient(
            x,
            y,
            x + length * 0.7,
            y - length * 0.4,
          );
          gradient.addColorStop(0, `rgba(200, 220, 255, ${alpha})`);
          gradient.addColorStop(1, 'transparent');
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + length * 0.7, y - length * 0.4);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
      }

      time += 0.02;
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
      style={{ background: '#060608' }}
    />
  );
}
