'use client';

import { useEffect, useRef } from 'react';

interface DataPacket {
  lineIndex: number;
  progress: number;
  speed: number;
  direction: 1 | -1;
  hue: number;
  size: number;
  trail: { x: number; y: number; alpha: number }[];
}

interface GridNode {
  x: number;
  y: number;
  pulsePhase: number;
  active: boolean;
  activationTime: number;
}

export function DiagonalLinesHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const packets: DataPacket[] = [];
    const nodes: GridNode[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
      initializeNodes();
    };

    const lineSpacing = 60;
    const getLineCount = () => Math.ceil((canvas.width + canvas.height) / lineSpacing) + 10;

    const initializeNodes = () => {
      nodes.length = 0;
      const lineCount = getLineCount();

      // Create nodes at line intersections
      for (let i = 0; i < lineCount; i++) {
        for (let j = 0; j < lineCount; j++) {
          // Calculate intersection points of forward and backward diagonals
          const x1Start = i * lineSpacing - canvas.height;
          const x2Start = canvas.width - j * lineSpacing + canvas.height;

          // Simplified intersection calculation
          const intersectX = (x1Start + x2Start) / 2;
          const intersectY = (intersectX - x1Start);

          if (intersectX >= 0 && intersectX <= canvas.width &&
              intersectY >= 0 && intersectY <= canvas.height) {
            nodes.push({
              x: intersectX,
              y: intersectY,
              pulsePhase: Math.random() * Math.PI * 2,
              active: false,
              activationTime: 0,
            });
          }
        }
      }
    };

    const createPacket = () => {
      const lineCount = getLineCount();
      const isForward = Math.random() > 0.5;

      packets.push({
        lineIndex: Math.floor(Math.random() * lineCount),
        progress: Math.random() > 0.5 ? 0 : 1,
        speed: 0.003 + Math.random() * 0.004,
        direction: Math.random() > 0.5 ? 1 : -1,
        hue: Math.random() > 0.5 ? 260 : 200, // Purple or cyan
        size: 2 + Math.random() * 2,
        trail: [],
      });
    };

    // Initialize packets
    for (let i = 0; i < 15; i++) createPacket();

    resize();
    window.addEventListener('resize', resize);

    const getLinePosition = (lineIndex: number, progress: number, isForward: boolean) => {
      if (isForward) {
        const startX = lineIndex * lineSpacing - canvas.height;
        const x = startX + progress * (canvas.height + canvas.width);
        const y = progress * canvas.height;
        return { x, y };
      } else {
        const startX = canvas.width - lineIndex * lineSpacing + canvas.height;
        const x = startX - progress * (canvas.height + canvas.width);
        const y = progress * canvas.height;
        return { x, y };
      }
    };

    const animate = () => {
      time += 0.016;
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const lineCount = getLineCount();

      // Draw grid lines - forward diagonals
      ctx.lineWidth = 1;
      for (let i = 0; i < lineCount; i++) {
        const offset = i * lineSpacing - canvas.height;
        const pulse = Math.sin(time * 0.5 + i * 0.2) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(offset + canvas.height, canvas.height);
        ctx.strokeStyle = `rgba(80, 80, 120, ${0.04 * pulse})`;
        ctx.stroke();
      }

      // Draw grid lines - backward diagonals
      for (let i = 0; i < lineCount; i++) {
        const offset = canvas.width - i * lineSpacing + canvas.height;
        const pulse = Math.sin(time * 0.5 + i * 0.3 + 1) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(offset - canvas.height, canvas.height);
        ctx.strokeStyle = `rgba(80, 80, 120, ${0.04 * pulse})`;
        ctx.stroke();
      }

      // Draw and update nodes
      nodes.forEach(node => {
        const timeSinceActive = time - node.activationTime;
        let alpha = 0.02;
        let size = 2;

        if (node.active && timeSinceActive < 1) {
          const t = timeSinceActive;
          alpha = 0.4 * (1 - t);
          size = 2 + 8 * t * (1 - t);

          // Draw expanding ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 3 * t, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(147, 51, 234, ${0.3 * (1 - t)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          node.active = false;
        }

        // Core node glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size + 4);
        gradient.addColorStop(0, `rgba(147, 51, 234, ${alpha * 2})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(node.x - size - 4, node.y - size - 4, (size + 4) * 2, (size + 4) * 2);
      });

      // Update and draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const packet = packets[i];
        packet.progress += packet.speed * packet.direction;

        // Get position on line
        const isForward = packet.lineIndex % 2 === 0;
        const pos = getLinePosition(packet.lineIndex, packet.progress, isForward);

        // Add to trail
        packet.trail.unshift({ x: pos.x, y: pos.y, alpha: 1 });
        if (packet.trail.length > 20) packet.trail.pop();

        // Update trail alphas
        packet.trail.forEach((t, idx) => {
          t.alpha = 1 - idx / packet.trail.length;
        });

        // Check for node activation
        nodes.forEach(node => {
          const dist = Math.hypot(pos.x - node.x, pos.y - node.y);
          if (dist < 15 && !node.active) {
            node.active = true;
            node.activationTime = time;
          }
        });

        // Draw trail
        if (packet.trail.length > 1) {
          for (let j = 1; j < packet.trail.length; j++) {
            const t1 = packet.trail[j - 1];
            const t2 = packet.trail[j];
            const alpha = t2.alpha * 0.6;

            ctx.beginPath();
            ctx.moveTo(t1.x, t1.y);
            ctx.lineTo(t2.x, t2.y);
            ctx.strokeStyle = `hsla(${packet.hue}, 70%, 60%, ${alpha})`;
            ctx.lineWidth = packet.size * t2.alpha;
            ctx.stroke();
          }
        }

        // Draw packet head
        const headGlow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, packet.size * 4);
        headGlow.addColorStop(0, `hsla(${packet.hue}, 80%, 70%, 0.8)`);
        headGlow.addColorStop(0.5, `hsla(${packet.hue}, 70%, 60%, 0.3)`);
        headGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = headGlow;
        ctx.fillRect(pos.x - packet.size * 4, pos.y - packet.size * 4, packet.size * 8, packet.size * 8);

        // Core
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, packet.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${packet.hue}, 90%, 80%, 1)`;
        ctx.fill();

        // Reset if out of bounds
        if (packet.progress < -0.1 || packet.progress > 1.1) {
          packets.splice(i, 1);
          createPacket();
        }
      }

      // Ambient corner glows
      const corners = [
        { x: 0, y: 0, hue: 260 },
        { x: canvas.width, y: canvas.height, hue: 200 },
      ];

      corners.forEach(corner => {
        const pulse = Math.sin(time + corner.hue * 0.01) * 0.3 + 0.7;
        const gradient = ctx.createRadialGradient(
          corner.x, corner.y, 0,
          corner.x, corner.y, Math.min(canvas.width, canvas.height) * 0.5
        );
        gradient.addColorStop(0, `hsla(${corner.hue}, 60%, 50%, ${0.08 * pulse})`);
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
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
