'use client';

import { useEffect, useRef } from 'react';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  trail: { x: number; y: number; alpha: number }[];
}

export function BouncingBallsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const balls: Ball[] = [];
    const gravity = 0.25;
    const friction = 0.99;
    const bounceDamping = 0.85;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (balls.length === 0) initBalls();
    };

    const initBalls = () => {
      balls.length = 0;
      for (let i = 0; i < 15; i++) {
        balls.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 4,
          radius: 20 + Math.random() * 40,
          hue: Math.random() * 360,
          trail: [],
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      // Create subtle fade effect
      ctx.fillStyle = 'rgba(10, 10, 20, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const ball of balls) {
        // Store trail position
        ball.trail.unshift({ x: ball.x, y: ball.y, alpha: 0.6 });
        if (ball.trail.length > 12) ball.trail.pop();

        // Update trail alpha
        for (let i = 0; i < ball.trail.length; i++) {
          ball.trail[i].alpha *= 0.85;
        }

        // Physics
        ball.vy += gravity;
        ball.vx *= friction;
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Bounce off walls
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx *= -bounceDamping;
        }
        if (ball.x + ball.radius > canvas.width) {
          ball.x = canvas.width - ball.radius;
          ball.vx *= -bounceDamping;
        }
        if (ball.y + ball.radius > canvas.height) {
          ball.y = canvas.height - ball.radius;
          ball.vy *= -bounceDamping;
          // Add some random energy to keep things interesting
          if (Math.abs(ball.vy) < 2) {
            ball.vy = -(8 + Math.random() * 6);
            ball.vx += (Math.random() - 0.5) * 4;
          }
        }
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy *= -bounceDamping;
        }

        // Draw trail
        for (let i = ball.trail.length - 1; i >= 0; i--) {
          const t = ball.trail[i];
          const trailRadius = ball.radius * (1 - i / ball.trail.length) * 0.8;
          ctx.beginPath();
          ctx.arc(t.x, t.y, trailRadius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${ball.hue}, 70%, 60%, ${t.alpha * 0.3})`;
          ctx.fill();
        }

        // Draw ball with gradient
        const gradient = ctx.createRadialGradient(
          ball.x - ball.radius * 0.3,
          ball.y - ball.radius * 0.3,
          0,
          ball.x,
          ball.y,
          ball.radius
        );
        gradient.addColorStop(0, `hsla(${ball.hue}, 80%, 75%, 0.9)`);
        gradient.addColorStop(0.5, `hsla(${ball.hue}, 70%, 55%, 0.8)`);
        gradient.addColorStop(1, `hsla(${ball.hue + 30}, 60%, 35%, 0.7)`);

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Highlight
        ctx.beginPath();
        ctx.arc(
          ball.x - ball.radius * 0.25,
          ball.y - ball.radius * 0.25,
          ball.radius * 0.3,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();

        // Slowly shift hue
        ball.hue = (ball.hue + 0.2) % 360;
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
