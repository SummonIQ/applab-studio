'use client';

import { useEffect, useRef } from 'react';

export function AuroraSweepHero() {
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
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Aurora bands
      const bands = [
        {
          yOffset: 0.2,
          amplitude: 80,
          color1: 'rgba(34, 211, 238, 0.15)',
          color2: 'rgba(34, 211, 238, 0)',
        },
        {
          yOffset: 0.35,
          amplitude: 60,
          color1: 'rgba(52, 211, 153, 0.12)',
          color2: 'rgba(52, 211, 153, 0)',
        },
        {
          yOffset: 0.25,
          amplitude: 70,
          color1: 'rgba(147, 51, 234, 0.1)',
          color2: 'rgba(147, 51, 234, 0)',
        },
      ];

      bands.forEach((band, i) => {
        ctx.beginPath();

        const baseY = canvas.height * band.yOffset;

        // Top edge of aurora
        for (let x = 0; x <= canvas.width; x += 10) {
          const y =
            baseY +
            Math.sin(x * 0.005 + time + i) * band.amplitude +
            Math.sin(x * 0.003 + time * 0.7) * band.amplitude * 0.5;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Bottom edge (wider)
        for (let x = canvas.width; x >= 0; x -= 10) {
          const y =
            baseY +
            150 +
            Math.sin(x * 0.004 + time * 0.8 + i) * band.amplitude * 0.7 +
            Math.sin(x * 0.002 + time * 0.5) * band.amplitude * 0.3;
          ctx.lineTo(x, y);
        }

        ctx.closePath();

        const gradient = ctx.createLinearGradient(
          0,
          baseY - band.amplitude,
          0,
          baseY + 200,
        );
        gradient.addColorStop(0, band.color2);
        gradient.addColorStop(0.3, band.color1);
        gradient.addColorStop(0.7, band.color1);
        gradient.addColorStop(1, band.color2);

        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Subtle stars
      for (let i = 0; i < 100; i++) {
        const x = (i * 73) % canvas.width;
        const y = (i * 37) % (canvas.height * 0.6);
        const twinkle = 0.3 + Math.sin(time * 2 + i) * 0.2;

        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        ctx.fill();
      }

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
