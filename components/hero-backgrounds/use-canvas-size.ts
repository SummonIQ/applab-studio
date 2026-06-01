'use client';

import { useEffect, useRef, useState } from 'react';

export function useCanvasSize() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const width = parent.clientWidth || window.innerWidth;
        const height = parent.clientHeight || window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        setSize({ width, height });
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return { canvasRef, size };
}
