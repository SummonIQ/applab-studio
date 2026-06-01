'use client';

import { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  vx: number;
  vy: number;
  hue: number;
  opacity: number;
  wobblePhase: number;
  popping: boolean;
  popProgress: number;
}

interface PopParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  life: number;
}

export function BubblePopBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const bubbles: Bubble[] = [];
    const particles: PopParticle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (bubbles.length === 0) initBubbles();
    };

    const initBubbles = () => {
      bubbles.length = 0;
      for (let i = 0; i < 20; i++) {
        bubbles.push(createBubble(true));
      }
    };

    const createBubble = (randomY = false): Bubble => {
      const maxRadius = 30 + Math.random() * 60;
      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : canvas.height + maxRadius,
        radius: maxRadius * 0.3,
        maxRadius,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(0.5 + Math.random() * 1.5),
        hue: 180 + Math.random() * 80,
        opacity: 0.4 + Math.random() * 0.3,
        wobblePhase: Math.random() * Math.PI * 2,
        popping: false,
        popProgress: 0,
      };
    };

    const popBubble = (bubble: Bubble) => {
      // Create pop particles
      const particleCount = 8 + Math.floor(bubble.radius / 5);
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x: bubble.x,
          y: bubble.y,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
          vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 2,
          radius: 2 + Math.random() * 4,
          hue: bubble.hue,
          life: 1,
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const drawBubble = (bubble: Bubble) => {
      const { x, y, radius, hue, opacity, popping, popProgress } = bubble;

      if (popping) {
        // Draw popping animation
        const popRadius = radius * (1 + popProgress * 0.5);
        const popOpacity = opacity * (1 - popProgress);

        ctx.beginPath();
        ctx.arc(x, y, popRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue}, 70%, 70%, ${popOpacity})`;
        ctx.lineWidth = 2 * (1 - popProgress);
        ctx.stroke();
        return;
      }

      // Main bubble
      const gradient = ctx.createRadialGradient(
        x - radius * 0.3, y - radius * 0.3, 0,
        x, y, radius
      );
      gradient.addColorStop(0, `hsla(${hue}, 50%, 90%, ${opacity * 0.2})`);
      gradient.addColorStop(0.6, `hsla(${hue}, 60%, 70%, ${opacity * 0.3})`);
      gradient.addColorStop(1, `hsla(${hue}, 70%, 50%, ${opacity * 0.5})`);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Edge
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 80%, 80%, ${opacity * 0.6})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Highlight
      ctx.beginPath();
      ctx.ellipse(
        x - radius * 0.35, y - radius * 0.35,
        radius * 0.25, radius * 0.15,
        -Math.PI / 4, 0, Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
      ctx.fill();

      // Secondary highlight
      ctx.beginPath();
      ctx.arc(x - radius * 0.15, y - radius * 0.5, radius * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
      ctx.fill();
    };

    const animate = () => {
      time += 0.016;

      // Background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0a0815');
      bgGradient.addColorStop(0.5, '#0f1020');
      bgGradient.addColorStop(1, '#15182a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.life -= 0.03;
        p.radius *= 0.97;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.life * 0.8})`;
        ctx.fill();
      }

      // Update and draw bubbles
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const bubble = bubbles[i];

        if (bubble.popping) {
          bubble.popProgress += 0.08;
          if (bubble.popProgress >= 1) {
            bubbles[i] = createBubble();
          }
          drawBubble(bubble);
          continue;
        }

        // Grow to max size
        if (bubble.radius < bubble.maxRadius) {
          bubble.radius += (bubble.maxRadius - bubble.radius) * 0.02;
        }

        // Wobble
        bubble.wobblePhase += 0.03;
        bubble.x += bubble.vx + Math.sin(bubble.wobblePhase) * 0.3;
        bubble.y += bubble.vy;

        // Random pop chance
        if (Math.random() < 0.001 && bubble.radius > bubble.maxRadius * 0.8) {
          bubble.popping = true;
          popBubble(bubble);
        }

        // Pop if reaches top
        if (bubble.y < -bubble.radius) {
          bubble.popping = true;
          popBubble(bubble);
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
