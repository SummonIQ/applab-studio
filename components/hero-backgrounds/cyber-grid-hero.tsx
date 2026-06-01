'use client';

import { useEffect, useRef } from 'react';

export function CyberGridHero() {
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
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Perspective grid
      const vanishY = canvas.height * 0.35;
      const gridLines = 20;

      // Horizontal lines with perspective
      for (let i = 0; i <= gridLines; i++) {
        const t = i / gridLines;
        const y = vanishY + (canvas.height - vanishY) * Math.pow(t, 1.5);
        const alpha = 0.02 + t * 0.04;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Vertical lines converging to vanish point
      const vanishX = canvas.width / 2;
      for (let i = -10; i <= 10; i++) {
        const bottomX = vanishX + i * 100;
        const alpha = 0.02 + (1 - Math.abs(i) / 10) * 0.04;

        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(bottomX, canvas.height);
        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx.stroke();
      }

      // Moving scan line
      const scanY = vanishY + ((time * 100) % (canvas.height - vanishY));
      const scanGradient = ctx.createLinearGradient(
        0,
        scanY - 20,
        0,
        scanY + 20,
      );
      scanGradient.addColorStop(0, 'transparent');
      scanGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)');
      scanGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY - 20, canvas.width, 40);

      // Horizon glow
      const horizonGlow = ctx.createRadialGradient(
        vanishX,
        vanishY,
        0,
        vanishX,
        vanishY,
        200,
      );
      horizonGlow.addColorStop(0, 'rgba(236, 72, 153, 0.06)');
      horizonGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = horizonGlow;
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
