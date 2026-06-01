'use client';

import { useEffect, useRef } from 'react';

export function StringWaveHero() {
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

    // Guitar/harp strings anchored at sides
    const strings = Array.from({ length: 8 }, (_, i) => ({
      y: canvas.height * (0.2 + (i / 8) * 0.6),
      tension: 0.5 + Math.random() * 0.5,
      pluckPhase: Math.random() * Math.PI * 2,
      frequency: 2 + i * 0.5,
    }));

    const animate = () => {
      time += 0.03;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw anchor points on sides
      strings.forEach(s => {
        ctx.beginPath();
        ctx.arc(20, s.y, 3, 0, Math.PI * 2);
        ctx.arc(canvas.width - 20, s.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(236, 72, 153, 0.2)';
        ctx.fill();
      });

      // Draw vibrating strings
      strings.forEach((s, i) => {
        const decay = Math.exp(-((time * 0.5) % 3) * s.tension);
        const amplitude = 25 * decay;

        ctx.beginPath();
        ctx.moveTo(20, s.y);

        for (let x = 20; x <= canvas.width - 20; x += 3) {
          const progress = (x - 20) / (canvas.width - 40);
          const envelope = Math.sin(progress * Math.PI); // Strongest in middle
          const vibration = Math.sin(
            progress * Math.PI * s.frequency + time * 8 + s.pluckPhase,
          );
          const y = s.y + vibration * amplitude * envelope;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width - 20, s.y);
        ctx.strokeStyle = `rgba(236, 72, 153, ${0.1 + decay * 0.1})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
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
