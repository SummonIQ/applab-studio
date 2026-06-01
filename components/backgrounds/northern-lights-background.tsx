'use client';

import { useEffect, useRef } from 'react';

export function NorthernLightsBackground() {
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

    const curtains = Array.from({ length: 5 }, (_, i) => ({
      offset: i * 200,
      speed: 0.5 + Math.random() * 0.5,
      amplitude: 50 + Math.random() * 50,
      color: i % 2 === 0 ? 'green' : 'purple',
    }));

    const animate = () => {
      time += 0.01;

      // Night sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, '#000510');
      skyGradient.addColorStop(0.5, '#051020');
      skyGradient.addColorStop(1, '#0a1525');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 200; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 97.3) % canvas.height;
        const twinkle = Math.sin(time * 2 + i) * 0.5 + 0.5;
        ctx.globalAlpha = twinkle * 0.8;
        ctx.beginPath();
        ctx.arc(x, y, 0.5 + twinkle * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Aurora curtains
      curtains.forEach((curtain, curtainIndex) => {
        const points: { x: number; y: number; intensity: number }[] = [];

        for (let x = -50; x <= canvas.width + 50; x += 10) {
          const baseY = canvas.height * 0.3;
          const wave1 =
            Math.sin((x + curtain.offset) * 0.01 + time * curtain.speed) *
            curtain.amplitude;
          const wave2 =
            Math.sin((x + curtain.offset) * 0.02 + time * curtain.speed * 1.3) *
            (curtain.amplitude * 0.5);
          const wave3 =
            Math.sin((x + curtain.offset) * 0.005 + time * 0.5) *
            (curtain.amplitude * 0.3);

          const y = baseY + wave1 + wave2 + wave3;
          const intensity = 0.3 + Math.sin((x + time * 50) * 0.02) * 0.3;

          points.push({ x, y, intensity });
        }

        // Draw aurora
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];

          const gradient = ctx.createLinearGradient(
            p1.x,
            p1.y,
            p1.x,
            p1.y + 300,
          );

          if (curtain.color === 'green') {
            gradient.addColorStop(
              0,
              `rgba(0, 255, 128, ${p1.intensity * 0.6})`,
            );
            gradient.addColorStop(
              0.3,
              `rgba(0, 200, 100, ${p1.intensity * 0.4})`,
            );
            gradient.addColorStop(
              0.6,
              `rgba(50, 150, 200, ${p1.intensity * 0.2})`,
            );
            gradient.addColorStop(1, 'rgba(0, 50, 100, 0)');
          } else {
            gradient.addColorStop(
              0,
              `rgba(150, 50, 255, ${p1.intensity * 0.5})`,
            );
            gradient.addColorStop(
              0.3,
              `rgba(100, 0, 200, ${p1.intensity * 0.3})`,
            );
            gradient.addColorStop(
              0.6,
              `rgba(0, 100, 200, ${p1.intensity * 0.15})`,
            );
            gradient.addColorStop(1, 'rgba(0, 50, 100, 0)');
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p2.x, p2.y + 300);
          ctx.lineTo(p1.x, p1.y + 300);
          ctx.closePath();
          ctx.fill();
        }
      });

      // Foreground mountains silhouette
      ctx.fillStyle = '#050a10';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width; x += 50) {
        const height = 50 + Math.sin(x * 0.01) * 30 + Math.sin(x * 0.03) * 20;
        ctx.lineTo(x, canvas.height - height);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();

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
