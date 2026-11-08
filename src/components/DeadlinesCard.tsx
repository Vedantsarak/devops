import React from 'react';
import { ChevronRight, Award, Trophy, Briefcase } from 'lucide-react';
import { UpcomingDeadline } from '../types/devos';

interface DeadlinesCardProps {
  deadlines: UpcomingDeadline[];
  onViewAll: () => void;
  onSelectDeadline?: (deadline: UpcomingDeadline) => void;
}

export const DeadlinesCard: React.FC<DeadlinesCardProps> = ({
  deadlines,
  onViewAll,
  onSelectDeadline,
}) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'hackathon':
        return (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-500/20 border border-rose-400/50 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.4)]">
            <Award className="w-4 h-4" />
          </div>
        );
      case 'contest':
        return (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]">
            <Trophy className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.4)]">
            <Briefcase className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#06183a]/80 via-[#030e25]/90 to-[#020716]/95 border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.12)] backdrop-blur-md">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white tracking-wide">
          Upcoming Deadlines
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-200 flex items-center gap-0.5 transition-colors group"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Deadlines List */}
      <div className="space-y-2.5">
        {deadlines.map((dl) => {
          return (
            <div
              key={dl.id}
              onClick={() => onSelectDeadline?.(dl)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                {getIcon(dl.category)}
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {dl.title}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {dl.dateStr}
                  </div>
                </div>
              </div>

              {/* Countdown Pill Badge */}
              <div
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-tight shadow-md ${
                  dl.badgeColor === 'red' || dl.daysRemaining <= 2
                    ? 'bg-rose-500/25 border border-rose-500/60 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                    : 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.3)]'
                }`}
              >
                {dl.daysRemaining}d
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
