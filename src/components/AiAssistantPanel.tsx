import React, { useState } from 'react';
import { 
  FileText, 
  Code2, 
  Target, 
  Compass, 
  ChevronRight, 
  Mic, 
  MicOff, 
  Send, 
  Sparkles,
  Bot,
  X
} from 'lucide-react';
import { AiCoreVisualizer } from './3d/AiCoreVisualizer';

interface AiAssistantPanelProps {
  onTriggerPrompt: (prompt: string) => void;
}

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({ onTriggerPrompt }) => {
  const [isListening, setIsListening] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [activeModal, setActiveModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Greetings, Developer! I am your DevOS Autonomous Intelligence Core. What would you like to build or optimize today?',
    },
  ]);

  const quickPrompts = [
    { label: 'Summarize my day', icon: FileText, query: 'Give me an executive summary of today: DSA priorities, upcoming deadlines, and streak status.' },
    { label: 'Help with coding', icon: Code2, query: 'I need assistance optimizing a TypeScript algorithm with clean architecture.' },
    { label: 'Plan my learning', icon: Target, query: 'Generate a focused 4-week roadmap for advanced distributed systems and C++ memory safety.' },
    { label: 'Find opportunities', icon: Compass, query: 'Search for high-impact hackathons and software engineering internships with upcoming deadlines.' },
  ];

  const handleSelectPrompt = (query: string, label: string) => {
    onTriggerPrompt(query);
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: label },
      {
        sender: 'ai',
        text: `Executing task: "${label}"... Analyzing DevOS workspace telemetry and synthesizing recommendations.`,
      },
    ]);
    setActiveModal(true);
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const userText = customInput.trim();
    setCustomInput('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      {
        sender: 'ai',
        text: `DevOS Core processed: "${userText}". Multi-agent research pipeline initialized with high confidence.`,
      },
    ]);
    setActiveModal(true);
  };

  return (
    <div className="relative w-full h-full p-4 rounded-2xl bg-gradient-to-br from-[#06183a]/80 via-[#030e25]/90 to-[#020716]/95 border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.15)] backdrop-blur-md flex flex-col justify-between items-center text-center overflow-hidden mx-auto">
      {/* Panel Header */}
      <div className="w-full">
        <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              <span className="text-cyan-400 font-extrabold">AI</span> Assistant
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/40 shadow-[0_0_8px_rgba(52,211,153,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-emerald-300 tracking-wider">
              Online
            </span>
          </div>
        </div>

        {/* 3D Holographic AI Core Visualizer */}
        <div className="my-1 flex items-center justify-center">
          <AiCoreVisualizer />
        </div>

        {/* Assistant Greeting */}
        <div className="text-center mb-4">
          <h4 className="text-xs font-bold text-white tracking-wide text-center">
            Hello Developer!
          </h4>
          <p className="text-[11px] text-cyan-300/70 mt-0.5 text-center">
            How can I assist you today?
          </p>
        </div>

        {/* Quick Action Prompt Chips */}
        <div className="space-y-1.5 mt-2">
          {quickPrompts.map((p, idx) => {
            const Icon = p.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSelectPrompt(p.query, p.label)}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#040e24]/70 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 text-slate-200 hover:text-white transition-all duration-200 group shadow-sm hover:shadow-[0_0_12px_rgba(0,240,255,0.2)]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300 group-hover:text-cyan-200">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium tracking-wide">
                    {p.label}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Audio Waveform & Microphone Visualizer (exact match to reference) */}
      <div className="mt-3 pt-2.5 border-t border-cyan-500/20 flex items-center justify-center gap-3">
        {/* Left Audio Frequency Bars */}
        <div className="flex items-center gap-0.5 h-6 w-20 justify-end">
          {[35, 60, 25, 80, 50, 95, 40, 70, 30].map((h, i) => (
            <div
              key={i}
              className="w-0.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee] transition-all duration-150"
              style={{
                height: isListening ? `${h}%` : `${Math.max(20, h * 0.45)}%`,
                animation: isListening ? `bounceWave 0.6s ease-in-out infinite alternate ${i * 0.08}s` : 'none',
              }}
            />
          ))}
        </div>

        {/* Glowing Central Microphone Button */}
        <button
          onClick={() => {
            setIsListening(!isListening);
            setActiveModal(true);
          }}
          aria-label={isListening ? 'Mute AI voice input' : 'Enable AI voice input'}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isListening
              ? 'bg-rose-500 text-white shadow-[0_0_15px_#f43f5e] border border-rose-300'
              : 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_0_16px_rgba(0,240,255,0.7)] border border-cyan-200 hover:scale-110'
          }`}
          title="Speak with DevOS AI"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Right Audio Frequency Bars */}
        <div className="flex items-center gap-0.5 h-6 w-20">
          {[30, 70, 40, 95, 50, 80, 25, 60, 35].map((h, i) => (
            <div
              key={i}
              className="w-0.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee] transition-all duration-150"
              style={{
                height: isListening ? `${h}%` : `${Math.max(20, h * 0.45)}%`,
                animation: isListening ? `bounceWave 0.6s ease-in-out infinite alternate ${i * 0.08}s` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Interactive AI Chat Dialog Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#030d22] border border-cyan-400/50 shadow-[0_0_40px_rgba(0,240,255,0.4)] overflow-hidden flex flex-col h-[520px]">
            <div className="p-3.5 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    DevOS Autonomous Assistant
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    Connected to Local & Cloud Reasoning Engine
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-[0_0_12px_rgba(0,180,255,0.3)]'
                        : 'bg-[#06183a]/90 border border-cyan-500/30 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="font-semibold text-[10px] text-cyan-300/80 mb-1">
                      {msg.sender === 'user' ? 'Developer' : 'DevOS Core'}
                    </div>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input area */}
            <form
              onSubmit={handleSendCustomMessage}
              className="p-3 border-t border-cyan-500/20 bg-[#020716] flex items-center gap-2"
            >
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Ask about algorithms, system design, or opportunities..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.6)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
