'use client';

import { useEffect, useRef } from 'react';

export function OrbitTrailHero() {
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

    let time = 0;
    let animationId: number;

    const orbits = [
      { radius: 80, speed: 0.02, size: 4 },
      { radius: 140, speed: -0.015, size: 5 },
      { radius: 200, speed: 0.01, size: 6 },
    ];

    const animate = () => {
      time += 1;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;

      orbits.forEach((orbit, i) => {
        const angle = time * orbit.speed;
        const x = centerX + Math.cos(angle) * orbit.radius;
        const y = centerY + Math.sin(angle) * orbit.radius;

        ctx.beginPath();
        ctx.arc(x, y, orbit.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${0.6 - i * 0.15})`;
        ctx.fill();
      });

      // Draw orbit paths
      ctx.globalAlpha = 0.05;
      orbits.forEach(orbit => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbit.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(139, 92, 246, 1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

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
