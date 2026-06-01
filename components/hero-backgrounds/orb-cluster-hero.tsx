'use client';

import { useEffect, useRef } from 'react';

export function OrbClusterHero() {
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

    interface Orb {
      x: number;
      y: number;
      radius: number;
      color: string;
      phase: number;
    }

    const orbs: Orb[] = [
      {
        x: 0.15,
        y: 0.3,
        radius: 200,
        color: 'rgba(139, 92, 246, 0.2)',
        phase: 0,
      },
      {
        x: 0.75,
        y: 0.25,
        radius: 180,
        color: 'rgba(59, 130, 246, 0.15)',
        phase: 1,
      },
      {
        x: 0.5,
        y: 0.7,
        radius: 220,
        color: 'rgba(236, 72, 153, 0.12)',
        phase: 2,
      },
      {
        x: 0.85,
        y: 0.8,
        radius: 150,
        color: 'rgba(34, 211, 238, 0.15)',
        phase: 3,
      },
      {
        x: 0.3,
        y: 0.85,
        radius: 170,
        color: 'rgba(168, 85, 247, 0.1)',
        phase: 4,
      },
    ];

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep dark background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw orbs with soft glow
      orbs.forEach(orb => {
        const x = canvas.width * orb.x + Math.sin(time + orb.phase) * 20;
        const y = canvas.height * orb.y + Math.cos(time * 0.8 + orb.phase) * 15;
        const pulseRadius = orb.radius + Math.sin(time * 2 + orb.phase) * 10;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, pulseRadius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(0.5, orb.color.replace(/[\d.]+\)$/, '0.05)'));
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle connecting lines between nearby orbs
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      orbs.forEach((orb1, i) => {
        orbs.slice(i + 1).forEach(orb2 => {
          ctx.beginPath();
          ctx.moveTo(canvas.width * orb1.x, canvas.height * orb1.y);
          ctx.lineTo(canvas.width * orb2.x, canvas.height * orb2.y);
          ctx.stroke();
        });
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
