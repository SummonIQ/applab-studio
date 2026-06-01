'use client';

import { useEffect, useRef } from 'react';

export function PendulumWaveHero() {
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
      time += 0.03;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const pendulums = 15;
      const spacing = canvas.width / (pendulums + 1);
      const anchorY = canvas.height * 0.15;
      const length = canvas.height * 0.5;

      for (let i = 0; i < pendulums; i++) {
        const x = spacing * (i + 1);
        const freq = 1 + i * 0.05;
        const angle = Math.sin(time * freq) * 0.4;
        const bobX = x + Math.sin(angle) * length;
        const bobY = anchorY + Math.cos(angle) * length;

        ctx.beginPath();
        ctx.moveTo(x, anchorY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(bobX, bobY, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167, 139, 250, 0.4)';
        ctx.fill();
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
