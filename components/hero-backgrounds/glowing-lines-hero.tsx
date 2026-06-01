'use client';

import { useEffect, useRef } from 'react';

interface FlowLine {
  points: { x: number; y: number }[];
  width: number;
  hue: number;
  speed: number;
  opacity: number;
  offset: number;
}

interface Particle {
  x: number;
  y: number;
  lineIndex: number;
  progress: number;
  speed: number;
  size: number;
  hue: number;
}

interface Intersection {
  x: number;
  y: number;
  pulse: number;
  hue: number;
}

export function GlowingLinesHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const lines: FlowLine[] = [];
    const particles: Particle[] = [];
    const intersections: Intersection[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
      initializeLines();
    };

    const initializeLines = () => {
      lines.length = 0;
      intersections.length = 0;

      // Create flowing curved lines
      const lineCount = 8;

      for (let i = 0; i < lineCount; i++) {
        const points: { x: number; y: number }[] = [];
        const startY = (i / lineCount) * canvas.height + canvas.height * 0.1;
        const amplitude = 50 + Math.random() * 80;
        const frequency = 0.003 + Math.random() * 0.002;
        const phaseOffset = Math.random() * Math.PI * 2;

        // Generate smooth curve points
        for (let x = -100; x <= canvas.width + 100; x += 20) {
          const y = startY + Math.sin(x * frequency + phaseOffset) * amplitude +
                    Math.sin(x * frequency * 2 + phaseOffset * 0.5) * amplitude * 0.3;
          points.push({ x, y });
        }

        lines.push({
          points,
          width: 1.5 + Math.random() * 1.5,
          hue: 250 + i * 15 % 60, // Purple to blue range
          speed: 0.3 + Math.random() * 0.4,
          opacity: 0.15 + Math.random() * 0.15,
          offset: Math.random() * 1000,
        });
      }

      // Add some crossing diagonal lines
      for (let i = 0; i < 4; i++) {
        const points: { x: number; y: number }[] = [];
        const startX = canvas.width * (0.1 + i * 0.25);
        const direction = i % 2 === 0 ? 1 : -1;

        for (let t = 0; t <= 1; t += 0.02) {
          const x = startX + (t - 0.5) * canvas.width * 0.5;
          const y = t * canvas.height;
          const wave = Math.sin(t * Math.PI * 3) * 40;
          points.push({ x: x + wave * direction, y });
        }

        lines.push({
          points,
          width: 1 + Math.random(),
          hue: 280 + Math.random() * 40,
          speed: 0.2 + Math.random() * 0.3,
          opacity: 0.1 + Math.random() * 0.1,
          offset: Math.random() * 1000,
        });
      }

      // Initialize particles on lines
      lines.forEach((line, lineIndex) => {
        const particleCount = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: 0,
            y: 0,
            lineIndex,
            progress: Math.random(),
            speed: 0.002 + Math.random() * 0.003,
            size: 2 + Math.random() * 2,
            hue: line.hue,
          });
        }
      });
    };

    resize();
    window.addEventListener('resize', resize);

    const getPointOnLine = (line: FlowLine, progress: number) => {
      const idx = progress * (line.points.length - 1);
      const i = Math.floor(idx);
      const t = idx - i;

      if (i >= line.points.length - 1) return line.points[line.points.length - 1];
      if (i < 0) return line.points[0];

      const p1 = line.points[i];
      const p2 = line.points[i + 1];

      return {
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t,
      };
    };

    const animate = () => {
      time += 0.016;

      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw lines with flowing glow effect
      lines.forEach((line, lineIndex) => {
        // Draw multiple passes for glow
        for (let glow = 2; glow >= 0; glow--) {
          ctx.beginPath();

          const flowOffset = (time * line.speed * 100 + line.offset) % 200;

          line.points.forEach((point, i) => {
            // Add subtle animation to points
            const animatedY = point.y + Math.sin(time * 2 + i * 0.1 + lineIndex) * 3;

            if (i === 0) {
              ctx.moveTo(point.x, animatedY);
            } else {
              // Smooth curve
              const prev = line.points[i - 1];
              const prevY = prev.y + Math.sin(time * 2 + (i - 1) * 0.1 + lineIndex) * 3;
              const cpX = (prev.x + point.x) / 2;
              const cpY = (prevY + animatedY) / 2;
              ctx.quadraticCurveTo(prev.x, prevY, cpX, cpY);
            }
          });

          const glowWidth = line.width + glow * 4;
          const glowAlpha = line.opacity * (glow === 0 ? 1 : 0.3 / (glow + 1));

          ctx.strokeStyle = `hsla(${line.hue}, 70%, ${60 + glow * 10}%, ${glowAlpha})`;
          ctx.lineWidth = glowWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }

        // Draw flowing energy segments
        const segmentCount = 3;
        for (let s = 0; s < segmentCount; s++) {
          const segmentProgress = ((time * line.speed + s / segmentCount + line.offset * 0.001) % 1);
          const segmentLength = 0.15;
          const startProgress = segmentProgress;
          const endProgress = Math.min(1, segmentProgress + segmentLength);

          if (startProgress < 1) {
            ctx.beginPath();
            let first = true;

            for (let p = startProgress; p <= endProgress; p += 0.01) {
              const point = getPointOnLine(line, p);
              const animatedY = point.y + Math.sin(time * 2 + p * 10 + lineIndex) * 3;

              if (first) {
                ctx.moveTo(point.x, animatedY);
                first = false;
              } else {
                ctx.lineTo(point.x, animatedY);
              }
            }

            const t = (segmentProgress - startProgress) / segmentLength;
            const alpha = Math.sin(t * Math.PI) * 0.5;

            ctx.strokeStyle = `hsla(${line.hue}, 90%, 75%, ${alpha})`;
            ctx.lineWidth = line.width * 2;
            ctx.stroke();
          }
        }
      });

      // Update and draw particles
      particles.forEach(particle => {
        particle.progress += particle.speed;
        if (particle.progress > 1) particle.progress = 0;

        const line = lines[particle.lineIndex];
        if (!line) return;

        const point = getPointOnLine(line, particle.progress);
        const animatedY = point.y + Math.sin(time * 2 + particle.progress * 10 + particle.lineIndex) * 3;
        particle.x = point.x;
        particle.y = animatedY;

        // Particle glow
        const glowSize = particle.size * 6;
        const glow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        glow.addColorStop(0, `hsla(${particle.hue}, 90%, 80%, 0.6)`);
        glow.addColorStop(0.5, `hsla(${particle.hue}, 80%, 70%, 0.2)`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(particle.x - glowSize, particle.y - glowSize, glowSize * 2, glowSize * 2);

        // Particle core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 90%, 85%, 1)`;
        ctx.fill();
      });

      // Detect and highlight intersections (simplified)
      const intersectionThreshold = 30;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          if (particles[i].lineIndex === particles[j].lineIndex) continue;

          const dist = Math.hypot(
            particles[i].x - particles[j].x,
            particles[i].y - particles[j].y
          );

          if (dist < intersectionThreshold) {
            const midX = (particles[i].x + particles[j].x) / 2;
            const midY = (particles[i].y + particles[j].y) / 2;
            const intensity = 1 - dist / intersectionThreshold;

            // Draw intersection flash
            const flashGlow = ctx.createRadialGradient(midX, midY, 0, midX, midY, 30);
            flashGlow.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.5})`);
            flashGlow.addColorStop(0.5, `hsla(270, 80%, 70%, ${intensity * 0.3})`);
            flashGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = flashGlow;
            ctx.fillRect(midX - 30, midY - 30, 60, 60);
          }
        }
      }

      // Corner accent glows
      const corners = [
        { x: 0, y: 0, hue: 260 },
        { x: canvas.width, y: canvas.height, hue: 290 },
      ];

      corners.forEach(corner => {
        const gradient = ctx.createRadialGradient(
          corner.x, corner.y, 0,
          corner.x, corner.y, Math.min(canvas.width, canvas.height) * 0.4
        );
        gradient.addColorStop(0, `hsla(${corner.hue}, 60%, 50%, 0.12)`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
