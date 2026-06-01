'use client';

import { useEffect, useRef } from 'react';

export function ParticleSwarmHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cx = w * 0.5;
      const cy = h * 0.5;

      ctx.fillStyle = '#080a10';
      ctx.fillRect(0, 0, w, h);

      // Multiple orbit rings
      for (let ring = 0; ring < 3; ring++) {
        const baseRadius = 60 + ring * 50;
        const particleCount = 8 + ring * 4;
        const speed = 0.2 - ring * 0.05;

        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2 + time * speed + ring;
          const radius = baseRadius + Math.sin(time * 2 + i + ring) * 15;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius * 0.5;
          const size = 2 + (2 - ring) * 0.5;
          const alpha = 0.1 + Math.sin(time * 2 + i) * 0.04;

          // Trail
          const prevAngle = angle - 0.15;
          const prevX = cx + Math.cos(prevAngle) * radius;
          const prevY = cy + Math.sin(prevAngle) * radius * 0.5;
          ctx.strokeStyle = `rgba(100, 150, 200, ${alpha * 0.4})`;
          ctx.lineWidth = size * 0.6;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();

          // Particle
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(120, 170, 220, ${alpha})`;
          ctx.fill();
        }
      }

      // Connecting lines between rings
      ctx.strokeStyle = 'rgba(100, 140, 180, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + time * 0.1;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * 60, cy + Math.sin(angle) * 30);
        ctx.lineTo(cx + Math.cos(angle) * 160, cy + Math.sin(angle) * 80);
        ctx.stroke();
      }

      // Center glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      glow.addColorStop(0, 'rgba(100, 140, 200, 0.1)');
      glow.addColorStop(0.5, 'rgba(80, 120, 180, 0.04)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      time += 0.012;
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
      style={{ background: '#080a10' }}
    />
  );
}
