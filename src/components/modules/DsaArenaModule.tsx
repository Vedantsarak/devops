import React, { useState } from 'react';
import { 
  Trophy, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Code, 
  FileText,
  X
} from 'lucide-react';
import { DsaProblem } from '../../types/devos';

interface DsaArenaModuleProps {
  problems: DsaProblem[];
  onUpdateProblemStatus: (id: string, status: 'Solved' | 'Attempted' | 'Todo') => void;
}

export const DsaArenaModule: React.FC<DsaArenaModuleProps> = ({
  problems,
  onUpdateProblemStatus,
}) => {
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [selectedProblem, setSelectedProblem] = useState<DsaProblem | null>(null);

  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchDiff = filterDifficulty === 'All' || p.difficulty === filterDifficulty;
    return matchSearch && matchDiff;
  });

  const solvedCount = problems.filter((p) => p.status === 'Solved').length;
  const progressPct = Math.round((solvedCount / problems.length) * 100);

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#030d22]/80 border border-cyan-500/25 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.4)]">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              DSA & Competitive Arena
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {progressPct}% Mastered
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Structured algorithm progression, complexity analysis, and LeetCode tracking
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problem or category..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-cyan-500/30">
            {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDifficulty(d)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filterDifficulty === d
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Problem List & Problem Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Problem List */}
        <div className={`space-y-2 overflow-y-auto custom-scrollbar ${selectedProblem ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          {filtered.map((prob) => {
            const isSolved = prob.status === 'Solved';
            return (
              <div
                key={prob.id}
                onClick={() => setSelectedProblem(prob)}
                className={`p-3.5 rounded-2xl bg-[#040e24]/80 border transition-all cursor-pointer flex items-center justify-between group ${
                  selectedProblem?.id === prob.id
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(0,220,255,0.2)]'
                    : 'border-cyan-500/20 hover:border-cyan-500/50 hover:bg-[#05132d]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateProblemStatus(
                        prob.id,
                        isSolved ? 'Todo' : 'Solved'
                      );
                    }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isSolved
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 shadow-[0_0_8px_#34d399]'
                        : 'border-2 border-slate-600 hover:border-cyan-400'
                    }`}
                  >
                    {isSolved && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors flex items-center gap-2">
                      {prob.title}
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-normal">
                        {prob.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-0.5">
                      {prob.timeComplexity && (
                        <span>Time: <span className="font-mono text-cyan-300">{prob.timeComplexity}</span></span>
                      )}
                      {prob.spaceComplexity && (
                        <span>Space: <span className="font-mono text-cyan-300">{prob.spaceComplexity}</span></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      prob.difficulty === 'Easy'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : prob.difficulty === 'Medium'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Problem Detail Drawer */}
        {selectedProblem && (
          <div className="lg:col-span-5 p-4 rounded-2xl bg-[#030d22]/95 border border-cyan-400/40 shadow-[0_0_25px_rgba(0,180,255,0.2)] flex flex-col justify-between overflow-y-auto custom-scrollbar">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {selectedProblem.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-cyan-300 font-medium">
                      {selectedProblem.category}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-amber-300">
                      {selectedProblem.difficulty}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Switcher */}
              <div className="my-3 p-2 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Status</span>
                <div className="flex items-center gap-1">
                  {(['Solved', 'Attempted', 'Todo'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => onUpdateProblemStatus(selectedProblem.id, s)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                        selectedProblem.status === s
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Solution Notes */}
              {selectedProblem.notes && (
                <div className="my-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 mb-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Algorithmic Invariant & Notes</span>
                  </div>
                  <p className="text-xs text-slate-300 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 leading-relaxed">
                    {selectedProblem.notes}
                  </p>
                </div>
              )}

              {/* Solution Code */}
              {selectedProblem.solution && (
                <div className="my-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 mb-1">
                    <Code className="w-3.5 h-3.5" />
                    <span>Saved Solution Implementation</span>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-950 text-emerald-300 font-mono text-[11px] overflow-x-auto border border-cyan-500/20 custom-scrollbar">
                    {selectedProblem.solution}
                  </pre>
                </div>
              )}
            </div>

            {/* LeetCode Direct Link */}
            {selectedProblem.url && (
              <a
                href={selectedProblem.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 w-full py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              >
                <span>Solve on LeetCode</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
