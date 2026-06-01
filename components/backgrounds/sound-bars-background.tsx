'use client';

import { useEffect, useRef } from 'react';

export function SoundBarsBackground() {
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

    const barCount = 64;
    const barHeights: number[] = Array(barCount).fill(0);
    const targetHeights: number[] = Array(barCount).fill(0);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.05;
      ctx.fillStyle = 'rgba(10, 10, 20, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barCount;
      const maxHeight = canvas.height * 0.7;

      // Update target heights with wave pattern
      for (let i = 0; i < barCount; i++) {
        const wave1 = Math.sin(time + i * 0.15) * 0.3;
        const wave2 = Math.sin(time * 1.5 + i * 0.1) * 0.2;
        const wave3 = Math.sin(time * 0.7 + i * 0.2) * 0.25;
        targetHeights[i] = (wave1 + wave2 + wave3 + 0.75) * 0.5 * maxHeight;
      }

      // Smooth interpolation
      for (let i = 0; i < barCount; i++) {
        barHeights[i] += (targetHeights[i] - barHeights[i]) * 0.15;
      }

      // Draw bars
      for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        const height = barHeights[i];
        const y = (canvas.height - height) / 2;

        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        const hue = (i / barCount) * 120 + 200; // blue to purple
        gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0.9)`);
        gradient.addColorStop(0.5, `hsla(${hue + 30}, 90%, 50%, 1)`);
        gradient.addColorStop(1, `hsla(${hue}, 80%, 60%, 0.9)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y, barWidth - 2, height);

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${hue}, 80%, 50%, 0.5)`;
        ctx.fillRect(x + 1, y, barWidth - 2, height);
        ctx.shadowBlur = 0;
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
