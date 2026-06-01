'use client';

import { useEffect, useRef } from 'react';

export function RainDropsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const ripples: {
      x: number;
      y: number;
      r: number;
      maxR: number;
      opacity: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.fillStyle = '#0a1520';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() > 0.9) {
        ripples.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 0,
          maxR: 50 + Math.random() * 50,
          opacity: 1,
        });
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.r += 1;
        rip.opacity = 1 - rip.r / rip.maxR;

        ctx.strokeStyle = `rgba(100, 180, 255, ${rip.opacity * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.stroke();

        if (rip.r > rip.maxR) ripples.splice(i, 1);
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
