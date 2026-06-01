'use client';

import { useEffect, useState } from 'react';

interface GradientMeshBackgroundProps {
  colors?: string[];
  speed?: number;
}

export function GradientMeshBackground({
  colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
  speed = 3,
}: GradientMeshBackgroundProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 0.5) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full opacity-60 blur-3xl"
        style={{
          background: `
            radial-gradient(ellipse at ${20 + Math.sin(offset * 0.01) * 10}% ${
            30 + Math.cos(offset * 0.01) * 10
          }%, ${colors[0]} 0%, transparent 50%),
            radial-gradient(ellipse at ${80 + Math.sin(offset * 0.015) * 10}% ${
            70 + Math.cos(offset * 0.015) * 10
          }%, ${colors[1]} 0%, transparent 50%),
            radial-gradient(ellipse at ${50 + Math.sin(offset * 0.02) * 10}% ${
            50 + Math.cos(offset * 0.02) * 10
          }%, ${colors[2]} 0%, transparent 50%),
            radial-gradient(ellipse at ${30 + Math.sin(offset * 0.018) * 10}% ${
            80 + Math.cos(offset * 0.018) * 10
          }%, ${colors[3]} 0%, transparent 50%)
          `,
          transition: `background ${speed}s ease-in-out`,
        }}
      />
    </div>
  );
}

