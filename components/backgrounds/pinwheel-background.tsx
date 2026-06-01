'use client';

import { useEffect, useRef } from 'react';

interface Pinwheel {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  blades: number;
  hue: number;
  depth: number;
}

export function PinwheelBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const pinwheels: Pinwheel[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (pinwheels.length === 0) initPinwheels();
    };

    const initPinwheels = () => {
      pinwheels.length = 0;
      const count = 12;
      for (let i = 0; i < count; i++) {
        pinwheels.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 60 + Math.random() * 120,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (0.5 + Math.random() * 1.5) * (Math.random() > 0.5 ? 1 : -1),
          blades: 4 + Math.floor(Math.random() * 5),
          hue: Math.random() * 360,
          depth: Math.random(),
        });
      }
      pinwheels.sort((a, b) => a.depth - b.depth);
    };

    resize();
    window.addEventListener('resize', resize);

    const drawPinwheel = (pw: Pinwheel) => {
      const { x, y, size, rotation, blades, hue, depth } = pw;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      const alpha = 0.4 + depth * 0.4;
      const scale = 0.7 + depth * 0.3;
      const scaledSize = size * scale;

      for (let i = 0; i < blades; i++) {
        const bladeAngle = (i / blades) * Math.PI * 2;
        const bladeHue = (hue + i * (360 / blades)) % 360;

        ctx.save();
        ctx.rotate(bladeAngle);

        ctx.beginPath();
        ctx.moveTo(0, 0);

        const bladeLength = scaledSize;
        const bladeWidth = scaledSize * 0.35;

        ctx.quadraticCurveTo(bladeWidth * 0.3, bladeLength * 0.4, bladeWidth * 0.1, bladeLength * 0.9);
        ctx.quadraticCurveTo(0, bladeLength, -bladeWidth * 0.05, bladeLength * 0.85);
        ctx.quadraticCurveTo(-bladeWidth * 0.15, bladeLength * 0.5, 0, 0);
        ctx.closePath();

        const bladeGradient = ctx.createLinearGradient(0, 0, bladeWidth * 0.2, bladeLength);
        bladeGradient.addColorStop(0, `hsla(${bladeHue}, 80%, 60%, ${alpha})`);
        bladeGradient.addColorStop(0.3, `hsla(${bladeHue}, 75%, 55%, ${alpha * 0.9})`);
        bladeGradient.addColorStop(0.7, `hsla(${bladeHue}, 70%, 45%, ${alpha * 0.8})`);
        bladeGradient.addColorStop(1, `hsla(${bladeHue + 20}, 65%, 35%, ${alpha * 0.6})`);

        ctx.fillStyle = bladeGradient;
        ctx.fill();

        ctx.strokeStyle = `hsla(${bladeHue}, 90%, 75%, ${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(bladeWidth * 0.15, bladeLength * 0.3, bladeWidth * 0.05, bladeLength * 0.7);
        ctx.strokeStyle = `hsla(${bladeHue}, 60%, 40%, ${alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }

      const hubSize = scaledSize * 0.12;
      const hubGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, hubSize);
      hubGradient.addColorStop(0, `hsla(${hue}, 30%, 90%, ${alpha})`);
      hubGradient.addColorStop(0.5, `hsla(${hue}, 25%, 70%, ${alpha})`);
      hubGradient.addColorStop(1, `hsla(${hue}, 20%, 50%, ${alpha})`);

      ctx.beginPath();
      ctx.arc(0, 0, hubSize, 0, Math.PI * 2);
      ctx.fillStyle = hubGradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(-hubSize * 0.3, -hubSize * 0.3, hubSize * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(0, 0%, 100%, ${alpha * 0.4})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, hubSize * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 30%, 30%, ${alpha})`;
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      time += 0.016;

      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, '#0f172a');
      bgGradient.addColorStop(0.5, '#1e1b4b');
      bgGradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const windStrength = Math.sin(time * 0.3) * 0.5 + 1;

      for (const pw of pinwheels) {
        const depthWind = pw.depth * windStrength;
        pw.rotation += pw.rotationSpeed * 0.02 * (0.5 + depthWind);

        pw.y += Math.sin(time + pw.x * 0.01) * 0.2;
        pw.x += Math.cos(time * 0.5 + pw.y * 0.01) * 0.15;

        if (pw.x < -pw.size) pw.x = canvas.width + pw.size;
        if (pw.x > canvas.width + pw.size) pw.x = -pw.size;
        if (pw.y < -pw.size) pw.y = canvas.height + pw.size;
        if (pw.y > canvas.height + pw.size) pw.y = -pw.size;

        pw.hue = (pw.hue + 0.1) % 360;

        drawPinwheel(pw);
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      for (let i = 0; i < 8; i++) {
        const sparkle = Math.sin(time * 4 + i * 1.3);
        if (sparkle > 0.9) {
          const sx = (Math.sin(i * 137.5) * 0.5 + 0.5) * canvas.width;
          const sy = (Math.cos(i * 97.3) * 0.5 + 0.5) * canvas.height;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.5 * (sparkle - 0.9) * 10, 0, Math.PI * 2);
          ctx.fill();
        }
      }

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
