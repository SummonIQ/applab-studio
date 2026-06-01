'use client';

import { useEffect, useRef } from 'react';

export function LiquidGradientHero() {
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
      time += 0.003;

      // Create flowing gradient effect
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          const nx = x / canvas.width;
          const ny = y / canvas.height;

          // Create flowing color values
          const r = Math.sin(nx * 3 + time) * 20 + 15;
          const g = Math.sin(ny * 2 + time * 0.8 + nx) * 15 + 10;
          const b = Math.sin((nx + ny) * 2 + time * 1.2) * 40 + 60;

          // Fill 4x4 block
          for (let dy = 0; dy < 4 && y + dy < canvas.height; dy++) {
            for (let dx = 0; dx < 4 && x + dx < canvas.width; dx++) {
              const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
              data[idx] = r;
              data[idx + 1] = g;
              data[idx + 2] = b;
              data[idx + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Overlay gradient spots
      const spots = [
        {
          x: 0.3 + Math.sin(time) * 0.1,
          y: 0.4,
          color: 'rgba(124, 58, 237, 0.2)',
        },
        {
          x: 0.7 + Math.cos(time * 0.8) * 0.1,
          y: 0.3,
          color: 'rgba(59, 130, 246, 0.15)',
        },
        {
          x: 0.5,
          y: 0.7 + Math.sin(time * 0.6) * 0.1,
          color: 'rgba(236, 72, 153, 0.1)',
        },
      ];

      spots.forEach(spot => {
        const gradient = ctx.createRadialGradient(
          canvas.width * spot.x,
          canvas.height * spot.y,
          0,
          canvas.width * spot.x,
          canvas.height * spot.y,
          300,
        );
        gradient.addColorStop(0, spot.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
