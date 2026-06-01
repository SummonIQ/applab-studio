'use client';

import { useEffect, useRef } from 'react';

export function RetroSunBackground() {
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
      time += 0.01;

      // Background gradient (purple to pink to orange)
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#2d1b69');
      bgGradient.addColorStop(0.4, '#6b2d5b');
      bgGradient.addColorStop(0.7, '#f06292');
      bgGradient.addColorStop(1, '#ff8a65');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sun
      const sunX = canvas.width / 2;
      const sunY = canvas.height * 0.45;
      const sunRadius = Math.min(canvas.width, canvas.height) * 0.25;

      // Sun glow
      const glowGradient = ctx.createRadialGradient(
        sunX,
        sunY,
        sunRadius * 0.8,
        sunX,
        sunY,
        sunRadius * 1.5,
      );
      glowGradient.addColorStop(0, 'rgba(255, 200, 100, 0.5)');
      glowGradient.addColorStop(1, 'rgba(255, 100, 50, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Sun body with horizontal lines
      const sunGradient = ctx.createLinearGradient(
        sunX,
        sunY - sunRadius,
        sunX,
        sunY + sunRadius,
      );
      sunGradient.addColorStop(0, '#fff176');
      sunGradient.addColorStop(0.5, '#ffb74d');
      sunGradient.addColorStop(1, '#e91e63');

      ctx.save();
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = sunGradient;
      ctx.fillRect(
        sunX - sunRadius,
        sunY - sunRadius,
        sunRadius * 2,
        sunRadius * 2,
      );

      // Horizontal stripes on sun
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let i = 0; i < 20; i++) {
        const stripeY =
          sunY -
          sunRadius +
          i * ((sunRadius * 2) / 10) +
          Math.sin(time * 2) * 5;
        if (i % 2 === 0) {
          ctx.fillRect(
            sunX - sunRadius,
            stripeY,
            sunRadius * 2,
            sunRadius / 10,
          );
        }
      }
      ctx.restore();

      // Grid floor
      const horizon = canvas.height * 0.65;
      const gridGradient = ctx.createLinearGradient(
        0,
        horizon,
        0,
        canvas.height,
      );
      gridGradient.addColorStop(0, '#1a0a2e');
      gridGradient.addColorStop(1, '#0a0015');
      ctx.fillStyle = gridGradient;
      ctx.fillRect(0, horizon, canvas.width, canvas.height - horizon);

      // Perspective grid
      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 1;

      // Horizontal lines
      for (let i = 0; i < 20; i++) {
        const y = horizon + Math.pow(i / 20, 2) * (canvas.height - horizon);
        const alpha = 0.3 + (i / 20) * 0.5;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Vertical lines (perspective)
      ctx.globalAlpha = 0.5;
      const vanishX = canvas.width / 2;
      for (let i = -15; i <= 15; i++) {
        const bottomX = vanishX + i * 80;
        ctx.beginPath();
        ctx.moveTo(vanishX, horizon);
        ctx.lineTo(bottomX, canvas.height);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Neon glow effect on grid
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(canvas.width, horizon);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 100; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 97.3) % (horizon * 0.8);
        const twinkle = Math.sin(time * 3 + i) * 0.5 + 0.5;
        ctx.globalAlpha = twinkle * 0.8;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

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
