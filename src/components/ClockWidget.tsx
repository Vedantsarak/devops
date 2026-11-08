import React, { useState, useEffect } from 'react';
import { MiniGlobe } from './3d/MiniGlobe';

export const ClockWidget: React.FC = () => {
  const [isLiveClock, setIsLiveClock] = useState(false);
  const [timeStr, setTimeStr] = useState('14:30');
  const [dateStr, setDateStr] = useState('Sat, Apr 26, 2025');

  useEffect(() => {
    if (!isLiveClock) {
      setTimeStr('14:30');
      setDateStr('Sat, Apr 26, 2025');
      return;
    }

    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      };
      setDateStr(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [isLiveClock]);

  return (
    <div
      onClick={() => setIsLiveClock(!isLiveClock)}
      className="relative p-3.5 rounded-2xl bg-gradient-to-br from-[#06183a]/80 via-[#030e25]/90 to-[#020716]/95 border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.15)] backdrop-blur-md flex items-center justify-center gap-4 text-center overflow-hidden cursor-pointer group mx-auto w-full"
      title={isLiveClock ? 'Switch to Reference Timestamp (14:30)' : 'Switch to Live System Clock'}
    >
      <div className="z-10 text-center flex flex-col items-center justify-center">
        <div className="text-3xl font-black tracking-tight text-white font-mono drop-shadow-[0_0_10px_rgba(0,240,255,0.7)] text-center">
          {timeStr}
        </div>
        <div className="text-xs font-medium text-slate-300 tracking-wide mt-0.5 text-center">
          {dateStr}
        </div>
      </div>

      {/* Mini 3D rotating holographic earth globe */}
      <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
        <MiniGlobe />
      </div>
    </div>
  );
};
