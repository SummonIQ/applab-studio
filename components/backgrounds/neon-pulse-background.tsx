'use client';

import { useEffect, useRef } from 'react';

export function NeonPulseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      ctx.fillStyle = 'rgba(5, 5, 15, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.6;

      // Draw pulsing neon circles
      const pulseCount = 6;
      for (let i = 0; i < pulseCount; i++) {
        const phase = (time + i * 0.5) % 3;
        const radius = (phase / 3) * maxRadius;
        const opacity = 1 - phase / 3;

        if (opacity > 0) {
          const hue = (i * 60 + time * 30) % 360;

          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${opacity * 0.8})`;
          ctx.lineWidth = 3;
          ctx.shadowBlur = 20;
          ctx.shadowColor = `hsla(${hue}, 100%, 50%, ${opacity})`;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // Center glow
      const centerGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
      centerGradient.addColorStop(
        0,
        `hsla(${(time * 50) % 360}, 100%, 70%, 0.3)`,
      );
      centerGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGradient;
      ctx.fillRect(cx - 100, cy - 100, 200, 200);

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
