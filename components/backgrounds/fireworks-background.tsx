'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  trail: { x: number; y: number }[];
}

interface Rocket {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
  exploded: boolean;
}

export function FireworksBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    const rockets: Rocket[] = [];
    let lastRocket = 0;

    const colors = [
      '#ff0000',
      '#ff6600',
      '#ffff00',
      '#00ff00',
      '#00ffff',
      '#0066ff',
      '#ff00ff',
      '#ff0099',
      '#ffffff',
      '#ffcc00',
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createExplosion = (x: number, y: number, color: string) => {
      const particleCount = 80 + Math.random() * 40;
      const explosionType = Math.floor(Math.random() * 3);

      for (let i = 0; i < particleCount; i++) {
        let vx, vy;

        if (explosionType === 0) {
          // Circular
          const angle = (i / particleCount) * Math.PI * 2;
          const speed = 2 + Math.random() * 4;
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed;
        } else if (explosionType === 1) {
          // Heart shape
          const t = (i / particleCount) * Math.PI * 2;
          const scale = 0.3;
          vx = scale * 16 * Math.pow(Math.sin(t), 3);
          vy =
            -scale *
            (13 * Math.cos(t) -
              5 * Math.cos(2 * t) -
              2 * Math.cos(3 * t) -
              Math.cos(4 * t));
        } else {
          // Random burst
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 5;
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed;
        }

        particles.push({
          x,
          y,
          vx,
          vy,
          life: 1,
          maxLife: 60 + Math.random() * 40,
          color:
            Math.random() > 0.7
              ? colors[Math.floor(Math.random() * colors.length)]
              : color,
          size: 2 + Math.random() * 2,
          trail: [],
        });
      }
    };

    const launchRocket = () => {
      rockets.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        vy: -8 - Math.random() * 4,
        targetY: 100 + Math.random() * (canvas.height * 0.4),
        color: colors[Math.floor(Math.random() * colors.length)],
        exploded: false,
      });
    };

    const animate = () => {
      // Semi-transparent background for trails
      ctx.fillStyle = 'rgba(0, 0, 10, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      if (now - lastRocket > 400 + Math.random() * 800) {
        launchRocket();
        lastRocket = now;
      }

      // Update and draw rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];

        if (!rocket.exploded) {
          rocket.y += rocket.vy;
          rocket.vy += 0.05; // gravity

          // Draw rocket trail
          ctx.beginPath();
          ctx.strokeStyle = rocket.color;
          ctx.lineWidth = 2;
          ctx.moveTo(rocket.x, rocket.y);
          ctx.lineTo(rocket.x, rocket.y + 10);
          ctx.stroke();

          // Sparkle trail
          ctx.fillStyle = '#ffcc00';
          for (let j = 0; j < 3; j++) {
            ctx.beginPath();
            ctx.arc(
              rocket.x + (Math.random() - 0.5) * 4,
              rocket.y + 10 + Math.random() * 10,
              Math.random() * 2,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }

          if (rocket.y <= rocket.targetY) {
            rocket.exploded = true;
            createExplosion(rocket.x, rocket.y, rocket.color);
          }
        } else {
          rockets.splice(i, 1);
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life--;

        const alpha = p.life / p.maxLife;

        // Draw trail
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = alpha * 0.3;
          ctx.lineWidth = p.size * 0.5;
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (const point of p.trail) {
            ctx.lineTo(point.x, point.y);
          }
          ctx.stroke();
        }

        // Draw particle
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    // Initial rockets
    for (let i = 0; i < 3; i++) {
      setTimeout(() => launchRocket(), i * 300);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-black"
    />
  );
}
