'use client';

import { useEffect, useRef } from 'react';

interface BurstRay {
  angle: number;
  length: number;
  speed: number;
  width: number;
  hue: number;
  phase: number;
}

interface EnergyPulse {
  radius: number;
  maxRadius: number;
  opacity: number;
  hue: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
  size: number;
}

export function RadialBurstHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const rays: BurstRay[] = [];
    const pulses: EnergyPulse[] = [];
    const sparks: Spark[] = [];
    let lastPulseTime = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
      initializeRays();
    };

    const initializeRays = () => {
      rays.length = 0;
      const rayCount = 72;

      for (let i = 0; i < rayCount; i++) {
        rays.push({
          angle: (i / rayCount) * Math.PI * 2,
          length: 200 + Math.random() * 200,
          speed: 0.5 + Math.random() * 1,
          width: 1 + Math.random() * 2,
          hue: 260 + Math.random() * 40, // Purple range
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const spawnSparks = (cx: number, cy: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        sparks.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          hue: 260 + Math.random() * 60,
          size: 1 + Math.random() * 2,
        });
      }
    };

    const animate = () => {
      time += 0.016;
      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.4;

      // Background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw rays with dynamic behavior
      rays.forEach((ray, i) => {
        const pulseFactor = Math.sin(time * ray.speed + ray.phase) * 0.3 + 0.7;
        const currentLength = ray.length * pulseFactor;
        const breathe = Math.sin(time * 0.5 + i * 0.1) * 0.2 + 0.8;

        // Inner starting point
        const innerRadius = 40 + Math.sin(time * 2 + ray.angle * 3) * 10;
        const x1 = cx + Math.cos(ray.angle + Math.sin(time * 0.3) * 0.02) * innerRadius;
        const y1 = cy + Math.sin(ray.angle + Math.sin(time * 0.3) * 0.02) * innerRadius;

        // Outer point
        const x2 = cx + Math.cos(ray.angle) * (innerRadius + currentLength);
        const y2 = cy + Math.sin(ray.angle) * (innerRadius + currentLength);

        // Ray gradient
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        const alpha = 0.4 * breathe;
        gradient.addColorStop(0, `hsla(${ray.hue}, 80%, 60%, ${alpha})`);
        gradient.addColorStop(0.3, `hsla(${ray.hue + 10}, 70%, 55%, ${alpha * 0.5})`);
        gradient.addColorStop(0.7, `hsla(${ray.hue + 20}, 60%, 50%, ${alpha * 0.2})`);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = ray.width * pulseFactor;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Bright tip
        if (pulseFactor > 0.8) {
          const tipGlow = ctx.createRadialGradient(x2, y2, 0, x2, y2, 8);
          tipGlow.addColorStop(0, `hsla(${ray.hue}, 90%, 70%, ${0.3 * pulseFactor})`);
          tipGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = tipGlow;
          ctx.fillRect(x2 - 8, y2 - 8, 16, 16);
        }
      });

      // Concentric rotating rings
      for (let i = 0; i < 4; i++) {
        const ringRadius = 60 + i * 50 + Math.sin(time + i) * 10;
        const rotation = time * (0.2 + i * 0.1) * (i % 2 === 0 ? 1 : -1);

        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, rotation, rotation + Math.PI * 1.5);
        ctx.strokeStyle = `hsla(${260 + i * 15}, 60%, 50%, ${0.15 - i * 0.03})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ring markers
        const markerCount = 4 + i * 2;
        for (let j = 0; j < markerCount; j++) {
          const markerAngle = rotation + (j / markerCount) * Math.PI * 2;
          const mx = cx + Math.cos(markerAngle) * ringRadius;
          const my = cy + Math.sin(markerAngle) * ringRadius;

          ctx.beginPath();
          ctx.arc(mx, my, 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${260 + i * 15}, 70%, 60%, ${0.4 - i * 0.08})`;
          ctx.fill();
        }
      }

      // Energy pulses
      if (time - lastPulseTime > 2) {
        pulses.push({
          radius: 40,
          maxRadius: 350,
          opacity: 0.5,
          hue: 260 + Math.random() * 40,
        });
        lastPulseTime = time;
        spawnSparks(cx, cy, 12);
      }

      // Update and draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.radius += 4;
        pulse.opacity = 0.5 * (1 - pulse.radius / pulse.maxRadius);

        if (pulse.radius > pulse.maxRadius) {
          pulses.splice(i, 1);
          continue;
        }

        // Pulse ring
        ctx.beginPath();
        ctx.arc(cx, cy, pulse.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${pulse.hue}, 70%, 60%, ${pulse.opacity})`;
        ctx.lineWidth = 3 * (1 - pulse.radius / pulse.maxRadius);
        ctx.stroke();

        // Inner glow
        const pulseGlow = ctx.createRadialGradient(
          cx, cy, pulse.radius - 20,
          cx, cy, pulse.radius + 20
        );
        pulseGlow.addColorStop(0, 'transparent');
        pulseGlow.addColorStop(0.5, `hsla(${pulse.hue}, 60%, 50%, ${pulse.opacity * 0.3})`);
        pulseGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = pulseGlow;
        ctx.fillRect(cx - pulse.radius - 20, cy - pulse.radius - 20,
          (pulse.radius + 20) * 2, (pulse.radius + 20) * 2);
      }

      // Update and draw sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vx *= 0.98;
        spark.vy *= 0.98;
        spark.life -= 0.02;

        if (spark.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        // Spark with trail
        const alpha = spark.life;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${spark.hue}, 80%, 70%, ${alpha})`;
        ctx.fill();

        // Glow
        const sparkGlow = ctx.createRadialGradient(
          spark.x, spark.y, 0,
          spark.x, spark.y, spark.size * 4
        );
        sparkGlow.addColorStop(0, `hsla(${spark.hue}, 80%, 70%, ${alpha * 0.5})`);
        sparkGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = sparkGlow;
        ctx.fillRect(spark.x - spark.size * 4, spark.y - spark.size * 4,
          spark.size * 8, spark.size * 8);
      }

      // Center core
      const coreSize = 35 + Math.sin(time * 3) * 5;

      // Outer glow layers
      for (let i = 3; i >= 0; i--) {
        const glowSize = coreSize * (2 + i * 0.8);
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize);
        glow.addColorStop(0, `hsla(${260 + i * 5}, 80%, 60%, ${0.2 - i * 0.04})`);
        glow.addColorStop(0.5, `hsla(${270 + i * 5}, 70%, 50%, ${0.1 - i * 0.02})`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(cx - glowSize, cy - glowSize, glowSize * 2, glowSize * 2);
      }

      // Core
      const coreGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize);
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      coreGradient.addColorStop(0.3, 'hsla(270, 90%, 70%, 0.8)');
      coreGradient.addColorStop(0.7, 'hsla(260, 80%, 55%, 0.6)');
      coreGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, coreSize, 0, Math.PI * 2);
      ctx.fill();

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
