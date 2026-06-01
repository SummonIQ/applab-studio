'use client';

import { useEffect, useRef } from 'react';

interface DustMote {
  x: number;
  y: number;
  z: number;
  size: number;
  baseSpeed: number;
  wobblePhase: number;
  wobbleSpeed: number;
  brightness: number;
}

interface LightRay {
  x: number;
  width: number;
  opacity: number;
  drift: number;
}

interface Sparkle {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
}

export function DustParticlesHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const dustMotes: DustMote[] = [];
    const lightRays: LightRay[] = [];
    const sparkles: Sparkle[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
      initializeLightRays();
    };

    const initializeLightRays = () => {
      lightRays.length = 0;
      const rayCount = 5;
      for (let i = 0; i < rayCount; i++) {
        lightRays.push({
          x: canvas.width * (0.4 + i * 0.08),
          width: 30 + Math.random() * 50,
          opacity: 0.03 + Math.random() * 0.03,
          drift: Math.random() * Math.PI * 2,
        });
      }
    };

    // Initialize dust motes with depth (z)
    for (let i = 0; i < 120; i++) {
      dustMotes.push({
        x: Math.random() * 2000,
        y: Math.random() * 1500,
        z: Math.random(), // 0 = far, 1 = near
        size: 0.5 + Math.random() * 2,
        baseSpeed: 0.1 + Math.random() * 0.2,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.5 + Math.random() * 1,
        brightness: 0.3 + Math.random() * 0.7,
      });
    }

    resize();
    window.addEventListener('resize', resize);

    const getLightIntensity = (x: number, y: number) => {
      const lightCenterX = canvas.width * 0.65;
      const lightCenterY = -canvas.height * 0.3;

      // Check if in light cone
      const angle = Math.atan2(y - lightCenterY, x - lightCenterX);
      const coneAngle = Math.PI * 0.3;
      const baseAngle = Math.PI * 0.4;

      const angleFromBase = Math.abs(angle - baseAngle);
      if (angleFromBase > coneAngle) return 0;

      const dist = Math.hypot(x - lightCenterX, y - lightCenterY);
      const normalizedAngle = 1 - angleFromBase / coneAngle;
      const normalizedDist = Math.max(0, 1 - dist / (canvas.height * 1.5));

      return normalizedAngle * normalizedDist;
    };

    const drawLightRays = () => {
      const lightCenterX = canvas.width * 0.65;
      const lightCenterY = -canvas.height * 0.1;

      lightRays.forEach((ray, i) => {
        const drift = Math.sin(time * 0.3 + ray.drift) * 20;
        const rayX = ray.x + drift;

        // Create diagonal light ray
        ctx.beginPath();
        ctx.moveTo(rayX - ray.width / 2, 0);
        ctx.lineTo(rayX + ray.width / 2, 0);
        ctx.lineTo(rayX + ray.width * 2 + drift * 0.5, canvas.height);
        ctx.lineTo(rayX + ray.width + drift * 0.5, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(
          rayX, 0,
          rayX + ray.width * 1.5, canvas.height
        );
        const pulse = Math.sin(time * 0.5 + i) * 0.3 + 0.7;
        gradient.addColorStop(0, `rgba(255, 240, 200, ${ray.opacity * pulse})`);
        gradient.addColorStop(0.3, `rgba(255, 230, 180, ${ray.opacity * pulse * 0.7})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Main light source glow
      const sourceGlow = ctx.createRadialGradient(
        lightCenterX, lightCenterY, 0,
        lightCenterX, lightCenterY, canvas.width * 0.4
      );
      sourceGlow.addColorStop(0, 'rgba(255, 250, 230, 0.15)');
      sourceGlow.addColorStop(0.3, 'rgba(255, 240, 200, 0.08)');
      sourceGlow.addColorStop(0.6, 'rgba(255, 220, 180, 0.03)');
      sourceGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sourceGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawDustMote = (mote: DustMote) => {
      const lightIntensity = getLightIntensity(mote.x, mote.y);
      const depthScale = 0.5 + mote.z * 0.5;
      const depthBlur = 1 - mote.z * 0.5;

      // Base visibility plus light boost
      let alpha = 0.1 + lightIntensity * 0.6 * mote.brightness;
      alpha *= depthBlur;

      if (alpha < 0.02) return;

      const size = mote.size * depthScale;

      // Outer glow when in light
      if (lightIntensity > 0.2) {
        const glowSize = size * (3 + lightIntensity * 4);
        const glow = ctx.createRadialGradient(
          mote.x, mote.y, 0,
          mote.x, mote.y, glowSize
        );
        glow.addColorStop(0, `rgba(255, 250, 220, ${alpha * lightIntensity * 0.5})`);
        glow.addColorStop(0.5, `rgba(255, 240, 200, ${alpha * lightIntensity * 0.2})`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(mote.x - glowSize, mote.y - glowSize, glowSize * 2, glowSize * 2);

        // Occasional sparkle
        if (lightIntensity > 0.5 && Math.random() < 0.01) {
          sparkles.push({
            x: mote.x,
            y: mote.y,
            life: 1,
            maxLife: 1,
            size: size * 2,
          });
        }
      }

      // Core particle
      ctx.beginPath();
      ctx.arc(mote.x, mote.y, size, 0, Math.PI * 2);

      const coreColor = lightIntensity > 0.3
        ? `rgba(255, 250, 230, ${alpha})`
        : `rgba(200, 190, 170, ${alpha * 0.5})`;
      ctx.fillStyle = coreColor;
      ctx.fill();
    };

    const drawSparkle = (sparkle: Sparkle) => {
      const t = sparkle.life / sparkle.maxLife;
      const alpha = t * (1 - t) * 4;
      const size = sparkle.size * (1 + (1 - t) * 2);

      // Cross sparkle
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(sparkle.x - size, sparkle.y);
      ctx.lineTo(sparkle.x + size, sparkle.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(sparkle.x, sparkle.y - size);
      ctx.lineTo(sparkle.x, sparkle.y + size);
      ctx.stroke();

      // Diagonal lines
      const diagSize = size * 0.6;
      ctx.beginPath();
      ctx.moveTo(sparkle.x - diagSize, sparkle.y - diagSize);
      ctx.lineTo(sparkle.x + diagSize, sparkle.y + diagSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(sparkle.x + diagSize, sparkle.y - diagSize);
      ctx.lineTo(sparkle.x - diagSize, sparkle.y + diagSize);
      ctx.stroke();
    };

    const animate = () => {
      time += 0.016;

      // Dark room gradient
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, '#0f0c08');
      bgGradient.addColorStop(0.5, '#0c0a07');
      bgGradient.addColorStop(1, '#080705');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw light rays first (background)
      drawLightRays();

      // Sort motes by depth (far to near)
      dustMotes.sort((a, b) => a.z - b.z);

      // Update and draw dust motes
      dustMotes.forEach(mote => {
        // Floating motion
        const wobbleX = Math.sin(time * mote.wobbleSpeed + mote.wobblePhase) * 15;
        const wobbleY = Math.cos(time * mote.wobbleSpeed * 0.7 + mote.wobblePhase) * 10;

        mote.x += mote.baseSpeed * (0.5 + mote.z * 0.5) + wobbleX * 0.01;
        mote.y += mote.baseSpeed * 0.3 + wobbleY * 0.01;

        // Wrap around
        if (mote.x > canvas.width + 50) {
          mote.x = -50;
          mote.y = Math.random() * canvas.height;
        }
        if (mote.y > canvas.height + 50) {
          mote.y = -50;
          mote.x = Math.random() * canvas.width;
        }

        drawDustMote(mote);
      });

      // Update and draw sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sparkle = sparkles[i];
        sparkle.life -= 0.03;

        if (sparkle.life <= 0) {
          sparkles.splice(i, 1);
        } else {
          drawSparkle(sparkle);
        }
      }

      // Subtle volumetric fog
      const fogGradient = ctx.createRadialGradient(
        canvas.width * 0.6, canvas.height * 0.3, 0,
        canvas.width * 0.6, canvas.height * 0.3, canvas.width * 0.5
      );
      fogGradient.addColorStop(0, 'rgba(255, 240, 200, 0.02)');
      fogGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = fogGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Edge vignette
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.8
      );
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
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
