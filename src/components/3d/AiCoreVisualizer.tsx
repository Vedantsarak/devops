import React, { useEffect, useRef } from 'react';

export const AiCoreVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.025;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(cx, cy) * 0.88;

      ctx.clearRect(0, 0, width, height);

      // Radial ambient glow
      const ambientGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, maxRadius);
      ambientGrad.addColorStop(0, 'rgba(0, 240, 255, 0.28)');
      ambientGrad.addColorStop(0.5, 'rgba(0, 140, 255, 0.12)');
      ambientGrad.addColorStop(0.85, 'rgba(180, 0, 255, 0.05)');
      ambientGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
      ctx.fill();

      // Outer dashed high-tech ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius * 0.95, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Segmented cardinal bracket arcs
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-time * 0.35);
      ctx.strokeStyle = '#00f7ff';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([]);
      for (let i = 0; i < 4; i++) {
        const start = (i * Math.PI) / 2 + 0.15;
        const end = ((i + 1) * Math.PI) / 2 - 0.15;
        ctx.beginPath();
        ctx.arc(0, 0, maxRadius * 0.86, start, end);
        ctx.stroke();

        // Add tick dots at ends
        const dotX = Math.cos(start) * maxRadius * 0.86;
        const dotY = Math.sin(start) * maxRadius * 0.86;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Dense radial tick ring (counter-clockwise)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.45);
      ctx.strokeStyle = 'rgba(0, 220, 255, 0.55)';
      ctx.lineWidth = 1.2;
      const tickCount = 48;
      for (let i = 0; i < tickCount; i++) {
        const angle = (i * Math.PI * 2) / tickCount;
        const isLong = i % 4 === 0;
        const r1 = maxRadius * 0.68;
        const r2 = r1 + (isLong ? 7 : 3.5);
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
        ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
        ctx.stroke();
      }
      ctx.restore();

      // Inner orbital magenta/purple accent arc
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-time * 0.7);
      ctx.strokeStyle = '#e024c3';
      ctx.lineWidth = 2;
      ctx.setLineDash([14, 18]);
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius * 0.54, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Inner solid cyan aperture ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius * 0.38, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Central Pulsating Energy Core Sphere
      const pulseScale = 1 + Math.sin(time * 3) * 0.12;
      const coreRadius = maxRadius * 0.24 * pulseScale;

      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreRadius);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.3, '#00f7ff');
      coreGrad.addColorStop(0.7, '#0066ff');
      coreGrad.addColorStop(1, 'rgba(0, 20, 60, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Central hot white dot
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f7ff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Orbiting energy sparks
      for (let s = 0; s < 3; s++) {
        const sparkAngle = time * (1.5 + s * 0.4) + (s * Math.PI * 2) / 3;
        const sparkDist = maxRadius * (0.42 + s * 0.18);
        const sx = cx + Math.cos(sparkAngle) * sparkDist;
        const sy = cy + Math.sin(sparkAngle) * sparkDist;

        ctx.fillStyle = s === 1 ? '#ff46e8' : '#00ffff';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full py-1">
      <canvas
        ref={canvasRef}
        width={220}
        height={220}
        className="w-[155px] h-[155px] md:w-[175px] md:h-[175px]"
      />
    </div>
  );
};
