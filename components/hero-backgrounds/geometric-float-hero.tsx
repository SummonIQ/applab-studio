'use client';

import { useEffect, useRef } from 'react';

export function GeometricFloatHero() {
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

    interface Shape {
      x: number;
      y: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      type: 'triangle' | 'square' | 'hexagon';
      alpha: number;
      floatOffset: number;
    }

    const shapes: Shape[] = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 20 + Math.random() * 40,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      type: ['triangle', 'square', 'hexagon'][
        Math.floor(Math.random() * 3)
      ] as Shape['type'],
      alpha: 0.03 + Math.random() * 0.05,
      floatOffset: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    let animationId: number;

    const drawShape = (shape: Shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y + Math.sin(time + shape.floatOffset) * 10);
      ctx.rotate(shape.rotation);
      ctx.strokeStyle = `rgba(147, 51, 234, ${shape.alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();

      if (shape.type === 'triangle') {
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * shape.size;
          const y = Math.sin(angle) * shape.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      } else if (shape.type === 'square') {
        ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
      } else {
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const x = Math.cos(angle) * shape.size;
          const y = Math.sin(angle) * shape.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      shapes.forEach(shape => {
        shape.rotation += shape.rotationSpeed;
        drawShape(shape);
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
