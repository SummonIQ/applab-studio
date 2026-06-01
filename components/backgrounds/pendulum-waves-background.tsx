'use client';

import { useEffect, useRef } from 'react';

export function PendulumWavesBackground() {
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

    const pendulumCount = 25;
    const baseFrequency = 0.5;
    const frequencyIncrement = 0.02;

    const animate = () => {
      time += 0.02;

      // Dark background with gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0a0a15');
      bgGradient.addColorStop(1, '#151525');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height * 0.15;
      const pendulumSpacing = canvas.width / (pendulumCount + 1);
      const maxLength = canvas.height * 0.7;

      // Draw mounting bar
      ctx.strokeStyle = 'rgba(100, 100, 120, 0.5)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(pendulumSpacing * 0.5, centerY);
      ctx.lineTo(canvas.width - pendulumSpacing * 0.5, centerY);
      ctx.stroke();

      // Draw pendulums
      for (let i = 0; i < pendulumCount; i++) {
        const x = pendulumSpacing * (i + 1);
        const frequency = baseFrequency + i * frequencyIncrement;
        const length = maxLength - i * (maxLength * 0.02);
        const angle = Math.sin(time * frequency) * 0.6;

        const bobX = x + Math.sin(angle) * length;
        const bobY = centerY + Math.cos(angle) * length;

        // Draw string with gradient
        const stringGradient = ctx.createLinearGradient(x, centerY, bobX, bobY);
        stringGradient.addColorStop(0, 'rgba(150, 150, 170, 0.4)');
        stringGradient.addColorStop(1, 'rgba(150, 150, 170, 0.2)');
        ctx.strokeStyle = stringGradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, centerY);
        ctx.lineTo(bobX, bobY);
        ctx.stroke();

        // Draw bob with glow
        const hue = (i / pendulumCount) * 280 + 180; // Cyan to magenta
        const bobRadius = 12 + (pendulumCount - i) * 0.3;

        // Glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${hue}, 80%, 60%, 0.5)`;

        // Bob gradient
        const bobGradient = ctx.createRadialGradient(
          bobX - bobRadius * 0.3,
          bobY - bobRadius * 0.3,
          0,
          bobX,
          bobY,
          bobRadius
        );
        bobGradient.addColorStop(0, `hsla(${hue}, 70%, 75%, 0.95)`);
        bobGradient.addColorStop(0.6, `hsla(${hue}, 80%, 55%, 0.9)`);
        bobGradient.addColorStop(1, `hsla(${hue}, 90%, 35%, 0.85)`);

        ctx.beginPath();
        ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
        ctx.fillStyle = bobGradient;
        ctx.fill();

        ctx.shadowBlur = 0;

        // Highlight
        ctx.beginPath();
        ctx.arc(bobX - bobRadius * 0.3, bobY - bobRadius * 0.3, bobRadius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
      }

      // Draw wave trail at the bottom
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.15)';
      ctx.lineWidth = 2;
      for (let i = 0; i < pendulumCount; i++) {
        const x = pendulumSpacing * (i + 1);
        const frequency = baseFrequency + i * frequencyIncrement;
        const length = maxLength - i * (maxLength * 0.02);
        const angle = Math.sin(time * frequency) * 0.6;
        const bobX = x + Math.sin(angle) * length;
        const bobY = centerY + Math.cos(angle) * length;

        if (i === 0) {
          ctx.moveTo(bobX, bobY);
        } else {
          ctx.lineTo(bobX, bobY);
        }
      }
      ctx.stroke();

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
