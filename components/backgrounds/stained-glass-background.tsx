'use client';

import { useEffect, useRef } from 'react';

interface Cell {
  x: number;
  y: number;
  hue: number;
  saturation: number;
  lightness: number;
}

export function StainedGlassBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let cells: Cell[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initCells();
    };

    const initCells = () => {
      cells = [];
      const cellCount = 50;
      for (let i = 0; i < cellCount; i++) {
        cells.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          hue: Math.random() * 360,
          saturation: 50 + Math.random() * 30,
          lightness: 40 + Math.random() * 25,
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const getClosestCell = (px: number, py: number): number => {
      let minDist = Infinity;
      let closest = 0;
      for (let i = 0; i < cells.length; i++) {
        const dx = px - cells[i].x;
        const dy = py - cells[i].y;
        const dist = dx * dx + dy * dy;
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }
      return closest;
    };

    const getSecondClosestDist = (px: number, py: number, closestIdx: number): number => {
      let minDist = Infinity;
      for (let i = 0; i < cells.length; i++) {
        if (i === closestIdx) continue;
        const dx = px - cells[i].x;
        const dy = py - cells[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
        }
      }
      return minDist;
    };

    const animate = () => {
      time += 0.005;

      for (const cell of cells) {
        cell.x += Math.sin(time + cell.hue * 0.01) * 0.3;
        cell.y += Math.cos(time * 1.1 + cell.hue * 0.01) * 0.3;
        cell.hue = (cell.hue + 0.1) % 360;

        if (cell.x < -50) cell.x = canvas.width + 50;
        if (cell.x > canvas.width + 50) cell.x = -50;
        if (cell.y < -50) cell.y = canvas.height + 50;
        if (cell.y > canvas.height + 50) cell.y = -50;
      }

      const pixelSize = 4;
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let y = 0; y < canvas.height; y += pixelSize) {
        for (let x = 0; x < canvas.width; x += pixelSize) {
          const closestIdx = getClosestCell(x, y);
          const cell = cells[closestIdx];

          const dx = x - cell.x;
          const dy = y - cell.y;
          const distToClosest = Math.sqrt(dx * dx + dy * dy);
          const distToSecond = getSecondClosestDist(x, y, closestIdx);

          const edgeFactor = distToSecond - distToClosest;
          const isEdge = edgeFactor < 8;

          const lightAngle = Math.sin(time * 0.5) * 0.3;
          const lightX = canvas.width * (0.5 + lightAngle);
          const lightDist = Math.sqrt((x - lightX) ** 2 + y ** 2);
          const lightIntensity = Math.max(0, 1 - lightDist / (canvas.height * 0.8));

          let h = cell.hue;
          let s = cell.saturation;
          let l = cell.lightness + lightIntensity * 20;

          if (isEdge) {
            l = 15;
            s = 10;
          }

          const c = (1 - Math.abs(2 * l / 100 - 1)) * (s / 100);
          const hPrime = h / 60;
          const xVal = c * (1 - Math.abs((hPrime % 2) - 1));
          const m = l / 100 - c / 2;

          let r = 0, g = 0, b = 0;
          if (hPrime < 1) { r = c; g = xVal; }
          else if (hPrime < 2) { r = xVal; g = c; }
          else if (hPrime < 3) { g = c; b = xVal; }
          else if (hPrime < 4) { g = xVal; b = c; }
          else if (hPrime < 5) { r = xVal; b = c; }
          else { r = c; b = xVal; }

          r = Math.round((r + m) * 255);
          g = Math.round((g + m) * 255);
          b = Math.round((b + m) * 255);

          for (let py = 0; py < pixelSize && y + py < canvas.height; py++) {
            for (let px = 0; px < pixelSize && x + px < canvas.width; px++) {
              const idx = ((y + py) * canvas.width + (x + px)) * 4;
              data[idx] = r;
              data[idx + 1] = g;
              data[idx + 2] = b;
              data[idx + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const shineX = canvas.width * (0.3 + Math.sin(time * 0.3) * 0.2);
      const shineGradient = ctx.createRadialGradient(shineX, -100, 0, shineX, canvas.height * 0.5, canvas.height);
      shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      shineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
      shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shineGradient;
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
