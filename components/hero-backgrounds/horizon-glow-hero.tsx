'use client';

import { useEffect, useRef } from 'react';

interface Cloud {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  opacity: number;
}

interface Bird {
  x: number;
  y: number;
  wingPhase: number;
  speed: number;
  size: number;
}

interface Ray {
  angle: number;
  length: number;
  width: number;
  opacity: number;
  speed: number;
}

export function HorizonGlowHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const clouds: Cloud[] = [];
    const birds: Bird[] = [];
    const rays: Ray[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
      initializeClouds();
      initializeRays();
    };

    const initializeClouds = () => {
      clouds.length = 0;
      for (let i = 0; i < 8; i++) {
        clouds.push({
          x: Math.random() * canvas.width * 1.5 - canvas.width * 0.25,
          y: canvas.height * (0.2 + Math.random() * 0.3),
          width: 100 + Math.random() * 200,
          height: 30 + Math.random() * 40,
          speed: 0.1 + Math.random() * 0.2,
          opacity: 0.1 + Math.random() * 0.15,
        });
      }
    };

    const initializeRays = () => {
      rays.length = 0;
      for (let i = 0; i < 12; i++) {
        rays.push({
          angle: -0.4 + (i / 12) * 0.8,
          length: 0.4 + Math.random() * 0.4,
          width: 0.02 + Math.random() * 0.04,
          opacity: 0.03 + Math.random() * 0.04,
          speed: 0.001 + Math.random() * 0.002,
        });
      }
    };

    // Initialize birds
    for (let i = 0; i < 5; i++) {
      birds.push({
        x: Math.random() * 2000 - 500,
        y: 100 + Math.random() * 200,
        wingPhase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.3,
        size: 3 + Math.random() * 4,
      });
    }

    resize();
    window.addEventListener('resize', resize);

    const drawCloud = (cloud: Cloud) => {
      const numBlobs = 5;
      for (let i = 0; i < numBlobs; i++) {
        const blobX = cloud.x + (i / numBlobs) * cloud.width;
        const blobY = cloud.y + Math.sin(i * 1.5) * cloud.height * 0.3;
        const blobSize = cloud.height * (0.8 + Math.sin(i * 2) * 0.3);

        const gradient = ctx.createRadialGradient(
          blobX, blobY, 0,
          blobX, blobY, blobSize
        );
        gradient.addColorStop(0, `rgba(255, 200, 150, ${cloud.opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 150, 100, ${cloud.opacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(blobX - blobSize, blobY - blobSize, blobSize * 2, blobSize * 2);
      }
    };

    const drawBird = (bird: Bird) => {
      const wingY = Math.sin(bird.wingPhase) * bird.size * 0.6;

      ctx.strokeStyle = 'rgba(30, 20, 40, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      // Left wing
      ctx.beginPath();
      ctx.moveTo(bird.x, bird.y);
      ctx.quadraticCurveTo(
        bird.x - bird.size * 0.7, bird.y + wingY,
        bird.x - bird.size, bird.y + wingY * 0.5
      );
      ctx.stroke();

      // Right wing
      ctx.beginPath();
      ctx.moveTo(bird.x, bird.y);
      ctx.quadraticCurveTo(
        bird.x + bird.size * 0.7, bird.y + wingY,
        bird.x + bird.size, bird.y + wingY * 0.5
      );
      ctx.stroke();
    };

    const animate = () => {
      time += 0.016;

      const horizonY = canvas.height * 0.65;
      const sunX = canvas.width * 0.5;
      const sunY = horizonY + Math.sin(time * 0.1) * 10;

      // Sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, '#1a0a20');
      skyGradient.addColorStop(0.3, '#2d1035');
      skyGradient.addColorStop(0.5, '#4a1942');
      skyGradient.addColorStop(0.65, '#ff6b35');
      skyGradient.addColorStop(0.7, '#ff8c42');
      skyGradient.addColorStop(1, '#0a0a0f');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sun rays
      rays.forEach(ray => {
        const wobble = Math.sin(time * 2 + ray.angle * 10) * 0.02;
        const currentAngle = ray.angle + wobble;
        const rayLength = Math.min(canvas.width, canvas.height) * ray.length;

        const endX = sunX + Math.sin(currentAngle) * rayLength;
        const endY = sunY - Math.cos(currentAngle) * rayLength;

        const gradient = ctx.createLinearGradient(sunX, sunY, endX, endY);
        const pulse = Math.sin(time * ray.speed * 100 + ray.angle * 5) * 0.3 + 0.7;
        gradient.addColorStop(0, `rgba(255, 200, 100, ${ray.opacity * pulse})`);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = ray.width * canvas.width;
        ctx.stroke();
      });

      // Sun glow layers
      for (let i = 3; i >= 0; i--) {
        const size = (80 + i * 60) * (1 + Math.sin(time * 0.5) * 0.1);
        const gradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, size);

        if (i === 0) {
          gradient.addColorStop(0, 'rgba(255, 255, 200, 0.9)');
          gradient.addColorStop(0.3, 'rgba(255, 200, 100, 0.6)');
          gradient.addColorStop(1, 'transparent');
        } else {
          const alpha = 0.15 - i * 0.03;
          gradient.addColorStop(0, `rgba(255, 150, 50, ${alpha})`);
          gradient.addColorStop(0.5, `rgba(255, 100, 50, ${alpha * 0.5})`);
          gradient.addColorStop(1, 'transparent');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Update and draw clouds
      clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > canvas.width + cloud.width) {
          cloud.x = -cloud.width;
        }
        drawCloud(cloud);
      });

      // Horizon line glow
      const horizonGlow = ctx.createLinearGradient(0, horizonY - 50, 0, horizonY + 50);
      horizonGlow.addColorStop(0, 'transparent');
      horizonGlow.addColorStop(0.5, 'rgba(255, 150, 80, 0.15)');
      horizonGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, horizonY - 50, canvas.width, 100);

      // Water/ground below horizon
      const waterGradient = ctx.createLinearGradient(0, horizonY, 0, canvas.height);
      waterGradient.addColorStop(0, 'rgba(255, 100, 50, 0.1)');
      waterGradient.addColorStop(0.3, 'rgba(30, 20, 40, 0.8)');
      waterGradient.addColorStop(1, '#0a0a0f');
      ctx.fillStyle = waterGradient;
      ctx.fillRect(0, horizonY, canvas.width, canvas.height - horizonY);

      // Water reflections
      for (let i = 0; i < 8; i++) {
        const y = horizonY + 20 + i * 30;
        const shimmer = Math.sin(time * 2 + i) * 0.3 + 0.7;
        const width = (canvas.width * 0.3) * (1 - i * 0.1);

        const reflectionGradient = ctx.createLinearGradient(
          sunX - width / 2, y,
          sunX + width / 2, y
        );
        reflectionGradient.addColorStop(0, 'transparent');
        reflectionGradient.addColorStop(0.5, `rgba(255, 180, 100, ${0.08 * shimmer * (1 - i * 0.1)})`);
        reflectionGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = reflectionGradient;
        ctx.fillRect(sunX - width / 2, y - 2, width, 4);
      }

      // Update and draw birds
      birds.forEach(bird => {
        bird.x += bird.speed;
        bird.wingPhase += 0.15;
        bird.y += Math.sin(time + bird.x * 0.01) * 0.2;

        if (bird.x > canvas.width + 100) {
          bird.x = -50;
          bird.y = 80 + Math.random() * 150;
        }

        drawBird(bird);
      });

      // Atmospheric haze
      const hazeGradient = ctx.createRadialGradient(
        sunX, horizonY, 0,
        sunX, horizonY, canvas.width * 0.7
      );
      hazeGradient.addColorStop(0, 'rgba(255, 200, 150, 0.05)');
      hazeGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = hazeGradient;
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
