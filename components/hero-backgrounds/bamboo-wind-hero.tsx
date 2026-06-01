'use client';

import { useEffect, useRef } from 'react';

interface BambooStalk {
  x: number;
  height: number;
  thickness: number;
  segments: number;
  hue: number;
  swayOffset: number;
  swaySpeed: number;
  depth: number;
}

interface Leaf {
  stalkIndex: number;
  segmentIndex: number;
  side: number;
  angle: number;
  length: number;
  swayOffset: number;
}

export function BambooWindHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create bamboo stalks
    const stalks: BambooStalk[] = [];
    const leaves: Leaf[] = [];
    const stalkCount = 15;

    for (let i = 0; i < stalkCount; i++) {
      const depth = 0.3 + Math.random() * 0.7;
      stalks.push({
        x: (canvas.width / stalkCount) * i + (Math.random() - 0.5) * 40,
        height: canvas.height * (0.6 + Math.random() * 0.35),
        thickness: 4 + Math.random() * 6,
        segments: 5 + Math.floor(Math.random() * 4),
        hue: 110 + Math.random() * 30,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: 0.8 + Math.random() * 0.4,
        depth,
      });

      // Add leaves to this stalk
      const leafCount = 2 + Math.floor(Math.random() * 3);
      for (let l = 0; l < leafCount; l++) {
        leaves.push({
          stalkIndex: i,
          segmentIndex: 1 + Math.floor(Math.random() * (stalks[i].segments - 1)),
          side: Math.random() > 0.5 ? 1 : -1,
          angle: (Math.random() - 0.5) * 0.5,
          length: 20 + Math.random() * 25,
          swayOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    const getStalkPointAt = (stalk: BambooStalk, t: number, windStrength: number) => {
      const sway = Math.sin(time * stalk.swaySpeed + stalk.swayOffset) * windStrength * t * t;
      const x = stalk.x + sway * (1 - stalk.depth * 0.5);
      const y = canvas.height - stalk.height * t;
      return { x, y };
    };

    const drawStalk = (stalk: BambooStalk, windStrength: number) => {
      const alpha = 0.15 + stalk.depth * 0.2;

      // Draw segments
      for (let s = 0; s < stalk.segments; s++) {
        const t1 = s / stalk.segments;
        const t2 = (s + 1) / stalk.segments;
        const p1 = getStalkPointAt(stalk, t1, windStrength);
        const p2 = getStalkPointAt(stalk, t2, windStrength);

        // Segment body
        const gradient = ctx.createLinearGradient(p1.x - stalk.thickness, 0, p1.x + stalk.thickness, 0);
        gradient.addColorStop(0, `hsla(${stalk.hue}, 40%, 25%, ${alpha * 0.8})`);
        gradient.addColorStop(0.3, `hsla(${stalk.hue}, 45%, 35%, ${alpha})`);
        gradient.addColorStop(0.7, `hsla(${stalk.hue}, 45%, 35%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${stalk.hue}, 40%, 25%, ${alpha * 0.8})`);

        ctx.beginPath();
        ctx.moveTo(p1.x - stalk.thickness / 2, p1.y);
        ctx.lineTo(p2.x - stalk.thickness / 2, p2.y);
        ctx.lineTo(p2.x + stalk.thickness / 2, p2.y);
        ctx.lineTo(p1.x + stalk.thickness / 2, p1.y);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Node ring
        if (s > 0) {
          ctx.beginPath();
          ctx.ellipse(p1.x, p1.y, stalk.thickness * 0.7, 3, 0, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${stalk.hue - 10}, 35%, 30%, ${alpha})`;
          ctx.fill();
        }
      }
    };

    const drawLeaf = (leaf: Leaf, windStrength: number) => {
      const stalk = stalks[leaf.stalkIndex];
      const t = leaf.segmentIndex / stalk.segments;
      const point = getStalkPointAt(stalk, t, windStrength);

      const leafSway = Math.sin(time * 1.5 + leaf.swayOffset) * 0.2;
      const angle = leaf.angle + leafSway + (leaf.side > 0 ? -0.3 : 0.3 + Math.PI);

      ctx.save();
      ctx.translate(point.x, point.y);
      ctx.rotate(angle * leaf.side);

      const alpha = 0.12 + stalk.depth * 0.15;

      // Leaf shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(leaf.length * 0.5, -leaf.length * 0.15, leaf.length, 0);
      ctx.quadraticCurveTo(leaf.length * 0.5, leaf.length * 0.1, 0, 0);

      const leafGradient = ctx.createLinearGradient(0, 0, leaf.length, 0);
      leafGradient.addColorStop(0, `hsla(${stalk.hue + 10}, 50%, 35%, ${alpha})`);
      leafGradient.addColorStop(1, `hsla(${stalk.hue}, 45%, 40%, ${alpha * 0.7})`);
      ctx.fillStyle = leafGradient;
      ctx.fill();

      // Leaf vein
      ctx.strokeStyle = `hsla(${stalk.hue - 10}, 40%, 30%, ${alpha * 0.5})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(leaf.length * 0.8, 0);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      time += 0.016;

      // Wind varies over time
      const windStrength = 15 + Math.sin(time * 0.5) * 10;

      // Background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0a100a');
      bgGradient.addColorStop(0.5, '#080c08');
      bgGradient.addColorStop(1, '#050805');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Atmospheric mist
      for (let i = 0; i < 3; i++) {
        const mistY = canvas.height * (0.6 + i * 0.15);
        const gradient = ctx.createLinearGradient(0, mistY - 50, 0, mistY + 50);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, 'rgba(100, 130, 100, 0.02)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, mistY - 50, canvas.width, 100);
      }

      // Sort by depth and draw
      const sortedIndices = stalks.map((_, i) => i).sort((a, b) => stalks[a].depth - stalks[b].depth);

      sortedIndices.forEach(i => {
        drawStalk(stalks[i], windStrength);
        leaves.filter(l => l.stalkIndex === i).forEach(l => drawLeaf(l, windStrength));
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
