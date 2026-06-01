'use client';

import { useEffect, useRef } from 'react';

export function AuroraCurtainHero() {
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

      // Night sky gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0a0a15');
      bgGradient.addColorStop(1, '#050508');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw aurora curtains (vertical waves)
      const curtainCount = 8;
      for (let i = 0; i < curtainCount; i++) {
        const baseX = canvas.width * (0.1 + (i / curtainCount) * 0.8);
        const hue = 150 + i * 15; // Green to cyan range

        ctx.beginPath();

        for (let y = 0; y <= canvas.height * 0.7; y += 10) {
          const wave =
            Math.sin(y * 0.01 + time * 2 + i * 0.5) * 30 +
            Math.sin(y * 0.005 + time) * 20;
          const x = baseX + wave;

          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Return path for fill
        for (let y = canvas.height * 0.7; y >= 0; y -= 10) {
          const wave =
            Math.sin(y * 0.01 + time * 2 + i * 0.5 + 0.1) * 30 +
            Math.sin(y * 0.005 + time + 0.1) * 20;
          const x = baseX + wave + 40;
          ctx.lineTo(x, y);
        }

        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.7);
        gradient.addColorStop(0, `hsla(${hue}, 80%, 50%, 0.15)`);
        gradient.addColorStop(0.5, `hsla(${hue}, 70%, 40%, 0.08)`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
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
