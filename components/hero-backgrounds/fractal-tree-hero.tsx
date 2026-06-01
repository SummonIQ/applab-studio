'use client';

import { useEffect, useRef } from 'react';

export function FractalTreeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.fillStyle = '#080c10';
      ctx.fillRect(0, 0, w, h);

      // Tree-like branching lines
      for (let tree = 0; tree < 5; tree++) {
        const baseX = w * (0.15 + tree * 0.18);
        const sway = Math.sin(time * 0.5 + tree) * 8;

        // Main trunk
        ctx.strokeStyle = `rgba(60, 100, 80, ${0.05 - tree * 0.008})`;
        ctx.lineWidth = 2 - tree * 0.2;
        ctx.beginPath();
        ctx.moveTo(baseX + sway, h);
        ctx.lineTo(baseX + sway * 0.3, h * 0.5);
        ctx.stroke();

        // Branches
        for (let branch = 0; branch < 4; branch++) {
          const branchY = h * (0.5 + branch * 0.1);
          const branchSway = Math.sin(time * 0.7 + tree + branch) * 5;
          const branchLen = 30 + branch * 10;
          const dir = branch % 2 === 0 ? 1 : -1;

          ctx.strokeStyle = `rgba(70, 120, 90, ${0.03 - branch * 0.005})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(baseX + sway * 0.5, branchY);
          ctx.lineTo(
            baseX + sway * 0.5 + dir * branchLen + branchSway,
            branchY - 20,
          );
          ctx.stroke();
        }
      }

      // Floating leaves/particles
      for (let i = 0; i < 15; i++) {
        const x = (Math.sin(i * 2.3 + time * 0.3) * 0.4 + 0.5) * w;
        const y = ((time * 20 + i * 50) % (h + 50)) - 25;
        const size = 1.5 + Math.sin(i) * 0.5;
        const alpha = 0.04 + Math.sin(time + i) * 0.02;

        ctx.beginPath();
        ctx.arc(x + Math.sin(y * 0.02 + time) * 10, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 160, 120, ${alpha})`;
        ctx.fill();
      }

      // Ground glow
      const glow = ctx.createRadialGradient(
        w * 0.5,
        h * 1.1,
        0,
        w * 0.5,
        h * 1.1,
        h * 0.5,
      );
      glow.addColorStop(0, 'rgba(60, 120, 90, 0.08)');
      glow.addColorStop(0.5, 'rgba(50, 100, 80, 0.03)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      time += 0.012;
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#080c10' }}
    />
  );
}
