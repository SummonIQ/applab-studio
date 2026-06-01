'use client';

import { useEffect, useRef } from 'react';

export function SpiralGalaxyHero() {
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

    let time = 0;
    let animationId: number;

    // Black hole with accretion disk effect
    const animate = () => {
      time += 0.008;
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;

      // Accretion disk - elliptical rings being pulled in
      for (let ring = 0; ring < 12; ring++) {
        const baseRadius = 50 + ring * 20;
        const angle = time * (1 - ring * 0.05);

        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          baseRadius + Math.sin(time * 2 + ring) * 5,
          baseRadius * 0.3,
          angle,
          0,
          Math.PI * 2,
        );

        const hue = 280 - ring * 10;
        const alpha = 0.12 - ring * 0.008;
        ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Event horizon - dark center
      const eventHorizon = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        40,
      );
      eventHorizon.addColorStop(0, '#000');
      eventHorizon.addColorStop(0.7, '#000');
      eventHorizon.addColorStop(1, 'transparent');
      ctx.fillStyle = eventHorizon;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
      ctx.fill();

      // Gravitational lensing glow
      const lensGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        30,
        centerX,
        centerY,
        80,
      );
      lensGlow.addColorStop(0, 'rgba(200, 150, 255, 0.15)');
      lensGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = lensGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.fill();

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
