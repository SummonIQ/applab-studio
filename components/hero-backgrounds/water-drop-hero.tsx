'use client';

import { useEffect, useRef } from 'react';

export function WaterDropHero() {
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

    // Falling drops and splash impacts
    const fallingDrops = Array.from({ length: 8 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      speed: 8 + Math.random() * 4,
      length: 15 + Math.random() * 10,
    }));

    const splashes: { x: number; y: number; age: number; maxAge: number }[] =
      [];

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update falling drops
      fallingDrops.forEach(drop => {
        drop.y += drop.speed;

        // Create splash when hitting bottom area
        if (drop.y > canvas.height * 0.85) {
          splashes.push({ x: drop.x, y: drop.y, age: 0, maxAge: 30 });
          drop.y = -20;
          drop.x = Math.random() * canvas.width;
        }

        // Draw elongated drop
        const gradient = ctx.createLinearGradient(
          drop.x,
          drop.y - drop.length,
          drop.x,
          drop.y,
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0.4)');
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y - drop.length);
        ctx.lineTo(drop.x, drop.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const splash = splashes[i];
        splash.age++;

        if (splash.age > splash.maxAge) {
          splashes.splice(i, 1);
          continue;
        }

        const progress = splash.age / splash.maxAge;
        const alpha = 0.3 * (1 - progress);
        const radius = progress * 25;

        // Crown splash effect
        for (let a = 0; a < 5; a++) {
          const angle = (a / 5) * Math.PI - Math.PI;
          const px = splash.x + Math.cos(angle) * radius * 0.8;
          const py = splash.y + Math.sin(angle) * radius * 0.5 - progress * 10;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.fill();
        }
      }

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
