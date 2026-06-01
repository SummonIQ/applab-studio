'use client';

import { useEffect, useRef } from 'react';

export function PebbleRippleHero() {
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

    // Static pebbles scattered on the ground
    const pebbles = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.6 + Math.random() * canvas.height * 0.35,
      width: 15 + Math.random() * 25,
      height: 10 + Math.random() * 15,
      rotation: Math.random() * Math.PI,
      shade: 0.08 + Math.random() * 0.06,
    }));

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.015;

      // Water-like gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0c14');
      gradient.addColorStop(1, '#080a10');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle water surface distortion lines
      for (let i = 0; i < 8; i++) {
        const y = canvas.height * 0.3 + i * 40;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= canvas.width; x += 20) {
          const wave = Math.sin(x * 0.01 + time + i * 0.5) * 3;
          ctx.lineTo(x, y + wave);
        }
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.03 - i * 0.003})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw pebbles with subtle shadows
      pebbles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Shadow
        ctx.beginPath();
        ctx.ellipse(2, 2, p.width * 0.5, p.height * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fill();

        // Pebble
        ctx.beginPath();
        ctx.ellipse(0, 0, p.width * 0.5, p.height * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 130, 150, ${p.shade})`;
        ctx.fill();
        ctx.restore();
      });

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
