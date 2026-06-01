'use client';

import { useEffect, useRef } from 'react';

export function NoiseGradientHero() {
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

    // Pre-generate noise texture
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 256;
    noiseCanvas.height = 256;
    const noiseCtx = noiseCanvas.getContext('2d')!;
    const noiseData = noiseCtx.createImageData(256, 256);

    for (let i = 0; i < noiseData.data.length; i += 4) {
      const value = Math.random() * 255;
      noiseData.data[i] = value;
      noiseData.data[i + 1] = value;
      noiseData.data[i + 2] = value;
      noiseData.data[i + 3] = 20;
    }
    noiseCtx.putImageData(noiseData, 0, 0);

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Animated gradient background
      const gradient = ctx.createLinearGradient(
        canvas.width * (0.3 + Math.sin(time) * 0.1),
        0,
        canvas.width * (0.7 + Math.cos(time * 0.8) * 0.1),
        canvas.height,
      );
      gradient.addColorStop(0, '#0f0f23');
      gradient.addColorStop(0.5, '#1a1a3e');
      gradient.addColorStop(1, '#0d0d1a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Color accents
      const accents = [
        { x: 0.2, y: 0.3, color: 'rgba(139, 92, 246, 0.15)' },
        { x: 0.8, y: 0.6, color: 'rgba(59, 130, 246, 0.12)' },
        { x: 0.5, y: 0.8, color: 'rgba(236, 72, 153, 0.1)' },
      ];

      accents.forEach((accent, i) => {
        const x = canvas.width * (accent.x + Math.sin(time + i) * 0.05);
        const y = canvas.height * (accent.y + Math.cos(time * 0.7 + i) * 0.05);

        const glow = ctx.createRadialGradient(x, y, 0, x, y, 300);
        glow.addColorStop(0, accent.color);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Overlay noise texture
      ctx.globalAlpha = 0.4;
      const pattern = ctx.createPattern(noiseCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.globalAlpha = 1;

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
