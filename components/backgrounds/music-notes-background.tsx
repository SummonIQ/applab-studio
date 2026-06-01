'use client';

import { useEffect, useRef } from 'react';

interface Note {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  type: 'quarter' | 'eighth' | 'double-eighth' | 'treble';
  hue: number;
  opacity: number;
}

export function MusicNotesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const notes: Note[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (notes.length === 0) initNotes();
    };

    const initNotes = () => {
      notes.length = 0;
      const types: Note['type'][] = ['quarter', 'eighth', 'double-eighth', 'treble'];
      for (let i = 0; i < 25; i++) {
        notes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: -(0.5 + Math.random() * 1),
          rotation: (Math.random() - 0.5) * 0.5,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          scale: 0.6 + Math.random() * 0.8,
          type: types[Math.floor(Math.random() * types.length)],
          hue: 30 + Math.random() * 30,
          opacity: 0.4 + Math.random() * 0.4,
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const drawQuarterNote = (x: number, y: number, scale: number) => {
      ctx.beginPath();
      ctx.ellipse(x, y, 12 * scale, 9 * scale, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 10 * scale, y - 3 * scale);
      ctx.lineTo(x + 10 * scale, y - 45 * scale);
      ctx.lineWidth = 2.5 * scale;
      ctx.stroke();
    };

    const drawEighthNote = (x: number, y: number, scale: number) => {
      drawQuarterNote(x, y, scale);
      ctx.beginPath();
      ctx.moveTo(x + 10 * scale, y - 45 * scale);
      ctx.quadraticCurveTo(x + 25 * scale, y - 35 * scale, x + 20 * scale, y - 20 * scale);
      ctx.lineWidth = 2.5 * scale;
      ctx.stroke();
    };

    const drawDoubleEighth = (x: number, y: number, scale: number) => {
      ctx.beginPath();
      ctx.ellipse(x - 10 * scale, y, 10 * scale, 7 * scale, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - 2 * scale, y - 3 * scale);
      ctx.lineTo(x - 2 * scale, y - 40 * scale);
      ctx.lineWidth = 2.5 * scale;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(x + 15 * scale, y, 10 * scale, 7 * scale, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 23 * scale, y - 3 * scale);
      ctx.lineTo(x + 23 * scale, y - 40 * scale);
      ctx.lineWidth = 2.5 * scale;
      ctx.stroke();

      ctx.fillRect(x - 2 * scale, y - 42 * scale, 27 * scale, 5 * scale);
    };

    const drawTrebleClef = (x: number, y: number, scale: number) => {
      ctx.beginPath();
      ctx.lineWidth = 3 * scale;
      ctx.moveTo(x, y + 30 * scale);
      ctx.bezierCurveTo(x - 15 * scale, y + 10 * scale, x + 15 * scale, y - 10 * scale, x, y - 25 * scale);
      ctx.bezierCurveTo(x - 20 * scale, y - 40 * scale, x - 20 * scale, y - 5 * scale, x + 5 * scale, y + 15 * scale);
      ctx.bezierCurveTo(x + 15 * scale, y + 30 * scale, x - 10 * scale, y + 45 * scale, x - 5 * scale, y + 50 * scale);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x - 3 * scale, y + 50 * scale, 4 * scale, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawNote = (note: Note) => {
      ctx.save();
      ctx.translate(note.x, note.y);
      ctx.rotate(note.rotation);

      ctx.fillStyle = `hsla(${note.hue}, 70%, 65%, ${note.opacity})`;
      ctx.strokeStyle = `hsla(${note.hue}, 70%, 65%, ${note.opacity})`;

      switch (note.type) {
        case 'quarter':
          drawQuarterNote(0, 0, note.scale);
          break;
        case 'eighth':
          drawEighthNote(0, 0, note.scale);
          break;
        case 'double-eighth':
          drawDoubleEighth(0, 0, note.scale);
          break;
        case 'treble':
          drawTrebleClef(0, 0, note.scale);
          break;
      }

      ctx.restore();
    };

    const drawStaffLines = () => {
      const lineCount = 5;
      const spacing = 15;
      const sets = Math.ceil(canvas.height / 200) + 1;

      ctx.strokeStyle = 'rgba(255, 220, 150, 0.08)';
      ctx.lineWidth = 1;

      for (let s = 0; s < sets; s++) {
        const baseY = s * 200 + 100 + Math.sin(time + s) * 10;
        for (let i = 0; i < lineCount; i++) {
          const y = baseY + i * spacing;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }
    };

    const animate = () => {
      time += 0.02;

      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, '#1a0a20');
      bgGradient.addColorStop(0.5, '#150818');
      bgGradient.addColorStop(1, '#0a0510');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawStaffLines();

      for (const note of notes) {
        note.x += note.vx + Math.sin(time + note.y * 0.01) * 0.3;
        note.y += note.vy;
        note.rotation += note.rotationSpeed;

        if (note.y < -80) {
          note.y = canvas.height + 80;
          note.x = Math.random() * canvas.width;
        }

        drawNote(note);
      }

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
