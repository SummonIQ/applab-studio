'use client';

import { useEffect, useRef } from 'react';

export function GradientMeshHero() {
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

    interface Point {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      color: string;
    }

    const points: Point[] = [
      { baseX: 0.2, baseY: 0.3, x: 0, y: 0, color: 'rgba(147, 51, 234, 0.4)' },
      { baseX: 0.8, baseY: 0.2, x: 0, y: 0, color: 'rgba(59, 130, 246, 0.4)' },
      { baseX: 0.5, baseY: 0.7, x: 0, y: 0, color: 'rgba(236, 72, 153, 0.3)' },
      { baseX: 0.1, baseY: 0.8, x: 0, y: 0, color: 'rgba(34, 211, 238, 0.3)' },
      { baseX: 0.9, baseY: 0.6, x: 0, y: 0, color: 'rgba(168, 85, 247, 0.35)' },
    ];

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Base background
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update point positions with smooth animation
      points.forEach((point, i) => {
        point.x = canvas.width * (point.baseX + Math.sin(time + i) * 0.05);
        point.y =
          canvas.height * (point.baseY + Math.cos(time * 0.8 + i) * 0.05);
      });

      // Draw gradient blurs for each point
      points.forEach(point => {
        const gradient = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          Math.min(canvas.width, canvas.height) * 0.4,
        );
        gradient.addColorStop(0, point.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Subtle grid overlay
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 60;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

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
