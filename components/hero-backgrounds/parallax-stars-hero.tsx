'use client';

import { useEffect, useRef } from 'react';

export function ParallaxStarsHero() {
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

    interface Star {
      x: number;
      y: number;
      size: number;
      speed: number;
      brightness: number;
    }

    const layers: Star[][] = [
      // Far layer - small, slow
      Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 0.5,
        speed: 0.1,
        brightness: 0.3 + Math.random() * 0.2,
      })),
      // Mid layer
      Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1 + Math.random() * 0.5,
        speed: 0.3,
        brightness: 0.5 + Math.random() * 0.2,
      })),
      // Near layer - larger, faster
      Array.from({ length: 30 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1.5 + Math.random(),
        speed: 0.6,
        brightness: 0.7 + Math.random() * 0.3,
      })),
    ];

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    let animationId: number;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark space background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate parallax offset based on mouse
      const offsetX = (mouse.x - canvas.width / 2) / canvas.width;
      const offsetY = (mouse.y - canvas.height / 2) / canvas.height;

      // Draw each layer with parallax
      layers.forEach((layer, layerIndex) => {
        const parallaxMultiplier = (layerIndex + 1) * 15;

        layer.forEach(star => {
          const x = star.x + offsetX * parallaxMultiplier;
          const y = star.y + offsetY * parallaxMultiplier;
          const twinkle = star.brightness + Math.sin(time * 3 + star.x) * 0.1;

          ctx.beginPath();
          ctx.arc(x, y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
          ctx.fill();
        });
      });

      // Subtle nebula glow
      const nebula = ctx.createRadialGradient(
        canvas.width * 0.3,
        canvas.height * 0.4,
        0,
        canvas.width * 0.3,
        canvas.height * 0.4,
        400,
      );
      nebula.addColorStop(0, 'rgba(139, 92, 246, 0.05)');
      nebula.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula;
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
