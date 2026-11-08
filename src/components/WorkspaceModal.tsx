import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Plus, 
  Check, 
  Terminal, 
  Cpu, 
  Shield, 
  FolderGit2, 
  Boxes,
  Sparkles 
} from 'lucide-react';
import { useSupabase } from '../context/SupabaseContext';
import { Workspace } from '../types/supabase';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_ICONS = [
  { name: 'Terminal', icon: Terminal },
  { name: 'Cpu', icon: Cpu },
  { name: 'Shield', icon: Shield },
  { name: 'FolderGit2', icon: FolderGit2 },
  { name: 'Boxes', icon: Boxes },
];

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({ isOpen, onClose }) => {
  const { workspaces, currentWorkspace, setCurrentWorkspace, createWorkspace, user } = useSupabase();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Terminal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const created = await createWorkspace(name.trim(), description.trim(), selectedIcon);
      if (created) {
        setName('');
        setDescription('');
        setIsCreating(false);
      } else {
        setError('Failed to create workspace.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#07132e] via-[#040c1e] to-[#020716] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                DevOS Workspaces
              </h3>
              <p className="text-[10px] text-cyan-300/70">
                Isolated project environments for {user?.user_metadata?.full_name || user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close workspace modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 custom-scrollbar">
          {!isCreating ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  Your Workspaces ({workspaces.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/50 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-medium flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Workspace</span>
                </button>
              </div>

              <div className="space-y-2">
                {workspaces.map((ws: Workspace) => {
                  const isSelected = currentWorkspace?.id === ws.id;
                  const IconComp = AVAILABLE_ICONS.find((i) => i.name === ws.icon)?.icon || Terminal;
                  return (
                    <div
                      key={ws.id}
                      onClick={() => {
                        setCurrentWorkspace(ws);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-slate-900/50 border-cyan-500/20 hover:border-cyan-400/50 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-300'
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{ws.name}</span>
                            {isSelected && (
                              <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-semibold">
                                Active
                              </span>
                            )}
                          </div>
                          {ws.description && (
                            <p className="text-[10px] text-slate-400 mt-0.5">{ws.description}</p>
                          )}
                        </div>
                      </div>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <span className="text-[10px] text-slate-500">Click to switch</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Create New Workspace
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-cyan-300/80 mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Distributed Core Systems"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-cyan-500/25 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-cyan-300/80 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Goals, repository links, or mission scope..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-cyan-500/25 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-cyan-300/80 mb-1">
                  Workspace Icon
                </label>
                <div className="flex items-center gap-2">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconC = item.icon;
                    const isSelected = selectedIcon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setSelectedIcon(item.name)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.6)] font-bold'
                            : 'bg-slate-900 border border-cyan-500/20 text-slate-300 hover:text-white'
                        }`}
                      >
                        <IconC className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-2 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                >
                  {isSubmitting ? 'Creating...' : 'Create Workspace'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
