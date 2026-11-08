import React from 'react';
import { Code, Flame, Trophy, Star } from 'lucide-react';

interface MetricsCardsProps {
  projectsCount?: number;
  streakDays?: number;
  dsaPercentage?: number;
  overallScore?: number;
  onCardClick?: (metric: string) => void;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  projectsCount = 12,
  streakDays = 47,
  dsaPercentage = 78,
  overallScore = 96,
  onCardClick,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
      {/* 1. Projects Card */}
      <div
        onClick={() => onCardClick?.('coding')}
        className="relative group p-3.5 rounded-2xl bg-gradient-to-br from-[#06183a]/80 via-[#030d22]/90 to-[#020716]/95 border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.12)] hover:shadow-[0_0_25px_rgba(0,220,255,0.3)] transition-all cursor-pointer backdrop-blur-md overflow-hidden"
      >
        <div className="flex items-center gap-3">
          {/* Cyan Code Badge */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform shrink-0">
            <Code className="w-6 h-6 drop-shadow-[0_0_8px_rgba(0,240,255,0.9)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium text-slate-300 tracking-wide">
              Projects
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-white tracking-tight">
                {projectsCount}
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center">
                ↑ +2%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Learning Streak Card */}
      <div
        onClick={() => onCardClick?.('learn')}
        className="relative group p-3.5 rounded-2xl bg-gradient-to-br from-[#06183a]/80 via-[#030d22]/90 to-[#020716]/95 border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.12)] hover:shadow-[0_0_25px_rgba(0,220,255,0.3)] transition-all cursor-pointer backdrop-blur-md overflow-hidden"
      >
        <div className="flex items-center gap-3">
          {/* Flame Icon Badge */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform shrink-0">
            <Flame className="w-6 h-6 fill-amber-400 text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium text-slate-300 tracking-wide">
              Learning Streak
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-white tracking-tight">
                {streakDays}
              </span>
              <span className="text-xs font-semibold text-slate-300">Days</span>
              <span className="text-xs font-bold text-emerald-400 ml-1">
                ↑ +1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DSA Progress Card */}
      <div
        onClick={() => onCardClick?.('dsa')}
        className="relative group p-3.5 rounded-2xl bg-gradient-to-br from-[#06183a]/80 via-[#030d22]/90 to-[#020716]/95 border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.12)] hover:shadow-[0_0_25px_rgba(0,220,255,0.3)] transition-all cursor-pointer backdrop-blur-md overflow-hidden"
      >
        <div className="flex items-center gap-3">
          {/* Trophy Icon Badge */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.4)] group-hover:scale-105 transition-transform shrink-0">
            <Trophy className="w-6 h-6 fill-yellow-400 text-yellow-200 drop-shadow-[0_0_8px_rgba(234,179,8,0.9)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium text-slate-300 tracking-wide">
              DSA Progress
            </div>
            <div className="text-2xl font-black text-white tracking-tight mt-0.5">
              {dsaPercentage}%
            </div>
          </div>
        </div>
        {/* Glowing Cyan Horizontal Progress Bar */}
        <div className="mt-2 w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden border border-cyan-500/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-300 shadow-[0_0_10px_rgba(0,240,255,0.8)] transition-all duration-500"
            style={{ width: `${dsaPercentage}%` }}
          />
        </div>
      </div>

      {/* 4. Overall Score Card */}
      <div
        onClick={() => onCardClick?.('analytics')}
        className="relative group p-3.5 rounded-2xl bg-gradient-to-br from-[#06183a]/80 via-[#030d22]/90 to-[#020716]/95 border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.12)] hover:shadow-[0_0_25px_rgba(0,220,255,0.3)] transition-all cursor-pointer backdrop-blur-md overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Star Icon Badge */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform shrink-0">
              <Star className="w-6 h-6 fill-amber-400 text-amber-200 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-300 tracking-wide">
                Overall Score
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-white tracking-tight">
                  {overallScore}
                </span>
                <span className="text-xs font-semibold text-slate-400">/100</span>
              </div>
            </div>
          </div>

          {/* Glowing Circular Progress Ring */}
          <div className="relative w-10 h-10 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {/* Background ring */}
              <circle
                cx="18"
                cy="18"
                r="14"
                className="stroke-slate-800"
                strokeWidth="3"
                fill="none"
              />
              {/* Glowing progress arc */}
              <circle
                cx="18"
                cy="18"
                r="14"
                className="stroke-cyan-400 transition-all duration-700"
                strokeWidth="3.2"
                strokeDasharray={`${(overallScore / 100) * 88} 88`}
                strokeLinecap="round"
                fill="none"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.8))',
                }}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
