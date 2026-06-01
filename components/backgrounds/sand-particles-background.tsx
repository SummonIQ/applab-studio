'use client';

import { useEffect, useRef } from 'react';

interface SandParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  windOffset: number;
  hue: number;
  brightness: number;
  layer: number;
}

export function SandParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const particles: SandParticle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particles.length === 0) initParticles();
    };

    const initParticles = () => {
      particles.length = 0;
      const layers = [
        { count: 150, speedMult: 0.3, sizeMult: 0.5 },
        { count: 200, speedMult: 0.6, sizeMult: 0.8 },
        { count: 250, speedMult: 1.0, sizeMult: 1.0 },
      ];

      layers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: (1 + Math.random() * 2) * layer.sizeMult,
            speed: (0.3 + Math.random() * 0.8) * layer.speedMult,
            windOffset: Math.random() * Math.PI * 2,
            hue: 30 + Math.random() * 25,
            brightness: 60 + Math.random() * 30,
            layer: layerIndex,
          });
        }
      });
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      time += 0.008;

      // Desert sunset gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#1a0a05');
      bgGradient.addColorStop(0.3, '#2a1510');
      bgGradient.addColorStop(0.6, '#3a2015');
      bgGradient.addColorStop(1, '#1a0a05');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle dune shapes
      ctx.fillStyle = 'rgba(60, 40, 25, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 50) {
        const duneY = canvas.height - 100 - Math.sin(x * 0.005 + time * 0.2) * 50 - Math.sin(x * 0.002) * 80;
        ctx.lineTo(x, duneY);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(80, 55, 35, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 50) {
        const duneY = canvas.height - 50 - Math.sin(x * 0.003 + 2 + time * 0.15) * 40 - Math.sin(x * 0.001 + 1) * 60;
        ctx.lineTo(x, duneY);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();

      const windStrength = Math.sin(time * 0.5) * 0.5 + 0.5;
      const windAngle = Math.sin(time * 0.3) * 0.3;

      particles.sort((a, b) => a.layer - b.layer);

      for (const p of particles) {
        const layerWind = (p.layer + 1) / 3;
        const windX = Math.sin(time * 0.8 + p.windOffset) * 2 * windStrength * layerWind;
        const windY = Math.cos(time * 0.3 + p.windOffset) * 0.5 * windStrength;
        const swirl = Math.sin(time + p.y * 0.01 + p.windOffset) * 1.5 * layerWind;

        p.x += windX + swirl + windAngle * p.speed;
        p.y -= p.speed + windY;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.x < -10) p.x = canvas.width + 10;

        const heightFade = Math.min(1, p.y / (canvas.height * 0.3));
        const opacity = [0.3, 0.5, 0.8][p.layer] * heightFade;

        if (p.size > 2) {
          ctx.shadowBlur = 3;
          ctx.shadowColor = `hsla(${p.hue}, 50%, ${p.brightness}%, 0.3)`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 45%, ${p.brightness}%, ${opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (let i = 0; i < 5; i++) {
        const glintPhase = Math.sin(time * 3 + i * 1.7);
        if (glintPhase > 0.95) {
          const gx = (Math.sin(i * 137.5 + time * 0.1) * 0.5 + 0.5) * canvas.width;
          const gy = (Math.cos(i * 97.3 + time * 0.05) * 0.5 + 0.5) * canvas.height;
          ctx.beginPath();
          ctx.arc(gx, gy, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 230, 180, ${(glintPhase - 0.95) * 10})`;
          ctx.fill();
        }
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
