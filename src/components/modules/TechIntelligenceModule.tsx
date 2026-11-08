import React, { useState } from 'react';
import { 
  Crosshair, 
  ExternalLink, 
  Clock, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import { TechNewsItem } from '../../types/devos';

interface TechIntelligenceModuleProps {
  news: TechNewsItem[];
}

export const TechIntelligenceModule: React.FC<TechIntelligenceModuleProps> = ({ news }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filtered = selectedCategory === 'All'
    ? news
    : news.filter((n) => n.category === selectedCategory);

  const categories = ['All', 'AI Research', 'Engineering', 'Tools'];

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#030d22]/80 border border-cyan-500/25 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Crosshair className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Tech Intelligence & Signal Radar
            </h2>
            <p className="text-xs text-slate-400">
              Noise-filtered AI research papers, systems breakthroughs, and production engineering releases
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-cyan-500/30">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedCategory === c
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar flex-1">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-[#030e25]/90 border border-cyan-500/25 hover:border-cyan-400 transition-all flex flex-col justify-between group shadow-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-md"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-cyan-400 font-medium mb-2">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-bold">
                  {item.category}
                </span>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {item.summary}
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-cyan-500/15 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-400 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-200 ml-2 shrink-0 group-hover:translate-x-0.5 transition-all"
              >
                <span>Read Full</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
