'use client';

import { useEffect, useRef } from 'react';

export function MoonGlowHero() {
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

    const animate = () => {
      time += 0.005;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const moonX = canvas.width * 0.75;
      const moonY = canvas.height * 0.25;
      const moonRadius = 60;
      const pulse = Math.sin(time) * 0.02 + 0.08;

      // Outer glow layers
      for (let i = 4; i > 0; i--) {
        const gradient = ctx.createRadialGradient(
          moonX,
          moonY,
          moonRadius,
          moonX,
          moonY,
          moonRadius + i * 60,
        );
        gradient.addColorStop(0, `rgba(226, 232, 240, ${pulse / i})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius + i * 60, 0, Math.PI * 2);
        ctx.fill();
      }

      // Moon
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(226, 232, 240, 0.15)';
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
