'use client';

import { useEffect, useRef } from 'react';

export function BreathingCirclesBackground() {
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

    const ringCount = 15;
    const pulseGroups = 3;

    const animate = () => {
      time += 0.015;

      // Deep gradient background
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.7
      );
      bgGradient.addColorStop(0, '#0a0a18');
      bgGradient.addColorStop(0.5, '#0f0f20');
      bgGradient.addColorStop(1, '#050510');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.45;

      // Draw multiple pulse groups for depth
      for (let g = 0; g < pulseGroups; g++) {
        const groupOffset = (g / pulseGroups) * Math.PI * 2;
        const groupScale = 1 - g * 0.15;

        for (let i = ringCount - 1; i >= 0; i--) {
          const baseRadius = (i / ringCount) * maxRadius * groupScale;

          // Breathing effect with wave propagation
          const breathPhase = time * 1.5 - i * 0.15 + groupOffset;
          const breathing = Math.sin(breathPhase) * 0.3 + 1;
          const secondaryBreath = Math.sin(breathPhase * 0.5 + i * 0.1) * 0.1;
          const radius = baseRadius * (breathing + secondaryBreath);

          // Calculate ring properties
          const normalizedI = i / ringCount;
          const hue = (240 + normalizedI * 80 + time * 20 + g * 40) % 360;
          const saturation = 60 + normalizedI * 20;
          const lightness = 50 + normalizedI * 15;

          // Pulse intensity
          const pulseIntensity = (Math.sin(breathPhase) + 1) / 2;
          const alpha = (0.15 + pulseIntensity * 0.25) * (1 - g * 0.2);

          // Draw glow layer
          if (pulseIntensity > 0.5) {
            ctx.shadowBlur = 30 * pulseIntensity;
            ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.5})`;
          }

          // Ring gradient for 3D effect
          const ringGradient = ctx.createRadialGradient(
            cx - radius * 0.1, cy - radius * 0.1, radius * 0.8,
            cx, cy, radius * 1.1
          );
          ringGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 10}%, ${alpha * 0.3})`);
          ringGradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`);
          ringGradient.addColorStop(1, `hsla(${hue - 20}, ${saturation}%, ${lightness - 10}%, ${alpha * 0.5})`);

          // Draw ring
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = ringGradient;
          ctx.lineWidth = 3 + pulseIntensity * 3 - g;
          ctx.stroke();

          ctx.shadowBlur = 0;

          // Inner glow on expanded rings
          if (pulseIntensity > 0.7 && g === 0) {
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${hue}, 90%, 80%, ${(pulseIntensity - 0.7) * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Central core glow
      const corePhase = Math.sin(time * 2) * 0.5 + 0.5;
      const coreGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius * 0.2);
      coreGradient.addColorStop(0, `hsla(280, 80%, 70%, ${0.3 + corePhase * 0.3})`);
      coreGradient.addColorStop(0.5, `hsla(260, 70%, 50%, ${0.1 + corePhase * 0.15})`);
      coreGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Subtle particle field
      ctx.fillStyle = 'rgba(200, 180, 255, 0.3)';
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2 + time * 0.2;
        const dist = maxRadius * (0.3 + Math.sin(time + i * 0.5) * 0.15);
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;
        const size = 1 + Math.sin(time * 2 + i) * 0.5;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

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
