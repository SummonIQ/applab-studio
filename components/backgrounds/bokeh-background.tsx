'use client';

import { useEffect, useRef } from 'react';

export interface BokehBackgroundProps {
  circleCount?: number;
  colors?: string[];
  speed?: number;
  minSize?: number;
  maxSize?: number;
}

interface BokehCircle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  opacity: number;
  opacityDir: number;
}

export function BokehBackground({
  circleCount = 20,
  colors = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24'],
  speed = 0.5,
  minSize = 30,
  maxSize = 150,
}: BokehBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const circles: BokehCircle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createCircle = (): BokehCircle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: minSize + Math.random() * (maxSize - minSize),
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      opacity: Math.random() * 0.3 + 0.1,
      opacityDir: Math.random() > 0.5 ? 0.002 : -0.002,
    });

    const init = () => {
      circles.length = 0;
      for (let i = 0; i < circleCount; i++) {
        circles.push(createCircle());
      }
    };

    const draw = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      circles.forEach(circle => {
        // Update position
        circle.x += circle.vx;
        circle.y += circle.vy;

        // Wrap around edges
        if (circle.x < -circle.radius) circle.x = canvas.width + circle.radius;
        if (circle.x > canvas.width + circle.radius) circle.x = -circle.radius;
        if (circle.y < -circle.radius) circle.y = canvas.height + circle.radius;
        if (circle.y > canvas.height + circle.radius) circle.y = -circle.radius;

        // Animate opacity
        circle.opacity += circle.opacityDir;
        if (circle.opacity > 0.4 || circle.opacity < 0.05) {
          circle.opacityDir *= -1;
        }

        // Draw bokeh circle with gradient
        const gradient = ctx.createRadialGradient(
          circle.x,
          circle.y,
          0,
          circle.x,
          circle.y,
          circle.radius,
        );
        gradient.addColorStop(
          0,
          circle.color +
            Math.floor(circle.opacity * 255)
              .toString(16)
              .padStart(2, '0'),
        );
        gradient.addColorStop(
          0.5,
          circle.color +
            Math.floor(circle.opacity * 128)
              .toString(16)
              .padStart(2, '0'),
        );
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
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
  }, [circleCount, colors, speed, minSize, maxSize]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        background:
          'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
      }}
    />
  );
}
