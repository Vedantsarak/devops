import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Save, 
  Check, 
  Database, 
  ShieldCheck, 
  KeyRound, 
  ExternalLink,
  Layers,
  User,
  Cpu
} from 'lucide-react';
import { useSupabase } from '../../context/SupabaseContext';

interface SettingsModuleProps {
  isLightMode: boolean;
  onToggleTheme: () => void;
  onOpenAuthModal?: () => void;
  onOpenWorkspaceModal?: () => void;
  onOpenProfileModal?: () => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  isLightMode,
  onToggleTheme,
  onOpenAuthModal,
  onOpenWorkspaceModal,
  onOpenProfileModal,
}) => {
  const { user, profile, currentWorkspace, isConfigured } = useSupabase();
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [githubUser, setGithubUser] = useState('octocat-dev');
  const [leetcodeUser, setLeetcodeUser] = useState('developer_pro');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4 max-w-4xl mx-auto custom-scrollbar overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#030d22]/80 border border-cyan-500/25 backdrop-blur-md shadow-[0_0_20px_rgba(0,180,255,0.1)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              DevOS Preferences & Environment Configuration
            </h2>
            <p className="text-xs text-slate-400">
              Audit environment status, Supabase database bindings, and developer profiles
            </p>
          </div>
        </div>
      </div>

      {/* Supabase & Cloud Integration Card */}
      <div className="p-5 rounded-2xl bg-[#030d22]/90 border border-cyan-500/35 space-y-3.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.08)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Supabase Integration & RLS Engine
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                  isConfigured 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' 
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isConfigured ? 'Live Cloud Connected' : 'Local Sandbox Active (RLS Enforced)'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Row Level Security strictly isolates user profiles, workspaces, and persistent tasks
              </p>
            </div>
          </div>
        </div>

        {/* Current Identity & Workspace Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-xs">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Active User Identity
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-semibold">
                  {profile?.full_name || (user ? user.email : 'Guest / Unauthenticated')}
                </span>
              </div>
              {onOpenProfileModal && user && (
                <button
                  type="button"
                  onClick={onOpenProfileModal}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Active Workspace
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-semibold">
                  {currentWorkspace?.name || 'Personal Command'}
                </span>
              </div>
              {onOpenWorkspaceModal && (
                <button
                  type="button"
                  onClick={onOpenWorkspaceModal}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium"
                >
                  Manage
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Environment Variables Reference */}
        <div className="space-y-1.5 pt-1 text-xs">
          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            Connecting to Live Supabase Project
          </span>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            To link an external Supabase project, supply these environment variables in your deployment or <code className="text-cyan-300 font-mono">.env</code>:
          </p>
          <div className="p-2.5 rounded-lg bg-black/60 font-mono text-[11px] text-cyan-300 space-y-1 border border-cyan-500/20">
            <div>VITE_SUPABASE_URL=https://&lt;your-project-id&gt;.supabase.co</div>
            <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOi... (public anon key only)</div>
          </div>
        </div>

        {onOpenAuthModal && (
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500 hover:text-slate-950 transition-all"
            >
              Open Auth Dialog / Switch Account
            </button>
          </div>
        )}
      </div>

      {/* Form Settings */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Appearance & Sound */}
        <div className="p-4 rounded-2xl bg-[#030d22]/90 border border-cyan-500/30 space-y-3">
          <h3 className="text-sm font-bold text-white mb-2">Display & Audio</h3>
          
          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <div>
              <div className="text-xs font-semibold text-white">Visual Mode</div>
              <div className="text-[11px] text-slate-400">Toggle between Cyber Midnight Dark and High-Contrast</div>
            </div>
            <button
              type="button"
              onClick={onToggleTheme}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-semibold text-cyan-300 flex items-center gap-1.5"
            >
              {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{isLightMode ? 'Light Mode' : 'Cyber Dark'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-xs font-semibold text-white">Sound Effects & Synthesizer Feedback</div>
              <div className="text-[11px] text-slate-400">Play subtle audio feedback on actions</div>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-cyan-300"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* AI Endpoints */}
        <div className="p-4 rounded-2xl bg-[#030d22]/90 border border-cyan-500/30 space-y-3">
          <h3 className="text-sm font-bold text-white mb-2">Local & Cloud AI Gateways</h3>
          
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              Local Ollama Base URL
            </label>
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Developer Profiles */}
        <div className="p-4 rounded-2xl bg-[#030d22]/90 border border-cyan-500/30 space-y-3">
          <h3 className="text-sm font-bold text-white mb-2">Developer Identities</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                GitHub Handle
              </label>
              <input
                type="text"
                value={githubUser}
                onChange={(e) => setGithubUser(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                LeetCode Profile Handle
              </label>
              <input
                type="text"
                value={leetcodeUser}
                onChange={(e) => setLeetcodeUser(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.6)] hover:from-cyan-300 hover:to-blue-500 transition-all cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4 text-slate-950" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved Successfully!' : 'Save Preferences'}</span>
        </button>
      </form>
    </div>
  );
};
