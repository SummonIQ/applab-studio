'use client';

import { useEffect, useRef } from 'react';

export function SoundVisualizerHero() {
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
      const centerY = h * 0.5;

      ctx.fillStyle = '#08080c';
      ctx.fillRect(0, 0, w, h);

      // Frequency bars
      const barCount = 24;
      for (let i = 0; i < barCount; i++) {
        const x = (i / barCount) * w + w / barCount / 2;
        const freq1 = Math.sin(time * 3 + i * 0.3) * 0.5 + 0.5;
        const freq2 = Math.sin(time * 2 + i * 0.2) * 0.3;
        const barHeight =
          (30 + freq1 * 40 + freq2 * 20) *
          (0.5 + (Math.abs(i - barCount / 2) / barCount) * 0.5);
        const hue = 200 + (i / barCount) * 60;
        const alpha = 0.08 + Math.sin(time * 2 + i) * 0.04;

        // Bar gradient
        const barGradient = ctx.createLinearGradient(
          x,
          centerY - barHeight,
          x,
          centerY + barHeight,
        );
        barGradient.addColorStop(0, `hsla(${hue}, 70%, 60%, ${alpha})`);
        barGradient.addColorStop(
          0.5,
          `hsla(${hue + 20}, 70%, 50%, ${alpha * 1.2})`,
        );
        barGradient.addColorStop(1, `hsla(${hue}, 70%, 60%, ${alpha})`);
        ctx.fillStyle = barGradient;
        ctx.fillRect(x - 4, centerY - barHeight, 8, barHeight * 2);

        // Peak dot
        ctx.beginPath();
        ctx.arc(x, centerY - barHeight - 4, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${alpha * 1.5})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, centerY + barHeight + 4, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Waveform line
      ctx.strokeStyle = 'rgba(150, 180, 220, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 4) {
        const y =
          centerY + Math.sin(x * 0.02 + time * 4) * 20 * Math.sin(x * 0.005);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      time += 0.025;
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
      style={{ background: '#08080c' }}
    />
  );
}
