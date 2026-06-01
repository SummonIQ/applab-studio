'use client';

import { useEffect, useRef } from 'react';

export function PixelRainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const pixelSize = 8;
    const columns = Math.ceil(canvas.width / pixelSize);
    const drops: number[] = new Array(columns)
      .fill(0)
      .map(() => Math.random() * -100);
    const colors = ['#00ff00', '#00cc00', '#009900', '#006600'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const x = i * pixelSize;
        const y = drops[i] * pixelSize;

        // Draw pixel block
        const colorIndex = Math.floor(Math.random() * colors.length);
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(x, y, pixelSize - 1, pixelSize - 1);

        // Glow effect
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 10;
        ctx.fillRect(x, y, pixelSize - 1, pixelSize - 1);
        ctx.shadowBlur = 0;

        drops[i]++;

        if (drops[i] * pixelSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-black"
    />
  );
}
