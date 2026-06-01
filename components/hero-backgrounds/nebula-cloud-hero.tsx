'use client';

import { useEffect, useRef } from 'react';

export function NebulaCloudHero() {
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

    interface Cloud {
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
    }

    const clouds: Cloud[] = [
      {
        x: 0.2,
        y: 0.3,
        radius: 300,
        color: 'rgba(139, 92, 246, 0.08)',
        speedX: 0.0001,
        speedY: 0.00005,
      },
      {
        x: 0.7,
        y: 0.4,
        radius: 250,
        color: 'rgba(59, 130, 246, 0.06)',
        speedX: -0.00008,
        speedY: 0.00006,
      },
      {
        x: 0.4,
        y: 0.7,
        radius: 280,
        color: 'rgba(236, 72, 153, 0.05)',
        speedX: 0.00006,
        speedY: -0.00004,
      },
      {
        x: 0.8,
        y: 0.2,
        radius: 200,
        color: 'rgba(34, 211, 238, 0.04)',
        speedX: -0.00005,
        speedY: 0.00007,
      },
      {
        x: 0.15,
        y: 0.8,
        radius: 220,
        color: 'rgba(168, 85, 247, 0.06)',
        speedX: 0.00007,
        speedY: 0.00003,
      },
    ];

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark space background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and animate clouds
      clouds.forEach(cloud => {
        cloud.x += cloud.speedX;
        cloud.y += cloud.speedY;

        // Bounce at edges
        if (cloud.x < 0 || cloud.x > 1) cloud.speedX *= -1;
        if (cloud.y < 0 || cloud.y > 1) cloud.speedY *= -1;

        const x = canvas.width * cloud.x;
        const y = canvas.height * cloud.y;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, cloud.radius);
        gradient.addColorStop(0, cloud.color);
        gradient.addColorStop(0.5, cloud.color.replace(/[\d.]+\)$/, '0.02)'));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 80; i++) {
        const x = (i * 97) % canvas.width;
        const y = (i * 53) % canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 0.5 + (i % 3) * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

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
