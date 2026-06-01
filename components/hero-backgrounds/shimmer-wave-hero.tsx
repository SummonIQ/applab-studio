'use client';

import { useEffect, useRef } from 'react';

export function ShimmerWaveHero() {
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
      time += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Base dark gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#030712');
      bgGradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Shimmer wave effect
      const waveCount = 5;
      for (let w = 0; w < waveCount; w++) {
        const yBase = canvas.height * (0.3 + w * 0.12);

        ctx.beginPath();
        ctx.moveTo(0, yBase);

        for (let x = 0; x <= canvas.width; x += 5) {
          const y =
            yBase +
            Math.sin(x * 0.01 + time + w) * 20 +
            Math.sin(x * 0.005 + time * 0.5) * 15;
          ctx.lineTo(x, y);
        }

        // Shimmer gradient along the wave
        const shimmerPos =
          ((time * 100 + w * 200) % (canvas.width + 400)) - 200;
        const gradient = ctx.createLinearGradient(
          shimmerPos - 200,
          0,
          shimmerPos + 200,
          0,
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.4, `rgba(139, 92, 246, ${0.15 - w * 0.02})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.2 - w * 0.03})`);
        gradient.addColorStop(0.6, `rgba(139, 92, 246, ${0.15 - w * 0.02})`);
        gradient.addColorStop(1, 'transparent');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
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
