'use client';

import { useEffect, useRef } from 'react';

export function FogMistHero() {
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

      ctx.fillStyle = '#0a0a0e';
      ctx.fillRect(0, 0, w, h);

      for (let layer = 0; layer < 4; layer++) {
        const layerSpeed = 0.1 + layer * 0.05;
        const layerY = h * (0.3 + layer * 0.15);

        for (let i = 0; i < 5; i++) {
          const x =
            ((time * layerSpeed * 50 + i * w * 0.4) % (w * 1.5)) - w * 0.25;
          const y = layerY + Math.sin(time + i + layer) * 20;
          const sizeX = w * 0.4 + Math.sin(i) * w * 0.1;
          const sizeY = 60 + layer * 20;

          const fog = ctx.createRadialGradient(x, y, 0, x, y, sizeX);
          fog.addColorStop(0, `rgba(150, 160, 180, ${0.06 - layer * 0.01})`);
          fog.addColorStop(0.5, `rgba(130, 140, 160, ${0.03 - layer * 0.005})`);
          fog.addColorStop(1, 'transparent');
          ctx.fillStyle = fog;
          ctx.fillRect(x - sizeX, y - sizeY, sizeX * 2, sizeY * 2);
        }
      }

      for (let i = 0; i < 15; i++) {
        const x = (Math.sin(i * 4.7) * 0.45 + 0.5) * w;
        const y = (Math.cos(i * 3.2) * 0.45 + 0.5) * h;
        const alpha = 0.04 + Math.sin(time * 2 + i) * 0.02;

        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 230, ${alpha})`;
        ctx.fill();
      }

      time += 0.01;
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
      style={{ background: '#0a0a0e' }}
    />
  );
}
