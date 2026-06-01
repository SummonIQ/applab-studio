'use client';

import { useEffect, useRef } from 'react';

interface Gear {
  x: number;
  y: number;
  radius: number;
  teeth: number;
  speed: number;
  rotation: number;
  hue: number;
  depth: number;
}

export function ClockGearsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const gears: Gear[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (gears.length === 0) initGears();
    };

    const initGears = () => {
      gears.length = 0;
      const positions = [
        { x: 0.2, y: 0.3, r: 0.12, teeth: 16, depth: 0 },
        { x: 0.35, y: 0.25, r: 0.08, teeth: 12, depth: 1 },
        { x: 0.5, y: 0.5, r: 0.18, teeth: 24, depth: 0 },
        { x: 0.7, y: 0.4, r: 0.1, teeth: 14, depth: 1 },
        { x: 0.8, y: 0.7, r: 0.14, teeth: 18, depth: 0 },
        { x: 0.25, y: 0.7, r: 0.11, teeth: 15, depth: 1 },
        { x: 0.6, y: 0.75, r: 0.09, teeth: 11, depth: 2 },
        { x: 0.15, y: 0.5, r: 0.07, teeth: 10, depth: 2 },
        { x: 0.85, y: 0.25, r: 0.06, teeth: 9, depth: 2 },
        { x: 0.45, y: 0.15, r: 0.08, teeth: 12, depth: 1 },
      ];

      positions.forEach((pos, i) => {
        const baseRadius = Math.min(canvas.width, canvas.height) * pos.r;
        gears.push({
          x: pos.x * canvas.width,
          y: pos.y * canvas.height,
          radius: baseRadius,
          teeth: pos.teeth,
          speed: (0.3 + Math.random() * 0.4) * (i % 2 === 0 ? 1 : -1),
          rotation: Math.random() * Math.PI * 2,
          hue: 25 + Math.random() * 20,
          depth: pos.depth,
        });
      });
    };

    resize();
    window.addEventListener('resize', resize);

    const drawGear = (gear: Gear) => {
      const { x, y, radius, teeth, rotation, hue, depth } = gear;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      const depthAlpha = 1 - depth * 0.25;
      const depthScale = 1 - depth * 0.1;
      const scaledRadius = radius * depthScale;

      const toothHeight = scaledRadius * 0.15;
      const innerRadius = scaledRadius * 0.85;
      const hubRadius = scaledRadius * 0.35;
      const holeRadius = scaledRadius * 0.15;

      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const angle1 = (i / teeth) * Math.PI * 2;
        const angle2 = ((i + 0.35) / teeth) * Math.PI * 2;
        const angle3 = ((i + 0.65) / teeth) * Math.PI * 2;
        const angle4 = ((i + 1) / teeth) * Math.PI * 2;

        ctx.lineTo(Math.cos(angle1) * innerRadius, Math.sin(angle1) * innerRadius);
        ctx.lineTo(Math.cos(angle2) * (scaledRadius + toothHeight), Math.sin(angle2) * (scaledRadius + toothHeight));
        ctx.lineTo(Math.cos(angle3) * (scaledRadius + toothHeight), Math.sin(angle3) * (scaledRadius + toothHeight));
        ctx.lineTo(Math.cos(angle4) * innerRadius, Math.sin(angle4) * innerRadius);
      }
      ctx.closePath();

      const bodyGradient = ctx.createRadialGradient(-scaledRadius * 0.3, -scaledRadius * 0.3, 0, 0, 0, scaledRadius + toothHeight);
      bodyGradient.addColorStop(0, `hsla(${hue}, 50%, 55%, ${depthAlpha * 0.9})`);
      bodyGradient.addColorStop(0.5, `hsla(${hue}, 45%, 40%, ${depthAlpha * 0.85})`);
      bodyGradient.addColorStop(1, `hsla(${hue}, 40%, 25%, ${depthAlpha * 0.8})`);
      ctx.fillStyle = bodyGradient;
      ctx.fill();

      ctx.strokeStyle = `hsla(${hue}, 55%, 65%, ${depthAlpha * 0.6})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, innerRadius * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 40%, 35%, ${depthAlpha * 0.5})`;
      ctx.lineWidth = 3;
      ctx.stroke();

      const spokeCount = Math.min(8, Math.floor(teeth / 2));
      for (let i = 0; i < spokeCount; i++) {
        const spokeAngle = (i / spokeCount) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(spokeAngle) * hubRadius, Math.sin(spokeAngle) * hubRadius);
        ctx.lineTo(Math.cos(spokeAngle) * innerRadius * 0.65, Math.sin(spokeAngle) * innerRadius * 0.65);
        ctx.strokeStyle = `hsla(${hue}, 35%, 40%, ${depthAlpha * 0.6})`;
        ctx.lineWidth = scaledRadius * 0.08;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      const hubGradient = ctx.createRadialGradient(-hubRadius * 0.2, -hubRadius * 0.2, 0, 0, 0, hubRadius);
      hubGradient.addColorStop(0, `hsla(${hue}, 45%, 50%, ${depthAlpha})`);
      hubGradient.addColorStop(0.7, `hsla(${hue}, 40%, 35%, ${depthAlpha})`);
      hubGradient.addColorStop(1, `hsla(${hue}, 35%, 25%, ${depthAlpha})`);

      ctx.beginPath();
      ctx.arc(0, 0, hubRadius, 0, Math.PI * 2);
      ctx.fillStyle = hubGradient;
      ctx.fill();
      ctx.strokeStyle = `hsla(${hue}, 50%, 55%, ${depthAlpha * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, holeRadius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue - 10}, 30%, 10%, ${depthAlpha})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, holeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 40%, 45%, ${depthAlpha * 0.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    let time = 0;
    const animate = () => {
      time += 0.016;

      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.7
      );
      bgGradient.addColorStop(0, '#1a1510');
      bgGradient.addColorStop(0.5, '#12100c');
      bgGradient.addColorStop(1, '#0a0908');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const gear of gears) {
        gear.rotation += gear.speed * 0.02;
      }

      const sortedGears = [...gears].sort((a, b) => b.depth - a.depth);
      for (const gear of sortedGears) {
        drawGear(gear);
      }

      ctx.fillStyle = 'rgba(255, 200, 100, 0.4)';
      for (let i = 0; i < 15; i++) {
        const px = (Math.sin(time * 0.5 + i * 2.1) * 0.5 + 0.5) * canvas.width;
        const py = (Math.cos(time * 0.3 + i * 1.7) * 0.5 + 0.5) * canvas.height;
        const flicker = Math.sin(time * 5 + i * 3) * 0.5 + 0.5;
        ctx.globalAlpha = flicker * 0.5;
        ctx.beginPath();
        ctx.arc(px, py, 1 + flicker, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

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
