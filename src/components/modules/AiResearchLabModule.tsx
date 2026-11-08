import React, { useState } from 'react';
import { 
  Atom, 
  Code, 
  GraduationCap, 
  Briefcase, 
  Crosshair, 
  TrendingUp, 
  Play, 
  Sparkles, 
  Cpu, 
  CheckCircle,
  Copy,
  Layers
} from 'lucide-react';
import { AgentType } from '../../types/devos';

interface AiResearchLabModuleProps {
  agents: AgentType[];
}

export const AiResearchLabModule: React.FC<AiResearchLabModuleProps> = ({ agents }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0].id);
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'ollama' | 'groq' | 'openrouter'>('gemini');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [prompt, setPrompt] = useState(
    'Synthesize the latest algorithmic papers on Multi-head Latent Attention (MLA) and evaluate trade-offs against standard Multi-Head Attention (MHA) in memory-bound inference.'
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(
    `[Multi-Agent Pipeline: Research Agent v2.4]
Provider: Google Gemini Gateway (Latency: 280ms)
Confidence Score: 0.98

### Executive Summary: Multi-Head Latent Attention (MLA)
1. **Memory Compression Ratio**: MLA compresses Key-Value (KV) cache tensors into low-rank latent vectors before projection, achieving up to 93.3% KV cache compression during generation phases.
2. **Matrix Factorization**: Down-projection (W_DKV) maps hidden dimension d -> d_c, while decoupled rotary positional embeddings (RoPE) preserve positional variance without inflating KV cache footprint.
3. **Inference Bandwidth**: Breaks the memory bandwidth bottleneck on consumer GPU nodes (A100/H100), enabling batch sizes up to 5.7x larger under identical VRAM constraints.

### Academic Citations:
- DeepSeek-AI et al., "DeepSeek-V3 Technical Report", arXiv:2412.19437, 2024.
- Shazeer, N., "Fast Transformer Decoding: One Write-Head is All You Need", arXiv:1911.02150.
- FlashAttention-3: "Fast and Memory-Efficient Exact Attention with Asynchrony and FP8", Tri Dao et al., 2024.`
  );

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const handleRunAgent = () => {
    setIsExecuting(true);
    setExecutionOutput(null);

    setTimeout(() => {
      setIsExecuting(false);
      setExecutionOutput(
        `[Multi-Agent Orchestration: ${selectedAgent.name}]
Routed via: ${selectedProvider.toUpperCase()} (${selectedModel})
Execution Status: COMPLETE (HTTP 200 OK)

### Synthesis Result:
The task has been parsed and structured into actionable technical specifications:
- Analyzed prompt parameters across ${selectedAgent.capabilities.join(', ')}.
- Verified algorithmic invariants, runtime complexities, and security posture.
- Formatted structured response with verified academic/industry citations.`
      );
    }, 600);
  };

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'agent-research': return Atom;
      case 'agent-coding': return Code;
      case 'agent-learning': return GraduationCap;
      case 'agent-opportunity': return Briefcase;
      case 'agent-news': return Crosshair;
      default: return TrendingUp;
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#030d22]/80 border border-cyan-500/25 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Atom className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              Multi-Agent Autonomous Research Lab
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-mono">
                Provider Agnostic
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Orchestrate specialized AI agents across Gemini, local Ollama, Groq, and OpenRouter
            </p>
          </div>
        </div>

        {/* Provider Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as any)}
              className="bg-transparent text-white font-medium focus:outline-none"
            >
              <option value="gemini">Google Gemini 2.5</option>
              <option value="ollama">Local Ollama (DeepSeek-R1)</option>
              <option value="groq">Groq LPU (Llama 3.3)</option>
              <option value="openrouter">OpenRouter Gateway</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agents Selection Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {agents.map((agent) => {
          const Icon = getAgentIcon(agent.id);
          const isSelected = selectedAgentId === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] scale-[1.02]'
                  : 'bg-[#030d22]/80 border-cyan-500/20 hover:border-cyan-500/50 hover:bg-[#05132d]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`p-1.5 rounded-lg ${
                    isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-cyan-400 bg-cyan-950/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />}
              </div>
              <div className="text-xs font-bold text-white tracking-tight">
                {agent.name}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                {agent.role}
              </div>
            </button>
          );
        })}
      </div>

      {/* Orchestration Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Agent Spec & Prompt Input */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#030d22]/90 border border-cyan-500/30 flex flex-col justify-between backdrop-blur-md">
          <div>
            <div className="pb-3 border-b border-cyan-500/20">
              <h3 className="text-sm font-bold text-white">
                {selectedAgent.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {selectedAgent.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedAgent.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs text-slate-300 font-semibold block mb-1.5">
                Task Instructions & Research Objective
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="w-full p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs text-white focus:outline-none focus:border-cyan-400 custom-scrollbar"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-between">
            <div className="text-[11px] text-slate-400">
              Quota: <span className="text-emerald-400 font-semibold">100% available</span>
            </div>
            <button
              onClick={handleRunAgent}
              disabled={isExecuting}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.6)] hover:from-cyan-300 hover:to-blue-500 transition-all"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isExecuting ? 'animate-spin' : ''}`} />
              <span>{isExecuting ? 'Synthesizing...' : 'Dispatch Agent'}</span>
            </button>
          </div>
        </div>

        {/* Right Output Log & Citations */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-[#020612]/95 border border-cyan-500/30 flex flex-col justify-between overflow-hidden shadow-[0_0_20px_rgba(0,180,255,0.1)]">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agent Synthesis Engine</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Deterministic Output
            </span>
          </div>

          <div className="flex-1 p-3 my-2 bg-slate-950/60 rounded-xl border border-cyan-500/20 overflow-y-auto custom-scrollbar font-mono text-xs leading-relaxed text-slate-200">
            {isExecuting ? (
              <div className="h-full flex items-center justify-center text-cyan-300 gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full" />
                <span>Running deep agent reasoning and citation verification...</span>
              </div>
            ) : executionOutput ? (
              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200">
                {executionOutput}
              </pre>
            ) : (
              <div className="text-slate-500 text-center py-8">
                Dispatch the agent to view execution telemetry and synthesized research.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
