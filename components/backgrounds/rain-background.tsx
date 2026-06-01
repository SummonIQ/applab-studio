'use client';

import { useEffect, useRef } from 'react';

export interface RainBackgroundProps {
  dropCount?: number;
  speed?: number;
  color?: string;
  wind?: number;
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

export function RainBackground({
  dropCount = 200,
  speed = 15,
  color = '#60a5fa',
  wind = 2,
}: RainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const drops: RainDrop[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createDrop = (startAtTop = false): RainDrop => ({
      x: Math.random() * canvas.width * 1.5 - canvas.width * 0.25,
      y: startAtTop ? -20 : Math.random() * canvas.height,
      length: 10 + Math.random() * 20,
      speed: speed * (0.5 + Math.random() * 0.5),
      opacity: 0.2 + Math.random() * 0.5,
    });

    const init = () => {
      drops.length = 0;
      for (let i = 0; i < dropCount; i++) {
        drops.push(createDrop());
      }
    };

    const draw = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drops.forEach((drop, index) => {
        // Update position
        drop.y += drop.speed;
        drop.x += wind;

        // Reset drop when it goes off screen
        if (drop.y > canvas.height + drop.length) {
          drops[index] = createDrop(true);
        }

        // Draw drop
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + wind * 0.5, drop.y - drop.length);
        ctx.strokeStyle =
          color +
          Math.floor(drop.opacity * 255)
            .toString(16)
            .padStart(2, '0');
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    init();
    window.addEventListener('resize', () => {
      resize();
      init();
    });
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [dropCount, speed, color, wind]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'linear-gradient(to bottom, #1e293b, #0f172a)' }}
    />
  );
}
