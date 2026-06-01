'use client';

import { useEffect, useRef } from 'react';

export function WarpTunnelHero() {
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
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, w, h);

      // Warp streaks
      for (let i = 0; i < 40; i++) {
        const angle = (i / 40) * Math.PI * 2 + Math.sin(i * 0.5) * 0.5;
        const baseZ = (time * 50 + i * 25) % 200;
        const z = 200 - baseZ;
        const scale = 200 / (z + 50);
        const x = cx + Math.cos(angle) * 150 * scale;
        const y = cy + Math.sin(angle) * 80 * scale;
        const size = Math.max(0.5, 2 * scale);
        const length = Math.min(20, 10 * scale);
        const alpha = Math.min(0.2, 0.05 + scale * 0.1);

        // Streak line
        const prevScale = 200 / (z + 60);
        const prevX = cx + Math.cos(angle) * 150 * prevScale;
        const prevY = cy + Math.sin(angle) * 80 * prevScale;
        ctx.strokeStyle = `rgba(180, 200, 240, ${alpha})`;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Star point
        ctx.beginPath();
        ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 230, 255, ${alpha * 1.5})`;
        ctx.fill();
      }

      // Center tunnel glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
      glow.addColorStop(0, 'rgba(100, 120, 180, 0.1)');
      glow.addColorStop(0.5, 'rgba(80, 100, 150, 0.04)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Outer vignette
      const vignette = ctx.createRadialGradient(
        cx,
        cy,
        w * 0.3,
        cx,
        cy,
        w * 0.7,
      );
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(0, 0, 10, 0.3)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

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
      style={{ background: '#060608' }}
    />
  );
}
