'use client';

import { useEffect, useRef } from 'react';

export function NeonRainHero() {
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

      // Rain drops
      for (let i = 0; i < 20; i++) {
        const x = (i / 20) * w + Math.sin(i * 3) * 20;
        const y = ((time * 80 + i * 60) % (h + 80)) - 40;
        const length = 20 + Math.sin(i) * 10;
        const hue = 200 + (i % 5) * 30;

        const gradient = ctx.createLinearGradient(x, y, x, y + length);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, `hsla(${hue}, 70%, 60%, 0.12)`);
        gradient.addColorStop(1, `hsla(${hue}, 70%, 70%, 0.15)`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + length);
        ctx.stroke();

        // Glow at tip
        ctx.beginPath();
        ctx.arc(x, y + length, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 70%, 70%, 0.1)`;
        ctx.fill();
      }

      // Ambient glow pools
      for (let i = 0; i < 3; i++) {
        const x = (Math.sin(i * 2.5) * 0.3 + 0.5) * w;
        const y = h * 0.85;
        const hue = 200 + i * 40;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 100);
        glow.addColorStop(0, `hsla(${hue}, 60%, 50%, 0.06)`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
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
      style={{ background: '#08080e' }}
    />
  );
}
