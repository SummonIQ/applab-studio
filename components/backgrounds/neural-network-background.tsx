'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

interface NeuralNetworkBackgroundProps {
  nodeCount?: number;
  connectionDistance?: number;
  nodeColor?: string;
  lineColor?: string;
  speed?: number;
}

export function NeuralNetworkBackground({
  nodeCount = 50,
  connectionDistance = 200,
  nodeColor = 'rgba(59, 130, 246, 0.8)',
  lineColor = 'rgba(59, 130, 246, 0.3)',
  speed = 0.3,
}: NeuralNetworkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize nodes
    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        connections: [],
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        node.connections = [];
      });

      // Find connections
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach((node2, j) => {
          const dx = node.x - node2.x;
          const dy = node.y - node2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            node.connections.push(i + j + 1);

            // Draw connection
            const opacity = 1 - distance / connectionDistance;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = lineColor.replace(
              /[\d.]+\)$/g,
              `${opacity * 0.3})`,
            );
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw data packet
            if (Math.random() > 0.99) {
              const packetX = node.x + (node2.x - node.x) * Math.random();
              const packetY = node.y + (node2.y - node.y) * Math.random();
              ctx.beginPath();
              ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
              ctx.fillStyle = nodeColor;
              ctx.fill();
            }
          }
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Pulse effect for active nodes
        if (node.connections.length > 0) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
          ctx.strokeStyle = nodeColor.replace(/[\d.]+\)$/g, '0.2)');
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodeCount, connectionDistance, nodeColor, lineColor, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'rgb(15, 23, 42)' }}
    />
  );
}
