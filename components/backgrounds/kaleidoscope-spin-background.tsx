'use client';

import { useEffect, useRef } from 'react';

export function KaleidoscopeSpinBackground() {
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

    const segments = 12;
    const layers = 5;

    const drawKaleidoscopePattern = (cx: number, cy: number, radius: number, rotation: number, layerIndex: number) => {
      const segmentAngle = (Math.PI * 2) / segments;

      for (let i = 0; i < segments; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation + i * segmentAngle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, 0, segmentAngle);
        ctx.closePath();
        ctx.clip();

        const hue = (time * 30 + i * 30 + layerIndex * 60) % 360;
        const patternOffset = time * (layerIndex + 1) * 0.5;

        for (let j = 0; j < 4; j++) {
          const r = radius * (0.3 + j * 0.2);
          const angleOffset = patternOffset + j * 0.3;

          ctx.beginPath();
          ctx.arc(
            r * 0.5 * Math.cos(angleOffset),
            r * 0.5 * Math.sin(angleOffset),
            r * 0.15,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `hsla(${(hue + j * 40) % 360}, 70%, 55%, ${0.3 - j * 0.05})`;
          ctx.fill();
        }

        for (let k = 0; k < 3; k++) {
          const petalAngle = segmentAngle * 0.5 + Math.sin(time + k) * 0.2;
          const petalLen = radius * (0.4 + k * 0.15);

          ctx.beginPath();
          ctx.ellipse(
            petalLen * 0.5 * Math.cos(petalAngle),
            petalLen * 0.5 * Math.sin(petalAngle),
            petalLen * 0.3,
            petalLen * 0.1,
            petalAngle,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `hsla(${(hue + 120 + k * 30) % 360}, 80%, 60%, ${0.25 - k * 0.05})`;
          ctx.fill();
        }

        const diamondDist = radius * 0.6;
        const diamondAngle = segmentAngle * 0.3;
        ctx.save();
        ctx.translate(
          diamondDist * Math.cos(diamondAngle),
          diamondDist * Math.sin(diamondAngle)
        );
        ctx.rotate(time * 2);
        ctx.beginPath();
        const ds = radius * 0.08;
        ctx.moveTo(0, -ds);
        ctx.lineTo(ds * 0.6, 0);
        ctx.lineTo(0, ds);
        ctx.lineTo(-ds * 0.6, 0);
        ctx.closePath();
        ctx.fillStyle = `hsla(${(hue + 240) % 360}, 90%, 70%, 0.5)`;
        ctx.fill();
        ctx.restore();

        ctx.restore();
      }
    };

    const animate = () => {
      time += 0.015;

      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.45;

      for (let layer = layers - 1; layer >= 0; layer--) {
        const layerRadius = maxRadius * (0.4 + layer * 0.15);
        const layerRotation = time * (0.2 + layer * 0.1) * (layer % 2 === 0 ? 1 : -1);
        drawKaleidoscopePattern(cx, cy, layerRadius, layerRotation, layer);
      }

      const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius * 0.3);
      centerGlow.addColorStop(0, `hsla(${(time * 50) % 360}, 80%, 70%, 0.3)`);
      centerGlow.addColorStop(0.5, `hsla(${(time * 50 + 60) % 360}, 70%, 50%, 0.1)`);
      centerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius * 0.3, 0, Math.PI * 2);
      ctx.fill();

      const vignette = ctx.createRadialGradient(cx, cy, maxRadius * 0.5, cx, cy, maxRadius * 1.2);
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      ctx.fillStyle = vignette;
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
