'use client';

import { useEffect, useRef } from 'react';

interface InkDrop {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  spreading: boolean;
  tendrils: Tendril[];
  birthTime: number;
}

interface Tendril {
  angle: number;
  length: number;
  targetLength: number;
  width: number;
  curve: number;
  branches: { angle: number; length: number; progress: number }[];
}

interface Brushstroke {
  points: { x: number; y: number; width: number }[];
  progress: number;
  opacity: number;
  complete: boolean;
}

export function InkWashHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const inkDrops: InkDrop[] = [];
    const brushstrokes: Brushstroke[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const createInkDrop = (x?: number, y?: number) => {
      const dropX = x ?? Math.random() * canvas.width;
      const dropY = y ?? Math.random() * canvas.height;

      const tendrils: Tendril[] = [];
      const tendrilCount = 4 + Math.floor(Math.random() * 4);

      for (let i = 0; i < tendrilCount; i++) {
        const baseAngle = (i / tendrilCount) * Math.PI * 2 + Math.random() * 0.5;
        tendrils.push({
          angle: baseAngle,
          length: 0,
          targetLength: 30 + Math.random() * 60,
          width: 2 + Math.random() * 3,
          curve: (Math.random() - 0.5) * 0.5,
          branches: Math.random() > 0.5 ? [
            { angle: baseAngle + 0.5, length: 20 + Math.random() * 20, progress: 0 },
            { angle: baseAngle - 0.5, length: 15 + Math.random() * 15, progress: 0 },
          ] : [],
        });
      }

      inkDrops.push({
        x: dropX,
        y: dropY,
        radius: 0,
        maxRadius: 20 + Math.random() * 40,
        opacity: 0.15 + Math.random() * 0.1,
        spreading: true,
        tendrils,
        birthTime: time,
      });
    };

    const createBrushstroke = () => {
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height;
      const points: { x: number; y: number; width: number }[] = [];

      let x = startX;
      let y = startY;
      const direction = Math.random() * Math.PI * 2;
      const length = 100 + Math.random() * 200;
      const segments = Math.floor(length / 10);

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const curve = Math.sin(t * Math.PI * 2) * 30;
        const width = (1 - Math.abs(t - 0.5) * 2) * (8 + Math.random() * 8);

        points.push({
          x: x + Math.cos(direction + Math.PI / 2) * curve,
          y: y + Math.sin(direction + Math.PI / 2) * curve,
          width: Math.max(1, width),
        });

        x += Math.cos(direction) * 10;
        y += Math.sin(direction) * 10;
      }

      brushstrokes.push({
        points,
        progress: 0,
        opacity: 0.08 + Math.random() * 0.08,
        complete: false,
      });
    };

    // Initial drops
    for (let i = 0; i < 3; i++) {
      createInkDrop();
    }
    createBrushstroke();

    const drawInkDrop = (drop: InkDrop) => {
      // Main ink blob with organic edge
      ctx.beginPath();
      const wobblePoints = 32;
      for (let i = 0; i <= wobblePoints; i++) {
        const angle = (i / wobblePoints) * Math.PI * 2;
        const wobble = Math.sin(angle * 5 + drop.birthTime * 2) * drop.radius * 0.1;
        const r = drop.radius + wobble;
        const px = drop.x + Math.cos(angle) * r;
        const py = drop.y + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Gradient fill
      const gradient = ctx.createRadialGradient(
        drop.x, drop.y, 0,
        drop.x, drop.y, drop.radius * 1.2
      );
      gradient.addColorStop(0, `rgba(20, 20, 30, ${drop.opacity})`);
      gradient.addColorStop(0.6, `rgba(30, 30, 45, ${drop.opacity * 0.7})`);
      gradient.addColorStop(1, `rgba(40, 40, 60, 0)`);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw tendrils
      drop.tendrils.forEach(tendril => {
        if (tendril.length < 1) return;

        ctx.beginPath();
        ctx.moveTo(
          drop.x + Math.cos(tendril.angle) * drop.radius * 0.8,
          drop.y + Math.sin(tendril.angle) * drop.radius * 0.8
        );

        // Curved tendril path
        const steps = 10;
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const currentLength = tendril.length * t;
          const curveOffset = Math.sin(t * Math.PI) * tendril.curve * currentLength;
          const angle = tendril.angle + curveOffset * 0.02;

          const tx = drop.x + Math.cos(angle) * (drop.radius * 0.8 + currentLength);
          const ty = drop.y + Math.sin(angle) * (drop.radius * 0.8 + currentLength);
          ctx.lineTo(tx, ty);
        }

        ctx.strokeStyle = `rgba(25, 25, 40, ${drop.opacity * (1 - tendril.length / tendril.targetLength * 0.5)})`;
        ctx.lineWidth = tendril.width * (1 - tendril.length / tendril.targetLength * 0.7);
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw branches
        tendril.branches.forEach(branch => {
          if (branch.progress < 0.3) return;

          const branchStart = drop.radius * 0.8 + tendril.length * 0.5;
          const startAngle = tendril.angle + tendril.curve * 0.3;
          const bx = drop.x + Math.cos(startAngle) * branchStart;
          const by = drop.y + Math.sin(startAngle) * branchStart;

          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(
            bx + Math.cos(branch.angle) * branch.length * branch.progress,
            by + Math.sin(branch.angle) * branch.length * branch.progress
          );
          ctx.strokeStyle = `rgba(30, 30, 50, ${drop.opacity * 0.5 * branch.progress})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      // Inner highlight
      const highlight = ctx.createRadialGradient(
        drop.x - drop.radius * 0.3, drop.y - drop.radius * 0.3, 0,
        drop.x, drop.y, drop.radius * 0.8
      );
      highlight.addColorStop(0, `rgba(60, 60, 80, ${drop.opacity * 0.3})`);
      highlight.addColorStop(1, 'transparent');
      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, drop.radius * 0.8, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawBrushstroke = (stroke: Brushstroke) => {
      const visiblePoints = Math.floor(stroke.points.length * stroke.progress);
      if (visiblePoints < 2) return;

      for (let i = 1; i < visiblePoints; i++) {
        const p1 = stroke.points[i - 1];
        const p2 = stroke.points[i];

        const fadeIn = Math.min(1, i / 5);
        const fadeOut = Math.min(1, (visiblePoints - i) / 5);
        const alpha = stroke.opacity * fadeIn * fadeOut;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(35, 35, 55, ${alpha})`;
        ctx.lineWidth = (p1.width + p2.width) / 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Dry brush texture
        if (Math.random() < 0.3) {
          const offset = (Math.random() - 0.5) * p1.width;
          ctx.beginPath();
          ctx.arc(
            (p1.x + p2.x) / 2 + offset,
            (p1.y + p2.y) / 2 + offset,
            1,
            0, Math.PI * 2
          );
          ctx.fillStyle = `rgba(40, 40, 60, ${alpha * 0.5})`;
          ctx.fill();
        }
      }
    };

    const animate = () => {
      time += 0.016;

      // Paper texture background
      ctx.fillStyle = '#f5f0e6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle paper grain
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle = `rgba(200, 190, 170, ${Math.random() * 0.05})`;
        ctx.fillRect(x, y, 1, 1);
      }

      // Update and draw ink drops
      for (let i = inkDrops.length - 1; i >= 0; i--) {
        const drop = inkDrops[i];

        if (drop.spreading) {
          drop.radius += (drop.maxRadius - drop.radius) * 0.02;

          // Grow tendrils
          drop.tendrils.forEach(tendril => {
            if (tendril.length < tendril.targetLength) {
              tendril.length += (tendril.targetLength - tendril.length) * 0.03;

              // Grow branches after main tendril is 50% grown
              if (tendril.length > tendril.targetLength * 0.5) {
                tendril.branches.forEach(branch => {
                  if (branch.progress < 1) {
                    branch.progress += 0.02;
                  }
                });
              }
            }
          });

          if (drop.radius > drop.maxRadius * 0.95) {
            drop.spreading = false;
          }
        }

        // Fade out old drops
        const age = time - drop.birthTime;
        if (age > 8) {
          drop.opacity *= 0.995;
          if (drop.opacity < 0.01) {
            inkDrops.splice(i, 1);
            continue;
          }
        }

        drawInkDrop(drop);
      }

      // Update and draw brushstrokes
      for (let i = brushstrokes.length - 1; i >= 0; i--) {
        const stroke = brushstrokes[i];

        if (!stroke.complete) {
          stroke.progress += 0.008;
          if (stroke.progress >= 1) {
            stroke.complete = true;
          }
        } else {
          stroke.opacity *= 0.998;
          if (stroke.opacity < 0.01) {
            brushstrokes.splice(i, 1);
            continue;
          }
        }

        drawBrushstroke(stroke);
      }

      // Occasionally add new elements
      if (Math.random() < 0.005 && inkDrops.length < 6) {
        createInkDrop();
      }
      if (Math.random() < 0.003 && brushstrokes.length < 4) {
        createBrushstroke();
      }

      // Vignette overlay
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.7
      );
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(200, 190, 170, 0.3)');
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
