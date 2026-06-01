'use client';

import { useEffect, useRef } from 'react';

interface Signal {
  path: { x: number; y: number }[];
  position: number;
  speed: number;
  hue: number;
  width: number;
}

export function CircuitTraceHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let signals: Signal[] = [];
    const gridSize = 30;

    const initCanvas = () => {
      const parent = canvas.parentElement; canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
      initSignals();
    };

    let resizeTimeout: NodeJS.Timeout;
    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initCanvas, 100);
    };

    const initSignals = () => {
      signals = [];
      const w = canvas.width;
      const h = canvas.height;

      // Create signal paths that look like data bus traces
      for (let i = 0; i < 12; i++) {
        const path: { x: number; y: number }[] = [];
        const startFromLeft = Math.random() > 0.5;
        let x = startFromLeft ? -50 : w + 50;
        let y = gridSize * (3 + Math.floor(Math.random() * (h / gridSize - 6)));

        path.push({ x, y });

        // Create orthogonal path segments
        const targetX = startFromLeft ? w + 50 : -50;
        while (
          (startFromLeft && x < targetX) ||
          (!startFromLeft && x > targetX)
        ) {
          // Horizontal segment
          const hDist = (100 + Math.random() * 200) * (startFromLeft ? 1 : -1);
          x += hDist;
          path.push({ x, y });

          // Maybe add vertical jog
          if (Math.random() > 0.4) {
            const vDist =
              (Math.random() > 0.5 ? 1 : -1) *
              gridSize *
              (1 + Math.floor(Math.random() * 3));
            y = Math.max(gridSize * 2, Math.min(h - gridSize * 2, y + vDist));
            path.push({ x, y });
          }
        }

        signals.push({
          path,
          position: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          hue: [200, 260, 180, 320][i % 4],
          width: 2 + Math.random() * 2,
        });
      }
    };

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Dark background with subtle blue tint
      ctx.fillStyle = '#080a10';
      ctx.fillRect(0, 0, w, h);

      // Draw subtle dot grid
      ctx.fillStyle = 'rgba(60, 80, 100, 0.15)';
      for (let x = gridSize; x < w; x += gridSize) {
        for (let y = gridSize; y < h; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw each signal
      signals.forEach(signal => {
        signal.position += signal.speed;
        if (signal.position > 1.2) signal.position = -0.2;

        // Calculate total path length
        let totalLength = 0;
        for (let i = 1; i < signal.path.length; i++) {
          totalLength += Math.hypot(
            signal.path[i].x - signal.path[i - 1].x,
            signal.path[i].y - signal.path[i - 1].y,
          );
        }

        // Draw the static trace line (dim)
        ctx.strokeStyle = `hsla(${signal.hue}, 60%, 40%, 0.04)`;
        ctx.lineWidth = signal.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        signal.path.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // Draw the signal pulse
        const pulseStart = signal.position * totalLength;
        const pulseLength = 80;

        let traveled = 0;
        for (let i = 1; i < signal.path.length; i++) {
          const prev = signal.path[i - 1];
          const curr = signal.path[i];
          const segLen = Math.hypot(curr.x - prev.x, curr.y - prev.y);

          // Check if pulse is in this segment
          const segStart = traveled;
          const segEnd = traveled + segLen;

          if (pulseStart + pulseLength > segStart && pulseStart < segEnd) {
            const startT = Math.max(0, (pulseStart - segStart) / segLen);
            const endT = Math.min(
              1,
              (pulseStart + pulseLength - segStart) / segLen,
            );

            const x1 = prev.x + (curr.x - prev.x) * startT;
            const y1 = prev.y + (curr.y - prev.y) * startT;
            const x2 = prev.x + (curr.x - prev.x) * endT;
            const y2 = prev.y + (curr.y - prev.y) * endT;

            // Glowing pulse line
            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, `hsla(${signal.hue}, 80%, 60%, 0)`);
            gradient.addColorStop(0.3, `hsla(${signal.hue}, 80%, 60%, 0.3)`);
            gradient.addColorStop(0.7, `hsla(${signal.hue}, 80%, 60%, 0.3)`);
            gradient.addColorStop(1, `hsla(${signal.hue}, 80%, 60%, 0)`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = signal.width + 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Glow effect
            ctx.shadowColor = `hsla(${signal.hue}, 80%, 60%, 0.3)`;
            ctx.shadowBlur = 15;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }

          traveled += segLen;
        }

        // Draw connection nodes at corners
        ctx.fillStyle = `hsla(${signal.hue}, 60%, 50%, 0.1)`;
        signal.path.forEach((p, i) => {
          if (i > 0 && i < signal.path.length - 1) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    initCanvas();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
