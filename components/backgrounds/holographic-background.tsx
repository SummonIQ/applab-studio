'use client';

import { useEffect, useState } from 'react';

interface HolographicBackgroundProps {
  primaryColor?: string;
  secondaryColor?: string;
  speed?: number;
}

export function HolographicBackground({
  primaryColor = '#06b6d4',
  secondaryColor = '#ec4899',
  speed = 3,
}: HolographicBackgroundProps) {
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition((prev) => (prev + 1) % 100);
    }, speed * 10);

    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        }}
      />

      {/* Animated overlay gradients */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)
          `,
          transform: `translateX(${scanPosition - 50}%)`,
          transition: 'transform 0.1s linear',
        }}
      />

      {/* Scan lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          )`,
        }}
      />

      {/* Moving scan line */}
      <div
        className="absolute left-0 right-0 h-1 bg-white/30 blur-sm"
        style={{
          top: `${scanPosition}%`,
          transition: 'top 0.1s linear',
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
    </div>
  );
}

