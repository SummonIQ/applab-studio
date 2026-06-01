'use client';

import { useEffect, useRef } from 'react';

export function SpotlightGlowHero() {
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
    let smoothMouse = { x: mouse.x, y: mouse.y };
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Smooth mouse follow
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.05;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.05;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark base
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spotlight gradient following mouse
      const gradient = ctx.createRadialGradient(
        smoothMouse.x,
        smoothMouse.y,
        0,
        smoothMouse.x,
        smoothMouse.y,
        400,
      );
      gradient.addColorStop(0, 'rgba(124, 58, 237, 0.15)');
      gradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.05)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Secondary ambient glow
      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.8,
        canvas.height * 0.2,
        0,
        canvas.width * 0.8,
        canvas.height * 0.2,
        300,
      );
      gradient2.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      gradient2.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle noise texture effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillRect(x, y, 1, 1);
      }

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
