'use client';

import { useEffect, useRef } from 'react';

export function SmokeWispsHero() {
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

    interface Wisp {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }

    const wisps: Wisp[] = Array.from({ length: 8 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 200,
      radius: 100 + Math.random() * 150,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: -0.3 - Math.random() * 0.4,
      opacity: 0.03 + Math.random() * 0.04,
    }));

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0a0a10';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      wisps.forEach(wisp => {
        wisp.x += wisp.speedX;
        wisp.y += wisp.speedY;
        wisp.speedX += (Math.random() - 0.5) * 0.02;
        wisp.speedX = Math.max(-1, Math.min(1, wisp.speedX));

        if (wisp.y < -wisp.radius * 2) {
          wisp.y = canvas.height + wisp.radius;
          wisp.x = Math.random() * canvas.width;
        }

        const gradient = ctx.createRadialGradient(
          wisp.x,
          wisp.y,
          0,
          wisp.x,
          wisp.y,
          wisp.radius,
        );
        gradient.addColorStop(0, `rgba(100, 100, 120, ${wisp.opacity})`);
        gradient.addColorStop(0.5, `rgba(80, 80, 100, ${wisp.opacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(
          wisp.x - wisp.radius,
          wisp.y - wisp.radius,
          wisp.radius * 2,
          wisp.radius * 2,
        );
      });

      // Subtle color accent
      const accent = ctx.createRadialGradient(
        canvas.width * 0.3,
        canvas.height * 0.5,
        0,
        canvas.width * 0.3,
        canvas.height * 0.5,
        400,
      );
      accent.addColorStop(0, 'rgba(139, 92, 246, 0.05)');
      accent.addColorStop(1, 'transparent');
      ctx.fillStyle = accent;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
