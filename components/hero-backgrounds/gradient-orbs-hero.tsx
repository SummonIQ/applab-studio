'use client';

import { useEffect, useRef } from 'react';

export function GradientOrbsHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement; canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Lava lamp style blobs that rise and fall
    const blobs = Array.from({ length: 4 }, (_, i) => ({
      x: canvas.width * (0.2 + i * 0.2),
      y: canvas.height * 0.8,
      vy: -0.3 - Math.random() * 0.2,
      baseSize: 60 + Math.random() * 40,
      phase: Math.random() * Math.PI * 2,
      hue: 260 + i * 25,
    }));

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.02;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      blobs.forEach(blob => {
        blob.y += blob.vy;

        // Reverse direction at top/bottom
        if (blob.y < canvas.height * 0.15) blob.vy = Math.abs(blob.vy);
        if (blob.y > canvas.height * 0.85) blob.vy = -Math.abs(blob.vy);

        // Wobble and morph
        const wobbleX = Math.sin(time + blob.phase) * 20;
        const sizeMultiplier = 1 + Math.sin(time * 0.5 + blob.phase) * 0.3;
        const size = blob.baseSize * sizeMultiplier;

        // Stretch based on velocity
        const stretchY = 1 + Math.abs(blob.vy) * 0.5;
        const stretchX = 1 / stretchY;

        const gradient = ctx.createRadialGradient(
          blob.x + wobbleX,
          blob.y,
          0,
          blob.x + wobbleX,
          blob.y,
          size,
        );
        gradient.addColorStop(0, `hsla(${blob.hue}, 80%, 55%, 0.25)`);
        gradient.addColorStop(0.6, `hsla(${blob.hue}, 70%, 45%, 0.1)`);
        gradient.addColorStop(1, 'transparent');

        ctx.save();
        ctx.translate(blob.x + wobbleX, blob.y);
        ctx.scale(stretchX, stretchY);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

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
