'use client';

import { useEffect, useRef } from 'react';

export function DnaHelixBackground() {
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

    const animate = () => {
      time += 0.02;

      // Dark blue gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#020617');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const helixRadius = 80;
      const verticalSpacing = 30;
      const numPoints = Math.ceil(canvas.height / verticalSpacing) + 10;

      // Draw multiple helixes
      for (let h = 0; h < 3; h++) {
        const offsetX = (h - 1) * 300;
        const phaseOffset = (h * Math.PI) / 3;

        for (let i = 0; i < numPoints; i++) {
          const y =
            ((i * verticalSpacing - time * 50) % (canvas.height + 300)) - 150;
          const angle = i * 0.3 + time * 2 + phaseOffset;

          // Two strands of the helix
          const x1 = centerX + offsetX + Math.cos(angle) * helixRadius;
          const x2 =
            centerX + offsetX + Math.cos(angle + Math.PI) * helixRadius;
          const z1 = Math.sin(angle);
          const z2 = Math.sin(angle + Math.PI);

          // Draw connecting bars (base pairs)
          if (i % 2 === 0) {
            const barGradient = ctx.createLinearGradient(x1, y, x2, y);
            const colors = [
              ['#06b6d4', '#8b5cf6'], // cyan to violet
              ['#f43f5e', '#fb923c'], // rose to orange
              ['#22c55e', '#3b82f6'], // green to blue
            ];
            const colorPair = colors[i % colors.length];
            barGradient.addColorStop(0, colorPair[0]);
            barGradient.addColorStop(1, colorPair[1]);

            ctx.strokeStyle = barGradient;
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();
          }

          // Draw backbone spheres
          const size1 = 6 + z1 * 2;
          const size2 = 6 + z2 * 2;

          // Strand 1
          ctx.globalAlpha = 0.5 + z1 * 0.3;
          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(x1, y, size1, 0, Math.PI * 2);
          ctx.fill();

          // Strand 2
          ctx.globalAlpha = 0.5 + z2 * 0.3;
          ctx.fillStyle = '#8b5cf6';
          ctx.shadowColor = '#8b5cf6';
          ctx.beginPath();
          ctx.arc(x2, y, size2, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;
        }
      }

      // Floating particles
      ctx.globalAlpha = 1;
      for (let i = 0; i < 50; i++) {
        const px = (Math.sin(i * 0.5 + time) * 0.5 + 0.5) * canvas.width;
        const py = ((i * canvas.height) / 50 + time * 30) % canvas.height;
        const size = 1 + Math.sin(i + time) * 0.5;

        ctx.fillStyle = i % 2 === 0 ? '#06b6d4' : '#8b5cf6';
        ctx.globalAlpha = 0.3 + Math.sin(i + time) * 0.2;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
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
