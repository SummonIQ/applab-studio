'use client';

import { useEffect, useRef } from 'react';

export function NorthernLightsHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    interface LightCurtain {
      baseX: number;
      amplitude: number;
      frequency: number;
      phase: number;
      hue: number;
      width: number;
    }
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      // Dark sky
      ctx.fillStyle = '#060810';
      ctx.fillRect(0, 0, w, h);

      // Aurora curtains
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.moveTo(0, h * 0.2);
        for (let x = 0; x <= w; x += 10) {
          const wave = Math.sin(x * 0.008 + time * 0.5 + layer) * 30;
          const wave2 = Math.sin(x * 0.015 + time * 0.3) * 15;
          const y = h * (0.2 + layer * 0.08) + wave + wave2;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h * 0.6);
        ctx.lineTo(0, h * 0.6);
        ctx.closePath();

        const hue = 140 + layer * 25 + Math.sin(time) * 10;
        const gradient = ctx.createLinearGradient(0, h * 0.15, 0, h * 0.5);
        gradient.addColorStop(0, `hsla(${hue}, 60%, 50%, 0)`);
        gradient.addColorStop(
          0.3,
          `hsla(${hue}, 60%, 45%, ${0.08 - layer * 0.02})`,
        );
        gradient.addColorStop(
          0.7,
          `hsla(${hue + 30}, 50%, 40%, ${0.05 - layer * 0.01})`,
        );
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Stars with twinkle
      for (let i = 0; i < 40; i++) {
        const x = (Math.sin(i * 7.3) * 0.45 + 0.5) * w;
        const y = (Math.cos(i * 5.7) * 0.35 + 0.25) * h;
        const twinkle = 0.1 + Math.sin(time * 3 + i * 2) * 0.08;
        const size = 0.5 + (i % 3) * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 220, 240, ${twinkle})`;
        ctx.fill();
      }

      time += 0.012;
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
      style={{ background: '#060810' }}
    />
  );
}
