'use client';

import { useEffect, useRef } from 'react';

export function PrismLightHero() {
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

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Diagonal light beams
      const beams = [
        { angle: -0.3, offset: 0.2, width: 200, hue: 280 },
        { angle: -0.25, offset: 0.4, width: 150, hue: 220 },
        { angle: -0.35, offset: 0.6, width: 180, hue: 320 },
        { angle: -0.28, offset: 0.8, width: 120, hue: 200 },
      ];

      beams.forEach((beam, i) => {
        const shimmer = Math.sin(time * 2 + i) * 0.3 + 0.7;
        const startX = canvas.width * beam.offset;
        const startY = -100;

        ctx.save();
        ctx.translate(startX, startY);
        ctx.rotate(beam.angle + Math.sin(time + i) * 0.02);

        const gradient = ctx.createLinearGradient(
          -beam.width / 2,
          0,
          beam.width / 2,
          0,
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(
          0.5,
          `hsla(${beam.hue}, 70%, 60%, ${0.08 * shimmer})`,
        );
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(-beam.width / 2, 0, beam.width, canvas.height * 1.5);
        ctx.restore();
      });

      // Subtle lens flare
      const flareX = canvas.width * 0.7;
      const flareY = canvas.height * 0.2;
      const flareGlow = ctx.createRadialGradient(
        flareX,
        flareY,
        0,
        flareX,
        flareY,
        150,
      );
      flareGlow.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      flareGlow.addColorStop(0.3, 'rgba(200, 180, 255, 0.05)');
      flareGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = flareGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
