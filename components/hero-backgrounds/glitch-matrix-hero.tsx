'use client';

import { useEffect, useRef } from 'react';

export function GlitchMatrixHero() {
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

      ctx.fillStyle = '#050805';
      ctx.fillRect(0, 0, w, h);

      // Horizontal scan lines
      for (let y = 0; y < h; y += 3) {
        const alpha = 0.03 + Math.sin(y * 0.1 + time) * 0.01;
        ctx.fillStyle = `rgba(50, 120, 50, ${alpha})`;
        ctx.fillRect(0, y, w, 1);
      }

      // Vertical data streams
      for (let i = 0; i < 15; i++) {
        const x = (i / 15) * w;
        const streamY = ((time * 50 + i * 100) % (h + 200)) - 100;
        const streamHeight = 50 + Math.sin(i) * 30;

        const gradient = ctx.createLinearGradient(
          x,
          streamY,
          x,
          streamY + streamHeight,
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.3, `rgba(60, 180, 60, 0.08)`);
        gradient.addColorStop(0.7, `rgba(60, 180, 60, 0.08)`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 1, streamY, 2, streamHeight);
      }

      // Glitch blocks
      if (Math.random() < 0.1) {
        const glitchX = Math.random() * w;
        const glitchY = Math.random() * h;
        const glitchW = 20 + Math.random() * 60;
        const glitchH = 2 + Math.random() * 8;
        ctx.fillStyle = `rgba(60, 200, 60, ${0.05 + Math.random() * 0.1})`;
        ctx.fillRect(glitchX, glitchY, glitchW, glitchH);
      }

      // Grid overlay
      ctx.strokeStyle = 'rgba(40, 100, 40, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      time += 0.02;
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
      style={{ background: '#050805' }}
    />
  );
}
