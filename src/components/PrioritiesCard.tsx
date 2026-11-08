import React, { useState } from 'react';
import { 
  Check, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Database, 
  ShieldCheck, 
  Layers, 
  AlertCircle,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { useSupabase } from '../context/SupabaseContext';
import { DbTask } from '../types/supabase';

interface PrioritiesCardProps {
  onViewAll: () => void;
  onOpenWorkspaceModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const PrioritiesCard: React.FC<PrioritiesCardProps> = ({
  onViewAll,
  onOpenWorkspaceModal,
  onOpenAuthModal,
}) => {
  const { 
    user, 
    tasks, 
    currentWorkspace, 
    createTask, 
    updateTask, 
    deleteTask, 
    isLoadingTasks, 
    taskError,
    isConfigured 
  } = useSupabase();

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newCategory, setNewCategory] = useState('DevOS Core');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = async (task: DbTask) => {
    await updateTask(task.id, { completed: !task.completed });
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteTask(id);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await createTask({
        title: newTitle.trim(),
        priority: newPriority,
        category: newCategory,
      });
      setNewTitle('');
      setIsAdding(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#06183a]/80 via-[#030e25]/90 to-[#020716]/95 border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.12)] backdrop-blur-md flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Today's Priorities
            </h3>
            <span 
              title={isConfigured ? "Connected to Supabase PostgreSQL (RLS Enforced)" : "Supabase Local Storage Engine (RLS Enforced)"}
              className="px-1.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-[9px] font-semibold text-cyan-300 flex items-center gap-1 cursor-default"
            >
              <Database className="w-2.5 h-2.5 text-cyan-400" />
              <span>RLS Active</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdding(true)}
              className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/40 transition-all text-xs flex items-center gap-1 shadow-sm"
              title="Add persistent task"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-semibold">New</span>
            </button>
            <button
              onClick={onViewAll}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-200 flex items-center gap-0.5 transition-colors group"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Workspace Context Tag */}
        <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-cyan-500/15 text-[10px]">
          <button
            onClick={onOpenWorkspaceModal}
            className="flex items-center gap-1 text-cyan-300/80 hover:text-cyan-200 transition-colors"
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            <span className="font-semibold truncate max-w-[150px]">
              {currentWorkspace?.name || 'Personal Command'}
            </span>
            <span className="text-slate-500 text-[9px]">(change)</span>
          </button>
          <span className="text-slate-400">
            {tasks.filter((t) => t.completed).length}/{tasks.length} Completed
          </span>
        </div>

        {/* Error notification if any */}
        {taskError && (
          <div className="p-2 mb-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{taskError}</span>
          </div>
        )}

        {/* Add Task Quick Form */}
        {isAdding && (
          <form onSubmit={handleCreate} className="p-2.5 mb-2.5 rounded-xl bg-slate-900/90 border border-cyan-400/50 space-y-2 animate-fadeIn shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Add Persistent Task
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <input
              type="text"
              required
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Optimize PostgreSQL Query Indexing"
              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="px-2 py-1 text-[10px] rounded-lg bg-slate-950 border border-cyan-500/30 text-slate-200 focus:outline-none"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>

                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="px-2 py-1 text-[10px] rounded-lg bg-slate-950 border border-cyan-500/30 text-slate-200 focus:outline-none"
                >
                  <option value="Coding Studio">Coding Studio</option>
                  <option value="DSA Arena">DSA Arena</option>
                  <option value="DevOS Core">DevOS Core</option>
                  <option value="Security">Security</option>
                  <option value="Research">Research</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-[0_0_10px_rgba(0,240,255,0.4)]"
              >
                {isSubmitting ? 'Saving...' : 'Add'}
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        {isLoadingTasks ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-[11px] text-cyan-300/70">Syncing Supabase database...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-6 text-center text-slate-400 space-y-2">
            <p className="text-xs">No active tasks in this workspace.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline"
            >
              Create your first task
            </button>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
            {tasks.map((task) => {
              const priorityColor = 
                task.priority === 'high' ? 'border-rose-500/60 text-rose-300 bg-rose-500/10' :
                task.priority === 'medium' ? 'border-amber-500/60 text-amber-300 bg-amber-500/10' :
                'border-cyan-500/60 text-cyan-300 bg-cyan-500/10';

              return (
                <div
                  key={task.id}
                  onClick={() => handleToggle(task)}
                  className="group flex items-center justify-between p-2 rounded-xl hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Glowing status checkbox */}
                    <div
                      className={`w-4 h-4 shrink-0 rounded-full flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_8px_#34d399]'
                          : 'border-2 border-cyan-400/50 group-hover:border-cyan-300'
                      }`}
                    >
                      {task.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>

                    {/* Task Title & Metadata */}
                    <div className="min-w-0">
                      <span
                        className={`text-xs font-medium block truncate transition-colors ${
                          task.completed
                            ? 'text-slate-400 line-through decoration-emerald-500/60'
                            : 'text-white group-hover:text-cyan-200'
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[8px] px-1 py-0.2 rounded border ${priorityColor}`}>
                          {task.priority}
                        </span>
                        <span className="text-[9px] text-slate-400 truncate">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => handleDelete(e, task.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 opacity-60 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-2 pt-2 border-t border-cyan-500/15 flex items-center justify-between text-[9px] text-slate-400">
        <span className="flex items-center gap-1 text-cyan-400/80">
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span>User-Isolated (auth.uid = user_id)</span>
        </span>
        <button
          onClick={onOpenAuthModal}
          className="text-slate-400 hover:text-cyan-300 transition-colors"
        >
          {user ? `User: ${user.email?.split('@')[0]}` : 'Sign In'}
        </button>
      </div>
    </div>
  );
};
