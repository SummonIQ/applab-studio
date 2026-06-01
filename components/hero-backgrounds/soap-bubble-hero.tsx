'use client';

import { useEffect, useRef } from 'react';

export function SoapBubbleHero() {
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

    const bubbles = Array.from({ length: 10 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      size: 20 + Math.random() * 40,
      speed: 0.5 + Math.random() * 0.5,
      hueShift: Math.random() * 360,
    }));

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.02;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach(b => {
        b.y -= b.speed;
        b.x += Math.sin(time + b.hueShift) * 0.3;
        if (b.y < -b.size * 2) {
          b.y = canvas.height + b.size;
          b.x = Math.random() * canvas.width;
        }

        const hue = (b.hueShift + time * 20) % 360;
        const gradient = ctx.createRadialGradient(
          b.x - b.size * 0.3,
          b.y - b.size * 0.3,
          0,
          b.x,
          b.y,
          b.size,
        );
        gradient.addColorStop(0, `hsla(${hue}, 80%, 80%, 0.15)`);
        gradient.addColorStop(0.5, `hsla(${(hue + 60) % 360}, 70%, 60%, 0.08)`);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
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
