'use client';

import { useEffect, useRef } from 'react';

export function RippleEffectHero() {
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

    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
    }

    const ripples: Ripple[] = [];
    let animationId: number;

    const handleClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 300,
        opacity: 0.4,
      });
    };
    canvas.addEventListener('click', handleClick);

    // Auto-generate ripples
    const autoRipple = () => {
      if (ripples.length < 5) {
        ripples.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 0,
          maxRadius: 200 + Math.random() * 150,
          opacity: 0.2,
        });
      }
    };
    const autoInterval = setInterval(autoRipple, 2000);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += 2;
        ripple.opacity = 0.4 * (1 - ripple.radius / ripple.maxRadius);

        if (ripple.radius > ripple.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        // Draw multiple concentric rings
        for (let r = 0; r < 3; r++) {
          const ringRadius = ripple.radius - r * 20;
          if (ringRadius > 0) {
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ringRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(139, 92, 246, ${ripple.opacity * (1 - r * 0.3)})`;
            ctx.lineWidth = 2 - r * 0.5;
            ctx.stroke();
          }
        }
      }

      // Ambient gradient
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
      clearInterval(autoInterval);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-pointer"
    />
  );
}
