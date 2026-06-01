'use client';

import { useEffect, useRef } from 'react';

interface PulseNode {
  x: number;
  y: number;
  rings: Ring[];
  hue: number;
  pulseInterval: number;
  lastPulse: number;
}

interface Ring {
  radius: number;
  maxRadius: number;
  opacity: number;
  width: number;
}

interface EnergyArc {
  nodeA: number;
  nodeB: number;
  progress: number;
  active: boolean;
  hue: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
}

export function PulseRingsHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const nodes: PulseNode[] = [];
    const arcs: EnergyArc[] = [];
    const particles: Particle[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
      initializeNodes();
    };

    const initializeNodes = () => {
      nodes.length = 0;

      // Create a network of pulse nodes
      const nodePositions = [
        { x: 0.5, y: 0.4 },   // Center
        { x: 0.2, y: 0.25 },  // Top left
        { x: 0.8, y: 0.3 },   // Top right
        { x: 0.15, y: 0.65 }, // Bottom left
        { x: 0.85, y: 0.7 },  // Bottom right
        { x: 0.4, y: 0.75 },  // Bottom center left
        { x: 0.65, y: 0.2 },  // Top center right
      ];

      nodePositions.forEach((pos, i) => {
        nodes.push({
          x: canvas.width * pos.x,
          y: canvas.height * pos.y,
          rings: [],
          hue: 260 + (i * 30) % 60, // Purple to blue range
          pulseInterval: 2000 + i * 500,
          lastPulse: i * -400, // Stagger initial pulses
        });
      });
    };

    resize();
    window.addEventListener('resize', resize);

    const createArc = () => {
      if (nodes.length < 2) return;

      const nodeA = Math.floor(Math.random() * nodes.length);
      let nodeB = Math.floor(Math.random() * nodes.length);
      while (nodeB === nodeA) nodeB = Math.floor(Math.random() * nodes.length);

      arcs.push({
        nodeA,
        nodeB,
        progress: 0,
        active: true,
        hue: (nodes[nodeA].hue + nodes[nodeB].hue) / 2,
      });
    };

    const spawnParticles = (x: number, y: number, hue: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 1,
          hue,
        });
      }
    };

    const drawNode = (node: PulseNode) => {
      // Core glow
      const coreSize = 8 + Math.sin(time * 3 + node.hue) * 2;
      const coreGlow = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, coreSize * 4
      );
      coreGlow.addColorStop(0, `hsla(${node.hue}, 80%, 70%, 0.8)`);
      coreGlow.addColorStop(0.3, `hsla(${node.hue}, 70%, 60%, 0.3)`);
      coreGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGlow;
      ctx.fillRect(node.x - coreSize * 4, node.y - coreSize * 4, coreSize * 8, coreSize * 8);

      // Inner core
      ctx.beginPath();
      ctx.arc(node.x, node.y, coreSize, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${node.hue}, 90%, 80%, 0.9)`;
      ctx.fill();

      // Orbital ring
      const orbitRadius = 20 + Math.sin(time * 2 + node.hue * 0.1) * 3;
      ctx.beginPath();
      ctx.arc(node.x, node.y, orbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${node.hue}, 60%, 60%, 0.2)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Small orbiting dot
      const orbitAngle = time * 2 + node.hue * 0.05;
      const dotX = node.x + Math.cos(orbitAngle) * orbitRadius;
      const dotY = node.y + Math.sin(orbitAngle) * orbitRadius;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${node.hue}, 80%, 70%, 0.6)`;
      ctx.fill();
    };

    const drawRing = (node: PulseNode, ring: Ring) => {
      // Main ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, ring.radius, 0, Math.PI * 2);

      const gradient = ctx.createRadialGradient(
        node.x, node.y, ring.radius - ring.width,
        node.x, node.y, ring.radius + ring.width
      );
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, `hsla(${node.hue}, 70%, 60%, ${ring.opacity})`);
      gradient.addColorStop(1, 'transparent');

      ctx.strokeStyle = `hsla(${node.hue}, 70%, 60%, ${ring.opacity})`;
      ctx.lineWidth = ring.width;
      ctx.stroke();

      // Segmented effect
      const segments = 8;
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2 + time;
        const segmentLength = 0.3;

        ctx.beginPath();
        ctx.arc(node.x, node.y, ring.radius, angle, angle + segmentLength);
        ctx.strokeStyle = `hsla(${node.hue}, 80%, 70%, ${ring.opacity * 1.5})`;
        ctx.lineWidth = ring.width * 1.5;
        ctx.stroke();
      }
    };

    const drawArc = (arc: EnergyArc) => {
      const nodeA = nodes[arc.nodeA];
      const nodeB = nodes[arc.nodeB];
      if (!nodeA || !nodeB) return;

      // Control point for curve
      const midX = (nodeA.x + nodeB.x) / 2;
      const midY = (nodeA.y + nodeB.y) / 2;
      const perpX = -(nodeB.y - nodeA.y) * 0.3;
      const perpY = (nodeB.x - nodeA.x) * 0.3;
      const ctrlX = midX + perpX * Math.sin(time);
      const ctrlY = midY + perpY * Math.sin(time);

      // Draw path
      const pathLength = 30;
      const startT = Math.max(0, arc.progress - 0.2);
      const endT = Math.min(1, arc.progress);

      ctx.beginPath();
      let firstPoint = true;

      for (let t = startT; t <= endT; t += 0.02) {
        const mt = 1 - t;
        const x = mt * mt * nodeA.x + 2 * mt * t * ctrlX + t * t * nodeB.x;
        const y = mt * mt * nodeA.y + 2 * mt * t * ctrlY + t * t * nodeB.y;

        if (firstPoint) {
          ctx.moveTo(x, y);
          firstPoint = false;
        } else {
          ctx.lineTo(x, y);
        }
      }

      const alpha = 1 - Math.abs(arc.progress - 0.5) * 2;
      ctx.strokeStyle = `hsla(${arc.hue}, 70%, 60%, ${0.6 * alpha})`;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Leading particle
      const t = arc.progress;
      const mt = 1 - t;
      const headX = mt * mt * nodeA.x + 2 * mt * t * ctrlX + t * t * nodeB.x;
      const headY = mt * mt * nodeA.y + 2 * mt * t * ctrlY + t * t * nodeB.y;

      const headGlow = ctx.createRadialGradient(headX, headY, 0, headX, headY, 15);
      headGlow.addColorStop(0, `hsla(${arc.hue}, 80%, 70%, ${0.8 * alpha})`);
      headGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = headGlow;
      ctx.fillRect(headX - 15, headY - 15, 30, 30);
    };

    const animate = () => {
      time += 0.016;
      const currentTime = time * 1000;

      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Background grid pattern
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 50;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and create node pulses
      nodes.forEach(node => {
        if (currentTime - node.lastPulse > node.pulseInterval) {
          node.rings.push({
            radius: 20,
            maxRadius: 200 + Math.random() * 150,
            opacity: 0.4,
            width: 2 + Math.random() * 2,
          });
          node.lastPulse = currentTime;
          spawnParticles(node.x, node.y, node.hue, 5);
        }

        // Update rings
        for (let i = node.rings.length - 1; i >= 0; i--) {
          const ring = node.rings[i];
          ring.radius += 2;
          ring.opacity = 0.4 * (1 - ring.radius / ring.maxRadius);

          if (ring.radius > ring.maxRadius) {
            node.rings.splice(i, 1);
          } else {
            drawRing(node, ring);
          }
        }

        drawNode(node);
      });

      // Draw connection lines between nodes (very subtle)
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < 400) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw arcs
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        arc.progress += 0.015;

        if (arc.progress > 1.2) {
          arcs.splice(i, 1);
        } else {
          drawArc(arc);
        }
      }

      // Occasionally create new arcs
      if (Math.random() < 0.02 && arcs.length < 3) {
        createArc();
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life -= 0.02;

        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          const alpha = p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2 * alpha, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${alpha * 0.5})`;
          ctx.fill();
        }
      }

      // Central ambient glow
      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.45;
      const ambientGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, Math.min(canvas.width, canvas.height) * 0.5
      );
      ambientGlow.addColorStop(0, 'rgba(139, 92, 246, 0.05)');
      ambientGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.02)');
      ambientGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = ambientGlow;
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
