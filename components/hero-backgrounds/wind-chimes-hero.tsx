'use client';

import { useEffect, useRef } from 'react';

export function WindChimesHero() {
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

    const chimes = Array.from({ length: 7 }, (_, i) => ({
      x: (canvas.width / 8) * (i + 1),
      length: 100 + i * 30,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.02;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const anchorY = 50;

      chimes.forEach(chime => {
        const swing = Math.sin(time + chime.phase) * 0.15;
        const endX = chime.x + Math.sin(swing) * chime.length;
        const endY = anchorY + Math.cos(swing) * chime.length;

        ctx.beginPath();
        ctx.moveTo(chime.x, anchorY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(endX, endY, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167, 139, 250, 0.25)';
        ctx.fill();
      });

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
