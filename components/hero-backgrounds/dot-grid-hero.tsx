'use client';

import { useEffect, useRef } from 'react';

export function DotGridHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let mouse = { x: -1000, y: -1000 };
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        mouse.x = -1000;
        mouse.y = -1000;
        return;
      }

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouse.x = x * scaleX;
      mouse.y = y * scaleY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const spacing = 40;
    let time = 0;

    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw dot grid
      for (let x = spacing; x < canvas.width; x += spacing) {
        for (let y = spacing; y < canvas.height; y += spacing) {
          const distToMouse = Math.hypot(x - mouse.x, y - mouse.y);
          const influence = Math.max(0, 1 - distToMouse / 150);

          const size = 2 + influence * 4;
          const alpha = 0.15 + influence * 0.6;

          // Subtle wave animation
          const wave = Math.sin(x * 0.02 + y * 0.02 + time) * 0.5 + 0.5;

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);

          if (influence > 0) {
            ctx.fillStyle = `rgba(147, 51, 234, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(100, 100, 120, ${0.1 + wave * 0.05})`;
          }
          ctx.fill();
        }
      }

      // Center gradient glow
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.4,
      );
      gradient.addColorStop(0, 'rgba(124, 58, 237, 0.05)');
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
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
