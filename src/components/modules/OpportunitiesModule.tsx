import React, { useState } from 'react';
import { 
  Briefcase, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Award, 
  MapPin, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { OpportunityItem } from '../../types/devos';

interface OpportunitiesModuleProps {
  opportunities: OpportunityItem[];
  onToggleSave: (id: string) => void;
}

export const OpportunitiesModule: React.FC<OpportunitiesModuleProps> = ({
  opportunities,
  onToggleSave,
}) => {
  const [filterType, setFilterType] = useState<string>('All');

  const filtered = filterType === 'All'
    ? opportunities
    : opportunities.filter((o) => o.type === filterType);

  const types = ['All', 'Hackathon', 'Competition', 'Internship', 'Conference'];

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#030d22]/80 border border-cyan-500/25 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Opportunities & Hackathons Radar
            </h2>
            <p className="text-xs text-slate-400">
              Verified software engineering internships, global hackathons, and competitive rounds
            </p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-cyan-500/30">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterType === t
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar flex-1">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="p-4 rounded-2xl bg-[#030e25]/90 border border-cyan-500/25 hover:border-cyan-400 transition-all flex flex-col justify-between group shadow-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 uppercase tracking-wider">
                  {opp.type}
                </span>

                <button
                  onClick={() => onToggleSave(opp.id)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Bookmark Opportunity"
                >
                  {opp.saved ? (
                    <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                {opp.title}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                {opp.organization}
              </div>

              {/* Meta details */}
              <div className="my-3 space-y-1.5 text-xs text-slate-400">
                {opp.prize && (
                  <div className="flex items-center gap-2 text-amber-300 font-semibold">
                    <Award className="w-3.5 h-3.5" />
                    <span>{opp.prize}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{opp.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Deadline: <span className="text-white font-medium">{opp.deadline}</span></span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 italic bg-slate-900/40 p-2 rounded-xl border border-slate-800/80">
                Eligibility: {opp.eligibility}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-cyan-500/15 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    opp.daysLeft <= 2
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  }`}
                >
                  {opp.daysLeft} days remaining
                </span>
              </div>

              <a
                href={opp.link}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              >
                <span>Apply / Register</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
