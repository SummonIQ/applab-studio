'use client';

import { useEffect, useRef } from 'react';

export function ConstellationHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const stars: { x: number; y: number; size: number; twinkle: number }[] = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.sin(i * 7.3) * 0.45 + 0.5,
        y: Math.cos(i * 5.7) * 0.45 + 0.5,
        size: 1 + (i % 3) * 0.5,
        twinkle: i * 0.5,
      });
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.fillStyle = '#06080c';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(100, 150, 200, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < stars.length - 1; i++) {
        const s1 = stars[i];
        const s2 = stars[i + 1];
        const dist = Math.hypot((s2.x - s1.x) * w, (s2.y - s1.y) * h);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(s1.x * w, s1.y * h);
          ctx.lineTo(s2.x * w, s2.y * h);
          ctx.stroke();
        }
      }

      stars.forEach(star => {
        const x = star.x * w;
        const y = star.y * h;
        const alpha = 0.15 + Math.sin(time * 2 + star.twinkle) * 0.1;

        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.5})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 180, 220, ${alpha * 0.08})`;
        ctx.fill();
      });

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
      style={{ background: '#06080c' }}
    />
  );
}
