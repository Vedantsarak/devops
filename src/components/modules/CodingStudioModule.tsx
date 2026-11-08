import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  FileCode, 
  Copy, 
  Check, 
  Terminal as TerminalIcon,
  FolderTree,
  Code2
} from 'lucide-react';

export const CodingStudioModule: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'typescript' | 'python' | 'cpp' | 'rust'>('typescript');
  const [selectedFile, setSelectedFile] = useState('solution.ts');
  const [copied, setCopied] = useState(false);
  const [outputLogs, setOutputLogs] = useState<string[]>([
    '[DevOS Runtime] Isolated sandbox environment initialized.',
    '[V8 Engine] Ready for execution.',
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const initialCodes: Record<string, string> = {
    'solution.ts': `// DevOS Coding Studio: High Performance LRU Cache
export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map<K, V>();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    // Re-insert to mark as recently used
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used (first key in Map)
      const lruKey = this.cache.keys().next().value;
      if (lruKey !== undefined) this.cache.delete(lruKey);
    }
    this.cache.set(key, value);
  }
}

// Test Run
const lru = new LRUCache<string, number>(2);
lru.put('alpha', 100);
lru.put('beta', 200);
console.log('Get alpha:', lru.get('alpha'));
lru.put('gamma', 300); // evicts beta
console.log('Get beta (should be undefined):', lru.get('beta'));
console.log('Get gamma:', lru.get('gamma'));`,
    'benchmark.ts': `// Performance Benchmark
import { performance } from 'perf_hooks';

const start = performance.now();
let sum = 0;
for (let i = 0; i < 1_000_000; i++) {
  sum += i;
}
const elapsed = performance.now() - start;
console.log(\`Computed sum \${sum} in \${elapsed.toFixed(3)}ms\`);`,
  };

  const [code, setCode] = useState(initialCodes['solution.ts']);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutputLogs((prev) => [
      ...prev,
      `[Compile] Building ${selectedFile}...`,
    ]);

    setTimeout(() => {
      setIsRunning(false);
      setOutputLogs((prev) => [
        ...prev,
        `[DevOS Output] Get alpha: 100`,
        `[DevOS Output] Get beta (should be undefined): undefined`,
        `[DevOS Output] Get gamma: 300`,
        `[Process] Exited with code 0 in 14ms (Memory: 8.4MB).`,
      ]);
    }, 400);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAiRefactor = () => {
    setOutputLogs((prev) => [
      ...prev,
      '[AI Assistant] Analyzing code complexity & memory allocation...',
      '[AI Assistant] Suggestion: Map iterator provides O(1) eviction in JS engines. Time Complexity: O(1) Get/Put. Optimal space usage confirmed.',
    ]);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#030d22]/80 border border-cyan-500/25 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              Vibe Coding Studio
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                Sandbox Ready
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Isolated WebAssembly & Node execution environment with AI refactoring
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-semibold text-cyan-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++ (Clang 18)</option>
            <option value="rust">Rust 1.80</option>
          </select>

          <button
            onClick={handleAiRefactor}
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/50 text-purple-200 hover:bg-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Optimize</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="p-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-slate-300 hover:text-white text-xs font-semibold"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 hover:from-cyan-300 hover:to-blue-500 font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.6)] transition-all"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Workspace Editor & Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[500px]">
        {/* Left Files Explorer */}
        <div className="lg:col-span-2 p-3 rounded-2xl bg-[#030d22]/80 border border-cyan-500/25 flex flex-col backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-3 px-1">
            <FolderTree className="w-3.5 h-3.5" />
            <span>Project Explorer</span>
          </div>
          <div className="space-y-1">
            {Object.keys(initialCodes).map((filename) => (
              <button
                key={filename}
                onClick={() => {
                  setSelectedFile(filename);
                  setCode(initialCodes[filename]);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-mono transition-all ${
                  selectedFile === filename
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{filename}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center Editor */}
        <div className="lg:col-span-6 rounded-2xl bg-[#020716]/90 border border-cyan-500/30 overflow-hidden flex flex-col shadow-[0_0_20px_rgba(0,180,255,0.1)]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-500/20 bg-[#05132d]/60">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
              {selectedFile}
            </div>
            <span className="text-[10px] text-slate-500">UTF-8 • Tab: 2</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full p-4 bg-transparent text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-none custom-scrollbar"
            spellCheck={false}
          />
        </div>

        {/* Right Terminal Console Output */}
        <div className="lg:col-span-4 rounded-2xl bg-[#020612]/95 border border-cyan-500/30 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/20 bg-[#05132d]/40">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
              <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>DevOS Console Output</span>
            </div>
            <button
              onClick={() => setOutputLogs(['[DevOS Runtime] Terminal cleared.'])}
              className="text-[10px] text-slate-500 hover:text-cyan-400 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
          </div>

          <div className="flex-1 p-3 font-mono text-xs text-cyan-200/90 overflow-y-auto space-y-1.5 custom-scrollbar">
            {outputLogs.map((log, i) => (
              <div
                key={i}
                className={
                  log.includes('[AI')
                    ? 'text-purple-300 bg-purple-950/20 p-1.5 rounded-lg border border-purple-500/20'
                    : log.includes('[Compile')
                    ? 'text-amber-300'
                    : log.includes('Error')
                    ? 'text-rose-400'
                    : 'text-slate-300'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
