'use client';

import { useEffect, useRef } from 'react';

export function SmokeRingHero() {
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

    const rings = Array.from({ length: 5 }, (_, i) => ({
      y: canvas.height + i * 150,
      radius: 40 + Math.random() * 30,
      wobble: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.3,
    }));

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.02;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rings.forEach(ring => {
        ring.y -= ring.speed;
        if (ring.y < -100) {
          ring.y = canvas.height + 50;
        }

        const x = canvas.width * 0.5 + Math.sin(time + ring.wobble) * 30;
        const expand = Math.max(0.1, 1 + ((canvas.height - ring.y) / canvas.height) * 0.5);
        const alpha = 0.1 * Math.max(0, ring.y / canvas.height);

        ctx.beginPath();
        ctx.ellipse(
          x,
          ring.y,
          Math.max(1, ring.radius * expand),
          Math.max(1, ring.radius * expand * 0.4),
          0,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
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
