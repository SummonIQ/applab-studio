'use client';

import { useEffect, useRef } from 'react';

interface Dot {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  radius: number;
  hue: number;
  phase: number;
  connections: number[];
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
}

export function DotWaveHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let dots: Dot[] = [];
    const ripples: Ripple[] = [];
    let mouse = { x: -1000, y: -1000 };

    const spacing = 50;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
      initializeDots();
    };

    const initializeDots = () => {
      dots = [];
      const cols = Math.ceil(canvas.width / spacing) + 2;
      const rows = Math.ceil(canvas.height / spacing) + 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = i * rows + j;
          dots.push({
            baseX: i * spacing,
            baseY: j * spacing,
            x: i * spacing,
            y: j * spacing,
            radius: 2,
            hue: 180 + (i + j) * 2 % 60, // Cyan to blue range
            phase: (i + j) * 0.3,
            connections: [],
          });
        }
      }

      // Find neighbor connections
      const getIndex = (col: number, row: number) => col * rows + row;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = getIndex(i, j);
          const neighbors = [];
          if (i < cols - 1) neighbors.push(getIndex(i + 1, j));
          if (j < rows - 1) neighbors.push(getIndex(i, j + 1));
          if (i < cols - 1 && j < rows - 1) neighbors.push(getIndex(i + 1, j + 1));
          dots[idx].connections = neighbors;
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: 300,
        strength: 30,
      });
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    // Auto-create ripples periodically
    let lastRipple = 0;

    const animate = () => {
      time += 0.02;

      // Auto-ripples
      if (time - lastRipple > 3) {
        ripples.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 0,
          maxRadius: 250,
          strength: 20,
        });
        lastRipple = time;
      }

      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += 4;
        if (ripple.radius > ripple.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Update dots
      dots.forEach((dot, idx) => {
        // Base wave motion
        const waveX = Math.sin(dot.phase + time) * 8;
        const waveY = Math.cos(dot.phase * 0.7 + time * 0.8) * 8;

        // Mouse influence
        const distToMouse = Math.hypot(dot.baseX - mouse.x, dot.baseY - mouse.y);
        let mouseInfluenceX = 0;
        let mouseInfluenceY = 0;
        if (distToMouse < 150) {
          const strength = (1 - distToMouse / 150) * 20;
          const angle = Math.atan2(dot.baseY - mouse.y, dot.baseX - mouse.x);
          mouseInfluenceX = Math.cos(angle) * strength;
          mouseInfluenceY = Math.sin(angle) * strength;
        }

        // Ripple influence
        let rippleInfluenceX = 0;
        let rippleInfluenceY = 0;
        ripples.forEach(ripple => {
          const dist = Math.hypot(dot.baseX - ripple.x, dot.baseY - ripple.y);
          const ringDist = Math.abs(dist - ripple.radius);
          if (ringDist < 50) {
            const strength = (1 - ringDist / 50) * ripple.strength * (1 - ripple.radius / ripple.maxRadius);
            const angle = Math.atan2(dot.baseY - ripple.y, dot.baseX - ripple.x);
            rippleInfluenceX += Math.cos(angle) * strength;
            rippleInfluenceY += Math.sin(angle) * strength;
          }
        });

        dot.x = dot.baseX + waveX + mouseInfluenceX + rippleInfluenceX;
        dot.y = dot.baseY + waveY + mouseInfluenceY + rippleInfluenceY;

        // Dynamic radius based on activity
        const activity = Math.abs(mouseInfluenceX) + Math.abs(rippleInfluenceX);
        dot.radius = 2 + Math.min(activity * 0.1, 3);
      });

      // Draw connections
      ctx.lineWidth = 1;
      dots.forEach(dot => {
        dot.connections.forEach(neighborIdx => {
          const neighbor = dots[neighborIdx];
          if (!neighbor) return;

          const dist = Math.hypot(dot.x - neighbor.x, dot.y - neighbor.y);
          const maxDist = spacing * 1.8;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            const avgHue = (dot.hue + neighbor.hue) / 2;

            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(neighbor.x, neighbor.y);
            ctx.strokeStyle = `hsla(${avgHue}, 70%, 50%, ${alpha})`;
            ctx.stroke();
          }
        });
      });

      // Draw dots
      dots.forEach(dot => {
        // Glow
        const glowSize = dot.radius * 4;
        const glow = ctx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, glowSize
        );
        glow.addColorStop(0, `hsla(${dot.hue}, 80%, 60%, 0.3)`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(dot.x - glowSize, dot.y - glowSize, glowSize * 2, glowSize * 2);

        // Core
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${dot.hue}, 80%, 70%, 0.8)`;
        ctx.fill();
      });

      // Draw active ripples
      ripples.forEach(ripple => {
        const alpha = 0.3 * (1 - ripple.radius / ripple.maxRadius);
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(200, 70%, 60%, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Ambient corner glows
      const corners = [
        { x: 0, y: 0, hue: 200 },
        { x: canvas.width, y: canvas.height, hue: 180 },
      ];

      corners.forEach(corner => {
        const gradient = ctx.createRadialGradient(
          corner.x, corner.y, 0,
          corner.x, corner.y, Math.min(canvas.width, canvas.height) * 0.4
        );
        gradient.addColorStop(0, `hsla(${corner.hue}, 60%, 50%, 0.1)`);
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
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
