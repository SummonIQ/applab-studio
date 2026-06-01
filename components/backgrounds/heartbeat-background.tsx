'use client';

import { useEffect, useRef } from 'react';

export function HeartbeatBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const getHeartbeatY = (x: number): number => {
      const phase = x % 1;

      if (phase < 0.1) return 0;
      if (phase < 0.18) {
        const t = (phase - 0.1) / 0.08;
        return Math.sin(t * Math.PI) * 0.15;
      }
      if (phase < 0.22) return 0;
      if (phase < 0.26) {
        const t = (phase - 0.22) / 0.04;
        return -Math.sin(t * Math.PI) * 0.1;
      }
      if (phase < 0.34) {
        const t = (phase - 0.26) / 0.08;
        return Math.sin(t * Math.PI) * 1.0;
      }
      if (phase < 0.40) {
        const t = (phase - 0.34) / 0.06;
        return -Math.sin(t * Math.PI) * 0.25;
      }
      if (phase < 0.48) return 0;
      if (phase < 0.62) {
        const t = (phase - 0.48) / 0.14;
        return Math.sin(t * Math.PI) * 0.3;
      }
      return 0;
    };

    const drawHeartbeatLine = (
      yOffset: number,
      amplitude: number,
      speed: number,
      hue: number,
      alpha: number,
      lineWidth: number
    ) => {
      const cycle = (time * speed) % 1;
      const waveWidth = canvas.width * 1.2;
      const offset = cycle * (waveWidth / 3);

      ctx.beginPath();
      ctx.strokeStyle = `hsla(${hue}, 80%, 55%, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.shadowBlur = 15;
      ctx.shadowColor = `hsla(${hue}, 100%, 50%, ${alpha * 0.5})`;

      for (let x = -50; x <= canvas.width + 50; x += 2) {
        const normalizedX = ((x + offset) % waveWidth) / waveWidth;
        const y = yOffset + getHeartbeatY(normalizedX) * amplitude;

        if (x === -50) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const drawPulsingHeart = () => {
      const cx = canvas.width * 0.85;
      const cy = canvas.height * 0.2;
      const beatPhase = (time * 1.2) % 1;
      let scale = 1;

      if (beatPhase < 0.1) {
        scale = 1 + Math.sin(beatPhase * Math.PI / 0.1) * 0.15;
      } else if (beatPhase < 0.25) {
        scale = 1 + Math.sin((beatPhase - 0.1) * Math.PI / 0.15) * 0.1;
      }

      const size = 30 * scale;

      ctx.save();
      ctx.translate(cx, cy);

      ctx.shadowBlur = 25;
      ctx.shadowColor = 'rgba(255, 50, 100, 0.6)';

      ctx.beginPath();
      ctx.moveTo(0, size * 0.3);
      ctx.bezierCurveTo(-size * 0.1, -size * 0.3, -size, -size * 0.3, -size, size * 0.1);
      ctx.bezierCurveTo(-size, size * 0.6, 0, size, 0, size);
      ctx.bezierCurveTo(0, size, size, size * 0.6, size, size * 0.1);
      ctx.bezierCurveTo(size, -size * 0.3, size * 0.1, -size * 0.3, 0, size * 0.3);

      const gradient = ctx.createRadialGradient(0, size * 0.3, 0, 0, size * 0.3, size);
      gradient.addColorStop(0, 'rgba(255, 100, 150, 0.9)');
      gradient.addColorStop(0.5, 'rgba(220, 50, 100, 0.8)');
      gradient.addColorStop(1, 'rgba(180, 30, 80, 0.7)');
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      time += 0.008;

      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, '#0a0510');
      bgGradient.addColorStop(0.5, '#100815');
      bgGradient.addColorStop(1, '#0a0510');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2;

      drawHeartbeatLine(centerY - 150, 40, 0.15, 340, 0.15, 1);
      drawHeartbeatLine(centerY + 150, 35, 0.18, 350, 0.15, 1);
      drawHeartbeatLine(centerY - 80, 55, 0.2, 350, 0.25, 1.5);
      drawHeartbeatLine(centerY + 80, 50, 0.22, 345, 0.25, 1.5);
      drawHeartbeatLine(centerY, 80, 0.25, 355, 0.8, 2.5);
      drawHeartbeatLine(centerY + 5, 75, 0.25, 0, 0.3, 2);

      drawPulsingHeart();

      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = 'rgba(255, 100, 150, 0.7)';
      ctx.textAlign = 'left';
      const bpm = 72 + Math.floor(Math.sin(time * 0.5) * 5);
      ctx.fillText(`${bpm} BPM`, 30, 50);

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
