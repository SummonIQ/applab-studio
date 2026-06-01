'use client';

import { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  wobblePhase: number;
  wobbleSpeed: number;
  hue: number;
  opacity: number;
}

export function FloatingBubblesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const bubbles: Bubble[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (bubbles.length === 0) initBubbles();
    };

    const initBubbles = () => {
      bubbles.length = 0;
      for (let i = 0; i < 35; i++) {
        bubbles.push(createBubble(true));
      }
    };

    const createBubble = (randomY = false): Bubble => ({
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : canvas.height + 50,
      radius: 15 + Math.random() * 50,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(0.3 + Math.random() * 1.2),
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
      hue: 180 + Math.random() * 60,
      opacity: 0.3 + Math.random() * 0.4,
    });

    resize();
    window.addEventListener('resize', resize);

    const drawBubble = (bubble: Bubble) => {
      const { x, y, radius, hue, opacity } = bubble;

      const gradient = ctx.createRadialGradient(
        x - radius * 0.3,
        y - radius * 0.3,
        0,
        x,
        y,
        radius
      );
      gradient.addColorStop(0, `hsla(${hue}, 60%, 85%, ${opacity * 0.1})`);
      gradient.addColorStop(0.5, `hsla(${hue}, 50%, 70%, ${opacity * 0.15})`);
      gradient.addColorStop(0.8, `hsla(${hue}, 40%, 60%, ${opacity * 0.2})`);
      gradient.addColorStop(1, `hsla(${hue}, 50%, 50%, ${opacity * 0.4})`);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 70%, 80%, ${opacity * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(
        x - radius * 0.35,
        y - radius * 0.35,
        radius * 0.25,
        radius * 0.15,
        -Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.7})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x - radius * 0.15, y - radius * 0.5, radius * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(
        x + radius * 0.2,
        y + radius * 0.4,
        radius * 0.3,
        radius * 0.1,
        Math.PI / 6,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `hsla(${hue + 20}, 80%, 90%, ${opacity * 0.2})`;
      ctx.fill();
    };

    const animate = () => {
      time += 0.016;

      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0a0a1a');
      bgGradient.addColorStop(0.5, '#0f1525');
      bgGradient.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const bubble = bubbles[i];

        bubble.wobblePhase += bubble.wobbleSpeed;
        bubble.x += bubble.vx + Math.sin(bubble.wobblePhase) * 0.5;
        bubble.y += bubble.vy;

        if (bubble.y + bubble.radius < -50) {
          bubbles[i] = createBubble();
        }

        drawBubble(bubble);
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
