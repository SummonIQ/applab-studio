'use client';

import { useEffect, useRef } from 'react';

interface Koi {
  x: number;
  y: number;
  angle: number;
  speed: number;
  turnSpeed: number;
  targetTurn: number;
  size: number;
  bodyHue: number;
  pattern: 'kohaku' | 'sanke' | 'showa' | 'tancho';
  tailPhase: number;
  depth: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export function KoiPondHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const ripples: Ripple[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const patterns: Koi['pattern'][] = ['kohaku', 'sanke', 'showa', 'tancho'];
    const koi: Koi[] = Array.from({ length: 7 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      angle: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.4,
      turnSpeed: 0,
      targetTurn: (Math.random() - 0.5) * 0.015,
      size: 25 + Math.random() * 20,
      bodyHue: Math.random() > 0.3 ? 15 + Math.random() * 20 : 0,
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
      tailPhase: Math.random() * Math.PI * 2,
      depth: 0.5 + Math.random() * 0.5,
    }));

    const drawKoi = (k: Koi) => {
      ctx.save();
      ctx.translate(k.x, k.y);
      ctx.rotate(k.angle);

      const tailWave = Math.sin(time * 4 + k.tailPhase) * 0.3;
      const alpha = 0.15 + k.depth * 0.15;

      // Shadow/depth effect
      ctx.fillStyle = `rgba(0, 20, 40, ${alpha * 0.3})`;
      ctx.beginPath();
      ctx.ellipse(3, 3, k.size * 0.9, k.size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body
      const bodyGradient = ctx.createLinearGradient(-k.size, 0, k.size, 0);
      if (k.pattern === 'kohaku' || k.pattern === 'tancho') {
        bodyGradient.addColorStop(0, `hsla(0, 0%, 95%, ${alpha})`);
        bodyGradient.addColorStop(0.3, `hsla(${k.bodyHue}, 85%, 55%, ${alpha})`);
        bodyGradient.addColorStop(0.6, `hsla(0, 0%, 95%, ${alpha})`);
        bodyGradient.addColorStop(1, `hsla(${k.bodyHue}, 85%, 55%, ${alpha})`);
      } else {
        bodyGradient.addColorStop(0, `hsla(${k.bodyHue}, 80%, 50%, ${alpha})`);
        bodyGradient.addColorStop(0.5, `hsla(0, 0%, 95%, ${alpha})`);
        bodyGradient.addColorStop(1, `hsla(0, 0%, 15%, ${alpha})`);
      }
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, k.size, k.size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = `hsla(${k.bodyHue}, 75%, 60%, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(k.size * 0.7, 0, k.size * 0.35, k.size * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tancho spot
      if (k.pattern === 'tancho') {
        ctx.fillStyle = `hsla(0, 85%, 50%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(k.size * 0.6, 0, k.size * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tail
      ctx.save();
      ctx.translate(-k.size * 0.8, 0);
      ctx.rotate(tailWave);
      ctx.fillStyle = `hsla(${k.bodyHue}, 70%, 55%, ${alpha * 0.8})`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-k.size * 0.4, -k.size * 0.3, -k.size * 0.5, -k.size * 0.35);
      ctx.quadraticCurveTo(-k.size * 0.3, 0, -k.size * 0.5, k.size * 0.35);
      ctx.quadraticCurveTo(-k.size * 0.4, k.size * 0.3, 0, 0);
      ctx.fill();
      ctx.restore();

      // Dorsal fin
      ctx.fillStyle = `hsla(${k.bodyHue}, 60%, 50%, ${alpha * 0.6})`;
      ctx.beginPath();
      ctx.moveTo(k.size * 0.2, -k.size * 0.3);
      ctx.quadraticCurveTo(0, -k.size * 0.5, -k.size * 0.2, -k.size * 0.35);
      ctx.lineTo(-k.size * 0.1, -k.size * 0.3);
      ctx.fill();

      // Eye
      ctx.fillStyle = `rgba(20, 20, 30, ${alpha})`;
      ctx.beginPath();
      ctx.arc(k.size * 0.75, -k.size * 0.08, k.size * 0.05, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawRipple = (r: Ripple) => {
      ctx.strokeStyle = `rgba(150, 180, 200, ${r.opacity * 0.15})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawWaterSurface = () => {
      // Caustics/light patterns
      for (let i = 0; i < 8; i++) {
        const x = (Math.sin(time * 0.3 + i * 1.5) * 0.3 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.25 + i * 1.2) * 0.3 + 0.5) * canvas.height;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 150);
        gradient.addColorStop(0, 'rgba(100, 150, 180, 0.03)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    const animate = () => {
      time += 0.016;

      // Pond water gradient
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      bgGradient.addColorStop(0, '#0a1520');
      bgGradient.addColorStop(0.5, '#081018');
      bgGradient.addColorStop(1, '#050a10');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawWaterSurface();

      // Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 1;
        r.opacity = 1 - r.radius / r.maxRadius;
        if (r.opacity <= 0) {
          ripples.splice(i, 1);
        } else {
          drawRipple(r);
        }
      }

      // Random ripples
      if (Math.random() < 0.02) {
        ripples.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 0,
          maxRadius: 50 + Math.random() * 50,
          opacity: 1,
        });
      }

      // Sort by depth for proper layering
      koi.sort((a, b) => a.depth - b.depth);

      koi.forEach(k => {
        // Smooth turning
        if (Math.random() < 0.01) {
          k.targetTurn = (Math.random() - 0.5) * 0.02;
        }
        k.turnSpeed += (k.targetTurn - k.turnSpeed) * 0.05;
        k.angle += k.turnSpeed;
        k.x += Math.cos(k.angle) * k.speed;
        k.y += Math.sin(k.angle) * k.speed;

        // Wrap around
        if (k.x < -60) k.x = canvas.width + 60;
        if (k.x > canvas.width + 60) k.x = -60;
        if (k.y < -60) k.y = canvas.height + 60;
        if (k.y > canvas.height + 60) k.y = -60;

        // Occasional ripple from koi
        if (Math.random() < 0.005) {
          ripples.push({
            x: k.x,
            y: k.y,
            radius: 0,
            maxRadius: 30,
            opacity: 1,
          });
        }

        drawKoi(k);
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
