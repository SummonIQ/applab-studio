'use client';

import { useEffect, useRef } from 'react';

export function FlowingLinesHero() {
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

      // Dark gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0c0a09');
      bgGradient.addColorStop(1, '#1c1917');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Flowing curved lines
      const lineCount = 15;
      for (let i = 0; i < lineCount; i++) {
        const yBase = (i / lineCount) * canvas.height;
        const hue = 250 + i * 5;

        ctx.beginPath();
        ctx.moveTo(0, yBase);

        for (let x = 0; x <= canvas.width; x += 20) {
          const y =
            yBase +
            Math.sin(x * 0.003 + time + i * 0.5) * 50 +
            Math.sin(x * 0.001 + time * 0.5) * 30;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.04)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Accent glow at intersection points
      for (let i = 0; i < 5; i++) {
        const x = canvas.width * (0.2 + i * 0.15);
        const y = canvas.height * 0.5 + Math.sin(time * 2 + i) * 100;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 80);
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.04)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 80, y - 80, 160, 160);
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
