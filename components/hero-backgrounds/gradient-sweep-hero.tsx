'use client';

import { useEffect, useRef } from 'react';

export function GradientSweepHero() {
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Animated sweeping gradient
      const angle = time * 0.5;
      const x1 = canvas.width * 0.5 + Math.cos(angle) * canvas.width * 0.5;
      const y1 = canvas.height * 0.5 + Math.sin(angle) * canvas.height * 0.5;
      const x2 =
        canvas.width * 0.5 + Math.cos(angle + Math.PI) * canvas.width * 0.5;
      const y2 =
        canvas.height * 0.5 + Math.sin(angle + Math.PI) * canvas.height * 0.5;

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, '#0f0a1a');
      gradient.addColorStop(0.3, '#1a1035');
      gradient.addColorStop(0.7, '#0d1025');
      gradient.addColorStop(1, '#050510');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Accent spots
      const spotX = canvas.width * (0.3 + Math.sin(time) * 0.2);
      const spotY = canvas.height * (0.4 + Math.cos(time * 0.7) * 0.1);
      const spotGlow = ctx.createRadialGradient(
        spotX,
        spotY,
        0,
        spotX,
        spotY,
        250,
      );
      spotGlow.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
      spotGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = spotGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
