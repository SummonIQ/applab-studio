'use client';

import { useEffect, useRef } from 'react';

export function InkSpreadHero() {
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

      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, w, h);

      // Ink blobs spreading outward
      for (let i = 0; i < 5; i++) {
        const cx = (Math.sin(i * 2.5) * 0.3 + 0.5) * w;
        const cy = (Math.cos(i * 3.2) * 0.3 + 0.5) * h;
        const baseSize = 100 + i * 40;
        const pulse = Math.sin(time * 0.5 + i * 1.5) * 0.2 + 1;
        const size = baseSize * pulse;

        // Outer glow
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size);
        gradient.addColorStop(0, `rgba(80, 60, 120, 0.15)`);
        gradient.addColorStop(0.4, `rgba(60, 40, 100, 0.08)`);
        gradient.addColorStop(0.7, `rgba(40, 30, 80, 0.03)`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ink tendrils spreading
      for (let i = 0; i < 12; i++) {
        const cx = w * 0.5;
        const cy = h * 0.5;
        const angle = (i / 12) * Math.PI * 2 + time * 0.1;
        const length = 150 + Math.sin(time + i) * 50;

        ctx.strokeStyle = `rgba(100, 80, 140, ${0.08 + Math.sin(time + i) * 0.03})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);

        for (let j = 1; j <= 5; j++) {
          const t = j / 5;
          const spread = Math.sin(time * 2 + i + j) * 20 * t;
          const x = cx + Math.cos(angle + spread * 0.02) * length * t;
          const y = cy + Math.sin(angle + spread * 0.02) * length * t;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Floating ink particles
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2;
        const dist = 50 + i * 8 + Math.sin(time + i) * 20;
        const x = w * 0.5 + Math.cos(angle + time * 0.2) * dist;
        const y = h * 0.5 + Math.sin(angle + time * 0.2) * dist;
        const size = 1.5 + Math.sin(time * 2 + i) * 0.5;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 100, 160, ${0.1 + Math.sin(time + i) * 0.05})`;
        ctx.fill();
      }

      time += 0.008;
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
      style={{ background: '#0a0a0f' }}
    />
  );
}
