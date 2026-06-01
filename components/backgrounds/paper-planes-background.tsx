'use client';

import { useEffect, useRef } from 'react';

interface Plane {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
  wobblePhase: number;
  wobbleSpeed: number;
  hue: number;
  opacity: number;
  trail: { x: number; y: number; alpha: number }[];
}

export function PaperPlanesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const planes: Plane[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (planes.length === 0) initPlanes();
    };

    const initPlanes = () => {
      planes.length = 0;
      for (let i = 0; i < 15; i++) {
        planes.push(createPlane(true));
      }
    };

    const createPlane = (randomPos = false): Plane => ({
      x: randomPos ? Math.random() * canvas.width : -100,
      y: randomPos ? Math.random() * canvas.height : Math.random() * canvas.height,
      vx: 2 + Math.random() * 3,
      vy: (Math.random() - 0.5) * 2,
      rotation: 0,
      scale: 0.5 + Math.random() * 0.8,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.03 + Math.random() * 0.02,
      hue: 200 + Math.random() * 40,
      opacity: 0.5 + Math.random() * 0.4,
      trail: [],
    });

    resize();
    window.addEventListener('resize', resize);

    const drawPlane = (plane: Plane) => {
      const { x, y, rotation, scale, hue, opacity } = plane;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);

      // Paper plane shape
      ctx.beginPath();
      // Main body
      ctx.moveTo(40, 0);
      ctx.lineTo(-30, -20);
      ctx.lineTo(-20, 0);
      ctx.lineTo(-30, 20);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(-30, -20, 40, 20);
      gradient.addColorStop(0, `hsla(${hue}, 30%, 90%, ${opacity})`);
      gradient.addColorStop(0.5, `hsla(${hue}, 40%, 95%, ${opacity})`);
      gradient.addColorStop(1, `hsla(${hue}, 30%, 85%, ${opacity})`);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = `hsla(${hue}, 50%, 70%, ${opacity * 0.8})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Wing fold line
      ctx.beginPath();
      ctx.moveTo(40, 0);
      ctx.lineTo(-20, 0);
      ctx.strokeStyle = `hsla(${hue}, 30%, 70%, ${opacity * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Top wing crease
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(-25, -15);
      ctx.strokeStyle = `hsla(${hue}, 30%, 75%, ${opacity * 0.4})`;
      ctx.stroke();

      // Bottom wing crease
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(-25, 15);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      time += 0.016;

      // Sky gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0a1628');
      bgGradient.addColorStop(0.4, '#152238');
      bgGradient.addColorStop(1, '#1a2d4a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let i = 0; i < 5; i++) {
        const cloudX = ((time * 20 + i * 300) % (canvas.width + 400)) - 200;
        const cloudY = 100 + i * 150 + Math.sin(time + i) * 20;
        ctx.beginPath();
        ctx.ellipse(cloudX, cloudY, 150, 40, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cloudX + 80, cloudY - 20, 100, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cloudX - 60, cloudY + 10, 80, 30, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const plane of planes) {
        // Store trail
        plane.trail.unshift({ x: plane.x, y: plane.y, alpha: 0.3 });
        if (plane.trail.length > 20) plane.trail.pop();

        // Wobble motion
        plane.wobblePhase += plane.wobbleSpeed;
        const wobble = Math.sin(plane.wobblePhase) * 0.5;
        plane.vy += wobble * 0.1;
        plane.vy *= 0.98; // Damping

        plane.x += plane.vx;
        plane.y += plane.vy;
        plane.rotation = Math.atan2(plane.vy, plane.vx);

        // Reset if off screen
        if (plane.x > canvas.width + 100) {
          Object.assign(plane, createPlane());
        }

        // Draw trail
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${plane.hue}, 30%, 80%, 0.1)`;
        ctx.lineWidth = 1;
        for (let i = 0; i < plane.trail.length; i++) {
          const t = plane.trail[i];
          if (i === 0) {
            ctx.moveTo(t.x, t.y);
          } else {
            ctx.lineTo(t.x, t.y);
          }
          plane.trail[i].alpha *= 0.92;
        }
        ctx.stroke();

        drawPlane(plane);
      }

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
