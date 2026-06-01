'use client';

import { useEffect, useRef } from 'react';

export function WaveDividerHero() {
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

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Multiple wave layers at bottom
      const waves = [
        {
          amplitude: 30,
          frequency: 0.008,
          speed: 1,
          yOffset: 0.85,
          color: 'rgba(59, 130, 246, 0.3)',
        },
        {
          amplitude: 25,
          frequency: 0.01,
          speed: 1.2,
          yOffset: 0.88,
          color: 'rgba(99, 102, 241, 0.4)',
        },
        {
          amplitude: 20,
          frequency: 0.012,
          speed: 0.8,
          yOffset: 0.91,
          color: 'rgba(139, 92, 246, 0.5)',
        },
      ];

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 5) {
          const y =
            canvas.height * wave.yOffset +
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 0.7) *
              wave.amplitude *
              0.5;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      // Floating particles
      for (let i = 0; i < 50; i++) {
        const x = (i * 47 + time * 20) % canvas.width;
        const y = canvas.height * 0.3 + Math.sin(i + time) * 100;
        const size = 1 + Math.sin(i * 0.5 + time) * 0.5;
        const alpha = 0.3 + Math.sin(i + time * 2) * 0.2;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
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
