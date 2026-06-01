'use client';

import { useEffect, useRef } from 'react';

export function FeatherFloatHero() {
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

    const feathers = Array.from({ length: 10 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      fallSpeed: 0.2 + Math.random() * 0.15,
      swayPhase: Math.random() * Math.PI * 2,
      size: 30 + Math.random() * 20,
    }));

    let time = 0;
    let animationId: number;

    // Draw realistic feather with quill
    const drawFeather = (size: number) => {
      // Quill/spine
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size);
      ctx.strokeStyle = 'rgba(200, 200, 210, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Barbs on each side
      for (let i = -8; i <= 8; i++) {
        if (i === 0) continue;
        const y = (i / 8) * size * 0.9;
        const barbLength = size * 0.4 * (1 - Math.abs(i) / 10);
        const curve = i < 0 ? -0.3 : 0.3;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.quadraticCurveTo(
          barbLength * 0.5,
          y + curve * barbLength,
          barbLength * (i > 0 ? 1 : -1),
          y,
        );
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.06)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    const animate = () => {
      time += 0.008;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      feathers.forEach(f => {
        f.y += f.fallSpeed;
        f.x += Math.sin(time + f.swayPhase) * 0.4;
        f.rotation +=
          f.rotationSpeed + Math.sin(time * 2 + f.swayPhase) * 0.005;

        if (f.y > canvas.height + 60) {
          f.y = -60;
          f.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);
        drawFeather(f.size);
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
