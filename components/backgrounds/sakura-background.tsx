'use client';

import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  fallSpeed: number;
  swayPhase: number;
  swaySpeed: number;
}

export function SakuraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const petals: Petal[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create petals
    for (let i = 0; i < 100; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: 8 + Math.random() * 12,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        fallSpeed: 0.5 + Math.random() * 1.5,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.03,
      });
    }

    const drawPetal = (
      x: number,
      y: number,
      size: number,
      rotation: number,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Petal shape
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(
        size * 0.8,
        -size * 0.5,
        size * 0.8,
        size * 0.5,
        0,
        size,
      );
      ctx.bezierCurveTo(
        -size * 0.8,
        size * 0.5,
        -size * 0.8,
        -size * 0.5,
        0,
        -size,
      );
      ctx.closePath();

      // Gradient fill
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradient.addColorStop(0, '#ffc0cb');
      gradient.addColorStop(0.5, '#ffb7c5');
      gradient.addColorStop(1, '#ff69b4');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Subtle center line
      ctx.strokeStyle = 'rgba(255, 105, 180, 0.3)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.lineTo(0, size * 0.7);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      // Soft gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#fce4ec');
      gradient.addColorStop(0.5, '#f8bbd9');
      gradient.addColorStop(1, '#f48fb1');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw tree branches silhouette
      ctx.strokeStyle = 'rgba(62, 39, 35, 0.3)';
      ctx.lineWidth = 3;

      const drawBranch = (
        startX: number,
        startY: number,
        length: number,
        angle: number,
        depth: number,
      ) => {
        if (depth <= 0 || length < 10) return;

        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        drawBranch(endX, endY, length * 0.7, angle - 0.4, depth - 1);
        drawBranch(endX, endY, length * 0.7, angle + 0.3, depth - 1);
      };

      drawBranch(0, canvas.height * 0.6, 150, -0.3, 5);
      drawBranch(canvas.width, canvas.height * 0.4, 180, Math.PI + 0.4, 5);

      // Update and draw petals
      petals.forEach(petal => {
        petal.y += petal.fallSpeed;
        petal.x += Math.sin(petal.swayPhase) * 1;
        petal.swayPhase += petal.swaySpeed;
        petal.rotation += petal.rotationSpeed;

        // Reset petal when it falls off screen
        if (petal.y > canvas.height + petal.size) {
          petal.y = -petal.size * 2;
          petal.x = Math.random() * canvas.width;
        }

        ctx.globalAlpha = 0.8;
        drawPetal(petal.x, petal.y, petal.size, petal.rotation);
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
