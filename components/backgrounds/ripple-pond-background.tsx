'use client';

import { useEffect, useRef } from 'react';

export function RipplePondBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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

    const addRipple = () => {
      ripples.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        maxRadius: 100 + Math.random() * 150,
        opacity: 0.6,
      });
    };

    // Initial ripples
    for (let i = 0; i < 5; i++) {
      addRipple();
      ripples[i].radius = Math.random() * ripples[i].maxRadius;
    }

    let lastRippleTime = 0;

    const animate = (time: number) => {
      ctx.fillStyle = 'rgba(10, 30, 50, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add new ripples periodically
      if (time - lastRippleTime > 800) {
        addRipple();
        lastRippleTime = time;
      }

      // Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += 1.5;
        ripple.opacity = 0.6 * (1 - ripple.radius / ripple.maxRadius);

        if (ripple.radius >= ripple.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        // Draw multiple concentric rings
        for (let j = 0; j < 3; j++) {
          const r = ripple.radius - j * 15;
          if (r > 0) {
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100, 180, 255, ${ripple.opacity * (1 - j * 0.3)})`;
            ctx.lineWidth = 2 - j * 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate(0);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
