'use client';

import { useEffect, useRef } from 'react';

export function QuantumDotsHero() {
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

    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      targetX: Math.random() * canvas.width,
      targetY: Math.random() * canvas.height,
      size: 3 + Math.random() * 4,
    }));

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dots.forEach(dot => {
        dot.x += (dot.targetX - dot.x) * 0.02;
        dot.y += (dot.targetY - dot.y) * 0.02;

        if (
          Math.abs(dot.x - dot.targetX) < 5 &&
          Math.abs(dot.y - dot.targetY) < 5
        ) {
          dot.targetX = Math.random() * canvas.width;
          dot.targetY = Math.random() * canvas.height;
        }

        const gradient = ctx.createRadialGradient(
          dot.x,
          dot.y,
          0,
          dot.x,
          dot.y,
          dot.size * 3,
        );
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.5)');
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
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
