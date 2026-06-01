'use client';

import { useEffect, useRef } from 'react';

export function FloatingShapesHero() {
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
      rotSpeed: number;
      ySpeed: number;
      opacity: number;
      sides: number;
    }

    const shapes: Shape[] = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 15 + Math.random() * 30,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      ySpeed: -0.2 - Math.random() * 0.3,
      opacity: 0.02 + Math.random() * 0.04,
      sides: [3, 4, 5, 6][Math.floor(Math.random() * 4)],
    }));

    let animationId: number;

    const drawPolygon = (
      x: number,
      y: number,
      radius: number,
      sides: number,
      rotation: number,
    ) => {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = rotation + (i / sides) * Math.PI * 2;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const animate = () => {
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
        shape.y += shape.ySpeed;
        shape.rotation += shape.rotSpeed;

        if (shape.y < -shape.size * 2) {
          shape.y = canvas.height + shape.size * 2;
          shape.x = Math.random() * canvas.width;
        }

        drawPolygon(shape.x, shape.y, shape.size, shape.sides, shape.rotation);
        ctx.strokeStyle = `rgba(147, 51, 234, ${shape.opacity})`;
        ctx.lineWidth = 1;
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
