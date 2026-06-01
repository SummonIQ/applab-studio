'use client';

import { useEffect, useRef } from 'react';

export function OceanWavesHero() {
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

      // Ocean gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#0a1420');
      gradient.addColorStop(0.5, '#0c1828');
      gradient.addColorStop(1, '#081018');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Wave layers
      for (let layer = 0; layer < 5; layer++) {
        const baseY = h * (0.4 + layer * 0.12);
        const amplitude = 12 - layer * 1.5;
        const alpha = 0.08 - layer * 0.012;

        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 8) {
          const wave1 = Math.sin(x * 0.01 + time * 0.8 + layer) * amplitude;
          const wave2 = Math.sin(x * 0.02 + time * 0.5) * (amplitude * 0.5);
          const y = baseY + wave1 + wave2;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();

        const waveGradient = ctx.createLinearGradient(
          0,
          baseY - amplitude,
          0,
          h,
        );
        waveGradient.addColorStop(0, `rgba(40, 100, 160, ${alpha})`);
        waveGradient.addColorStop(0.5, `rgba(30, 80, 140, ${alpha * 0.6})`);
        waveGradient.addColorStop(1, `rgba(20, 60, 100, ${alpha * 0.3})`);
        ctx.fillStyle = waveGradient;
        ctx.fill();
      }

      // Foam hints on crests
      for (let i = 0; i < 12; i++) {
        const x = (i / 12) * w + Math.sin(time + i) * 30;
        const baseY = h * 0.45 + Math.sin(x * 0.01 + time * 0.8) * 10;
        if (Math.sin(x * 0.05 + time) > 0.5) {
          ctx.beginPath();
          ctx.arc(x, baseY, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(200, 220, 240, 0.08)';
          ctx.fill();
        }
      }

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
      style={{ background: '#0a1420' }}
    />
  );
}
