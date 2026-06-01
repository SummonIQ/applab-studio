'use client';

import { useEffect, useRef } from 'react';

interface Lantern {
  x: number;
  y: number;
  size: number;
  speed: number;
  swayPhase: number;
  swayAmount: number;
  hue: number;
  flickerPhase: number;
  flickerSpeed: number;
  rotation: number;
  rotSpeed: number;
  depth: number;
  type: 'round' | 'cylinder' | 'diamond';
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export function PaperLanternHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const sparks: Spark[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const types: Lantern['type'][] = ['round', 'cylinder', 'diamond'];
    const createLantern = (randomY = false): Lantern => ({
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : canvas.height + 50 + Math.random() * 100,
      size: 20 + Math.random() * 25,
      speed: 0.25 + Math.random() * 0.35,
      swayPhase: Math.random() * Math.PI * 2,
      swayAmount: 0.5 + Math.random() * 1,
      hue: Math.random() > 0.7 ? 0 + Math.random() * 30 : 30 + Math.random() * 30,
      flickerPhase: Math.random() * Math.PI * 2,
      flickerSpeed: 3 + Math.random() * 2,
      rotation: (Math.random() - 0.5) * 0.2,
      rotSpeed: (Math.random() - 0.5) * 0.005,
      depth: 0.3 + Math.random() * 0.7,
      type: types[Math.floor(Math.random() * types.length)],
    });

    const lanterns: Lantern[] = Array.from({ length: 12 }, () => createLantern(true));

    const drawRoundLantern = (l: Lantern, flicker: number) => {
      const alpha = 0.2 + l.depth * 0.15;

      // Outer glow
      const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, l.size * 2.5);
      glowGradient.addColorStop(0, `hsla(${l.hue}, 90%, 60%, ${alpha * flicker * 0.3})`);
      glowGradient.addColorStop(0.5, `hsla(${l.hue}, 85%, 50%, ${alpha * flicker * 0.1})`);
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(0, 0, l.size * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Lantern body
      const bodyGradient = ctx.createRadialGradient(-l.size * 0.2, -l.size * 0.2, 0, 0, 0, l.size);
      bodyGradient.addColorStop(0, `hsla(${l.hue}, 85%, 70%, ${alpha * flicker})`);
      bodyGradient.addColorStop(0.6, `hsla(${l.hue}, 80%, 55%, ${alpha * flicker})`);
      bodyGradient.addColorStop(1, `hsla(${l.hue}, 75%, 40%, ${alpha * flicker * 0.8})`);
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.arc(0, 0, l.size, 0, Math.PI * 2);
      ctx.fill();

      // Paper texture lines
      ctx.strokeStyle = `hsla(${l.hue - 10}, 60%, 50%, ${alpha * 0.3})`;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * l.size * 0.9, Math.sin(angle) * l.size * 0.9);
        ctx.lineTo(Math.cos(angle + Math.PI) * l.size * 0.9, Math.sin(angle + Math.PI) * l.size * 0.9);
        ctx.stroke();
      }

      // Top opening
      ctx.fillStyle = `hsla(${l.hue}, 70%, 30%, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(0, -l.size * 0.85, l.size * 0.3, l.size * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawCylinderLantern = (l: Lantern, flicker: number) => {
      const alpha = 0.2 + l.depth * 0.15;
      const h = l.size * 1.4;
      const w = l.size * 0.7;

      // Glow
      const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, l.size * 2);
      glowGradient.addColorStop(0, `hsla(${l.hue}, 90%, 60%, ${alpha * flicker * 0.25})`);
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(-l.size * 2, -l.size * 2, l.size * 4, l.size * 4);

      // Body
      const bodyGradient = ctx.createLinearGradient(-w, 0, w, 0);
      bodyGradient.addColorStop(0, `hsla(${l.hue}, 75%, 45%, ${alpha * flicker * 0.8})`);
      bodyGradient.addColorStop(0.3, `hsla(${l.hue}, 85%, 60%, ${alpha * flicker})`);
      bodyGradient.addColorStop(0.7, `hsla(${l.hue}, 85%, 60%, ${alpha * flicker})`);
      bodyGradient.addColorStop(1, `hsla(${l.hue}, 75%, 45%, ${alpha * flicker * 0.8})`);

      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.roundRect(-w, -h / 2, w * 2, h, 5);
      ctx.fill();

      // Ribs
      ctx.strokeStyle = `hsla(${l.hue - 10}, 50%, 40%, ${alpha * 0.4})`;
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        const y = -h / 2 + (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(-w, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Top/bottom caps
      ctx.fillStyle = `hsla(${l.hue}, 60%, 35%, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(0, -h / 2, w, w * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, h / 2, w, w * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawDiamondLantern = (l: Lantern, flicker: number) => {
      const alpha = 0.2 + l.depth * 0.15;
      const s = l.size;

      // Glow
      const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2.5);
      glowGradient.addColorStop(0, `hsla(${l.hue}, 90%, 60%, ${alpha * flicker * 0.25})`);
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(0, 0, s * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Diamond shape
      ctx.beginPath();
      ctx.moveTo(0, -s * 1.2);
      ctx.lineTo(s * 0.8, 0);
      ctx.lineTo(0, s * 1.2);
      ctx.lineTo(-s * 0.8, 0);
      ctx.closePath();

      const bodyGradient = ctx.createLinearGradient(-s, 0, s, 0);
      bodyGradient.addColorStop(0, `hsla(${l.hue}, 75%, 45%, ${alpha * flicker * 0.8})`);
      bodyGradient.addColorStop(0.5, `hsla(${l.hue}, 85%, 65%, ${alpha * flicker})`);
      bodyGradient.addColorStop(1, `hsla(${l.hue}, 75%, 45%, ${alpha * flicker * 0.8})`);
      ctx.fillStyle = bodyGradient;
      ctx.fill();

      // Frame lines
      ctx.strokeStyle = `hsla(${l.hue - 10}, 50%, 35%, ${alpha * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Cross struts
      ctx.beginPath();
      ctx.moveTo(0, -s * 1.2);
      ctx.lineTo(0, s * 1.2);
      ctx.moveTo(-s * 0.8, 0);
      ctx.lineTo(s * 0.8, 0);
      ctx.stroke();
    };

    const drawLantern = (l: Lantern) => {
      const flicker = 0.85 + Math.sin(time * l.flickerSpeed + l.flickerPhase) * 0.15;

      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rotation);

      switch (l.type) {
        case 'round':
          drawRoundLantern(l, flicker);
          break;
        case 'cylinder':
          drawCylinderLantern(l, flicker);
          break;
        case 'diamond':
          drawDiamondLantern(l, flicker);
          break;
      }

      // String
      ctx.strokeStyle = `rgba(100, 80, 60, ${0.1 + l.depth * 0.1})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -l.size * 1.3);
      ctx.lineTo(0, -l.size * 2.5);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      time += 0.016;

      // Night sky gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#050510');
      bgGradient.addColorStop(0.4, '#0a0815');
      bgGradient.addColorStop(1, '#100a15');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 30; i++) {
        const starX = (Math.sin(i * 7.3) * 0.5 + 0.5) * canvas.width;
        const starY = (Math.cos(i * 4.7) * 0.3 + 0.15) * canvas.height;
        const twinkle = 0.5 + Math.sin(time * 2 + i) * 0.5;
        ctx.globalAlpha = twinkle * 0.4;
        ctx.beginPath();
        ctx.arc(starX, starY, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Update and draw sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy -= 0.01; // Float up
        s.life -= 1;
        if (s.life <= 0) {
          sparks.splice(i, 1);
        } else {
          const alpha = (s.life / s.maxLife) * 0.6;
          ctx.fillStyle = `hsla(${s.hue}, 100%, 70%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Sort by depth
      lanterns.sort((a, b) => a.depth - b.depth);

      lanterns.forEach(l => {
        l.y -= l.speed * (0.8 + l.depth * 0.4);
        l.x += Math.sin(time * 0.5 + l.swayPhase) * l.swayAmount * 0.3;
        l.rotation += l.rotSpeed;

        // Emit occasional sparks
        if (Math.random() < 0.005) {
          sparks.push({
            x: l.x,
            y: l.y + l.size,
            vx: (Math.random() - 0.5) * 0.5,
            vy: Math.random() * 0.5,
            life: 30 + Math.random() * 30,
            maxLife: 60,
            size: 1 + Math.random(),
            hue: l.hue + 10,
          });
        }

        if (l.y < -l.size * 3) {
          Object.assign(l, createLantern());
        }

        drawLantern(l);
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
