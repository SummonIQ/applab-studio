'use client';

import { useEffect, useRef } from 'react';

export function HexagonGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const hexSize = 40;
    const hexHeight = hexSize * Math.sqrt(3);

    let animationId: number;
    let time = 0;

    const drawHexagon = (
      cx: number,
      cy: number,
      size: number,
      pulse: number,
    ) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + size * Math.cos(angle);
        const y = cy + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const hue = 200 + pulse * 60;
      ctx.strokeStyle = `hsla(${hue}, 70%, ${50 + pulse * 30}%, ${0.3 + pulse * 0.5})`;
      ctx.lineWidth = 1 + pulse;
      ctx.stroke();
    };

    const animate = () => {
      time += 0.03;
      ctx.fillStyle = 'rgba(10, 15, 30, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / (hexSize * 1.5)) + 2;
      const rows = Math.ceil(canvas.height / hexHeight) + 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * hexSize * 1.5;
          const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);

          const distFromCenter = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) +
              Math.pow(y - canvas.height / 2, 2),
          );
          const wave = Math.sin(time * 2 - distFromCenter * 0.01);
          const pulse = Math.max(0, wave);

          drawHexagon(x, y, hexSize * 0.9, pulse);
        }
      }

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
