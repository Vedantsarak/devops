import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Layers
} from 'lucide-react';

interface RoadmapTopic {
  id: string;
  title: string;
  level: string;
  progress: number;
  lessons: Array<{ title: string; completed: boolean }>;
}

export const LearningAcademyModule: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<RoadmapTopic[]>([
    {
      id: 'rm-1',
      title: 'Advanced C++ & Systems Programming',
      level: 'Advanced',
      progress: 82,
      lessons: [
        { title: 'Move Semantics & Rvalue References', completed: true },
        { title: 'Custom Memory Allocators & Arenas', completed: true },
        { title: 'SIMD Vectorization & Cache Locality', completed: true },
        { title: 'Lock-Free Queues with std::atomic', completed: false },
      ],
    },
    {
      id: 'rm-2',
      title: 'Distributed Systems & Consensus Engines',
      level: 'Mastery',
      progress: 65,
      lessons: [
        { title: 'CAP Theorem & PACELC Real-world Tradeoffs', completed: true },
        { title: 'Raft Consensus Protocol Step-by-Step', completed: true },
        { title: 'Vector Clocks & Dynamo Partitioning', completed: true },
        { title: 'Two-Phase Commit vs Saga Pattern', completed: false },
      ],
    },
    {
      id: 'rm-3',
      title: 'AI Engineering & Transformer Internals',
      level: 'Advanced',
      progress: 74,
      lessons: [
        { title: 'Self-Attention Math & Scaled Dot Product', completed: true },
        { title: 'KV-Caching & FlashAttention 2/3', completed: true },
        { title: 'Quantization (GPTQ, AWQ, FP8) Deep Dive', completed: true },
        { title: 'Speculative Decoding Architecture', completed: false },
      ],
    },
    {
      id: 'rm-4',
      title: 'Production Full-Stack & Database Internals',
      level: 'Intermediate',
      progress: 90,
      lessons: [
        { title: 'Postgres B-Tree & WAL Logging Mechanics', completed: true },
        { title: 'Zero-Downtime Database Schema Migrations', completed: true },
        { title: 'HTTP/3, QUIC & Edge Streaming', completed: true },
        { title: 'OAuth2 PKCE & JWT Security Hardening', completed: true },
      ],
    },
  ]);

  const [activeRoadmap, setActiveRoadmap] = useState<string>('rm-1');
  const [aiClarification, setAiClarification] = useState<string | null>(null);

  const currentRoadmap = roadmaps.find((r) => r.id === activeRoadmap) || roadmaps[0];

  const toggleLesson = (lessonIndex: number) => {
    setRoadmaps((prev) =>
      prev.map((r) => {
        if (r.id !== activeRoadmap) return r;
        const updatedLessons = [...r.lessons];
        updatedLessons[lessonIndex].completed = !updatedLessons[lessonIndex].completed;
        const completedCount = updatedLessons.filter((l) => l.completed).length;
        const progress = Math.round((completedCount / updatedLessons.length) * 100);
        return { ...r, lessons: updatedLessons, progress };
      })
    );
  };

  const handleAskAi = (lessonTitle: string) => {
    setAiClarification(
      `AI Tutor Explanation for "${lessonTitle}": In high-performance systems, understanding memory layout, data alignment, and cache-line boundaries (typically 64 bytes) prevents false sharing and L1/L2 misses. Applying this invariant unlocks massive throughput improvements.`
    );
  };

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#030d22]/80 border border-cyan-500/25 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Learning Academy & Roadmaps
            </h2>
            <p className="text-xs text-slate-400">
              Rigorous computer science study paths with interactive Socratic AI tutor
            </p>
          </div>
        </div>
      </div>

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Track Selector */}
        <div className="lg:col-span-5 space-y-3">
          {roadmaps.map((rm) => (
            <div
              key={rm.id}
              onClick={() => {
                setActiveRoadmap(rm.id);
                setAiClarification(null);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeRoadmap === rm.id
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(0,220,255,0.2)]'
                  : 'bg-[#030d22]/80 border-cyan-500/20 hover:border-cyan-500/50 hover:bg-[#05132d]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-wide">
                  {rm.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40">
                  {rm.level}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Mastery Progress</span>
                  <span className="font-bold text-cyan-300">{rm.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_#22d3ee]"
                    style={{ width: `${rm.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Lessons Checklist & AI Tutor */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-[#030d22]/90 border border-cyan-500/30 flex flex-col justify-between backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  {currentRoadmap.title}
                </h3>
              </div>
              <span className="text-xs text-cyan-300 font-mono">
                {currentRoadmap.lessons.filter((l) => l.completed).length} / {currentRoadmap.lessons.length} Completed
              </span>
            </div>

            {/* Lessons List */}
            <div className="my-4 space-y-2.5">
              {currentRoadmap.lessons.map((lesson, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-400/40 transition-all"
                >
                  <div
                    onClick={() => toggleLesson(idx)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        lesson.completed
                          ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_8px_#34d399]'
                          : 'border-2 border-slate-600 hover:border-cyan-400'
                      }`}
                    >
                      {lesson.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        lesson.completed ? 'text-slate-400 line-through' : 'text-white'
                      }`}
                    >
                      {lesson.title}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAskAi(lesson.title)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Explain Invariant</span>
                  </button>
                </div>
              ))}
            </div>

            {/* AI Explanation Box */}
            {aiClarification && (
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs text-purple-200 leading-relaxed shadow-[0_0_15px_rgba(168,85,247,0.15)] animate-fade-in">
                <div className="flex items-center gap-1.5 font-bold text-purple-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>DevOS AI Tutor Note</span>
                </div>
                {aiClarification}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-between text-xs text-slate-400">
            <span>Next recommended milestone: Practice Lock-Free Ringbuffer in Coding Studio</span>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
