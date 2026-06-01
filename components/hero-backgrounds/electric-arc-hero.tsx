'use client';

import { useEffect, useRef } from 'react';

export function ElectricArcHero() {
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

    interface Arc {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      life: number;
      maxLife: number;
    }

    const arcs: Arc[] = [];
    let animationId: number;
    let time = 0;

    const createArc = () => {
      const side = Math.random() > 0.5;
      arcs.push({
        startX: side ? 0 : canvas.width,
        startY: Math.random() * canvas.height * 0.6,
        endX: canvas.width * (0.3 + Math.random() * 0.4),
        endY: canvas.height * (0.2 + Math.random() * 0.4),
        life: 0,
        maxLife: 20 + Math.random() * 30,
      });
    };

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Randomly create new arcs
      if (Math.random() < 0.02 && arcs.length < 3) {
        createArc();
      }

      // Draw arcs
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        arc.life++;

        if (arc.life > arc.maxLife) {
          arcs.splice(i, 1);
          continue;
        }

        const alpha = Math.sin((arc.life / arc.maxLife) * Math.PI) * 0.12;

        ctx.beginPath();
        ctx.moveTo(arc.startX, arc.startY);

        // Create jagged lightning path
        let x = arc.startX;
        let y = arc.startY;
        const steps = 10;

        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const targetX = arc.startX + (arc.endX - arc.startX) * t;
          const targetY = arc.startY + (arc.endY - arc.startY) * t;
          const jitter = (1 - t) * 30;
          x = targetX + (Math.random() - 0.5) * jitter;
          y = targetY + (Math.random() - 0.5) * jitter;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(139, 92, 246, 0.2)';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Glow at endpoints
        const glow = ctx.createRadialGradient(
          arc.endX,
          arc.endY,
          0,
          arc.endX,
          arc.endY,
          50,
        );
        glow.addColorStop(0, `rgba(139, 92, 246, ${alpha * 0.3})`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(arc.endX - 50, arc.endY - 50, 100, 100);
      }

      // Ambient glow
      const ambient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height * 0.4,
        0,
        canvas.width / 2,
        canvas.height * 0.4,
        300,
      );
      ambient.addColorStop(0, 'rgba(139, 92, 246, 0.05)');
      ambient.addColorStop(1, 'transparent');
      ctx.fillStyle = ambient;
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
