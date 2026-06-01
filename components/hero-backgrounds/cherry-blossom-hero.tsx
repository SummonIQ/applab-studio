'use client';

import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  rotation: number;
  rotSpeed: number;
  fallSpeed: number;
  swayPhase: number;
  swayAmount: number;
  size: number;
  hue: number;
  saturation: number;
  lightness: number;
  opacity: number;
  flutter: number;
  depth: number;
}

export function CherryBlossomHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createPetal = (randomY = false): Petal => ({
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : -30 - Math.random() * 100,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      fallSpeed: 0.3 + Math.random() * 0.5,
      swayPhase: Math.random() * Math.PI * 2,
      swayAmount: 1 + Math.random() * 2,
      size: 6 + Math.random() * 10,
      hue: 340 + Math.random() * 20,
      saturation: 70 + Math.random() * 20,
      lightness: 80 + Math.random() * 15,
      opacity: 0.15 + Math.random() * 0.2,
      flutter: Math.random() * Math.PI * 2,
      depth: 0.3 + Math.random() * 0.7,
    });

    const petals: Petal[] = Array.from({ length: 40 }, () => createPetal(true));

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      const scale = 0.7 + p.depth * 0.5;
      const alpha = p.opacity * (0.5 + p.depth * 0.5);

      // Petal shape - sakura petal with notch
      ctx.beginPath();
      const s = p.size * scale;

      // Draw sakura petal shape
      ctx.moveTo(0, -s * 0.8);
      ctx.bezierCurveTo(s * 0.5, -s * 0.6, s * 0.6, -s * 0.2, s * 0.5, s * 0.2);
      ctx.bezierCurveTo(s * 0.4, s * 0.4, s * 0.1, s * 0.5, 0, s * 0.3);
      ctx.bezierCurveTo(-s * 0.1, s * 0.5, -s * 0.4, s * 0.4, -s * 0.5, s * 0.2);
      ctx.bezierCurveTo(-s * 0.6, -s * 0.2, -s * 0.5, -s * 0.6, 0, -s * 0.8);

      // Gradient fill
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
      gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, 95%, ${alpha})`);
      gradient.addColorStop(0.5, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${alpha})`);
      gradient.addColorStop(1, `hsla(${p.hue - 10}, ${p.saturation}%, ${p.lightness - 10}%, ${alpha * 0.8})`);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Center line
      ctx.strokeStyle = `hsla(${p.hue - 10}, 60%, 70%, ${alpha * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.5);
      ctx.lineTo(0, s * 0.2);
      ctx.stroke();

      ctx.restore();
    };

    const drawBranch = () => {
      // Decorative branch in corner
      ctx.save();
      ctx.strokeStyle = 'rgba(80, 50, 40, 0.15)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.3);
      ctx.quadraticCurveTo(
        canvas.width * 0.15,
        canvas.height * 0.15,
        canvas.width * 0.3,
        canvas.height * 0.05
      );
      ctx.stroke();

      // Small branches
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.1, canvas.height * 0.2);
      ctx.quadraticCurveTo(
        canvas.width * 0.15,
        canvas.height * 0.12,
        canvas.width * 0.18,
        canvas.height * 0.08
      );
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      time += 0.016;

      // Gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, '#0f0a12');
      bgGradient.addColorStop(0.5, '#0a0810');
      bgGradient.addColorStop(1, '#080610');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Soft pink ambient glow
      const glowGradient = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.2, 0,
        canvas.width * 0.3, canvas.height * 0.2, canvas.width * 0.5
      );
      glowGradient.addColorStop(0, 'rgba(255, 180, 200, 0.03)');
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawBranch();

      // Sort by depth
      petals.sort((a, b) => a.depth - b.depth);

      petals.forEach(p => {
        // Falling with wind
        p.y += p.fallSpeed * (0.8 + p.depth * 0.4);
        p.x += Math.sin(time * 2 + p.swayPhase) * p.swayAmount;
        p.x += 0.3 * p.depth; // Drift right

        // Flutter rotation
        p.flutter += 0.1;
        p.rotation += p.rotSpeed + Math.sin(p.flutter) * 0.02;

        // Reset when off screen
        if (p.y > canvas.height + 30 || p.x > canvas.width + 30) {
          Object.assign(p, createPetal());
          p.x = Math.random() * canvas.width * 1.2 - canvas.width * 0.2;
        }

        drawPetal(p);
      });

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
