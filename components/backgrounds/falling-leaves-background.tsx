'use client';

import { useEffect, useRef } from 'react';

export function FallingLeavesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const leaves: {
      x: number;
      y: number;
      r: number;
      rot: number;
      rotSpeed: number;
      speed: number;
      color: string;
    }[] = [];
    const colors = ['#ff6b35', '#f7c59f', '#efa94a', '#c44536', '#772e25'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 50; i++) {
      leaves.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: 10 + Math.random() * 15,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        speed: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const drawLeaf = (
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.lineTo(size, 0);
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87ceeb');
      gradient.addColorStop(1, '#e0f0ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      leaves.forEach(l => {
        l.y += l.speed;
        l.x += Math.sin(l.y * 0.01) * 1;
        l.rot += l.rotSpeed;
        if (l.y > canvas.height + 50) {
          l.y = -50;
          l.x = Math.random() * canvas.width;
        }
        drawLeaf(l.x, l.y, l.r, l.rot, l.color);
      });
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
