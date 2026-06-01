'use client';

import { useEffect, useRef } from 'react';

interface EnergyStream {
  startCorner: number;
  endCorner: number;
  progress: number;
  speed: number;
  hue: number;
  width: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  size: number;
}

export function CornerGlowHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const streams: EnergyStream[] = [];
    const particles: Particle[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const corners = [
      { x: 0, y: 0, hue: 270 },           // Purple - top left
      { x: 1, y: 0, hue: 210 },           // Blue - top right
      { x: 0, y: 1, hue: 330 },           // Pink - bottom left
      { x: 1, y: 1, hue: 180 },           // Cyan - bottom right
    ];

    const getCornerPos = (index: number) => ({
      x: corners[index].x * canvas.width,
      y: corners[index].y * canvas.height,
    });

    const createStream = () => {
      const start = Math.floor(Math.random() * 4);
      let end = Math.floor(Math.random() * 4);
      while (end === start) end = Math.floor(Math.random() * 4);

      streams.push({
        startCorner: start,
        endCorner: end,
        progress: 0,
        speed: 0.003 + Math.random() * 0.004,
        hue: corners[start].hue,
        width: 1 + Math.random() * 2,
      });
    };

    // Initial streams
    for (let i = 0; i < 3; i++) createStream();

    const drawCornerGlow = (corner: typeof corners[0], index: number) => {
      const x = corner.x * canvas.width;
      const y = corner.y * canvas.height;
      const pulse = 0.7 + Math.sin(time * 2 + index * 1.5) * 0.3;
      const radius = Math.min(canvas.width, canvas.height) * 0.45 * pulse;

      // Multiple layered glows
      for (let layer = 0; layer < 3; layer++) {
        const layerRadius = radius * (1 - layer * 0.25);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, layerRadius);
        const alpha = (0.12 - layer * 0.03) * pulse;

        gradient.addColorStop(0, `hsla(${corner.hue}, 80%, 60%, ${alpha})`);
        gradient.addColorStop(0.4, `hsla(${corner.hue}, 70%, 50%, ${alpha * 0.5})`);
        gradient.addColorStop(0.7, `hsla(${corner.hue + 20}, 60%, 40%, ${alpha * 0.2})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Energy ring
      ctx.strokeStyle = `hsla(${corner.hue}, 70%, 60%, ${0.1 * pulse})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.6 + Math.sin(time * 3 + index) * 20, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawStream = (stream: EnergyStream) => {
      const start = getCornerPos(stream.startCorner);
      const end = getCornerPos(stream.endCorner);

      // Control points for curved path
      const cx = canvas.width / 2 + Math.sin(time + stream.startCorner) * 100;
      const cy = canvas.height / 2 + Math.cos(time + stream.endCorner) * 100;

      // Draw the energy stream as a curved path
      const points: { x: number; y: number }[] = [];
      for (let t = 0; t <= 1; t += 0.02) {
        const mt = 1 - t;
        points.push({
          x: mt * mt * start.x + 2 * mt * t * cx + t * t * end.x,
          y: mt * mt * start.y + 2 * mt * t * cy + t * t * end.y,
        });
      }

      // Draw glowing trail
      const trailLength = 0.3;
      const trailStart = Math.max(0, stream.progress - trailLength);
      const trailEnd = stream.progress;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 1; i < points.length; i++) {
        const t = i / points.length;
        if (t < trailStart || t > trailEnd) continue;

        const alpha = (1 - Math.abs(t - stream.progress) / trailLength) * 0.6;
        ctx.strokeStyle = `hsla(${stream.hue}, 80%, 65%, ${alpha})`;
        ctx.lineWidth = stream.width * (1 + alpha);

        ctx.beginPath();
        ctx.moveTo(points[i - 1].x, points[i - 1].y);
        ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
      }

      // Head glow
      const headIndex = Math.floor(stream.progress * (points.length - 1));
      if (headIndex >= 0 && headIndex < points.length) {
        const head = points[headIndex];
        const gradient = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 20);
        gradient.addColorStop(0, `hsla(${stream.hue}, 90%, 70%, 0.5)`);
        gradient.addColorStop(0.5, `hsla(${stream.hue}, 80%, 60%, 0.2)`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(head.x - 20, head.y - 20, 40, 40);

        // Spawn particles at head
        if (Math.random() < 0.3) {
          particles.push({
            x: head.x,
            y: head.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 30 + Math.random() * 20,
            maxLife: 50,
            hue: stream.hue,
            size: 1 + Math.random() * 2,
          });
        }
      }
    };

    const animate = () => {
      time += 0.016;

      // Background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Corner glows
      corners.forEach((corner, i) => drawCornerGlow(corner, i));

      // Update and draw streams
      for (let i = streams.length - 1; i >= 0; i--) {
        const stream = streams[i];
        stream.progress += stream.speed;

        if (stream.progress > 1.3) {
          streams.splice(i, 1);
          createStream();
        } else {
          drawStream(stream);
        }
      }

      // Ensure minimum streams
      while (streams.length < 3) createStream();

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          const alpha = (p.life / p.maxLife) * 0.6;
          ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Center convergence glow
      const centerPulse = 0.8 + Math.sin(time * 1.5) * 0.2;
      const centerGlow = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, 150 * centerPulse
      );
      centerGlow.addColorStop(0, `rgba(255, 255, 255, ${0.05 * centerPulse})`);
      centerGlow.addColorStop(0.5, `rgba(200, 180, 255, ${0.03 * centerPulse})`);
      centerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
