'use client';

import { useEffect, useRef } from 'react';

export function MountainLayersHero() {
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

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#0a0c14');
      sky.addColorStop(0.5, '#0c0e18');
      sky.addColorStop(1, '#0e1020');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(i * 7.3) * 0.45 + 0.5) * w;
        const y = (Math.cos(i * 5.7) * 0.2 + 0.15) * h;
        const alpha = 0.15 + Math.sin(time * 2 + i) * 0.08;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 230, ${alpha})`;
        ctx.fill();
      }

      for (let layer = 0; layer < 4; layer++) {
        const baseY = h * (0.4 + layer * 0.15);
        const amplitude = 30 + layer * 15;
        const freq = 0.003 - layer * 0.0005;
        const offset = time * (0.02 - layer * 0.005) + layer * 100;
        const brightness = 15 + layer * 8;

        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 5) {
          const noise1 = Math.sin(x * freq + offset) * amplitude;
          const noise2 =
            Math.sin(x * freq * 2.5 + offset * 1.3) * amplitude * 0.4;
          const y = baseY + noise1 + noise2;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = `rgb(${brightness}, ${brightness + 5}, ${brightness + 15})`;
        ctx.fill();
      }

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
      style={{ background: '#0a0c14' }}
    />
  );
}
