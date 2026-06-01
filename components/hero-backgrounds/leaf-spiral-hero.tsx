'use client';

import { useEffect, useRef } from 'react';

export function LeafSpiralHero() {
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

    const leaves = Array.from({ length: 15 }, (_, i) => ({
      angle: (i / 15) * Math.PI * 2,
      dist: 50 + i * 15,
      rotation: Math.random() * Math.PI * 2,
      size: 12 + Math.random() * 8,
    }));

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.01;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;

      leaves.forEach((leaf, i) => {
        leaf.angle += 0.005;
        leaf.rotation += 0.02;
        const x = centerX + Math.cos(leaf.angle) * leaf.dist;
        const y = centerY + Math.sin(leaf.angle) * leaf.dist;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(leaf.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, leaf.size, leaf.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${0.12 - i * 0.005})`;
        ctx.fill();
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
