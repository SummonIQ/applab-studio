'use client';

import { useEffect, useRef } from 'react';

export function CanopyLightHero() {
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

    const beams = Array.from({ length: 8 }, (_, i) => ({
      x: (canvas.width / 8) * i + canvas.width / 16,
      width: 30 + Math.random() * 40,
      phase: Math.random() * Math.PI * 2,
    }));

    const animate = () => {
      time += 0.01;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      beams.forEach(beam => {
        const flicker = Math.sin(time + beam.phase) * 0.3 + 0.7;
        const sway = Math.sin(time * 0.5 + beam.phase) * 20;

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, `rgba(134, 239, 172, ${0.04 * flicker})`);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(beam.x + sway - beam.width / 2, 0);
        ctx.lineTo(beam.x + sway * 2 - beam.width, canvas.height);
        ctx.lineTo(beam.x + sway * 2 + beam.width, canvas.height);
        ctx.lineTo(beam.x + sway + beam.width / 2, 0);
        ctx.closePath();
        ctx.fillStyle = gradient;
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
