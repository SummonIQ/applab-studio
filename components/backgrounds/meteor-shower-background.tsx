'use client';

import { useEffect, useRef } from 'react';

export function MeteorShowerBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const meteors: {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createMeteor = () => {
      meteors.push({
        x: Math.random() * canvas.width * 1.5,
        y: -50,
        length: 50 + Math.random() * 100,
        speed: 10 + Math.random() * 15,
        opacity: 0.5 + Math.random() * 0.5,
      });
    };

    const animate = () => {
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(
          (i * 137) % canvas.width,
          (i * 97) % canvas.height,
          0.5 + Math.random(),
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      if (Math.random() > 0.95) createMeteor();

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x -= m.speed * 0.7;
        m.y += m.speed;

        const gradient = ctx.createLinearGradient(
          m.x,
          m.y,
          m.x + m.length * 0.7,
          m.y - m.length,
        );
        gradient.addColorStop(0, `rgba(255,255,255,${m.opacity})`);
        gradient.addColorStop(1, 'transparent');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x + m.length * 0.7, m.y - m.length);
        ctx.stroke();

        if (m.y > canvas.height + 100) meteors.splice(i, 1);
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
