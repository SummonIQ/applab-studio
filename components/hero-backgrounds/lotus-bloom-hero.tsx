'use client';

import { useEffect, useRef } from 'react';

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export function LotusBloomHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const ripples: WaterRipple[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drawPetal = (
      cx: number,
      cy: number,
      angle: number,
      length: number,
      width: number,
      hue: number,
      alpha: number,
      tipCurl: number
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Petal shape with curved tip
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        length * 0.3, -width * 0.5,
        length * 0.7, -width * 0.4,
        length, -width * 0.1 * tipCurl
      );
      ctx.bezierCurveTo(
        length * 1.05, 0,
        length * 1.05, 0,
        length, width * 0.1 * tipCurl
      );
      ctx.bezierCurveTo(
        length * 0.7, width * 0.4,
        length * 0.3, width * 0.5,
        0, 0
      );

      // Gradient fill
      const gradient = ctx.createLinearGradient(0, 0, length, 0);
      gradient.addColorStop(0, `hsla(${hue}, 70%, 85%, ${alpha})`);
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 75%, ${alpha})`);
      gradient.addColorStop(1, `hsla(${hue - 10}, 75%, 65%, ${alpha * 0.8})`);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Petal veins
      ctx.strokeStyle = `hsla(${hue - 15}, 60%, 60%, ${alpha * 0.3})`;
      ctx.lineWidth = 0.5;
      for (let v = 0; v < 3; v++) {
        const vOffset = (v - 1) * width * 0.15;
        ctx.beginPath();
        ctx.moveTo(length * 0.1, vOffset * 0.3);
        ctx.quadraticCurveTo(length * 0.5, vOffset, length * 0.85, vOffset * 0.5);
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawLotusCenter = (cx: number, cy: number, size: number, alpha: number) => {
      // Seed pod center
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size);
      gradient.addColorStop(0, `rgba(255, 230, 150, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(240, 200, 100, ${alpha})`);
      gradient.addColorStop(1, `rgba(200, 160, 80, ${alpha * 0.8})`);

      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Seed holes
      const seeds = 6;
      for (let i = 0; i < seeds; i++) {
        const angle = (i / seeds) * Math.PI * 2 + time * 0.2;
        const dist = size * 0.5;
        const sx = cx + Math.cos(angle) * dist;
        const sy = cy + Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 80, 50, ${alpha * 0.6})`;
        ctx.fill();
      }
    };

    const drawLotus = (cx: number, cy: number, baseSize: number, bloomPhase: number, alpha: number) => {
      const layers = 4;
      const petalsPerLayer = [5, 8, 10, 12];
      const hues = [340, 335, 330, 325];

      // Draw from outer to inner
      for (let l = layers - 1; l >= 0; l--) {
        const layerPhase = Math.max(0, Math.min(1, (bloomPhase - l * 0.15) / 0.7));
        if (layerPhase <= 0) continue;

        const layerScale = 1 - l * 0.2;
        const petalCount = petalsPerLayer[l];
        const layerRotation = l * 0.15;

        for (let p = 0; p < petalCount; p++) {
          const angle = (p / petalCount) * Math.PI * 2 + layerRotation;
          const petalLength = baseSize * layerScale * (0.7 + layerPhase * 0.3);
          const petalWidth = petalLength * 0.35;
          const tipCurl = 1 + (1 - layerPhase) * 2;

          // Petals curve outward as they bloom
          const openAngle = angle - Math.PI / 2 + (layerPhase - 0.5) * 0.3 * (l === 0 ? 0.5 : 1);

          drawPetal(
            cx, cy,
            openAngle,
            petalLength,
            petalWidth,
            hues[l],
            alpha * (0.15 + l * 0.05),
            tipCurl
          );
        }
      }

      // Center
      if (bloomPhase > 0.5) {
        const centerAlpha = (bloomPhase - 0.5) * 2;
        drawLotusCenter(cx, cy, baseSize * 0.15, alpha * centerAlpha * 0.4);
      }
    };

    const drawLilyPad = (x: number, y: number, size: number, rotation: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Pad shape with notch
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size, 0.15, Math.PI * 2 - 0.15);
      ctx.lineTo(0, 0);

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradient.addColorStop(0, `rgba(30, 80, 50, ${alpha})`);
      gradient.addColorStop(0.7, `rgba(20, 60, 40, ${alpha})`);
      gradient.addColorStop(1, `rgba(15, 50, 35, ${alpha * 0.8})`);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Veins
      ctx.strokeStyle = `rgba(40, 100, 60, ${alpha * 0.3})`;
      ctx.lineWidth = 1;
      for (let v = 0; v < 8; v++) {
        const vAngle = 0.3 + (v / 8) * (Math.PI * 2 - 0.6);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(vAngle) * size * 0.85, Math.sin(vAngle) * size * 0.85);
        ctx.stroke();
      }

      ctx.restore();
    };

    const animate = () => {
      time += 0.008;

      // Background - dark pond water
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      bgGradient.addColorStop(0, '#0a1015');
      bgGradient.addColorStop(0.5, '#080c10');
      bgGradient.addColorStop(1, '#050810');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Water surface shimmer
      for (let i = 0; i < 5; i++) {
        const shimmerX = (Math.sin(time * 0.3 + i * 1.5) * 0.3 + 0.5) * canvas.width;
        const shimmerY = (Math.cos(time * 0.25 + i * 1.2) * 0.3 + 0.5) * canvas.height;
        const gradient = ctx.createRadialGradient(shimmerX, shimmerY, 0, shimmerX, shimmerY, 100);
        gradient.addColorStop(0, 'rgba(80, 120, 100, 0.02)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Ripples
      if (Math.random() < 0.01) {
        ripples.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 0,
          maxRadius: 40 + Math.random() * 30,
          opacity: 1,
        });
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 0.5;
        r.opacity = 1 - r.radius / r.maxRadius;
        if (r.opacity <= 0) {
          ripples.splice(i, 1);
        } else {
          ctx.strokeStyle = `rgba(100, 150, 130, ${r.opacity * 0.1})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Lily pads
      drawLilyPad(canvas.width * 0.2, canvas.height * 0.7, 60, 0.3, 0.15);
      drawLilyPad(canvas.width * 0.75, canvas.height * 0.65, 50, -0.5, 0.12);
      drawLilyPad(canvas.width * 0.4, canvas.height * 0.8, 45, 1.2, 0.1);

      // Main lotus - breathing bloom animation
      const bloomPhase = (Math.sin(time * 0.3) + 1) * 0.35 + 0.3;
      drawLotus(canvas.width * 0.5, canvas.height * 0.5, 100, bloomPhase, 1);

      // Smaller background lotus
      const smallBloom = (Math.sin(time * 0.25 + 1) + 1) * 0.3 + 0.4;
      drawLotus(canvas.width * 0.25, canvas.height * 0.6, 50, smallBloom, 0.6);

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
