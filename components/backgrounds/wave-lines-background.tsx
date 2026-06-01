'use client';

import { useEffect, useRef } from 'react';

interface WaveLinesBackgroundProps {
  lineCount?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  speed?: number;
  lineColor?: string;
}

export function WaveLinesBackground({
  lineCount = 15,
  waveAmplitude = 50,
  waveFrequency = 0.01,
  speed = 0.02,
  lineColor = 'rgba(99, 102, 241, 0.3)',
}: WaveLinesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const offsetRef = useRef(0);

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

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      offsetRef.current += speed;

      for (let i = 0; i < lineCount; i++) {
        const yOffset = (canvas.height / (lineCount + 1)) * (i + 1);
        const phase = offsetRef.current + i * 0.5;

        ctx.beginPath();
        ctx.moveTo(0, yOffset);

        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            yOffset +
            Math.sin(x * waveFrequency + phase) * waveAmplitude +
            Math.sin(x * waveFrequency * 2 + phase * 1.5) * (waveAmplitude / 2);

          ctx.lineTo(x, y);
        }

        const opacity = 1 - i / lineCount;
        ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/g, `${opacity * 0.5})`);
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [lineCount, waveAmplitude, waveFrequency, speed, lineColor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'rgb(15, 23, 42)' }}
    />
  );
}
