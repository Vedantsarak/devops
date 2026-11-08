import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Copy, 
  Check, 
  Plus, 
  FileCode2, 
  Tag 
} from 'lucide-react';
import { SnippetNote } from '../../types/devos';

interface KnowledgeVaultModuleProps {
  snippets: SnippetNote[];
  onAddSnippet: (snip: SnippetNote) => void;
}

export const KnowledgeVaultModule: React.FC<KnowledgeVaultModuleProps> = ({
  snippets,
  onAddSnippet,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState<SnippetNote>(snippets[0]);
  const [copied, setCopied] = useState(false);

  const filtered = snippets.filter((s) => {
    const matchTitle = s.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = s.category.toLowerCase().includes(search.toLowerCase());
    const matchTags = s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchTitle || matchCategory || matchTags;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#030d22]/80 border border-cyan-500/25 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Knowledge Vault & Code Artifacts
            </h2>
            <p className="text-xs text-slate-400">
              Personalized technical documentation, verified architecture patterns, and algorithm snippets
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code snippets or tags..."
            className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Grid: Snippets Directory & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-2 overflow-y-auto custom-scrollbar">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedSnippet(item)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                selectedSnippet.id === item.id
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,220,255,0.2)]'
                  : 'bg-[#030d22]/80 border-cyan-500/20 hover:border-cyan-500/50 hover:bg-[#05132d]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">
                  {item.title}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {item.language}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">{item.category}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Code Previewer */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-[#020612]/95 border border-cyan-500/30 flex flex-col justify-between overflow-hidden shadow-[0_0_20px_rgba(0,180,255,0.1)]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {selectedSnippet.title}
                </h3>
                <span className="text-xs text-slate-400">
                  {selectedSnippet.category} • Updated {selectedSnippet.updatedAt}
                </span>
              </div>
              <button
                onClick={() => handleCopy(selectedSnippet.code)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="mt-4 p-4 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs leading-relaxed overflow-x-auto border border-cyan-500/20 custom-scrollbar max-h-[420px]">
              {selectedSnippet.code}
            </pre>
          </div>

          <div className="pt-3 border-t border-cyan-500/15 flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-slate-400">Tags:</span>
            {selectedSnippet.tags.map((t, i) => (
              <span key={i} className="text-xs font-mono text-cyan-300">
                {t}{i < selectedSnippet.tags.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
