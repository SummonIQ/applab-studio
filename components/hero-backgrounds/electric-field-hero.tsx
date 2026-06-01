'use client';

import { useEffect, useRef } from 'react';

export function ElectricFieldHero() {
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

      ctx.fillStyle = '#08080e';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);

        let x = cx;
        let y = cy;
        for (let j = 0; j < 15; j++) {
          const fieldAngle = angle + Math.sin(time + j * 0.3 + i) * 0.3;
          const step = 20 + j * 3;
          x += Math.cos(fieldAngle) * step;
          y += Math.sin(fieldAngle) * step;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(80, 150, 255, ${0.04 + Math.sin(time * 2 + i) * 0.015})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      for (let ring = 1; ring < 5; ring++) {
        const radius = ring * 60 + Math.sin(time * 2) * 10;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 180, 255, ${0.06 - ring * 0.01})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      glow.addColorStop(0, 'rgba(80, 150, 255, 0.06)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      time += 0.015;
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
      style={{ background: '#08080e' }}
    />
  );
}
