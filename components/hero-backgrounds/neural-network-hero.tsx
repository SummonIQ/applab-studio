'use client';

import { useEffect, useRef } from 'react';

export function NeuralNetworkHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const nodes: { x: number; y: number; layer: number }[] = [];
    const layers = [5, 8, 8, 5];
    layers.forEach((count, layerIdx) => {
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: 0.2 + (layerIdx / (layers.length - 1)) * 0.6,
          y: 0.2 + (i / (count - 1)) * 0.6,
          layer: layerIdx,
        });
      }
    });

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.fillStyle = '#080810';
      ctx.fillRect(0, 0, w, h);

      nodes.forEach((node, i) => {
        nodes.forEach((other, j) => {
          if (other.layer === node.layer + 1) {
            const pulse = Math.sin(time * 3 + i * 0.2 + j * 0.1) * 0.5 + 0.5;
            const alpha = 0.03 + pulse * 0.04;
            ctx.strokeStyle = `rgba(100, 150, 200, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x * w, node.y * h);
            ctx.lineTo(other.x * w, other.y * h);
            ctx.stroke();
          }
        });
      });

      nodes.forEach((node, i) => {
        const x = node.x * w;
        const y = node.y * h;
        const pulse = Math.sin(time * 2 + i * 0.3) * 0.5 + 0.5;
        const size = 4 + pulse * 2;
        const alpha = 0.3 + pulse * 0.3;

        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80, 140, 200, ${alpha * 0.2})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 160, 220, ${alpha})`;
        ctx.fill();
      });

      time += 0.015;
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
      style={{ background: '#080810' }}
    />
  );
}
