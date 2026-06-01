'use client';

import { useEffect, useRef } from 'react';

export function ZenRippleHero() {
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
      time += 0.006;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;

      // Draw mandala-style pattern with rotating segments
      const segments = 8;
      for (let s = 0; s < segments; s++) {
        const segAngle = (s / segments) * Math.PI * 2 + time * 0.2;

        // Draw curved lines from center outward
        for (let layer = 1; layer <= 5; layer++) {
          const radius = layer * 50;
          const arcLength = 0.3 + Math.sin(time + layer) * 0.1;

          ctx.beginPath();
          ctx.arc(
            centerX,
            centerY,
            radius,
            segAngle - arcLength,
            segAngle + arcLength,
          );
          ctx.strokeStyle = `rgba(167, 139, 250, ${0.15 - layer * 0.02})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Center dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(167, 139, 250, 0.3)';
      ctx.fill();

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
