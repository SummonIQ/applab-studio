'use client';

import { useEffect, useRef } from 'react';

export function RetroSunHero() {
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

      // Retro gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#12081a');
      gradient.addColorStop(0.4, '#1a0c22');
      gradient.addColorStop(0.7, '#220e28');
      gradient.addColorStop(1, '#1a0c20');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Sun glow
      const sunY = h * 0.4;
      const sunRadius = Math.min(w, h) * 0.15;
      const sunGlow = ctx.createRadialGradient(
        w / 2,
        sunY,
        0,
        w / 2,
        sunY,
        sunRadius * 2,
      );
      sunGlow.addColorStop(0, 'rgba(255, 150, 100, 0.15)');
      sunGlow.addColorStop(0.3, 'rgba(255, 100, 80, 0.08)');
      sunGlow.addColorStop(0.6, 'rgba(200, 60, 100, 0.04)');
      sunGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, w, h);

      // Sun stripes
      ctx.fillStyle = '#12081a';
      for (let i = 0; i < 6; i++) {
        const stripeY = sunY + sunRadius * 0.3 - i * (sunRadius * 0.15);
        const stripeH = 3 + i * 0.5;
        if (stripeY > sunY - sunRadius) {
          const halfWidth =
            Math.sqrt(
              Math.max(0, sunRadius * sunRadius - Math.pow(stripeY - sunY, 2)),
            ) * 0.8;
          ctx.fillRect(w / 2 - halfWidth, stripeY, halfWidth * 2, stripeH);
        }
      }

      // Grid horizon lines
      ctx.strokeStyle = 'rgba(200, 80, 180, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const t = (i / 12 + time * 0.05) % 1;
        const y = h * 0.55 + h * 0.45 * Math.pow(t, 1.5);
        ctx.globalAlpha = 0.3 + t * 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Perspective lines
      ctx.strokeStyle = 'rgba(200, 80, 180, 0.04)';
      for (let i = -8; i <= 8; i++) {
        const x = w / 2 + i * (w / 16);
        ctx.beginPath();
        ctx.moveTo(w / 2, h * 0.55);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Stars
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(i * 7.3) * 0.45 + 0.5) * w;
        const y = (Math.cos(i * 5.7) * 0.2 + 0.15) * h;
        const twinkle = 0.1 + Math.sin(time * 3 + i) * 0.06;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 255, ${twinkle})`;
        ctx.fill();
      }

      // Subtle horizontal lines
      ctx.strokeStyle = 'rgba(180, 80, 150, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const y = h * (0.6 + i * 0.05);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Warm glow at center
      const glow = ctx.createRadialGradient(
        w * 0.5,
        h * 0.4,
        0,
        w * 0.5,
        h * 0.4,
        w * 0.3,
      );
      glow.addColorStop(0, 'rgba(200, 100, 80, 0.05)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      time += 0.01;
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
      style={{ background: '#12081a' }}
    />
  );
}
