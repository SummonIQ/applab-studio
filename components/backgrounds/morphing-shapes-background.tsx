'use client';

import { useEffect, useRef } from 'react';

export function MorphingShapesBackground() {
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

    interface Shape {
      x: number;
      y: number;
      radius: number;
      points: number;
      morphSpeed: number;
      rotationSpeed: number;
      rotation: number;
      hue: number;
    }

    const shapes: Shape[] = Array.from({ length: 8 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 50 + Math.random() * 100,
      points: 3 + Math.floor(Math.random() * 5),
      morphSpeed: 0.01 + Math.random() * 0.02,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      rotation: Math.random() * Math.PI * 2,
      hue: Math.random() * 360,
    }));

    let animationId: number;
    let time = 0;

    const drawShape = (shape: Shape) => {
      const morphedPoints =
        shape.points + Math.sin(time * shape.morphSpeed * 50) * 2;
      const actualPoints = Math.max(3, Math.round(morphedPoints));

      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);

      ctx.beginPath();
      for (let i = 0; i <= actualPoints; i++) {
        const angle = (i / actualPoints) * Math.PI * 2;
        const wobble = Math.sin(time * 2 + i) * 10;
        const r = shape.radius + wobble;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, shape.radius);
      gradient.addColorStop(0, `hsla(${shape.hue}, 70%, 60%, 0.3)`);
      gradient.addColorStop(1, `hsla(${shape.hue + 30}, 70%, 40%, 0.1)`);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = `hsla(${shape.hue}, 80%, 70%, 0.5)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      time += 0.016;
      ctx.fillStyle = 'rgba(15, 15, 35, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      shapes.forEach(shape => {
        shape.rotation += shape.rotationSpeed;
        shape.hue = (shape.hue + 0.1) % 360;
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
