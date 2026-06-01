'use client';

import { useEffect, useState } from 'react';

interface AuroraBackgroundProps {
  colors?: string[];
  speed?: number;
}

export function AuroraBackground({
  colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
  speed = 5,
}: AuroraBackgroundProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => prev + 1);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      {colors.map((color, i) => (
        <div
          key={i}
          className="absolute inset-0 blur-3xl opacity-40"
          style={{
            background: `radial-gradient(ellipse at ${
              50 + Math.sin((offset + i * 120) * 0.01) * 30
            }% ${50 + Math.cos((offset + i * 120) * 0.01) * 20}%, ${color} 0%, transparent 50%)`,
            transform: `rotate(${offset * 0.1 + i * 45}deg) scale(${
              1.2 + Math.sin(offset * 0.01) * 0.2
            })`,
            transition: 'transform 0.3s ease-out',
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
    </div>
  );
}

