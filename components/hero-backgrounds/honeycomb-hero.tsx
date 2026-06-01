'use client';

import { useEffect, useRef } from 'react';

export function HoneycombHero() {
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

    const drawHexagon = (cx: number, cy: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
        const x = cx + Math.cos(angle) * size;
        const y = cy + Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const hexSize = 40;
      const hexHeight = hexSize * Math.sqrt(3);
      const cols = Math.ceil(canvas.width / (hexSize * 1.5)) + 2;
      const rows = Math.ceil(canvas.height / hexHeight) + 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * hexSize * 1.5;
          const y = row * hexHeight + (col % 2) * (hexHeight / 2);

          const distFromCenter = Math.hypot(
            x - canvas.width / 2,
            y - canvas.height / 2,
          );
          const wave = Math.sin(distFromCenter * 0.01 - time * 2) * 0.5 + 0.5;
          const opacity = 0.02 + wave * 0.04;

          drawHexagon(x, y, hexSize - 2);
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Center glow
      const glow = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        300,
      );
      glow.addColorStop(0, 'rgba(124, 58, 237, 0.1)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
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
