'use client';

import { useEffect, useRef } from 'react';

export function CometTrailHero() {
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

    const comets = Array.from({ length: 3 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      speed: 2 + Math.random() * 2,
      length: 80 + Math.random() * 60,
    }));

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      comets.forEach(comet => {
        comet.x += comet.speed;
        comet.y += comet.speed * 0.3;

        if (comet.x > canvas.width + 100) {
          comet.x = -100;
          comet.y = Math.random() * canvas.height * 0.5;
        }

        const gradient = ctx.createLinearGradient(
          comet.x - comet.length,
          comet.y - comet.length * 0.3,
          comet.x,
          comet.y,
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.15)');

        ctx.beginPath();
        ctx.moveTo(comet.x - comet.length, comet.y - comet.length * 0.3);
        ctx.lineTo(comet.x, comet.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(comet.x, comet.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
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
