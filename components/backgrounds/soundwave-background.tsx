'use client';

import { useEffect, useRef } from 'react';

export function SoundwaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      time += 0.05;
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const bars = 64;
      const barWidth = canvas.width / bars;
      const centerY = canvas.height / 2;

      for (let i = 0; i < bars; i++) {
        const frequency = 0.1 + (i / bars) * 0.3;
        const amplitude = Math.sin(time * frequency + i * 0.2) * 0.5 + 0.5;
        const height = amplitude * canvas.height * 0.4;

        const hue = (i / bars) * 180 + 180;
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.8)`;
        ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
        ctx.shadowBlur = 10;

        ctx.fillRect(
          i * barWidth + 2,
          centerY - height / 2,
          barWidth - 4,
          height,
        );
      }
      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
