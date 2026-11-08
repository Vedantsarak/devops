import React from 'react';
import {
  Home,
  Code2,
  Trophy,
  GraduationCap,
  Atom,
  Calendar,
  Database,
  TrendingUp,
} from 'lucide-react';
import { NavModule } from '../types/devos';

interface BottomDockProps {
  currentModule: NavModule;
  onSelectModule: (module: NavModule) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  currentModule,
  onSelectModule,
}) => {
  const leftItems = [
    { id: 'home' as NavModule, label: 'Home', icon: Home, isHex: true },
    { id: 'coding' as NavModule, label: 'Coding', icon: Code2 },
    { id: 'dsa' as NavModule, label: 'DSA', icon: Trophy },
    { id: 'learn' as NavModule, label: 'Learn', icon: GraduationCap },
  ];

  const rightItems = [
    { id: 'research' as NavModule, label: 'Research', icon: Atom },
    { id: 'calendar' as NavModule, label: 'Calendar', icon: Calendar },
    { id: 'vault' as NavModule, label: 'Vault', icon: Database },
    { id: 'analytics' as NavModule, label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-full px-4 pointer-events-auto">
      {/* Outer futuristic angled glass console */}
      <div className="relative px-4 py-2 rounded-2xl bg-[#040e24]/85 border border-cyan-400/40 shadow-[0_10px_35px_rgba(0,180,255,0.35)] backdrop-blur-xl flex items-center gap-1.5 md:gap-3">
        {/* Glow backdrop bar */}
        <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]" />

        {/* Left Nav items */}
        {leftItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className="group flex flex-col items-center justify-center p-1.5 md:p-2 rounded-xl transition-all relative"
            >
              <div
                className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center transition-all ${
                  item.isHex && isActive
                    ? 'rounded-xl bg-gradient-to-b from-cyan-400 to-blue-600 text-white shadow-[0_0_18px_rgba(0,240,255,0.8)] border border-cyan-200 scale-105'
                    : isActive
                    ? 'rounded-xl bg-cyan-500/30 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                    : 'rounded-xl text-slate-400 group-hover:text-cyan-300 group-hover:bg-cyan-950/40'
                }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span
                className={`text-[10px] md:text-[11px] font-semibold mt-1 transition-colors ${
                  isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Center Illuminated DevOS Delta Emblem */}
        <div
          onClick={() => onSelectModule('home')}
          className="relative px-2 group cursor-pointer -translate-y-1"
          title="DevOS Command Center"
        >
          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-b from-cyan-400/30 via-blue-700/40 to-indigo-950/80 border-2 border-cyan-300 flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.9)] hover:scale-110 transition-transform">
            <svg
              viewBox="0 0 36 36"
              className="w-7 h-7 md:w-8 md:h-8 fill-none stroke-cyan-200 stroke-2 filter drop-shadow-[0_0_10px_rgba(0,240,255,1)]"
            >
              <polygon points="18,4 32,28 4,28" className="fill-cyan-400/40" />
              <polygon points="18,11 26,26 10,26" className="stroke-white stroke-1 fill-cyan-300/60" />
              <circle cx="18" cy="19" r="2.5" className="fill-white" />
            </svg>
            <div className="absolute -bottom-1 w-6 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
          </div>
        </div>

        {/* Right Nav items */}
        {rightItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className="group flex flex-col items-center justify-center p-1.5 md:p-2 rounded-xl transition-all relative"
            >
              <div
                className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center transition-all ${
                  isActive
                    ? 'rounded-xl bg-cyan-500/30 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                    : 'rounded-xl text-slate-400 group-hover:text-cyan-300 group-hover:bg-cyan-950/40'
                }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span
                className={`text-[10px] md:text-[11px] font-semibold mt-1 transition-colors ${
                  isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
