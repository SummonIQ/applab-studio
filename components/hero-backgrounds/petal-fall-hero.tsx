'use client';

import { useEffect, useRef } from 'react';

export function PetalFallHero() {
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

    // Rose petals with heart-like shape
    const petals = Array.from({ length: 18 }, () => ({
      x: Math.random() * canvas.width,
      y: -50 - Math.random() * 300,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      fallSpeed: 1.2 + Math.random() * 0.8,
      swayPhase: Math.random() * Math.PI * 2,
      size: 12 + Math.random() * 8,
      hue: 340 + Math.random() * 30, // Red to pink range
    }));

    let time = 0;
    let animationId: number;

    // Draw heart-shaped petal
    const drawPetal = (size: number, hue: number) => {
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.3);
      ctx.bezierCurveTo(size * 0.5, -size, size, -size * 0.3, 0, size * 0.5);
      ctx.bezierCurveTo(-size, -size * 0.3, -size * 0.5, -size, 0, -size * 0.3);
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.15)`;
      ctx.fill();
    };

    const animate = () => {
      time += 0.015;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      petals.forEach(p => {
        p.y += p.fallSpeed;
        p.x += Math.sin(time * 1.5 + p.swayPhase) * 1.2;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height + 50) {
          p.y = -50;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        drawPetal(p.size, p.hue);
        ctx.restore();
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
