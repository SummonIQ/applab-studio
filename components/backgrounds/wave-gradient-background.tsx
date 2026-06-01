'use client';

import { useEffect, useRef } from 'react';

export function WaveGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      time += 0.005;

      for (let y = 0; y < canvas.height; y++) {
        const hue1 = 200 + Math.sin(y * 0.01 + time) * 40;
        const hue2 = 280 + Math.cos(y * 0.01 + time * 1.5) * 40;
        const gradient = ctx.createLinearGradient(0, y, canvas.width, y);
        gradient.addColorStop(0, `hsl(${hue1}, 70%, 50%)`);
        gradient.addColorStop(0.5, `hsl(${(hue1 + hue2) / 2}, 80%, 60%)`);
        gradient.addColorStop(1, `hsl(${hue2}, 70%, 50%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, y, canvas.width, 1);
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
