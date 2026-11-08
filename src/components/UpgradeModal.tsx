import React from 'react';
import { Crown, Check, X, Sparkles, Zap, Shield } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const proFeatures = [
    'Unlimited Multi-Agent Orchestration runs (Gemini 2.5 Pro & Claude 3.5)',
    'Zero-latency GPU-accelerated WebAssembly code execution sandbox',
    'Automated daily GitHub & LeetCode telemetry synchronization',
    'Direct integration with Private Enterprise Repos & Supabase databases',
    'Custom AI Autonomous Agents with persistent Vector Memory',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#06183a] via-[#030d22] to-[#020716] border border-amber-400/50 shadow-[0_0_50px_rgba(251,191,36,0.3)] p-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.4)]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                DevOS Enterprise & Pro
              </h3>
              <p className="text-[11px] text-amber-300/80">
                Supercharge your developer universe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-5 space-y-2.5">
          {proFeatures.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
              <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="leading-snug">{f}</span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between mb-5">
          <div>
            <div className="text-xs font-semibold text-amber-200">Personal Pro Pass</div>
            <div className="text-[11px] text-slate-400">Cancel anytime • 14-day trial</div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-amber-300 font-mono">₹0</span>
            <span className="text-xs text-slate-400"> / first month</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:brightness-110 transition-all"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Activate DevOS Pro Pass</span>
        </button>
      </div>
    </div>
  );
};
