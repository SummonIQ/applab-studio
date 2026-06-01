'use client';

import { useEffect, useRef } from 'react';

export function DepthLayersHero() {
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

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const layers = [
      { depth: 0.1, color: 'rgba(30, 30, 50, 0.3)' },
      { depth: 0.2, color: 'rgba(40, 35, 60, 0.2)' },
      { depth: 0.4, color: 'rgba(50, 40, 70, 0.15)' },
      { depth: 0.6, color: 'rgba(60, 45, 80, 0.1)' },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const offsetX = (mouse.x - canvas.width / 2) / canvas.width;
      const offsetY = (mouse.y - canvas.height / 2) / canvas.height;

      // Draw depth layers with parallax
      layers.forEach((layer, i) => {
        const parallax = layer.depth * 50;
        const yOffset = canvas.height * (0.6 + i * 0.1) + offsetY * parallax;

        ctx.beginPath();
        ctx.moveTo(-100, canvas.height);

        for (let x = -100; x <= canvas.width + 100; x += 50) {
          const wave = Math.sin(x * 0.005 + i) * 30;
          ctx.lineTo(x + offsetX * parallax, yOffset + wave);
        }

        ctx.lineTo(canvas.width + 100, canvas.height);
        ctx.closePath();
        ctx.fillStyle = layer.color;
        ctx.fill();
      });

      // Ambient light
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5 + offsetX * 30,
        canvas.height * 0.3 + offsetY * 20,
        0,
        canvas.width * 0.5,
        canvas.height * 0.3,
        400,
      );
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.04)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
