'use client';

import { useEffect, useRef } from 'react';

export function AuroraWavesHero() {
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

      ctx.fillStyle = '#0a0a14';
      ctx.fillRect(0, 0, w, h);

      for (let layer = 0; layer < 4; layer++) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 8) {
          const wave1 = Math.sin(x * 0.006 + time * 0.4 + layer * 0.8) * 40;
          const wave2 = Math.sin(x * 0.01 + time * 0.6) * 20;
          const y = h * (0.3 + layer * 0.12) + wave1 + wave2;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();

        const hue = 180 + layer * 30;
        const gradient = ctx.createLinearGradient(0, h * 0.2, 0, h * 0.7);
        gradient.addColorStop(0, `hsla(${hue}, 70%, 50%, 0)`);
        gradient.addColorStop(
          0.4,
          `hsla(${hue}, 60%, 45%, ${0.05 - layer * 0.008})`,
        );
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
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
      style={{ background: '#0a0a14' }}
    />
  );
}
