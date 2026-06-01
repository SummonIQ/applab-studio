'use client';

import { useEffect, useRef } from 'react';

export function LightningBugsBackground() {
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

    interface Bug {
      x: number;
      y: number;
      vx: number;
      vy: number;
      phase: number;
      glowIntensity: number;
    }

    const bugs: Bug[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      phase: Math.random() * Math.PI * 2,
      glowIntensity: 0,
    }));

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      ctx.fillStyle = 'rgba(5, 15, 25, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const bug of bugs) {
        bug.x += bug.vx;
        bug.y += bug.vy;
        bug.vx += (Math.random() - 0.5) * 0.1;
        bug.vy += (Math.random() - 0.5) * 0.1;
        bug.vx = Math.max(-2, Math.min(2, bug.vx));
        bug.vy = Math.max(-2, Math.min(2, bug.vy));

        if (bug.x < 0 || bug.x > canvas.width) bug.vx *= -1;
        if (bug.y < 0 || bug.y > canvas.height) bug.vy *= -1;

        bug.glowIntensity = (Math.sin(time * 3 + bug.phase) + 1) / 2;

        // Draw glow when intensity is high enough
        if (bug.glowIntensity > 0.3) {
          ctx.save();
          ctx.shadowBlur = 20 * bug.glowIntensity;
          ctx.shadowColor = '#b4ff64';
          ctx.fillStyle = `rgba(180, 255, 100, ${bug.glowIntensity * 0.6})`;
          ctx.beginPath();
          ctx.arc(bug.x, bug.y, 8 * bug.glowIntensity, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Draw bug body
        ctx.fillStyle = 'rgba(100, 80, 60, 0.8)';
        ctx.beginPath();
        ctx.arc(bug.x, bug.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-900 to-slate-950"
    />
  );
}
