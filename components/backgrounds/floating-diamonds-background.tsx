'use client';

import { useEffect, useRef } from 'react';

export function FloatingDiamondsBackground() {
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

    interface Diamond {
      x: number;
      y: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      speed: number;
      hue: number;
    }

    const diamonds: Diamond[] = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 15 + Math.random() * 30,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      speed: 0.3 + Math.random() * 0.5,
      hue: Math.random() * 60 + 180, // cyan to blue range
    }));

    let animationId: number;

    const drawDiamond = (
      x: number,
      y: number,
      size: number,
      rotation: number,
      hue: number,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.6, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.6, 0);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(-size, -size, size, size);
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.4)`);
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 70%, 0.6)`);
      gradient.addColorStop(1, `hsla(${hue}, 70%, 50%, 0.3)`);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = `hsla(${hue}, 80%, 80%, 0.8)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 25, 45, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      diamonds.forEach(diamond => {
        diamond.y -= diamond.speed;
        diamond.rotation += diamond.rotationSpeed;

        if (diamond.y < -diamond.size * 2) {
          diamond.y = canvas.height + diamond.size * 2;
          diamond.x = Math.random() * canvas.width;
        }

        drawDiamond(
          diamond.x,
          diamond.y,
          diamond.size,
          diamond.rotation,
          diamond.hue,
        );
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
