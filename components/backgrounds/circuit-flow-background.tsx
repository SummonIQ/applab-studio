'use client';

import { useEffect, useRef } from 'react';

export function CircuitFlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      speed: number;
      trail: { x: number; y: number }[];
    }

    const gridSize = 60;
    const particles: Particle[] = [];

    const getGridPoint = () => {
      const col = Math.floor(Math.random() * (canvas.width / gridSize));
      const row = Math.floor(Math.random() * (canvas.height / gridSize));
      return { x: col * gridSize, y: row * gridSize };
    };

    for (let i = 0; i < 20; i++) {
      const start = getGridPoint();
      const target = getGridPoint();
      particles.push({
        x: start.x,
        y: start.y,
        targetX: target.x,
        targetY: target.y,
        speed: 2 + Math.random() * 3,
        trail: [],
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 15, 25, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(50, 100, 150, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      particles.forEach(p => {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 20) p.trail.shift();

        // Move along grid
        if (Math.abs(p.x - p.targetX) > p.speed) {
          p.x += p.x < p.targetX ? p.speed : -p.speed;
        } else if (Math.abs(p.y - p.targetY) > p.speed) {
          p.y += p.y < p.targetY ? p.speed : -p.speed;
        } else {
          const newTarget = getGridPoint();
          p.targetX = newTarget.x;
          p.targetY = newTarget.y;
        }

        // Draw trail
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length; i++) {
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
          }
          ctx.strokeStyle = 'rgba(0, 200, 255, 0.6)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
        ctx.fill();
        ctx.shadowBlur = 0;
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
