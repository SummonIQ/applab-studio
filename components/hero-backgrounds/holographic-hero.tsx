'use client';

import { useEffect, useRef } from 'react';

export function HolographicHero() {
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

      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, w, h);

      // Horizontal scan lines
      for (let y = 0; y < h; y += 3) {
        const alpha = 0.03 + Math.sin(y * 0.05 + time * 2) * 0.01;
        ctx.fillStyle = `rgba(100, 150, 220, ${alpha})`;
        ctx.fillRect(0, y, w, 1);
      }

      // Color shift gradient bands
      for (let i = 0; i < 5; i++) {
        const y = (i / 5) * h + Math.sin(time + i) * 20;
        const hue = (time * 20 + i * 60) % 360;
        const gradient = ctx.createLinearGradient(0, y, w, y + h * 0.3);
        gradient.addColorStop(0, `hsla(${hue}, 60%, 50%, 0.04)`);
        gradient.addColorStop(0.5, `hsla(${hue + 60}, 60%, 50%, 0.06)`);
        gradient.addColorStop(1, `hsla(${hue + 120}, 60%, 50%, 0.04)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, y, w, h * 0.3);
      }

      // Grid overlay
      ctx.strokeStyle = 'rgba(100, 150, 200, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(time + x * 0.01) * 5, 0);
        ctx.lineTo(x + Math.sin(time + x * 0.01) * 5, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y + Math.sin(time + y * 0.01) * 3);
        ctx.lineTo(w, y + Math.sin(time + y * 0.01) * 3);
        ctx.stroke();
      }

      // Moving highlight
      const highlightY = ((time * 30) % (h + 50)) - 25;
      ctx.fillStyle = 'rgba(150, 200, 255, 0.05)';
      ctx.fillRect(0, highlightY, w, 6);

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
      style={{ background: '#0a0a12' }}
    />
  );
}
