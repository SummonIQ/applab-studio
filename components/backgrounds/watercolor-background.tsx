'use client';

import { useEffect, useRef } from 'react';

export function WatercolorBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const blobs: {
      x: number;
      y: number;
      radius: number;
      color: string;
      phase: number;
      speed: number;
    }[] = [];

    const colors = [
      'rgba(59, 130, 246, 0.15)', // blue
      'rgba(236, 72, 153, 0.15)', // pink
      'rgba(168, 85, 247, 0.15)', // purple
      'rgba(34, 197, 94, 0.15)', // green
      'rgba(249, 115, 22, 0.15)', // orange
      'rgba(20, 184, 166, 0.15)', // teal
    ];

    // Create blobs
    for (let i = 0; i < 15; i++) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 150 + Math.random() * 300,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
      });
    }

    const animate = () => {
      time += 0.005;

      // Cream paper background
      ctx.fillStyle = '#fefce8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw watercolor blobs
      blobs.forEach((blob, i) => {
        const x = blob.x + Math.sin(time * blob.speed + blob.phase) * 50;
        const y = blob.y + Math.cos(time * blob.speed * 0.7 + blob.phase) * 30;
        const radius = blob.radius + Math.sin(time + i) * 20;

        // Multiple layers for watercolor effect
        for (let layer = 0; layer < 5; layer++) {
          const layerRadius = radius * (1 - layer * 0.15);
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, layerRadius);

          gradient.addColorStop(0, blob.color);
          gradient.addColorStop(0.5, blob.color.replace('0.15', '0.08'));
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = gradient;
          ctx.beginPath();

          // Organic blob shape
          const points = 8;
          for (let j = 0; j <= points; j++) {
            const angle = (j / points) * Math.PI * 2;
            const wobble = Math.sin(angle * 3 + time + i + layer) * 0.2 + 1;
            const px = x + Math.cos(angle) * layerRadius * wobble;
            const py = y + Math.sin(angle) * layerRadius * wobble;

            if (j === 0) {
              ctx.moveTo(px, py);
            } else {
              const prevAngle = ((j - 1) / points) * Math.PI * 2;
              const prevWobble =
                Math.sin(prevAngle * 3 + time + i + layer) * 0.2 + 1;
              const cpx =
                x +
                Math.cos((angle + prevAngle) / 2) *
                  layerRadius *
                  1.1 *
                  ((wobble + prevWobble) / 2);
              const cpy =
                y +
                Math.sin((angle + prevAngle) / 2) *
                  layerRadius *
                  1.1 *
                  ((wobble + prevWobble) / 2);
              ctx.quadraticCurveTo(cpx, cpy, px, py);
            }
          }
          ctx.closePath();
          ctx.fill();
        }
      });

      // Add paper texture overlay
      ctx.globalAlpha = 0.03;
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#fff';
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.globalAlpha = 1;

      // Soft vignette
      const vignette = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.7,
      );
      vignette.addColorStop(0, 'rgba(255, 255, 255, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
