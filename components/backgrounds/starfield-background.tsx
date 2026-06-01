'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  previousZ: number;
}

interface StarfieldBackgroundProps {
  starCount?: number;
  speed?: number;
  starColor?: string;
}

export function StarfieldBackground({
  starCount = 800,
  speed = 5,
  starColor = '#ffffff',
}: StarfieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Initialize stars
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width - centerX,
        y: Math.random() * canvas.height - centerY,
        z: Math.random() * canvas.width,
        previousZ: Math.random() * canvas.width,
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.previousZ = star.z;
        star.z -= speed;

        if (star.z <= 0) {
          star.x = Math.random() * canvas.width - centerX;
          star.y = Math.random() * canvas.height - centerY;
          star.z = canvas.width;
          star.previousZ = star.z;
        }

        // Current position
        const k = 128 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;

        // Previous position
        const pk = 128 / star.previousZ;
        const ppx = star.x * pk + centerX;
        const ppy = star.y * pk + centerY;

        // Draw star trail
        ctx.strokeStyle = starColor;
        ctx.lineWidth = (1 - star.z / canvas.width) * 2;
        ctx.beginPath();
        ctx.moveTo(ppx, ppy);
        ctx.lineTo(px, py);
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [starCount, speed, starColor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#000' }}
    />
  );
}
