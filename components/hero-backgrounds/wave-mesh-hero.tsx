'use client';

import { useEffect, useRef } from 'react';

export function WaveMeshHero() {
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

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3D-like wave mesh
      const cols = 40;
      const rows = 20;
      const spacing = canvas.width / cols;

      ctx.strokeStyle = 'rgba(100, 100, 150, 0.1)';
      ctx.lineWidth = 1;

      // Horizontal waves
      for (let row = 0; row < rows; row++) {
        ctx.beginPath();
        for (let col = 0; col <= cols; col++) {
          const x = col * spacing;
          const baseY =
            canvas.height * 0.3 + row * ((canvas.height * 0.5) / rows);
          const wave = Math.sin(col * 0.3 + time + row * 0.2) * 20;
          const y = baseY + wave;

          if (col === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Vertical connections
      for (let col = 0; col <= cols; col += 2) {
        ctx.beginPath();
        for (let row = 0; row < rows; row++) {
          const x = col * spacing;
          const baseY =
            canvas.height * 0.3 + row * ((canvas.height * 0.5) / rows);
          const wave = Math.sin(col * 0.3 + time + row * 0.2) * 20;
          const y = baseY + wave;

          if (row === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Gradient overlay
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.5,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.5,
      );
      gradient.addColorStop(0, 'rgba(124, 58, 237, 0.08)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
