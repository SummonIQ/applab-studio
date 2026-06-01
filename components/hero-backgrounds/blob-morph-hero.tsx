'use client';

import { useEffect, useRef } from 'react';

export function BlobMorphHero() {
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

    const createBlobPath = (
      cx: number,
      cy: number,
      radius: number,
      points: number,
      variance: number,
      phase: number,
    ) => {
      const path = new Path2D();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const r =
          radius +
          Math.sin(angle * 3 + phase) * variance +
          Math.cos(angle * 2 + phase * 0.7) * variance * 0.5;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      }
      path.closePath();
      return path;
    };

    const animate = () => {
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark gradient background
      const bgGradient = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.5,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.7,
      );
      bgGradient.addColorStop(0, '#1a1a2e');
      bgGradient.addColorStop(1, '#0f0f1a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Large morphing blobs in corners
      const blobs = [
        {
          x: -0.1,
          y: -0.1,
          radius: 0.4,
          color1: 'rgba(124, 58, 237, 0.06)',
          color2: 'rgba(124, 58, 237, 0)',
        },
        {
          x: 1.1,
          y: 0.2,
          radius: 0.35,
          color1: 'rgba(59, 130, 246, 0.05)',
          color2: 'rgba(59, 130, 246, 0)',
        },
        {
          x: 0.1,
          y: 1.1,
          radius: 0.3,
          color1: 'rgba(236, 72, 153, 0.04)',
          color2: 'rgba(236, 72, 153, 0)',
        },
        {
          x: 0.9,
          y: 0.9,
          radius: 0.25,
          color1: 'rgba(34, 211, 238, 0.04)',
          color2: 'rgba(34, 211, 238, 0)',
        },
      ];

      blobs.forEach((blob, i) => {
        const cx = canvas.width * blob.x;
        const cy = canvas.height * blob.y;
        const radius = Math.min(canvas.width, canvas.height) * blob.radius;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, blob.color1);
        gradient.addColorStop(1, blob.color2);

        const path = createBlobPath(
          cx,
          cy,
          radius,
          60,
          radius * 0.15,
          time + i * 2,
        );
        ctx.fillStyle = gradient;
        ctx.fill(path);
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
