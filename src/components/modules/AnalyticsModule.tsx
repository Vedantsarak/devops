import React from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Activity,
  Award
} from 'lucide-react';

export const AnalyticsModule: React.FC = () => {
  const weeklyHours = [
    { day: 'Mon', hours: 4.5 },
    { day: 'Tue', hours: 6.2 },
    { day: 'Wed', hours: 5.8 },
    { day: 'Thu', hours: 7.0 },
    { day: 'Fri', hours: 6.5 },
    { day: 'Sat', hours: 8.4 },
    { day: 'Sun', hours: 7.2 },
  ];

  const maxHours = Math.max(...weeklyHours.map((d) => d.hours));

  const skillCategories = [
    { name: 'Data Structures & Algorithms', level: 86, color: 'from-cyan-400 to-blue-500' },
    { name: 'Distributed Systems & Database WAL', level: 78, color: 'from-purple-400 to-indigo-500' },
    { name: 'Full-Stack TypeScript & React', level: 94, color: 'from-emerald-400 to-teal-500' },
    { name: 'AI Engineering & Vector Embeddings', level: 75, color: 'from-amber-400 to-orange-500' },
  ];

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#030d22]/80 border border-cyan-500/25 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Engineering Analytics & Performance Telemetry
            </h2>
            <p className="text-xs text-slate-400">
              DSA progression velocity, weekly focus distribution, and skill competency metrics
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Weekly Focus Time Chart */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-[#030d22]/90 border border-cyan-500/30 flex flex-col justify-between backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Weekly Engineering Focus Hours</span>
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Total: 45.6 hrs
            </span>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="my-6 flex items-end justify-between gap-3 h-48 px-4">
            {weeklyHours.map((item) => {
              const heightPct = Math.round((item.hours / maxHours) * 100);
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.hours}h
                  </span>
                  <div className="w-full max-w-[36px] bg-slate-800 rounded-t-xl overflow-hidden relative border-t border-cyan-400/40">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 via-cyan-400 to-sky-200 shadow-[0_0_12px_rgba(0,240,255,0.6)] group-hover:brightness-125 transition-all duration-500"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-between text-xs text-slate-400">
            <span>Peak Velocity: Saturday (8.4 hrs)</span>
            <span className="text-cyan-300">Consistency: 98%</span>
          </div>
        </div>

        {/* Skill Mastery Breakdown */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#030d22]/90 border border-cyan-500/30 flex flex-col justify-between backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Skill Mastery Spectrum</span>
            </h3>
            <span className="text-xs text-cyan-400 font-mono">Top 2% Globally</span>
          </div>

          <div className="my-4 space-y-4">
            {skillCategories.map((skill) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{skill.name}</span>
                  <span className="font-mono font-bold text-cyan-300">{skill.level}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${skill.color} shadow-[0_0_8px_rgba(0,240,255,0.5)]`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-center gap-3">
            <Flame className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs text-slate-300">
              <strong className="text-white">47 Days Streak Active.</strong> You are 13 days away from unlocking the "Diamond Synthesizer" rank!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
