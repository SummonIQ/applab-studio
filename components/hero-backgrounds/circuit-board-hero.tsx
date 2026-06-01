'use client';

import { useEffect, useRef } from 'react';

interface Trace {
  points: { x: number; y: number }[];
  pulseOffset: number;
  pulseSpeed: number;
}

interface Node {
  x: number;
  y: number;
  size: number;
  type: 'chip' | 'capacitor' | 'resistor' | 'led';
  phase: number;
}

export function CircuitBoardHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let traces: Trace[] = [];
    let nodes: Node[] = [];
    let w = 0;
    let h = 0;

    const gridSize = 24;

    const generateCircuit = () => {
      w = canvas.width;
      h = canvas.height;
      traces = [];
      nodes = [];

      // Generate traces (circuit paths)
      for (let i = 0; i < 25; i++) {
        const startX = Math.floor(Math.random() * (w / gridSize)) * gridSize;
        const startY = Math.floor(Math.random() * (h / gridSize)) * gridSize;
        const points: { x: number; y: number }[] = [{ x: startX, y: startY }];

        let cx = startX;
        let cy = startY;
        const segments = 3 + Math.floor(Math.random() * 5);

        for (let j = 0; j < segments; j++) {
          const horizontal = Math.random() > 0.5;
          const distance = (2 + Math.floor(Math.random() * 4)) * gridSize;

          if (horizontal) {
            cx += Math.random() > 0.5 ? distance : -distance;
          } else {
            cy += Math.random() > 0.5 ? distance : -distance;
          }

          cx = Math.max(0, Math.min(w, cx));
          cy = Math.max(0, Math.min(h, cy));
          points.push({ x: cx, y: cy });
        }

        traces.push({
          points,
          pulseOffset: Math.random() * 100,
          pulseSpeed: 0.5 + Math.random() * 1.5,
        });
      }

      // Generate nodes (components)
      const types: Node['type'][] = ['chip', 'capacitor', 'resistor', 'led'];
      for (let i = 0; i < 20; i++) {
        nodes.push({
          x: Math.floor(Math.random() * (w / gridSize)) * gridSize,
          y: Math.floor(Math.random() * (h / gridSize)) * gridSize,
          size: types[i % 4] === 'chip' ? 20 : 8,
          type: types[i % 4],
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const initCanvas = () => {
      const parent = canvas.parentElement; canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
      generateCircuit();
    };

    let resizeTimeout: NodeJS.Timeout;
    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initCanvas, 100);
    };

    const drawNode = (node: Node) => {
      const glow = 0.3 + Math.sin(time * 2 + node.phase) * 0.2;

      if (node.type === 'chip') {
        // IC chip
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(node.x - 15, node.y - 10, 30, 20);
        ctx.strokeStyle = `rgba(0, 255, 136, ${glow * 0.4})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(node.x - 15, node.y - 10, 30, 20);

        // Pins
        ctx.fillStyle = `rgba(0, 255, 136, ${glow * 0.3})`;
        for (let p = 0; p < 4; p++) {
          ctx.fillRect(node.x - 12 + p * 8, node.y - 13, 2, 3);
          ctx.fillRect(node.x - 12 + p * 8, node.y + 10, 2, 3);
        }
      } else if (node.type === 'capacitor') {
        ctx.strokeStyle = `rgba(0, 200, 255, ${glow * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(node.x - 4, node.y - 6);
        ctx.lineTo(node.x - 4, node.y + 6);
        ctx.moveTo(node.x + 4, node.y - 6);
        ctx.lineTo(node.x + 4, node.y + 6);
        ctx.stroke();
      } else if (node.type === 'resistor') {
        ctx.strokeStyle = `rgba(255, 150, 50, ${glow * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(node.x - 10, node.y);
        for (let z = 0; z < 4; z++) {
          ctx.lineTo(node.x - 6 + z * 4, node.y + (z % 2 === 0 ? -4 : 4));
        }
        ctx.lineTo(node.x + 10, node.y);
        ctx.stroke();
      } else if (node.type === 'led') {
        const ledGlow = 0.4 + Math.sin(time * 3 + node.phase) * 0.4;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 50, 100, ${ledGlow * 0.4})`;
        ctx.fill();
        ctx.shadowColor = 'rgba(255, 50, 100, 0.8)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const animate = () => {
      time += 0.016;

      // Dark PCB background
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, w, h);

      // Subtle grid pattern (solder mask holes)
      ctx.fillStyle = 'rgba(30, 40, 50, 0.3)';
      for (let x = 0; x < w; x += gridSize) {
        for (let y = 0; y < h; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw traces
      traces.forEach(trace => {
        // Copper trace
        ctx.strokeStyle = 'rgba(0, 180, 100, 0.15)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        trace.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // Data pulse traveling along trace
        const totalLength = trace.points.reduce((acc, p, i) => {
          if (i === 0) return 0;
          const prev = trace.points[i - 1];
          return acc + Math.hypot(p.x - prev.x, p.y - prev.y);
        }, 0);

        const pulsePos =
          ((time * trace.pulseSpeed * 50 + trace.pulseOffset) %
            (totalLength + 50)) -
          25;

        let traveled = 0;
        for (let i = 1; i < trace.points.length; i++) {
          const prev = trace.points[i - 1];
          const curr = trace.points[i];
          const segLen = Math.hypot(curr.x - prev.x, curr.y - prev.y);

          if (pulsePos >= traveled && pulsePos <= traveled + segLen) {
            const t = (pulsePos - traveled) / segLen;
            const px = prev.x + (curr.x - prev.x) * t;
            const py = prev.y + (curr.y - prev.y) * t;

            const gradient = ctx.createRadialGradient(px, py, 0, px, py, 12);
            gradient.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
            gradient.addColorStop(0.5, 'rgba(0, 255, 136, 0.1)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(px, py, 12, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          traveled += segLen;
        }

        // Connection points at trace ends
        ctx.fillStyle = 'rgba(0, 255, 136, 0.15)';
        trace.points.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // Draw nodes
      nodes.forEach(drawNode);

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
