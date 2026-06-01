'use client';

import { useEffect, useRef } from 'react';

interface Shape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: 'triangle' | 'square' | 'hexagon' | 'circle';
  color: string;
  speed: number;
  opacity: number;
}

export function GeometricShapesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const shapes: Shape[] = [];

    const colors = [
      '#06b6d4',
      '#8b5cf6',
      '#ec4899',
      '#f59e0b',
      '#10b981',
      '#3b82f6',
    ];
    const types: Shape['type'][] = ['triangle', 'square', 'hexagon', 'circle'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create shapes
    for (let i = 0; i < 40; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 20 + Math.random() * 60,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        type: types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.2 + Math.random() * 0.5,
        opacity: 0.1 + Math.random() * 0.3,
      });
    }

    const drawShape = (shape: Shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.globalAlpha = shape.opacity;
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 2;

      ctx.beginPath();
      switch (shape.type) {
        case 'triangle':
          for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * shape.size;
            const y = Math.sin(angle) * shape.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          break;
        case 'square':
          ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
          break;
        case 'hexagon':
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * shape.size;
            const y = Math.sin(angle) * shape.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          break;
        case 'circle':
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
          break;
      }
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      // Dark gradient background
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

      // Update and draw shapes
      shapes.forEach(shape => {
        shape.y -= shape.speed;
        shape.rotation += shape.rotationSpeed;

        if (shape.y < -shape.size * 2) {
          shape.y = canvas.height + shape.size * 2;
          shape.x = Math.random() * canvas.width;
        }

        drawShape(shape);
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
