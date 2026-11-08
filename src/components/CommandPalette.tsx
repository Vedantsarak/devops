import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  Home,
  Code2,
  Trophy,
  GraduationCap,
  Crosshair,
  Briefcase,
  Calendar,
  Atom,
  Database,
  BarChart2,
  Settings,
  Rocket,
  Plus,
  Play,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight,
  Check,
  Sparkles,
} from 'lucide-react';
import { NavModule } from '../types/devos';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: NavModule) => void;
  onOpenNewTaskModal?: () => void;
  onToggleTheme?: () => void;
  isLightMode?: boolean;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Quick Actions' | 'External Tools';
  icon: React.ElementType;
  action: () => void;
  hint?: string;
  badge?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenNewTaskModal,
  onToggleTheme,
  isLightMode,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allCommands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-home',
      title: 'Go to Command Center Home',
      category: 'Navigation',
      icon: Home,
      action: () => onNavigate('home'),
      hint: 'H',
    },
    {
      id: 'nav-coding',
      title: 'Open Coding Studio & Sandbox',
      category: 'Navigation',
      icon: Code2,
      action: () => onNavigate('coding'),
      hint: 'C',
    },
    {
      id: 'nav-dsa',
      title: 'Practice in DSA Arena',
      category: 'Navigation',
      icon: Trophy,
      action: () => onNavigate('dsa'),
      hint: 'D',
    },
    {
      id: 'nav-learn',
      title: 'Access Learning Academy Tracks',
      category: 'Navigation',
      icon: GraduationCap,
      action: () => onNavigate('learn'),
      hint: 'L',
    },
    {
      id: 'nav-intelligence',
      title: 'Explore Tech Intelligence & News',
      category: 'Navigation',
      icon: Crosshair,
      action: () => onNavigate('intelligence'),
      hint: 'T',
    },
    {
      id: 'nav-opps',
      title: 'View Opportunities & Hackathons',
      category: 'Navigation',
      icon: Briefcase,
      action: () => onNavigate('opportunities'),
      hint: 'O',
    },
    {
      id: 'nav-cal',
      title: 'Manage Tasks & Sprint Calendar',
      category: 'Navigation',
      icon: Calendar,
      action: () => onNavigate('calendar'),
      hint: 'K',
    },
    {
      id: 'nav-launcher',
      title: 'Open Application Launcher',
      category: 'Navigation',
      icon: Rocket,
      action: () => onNavigate('launcher'),
      hint: 'P',
    },
    {
      id: 'nav-research',
      title: 'Launch Multi-Agent AI Research Lab',
      category: 'Navigation',
      icon: Atom,
      action: () => onNavigate('research'),
      hint: 'R',
    },
    {
      id: 'nav-vault',
      title: 'Access Knowledge Vault Snippets',
      category: 'Navigation',
      icon: Database,
      action: () => onNavigate('vault'),
      hint: 'V',
    },
    {
      id: 'nav-analytics',
      title: 'View Developer Analytics & Skills',
      category: 'Navigation',
      icon: BarChart2,
      action: () => onNavigate('analytics'),
      hint: 'A',
    },
    {
      id: 'nav-settings',
      title: 'System Settings & Profile',
      category: 'Navigation',
      icon: Settings,
      action: () => onNavigate('settings'),
      hint: 'S',
    },

    // Quick Actions
    {
      id: 'action-task',
      title: 'Create New Task',
      category: 'Quick Actions',
      icon: Plus,
      action: () => {
        onNavigate('calendar');
        if (onOpenNewTaskModal) onOpenNewTaskModal();
      },
      badge: 'Sprint',
    },
    {
      id: 'action-theme',
      title: isLightMode ? 'Switch to Cyber Midnight Dark' : 'Switch to High-Contrast Light Mode',
      category: 'Quick Actions',
      icon: isLightMode ? Moon : Sun,
      action: () => {
        if (onToggleTheme) onToggleTheme();
      },
      badge: 'Theme',
    },
    {
      id: 'action-code',
      title: 'Run Quick Code Sandbox',
      category: 'Quick Actions',
      icon: Play,
      action: () => onNavigate('coding'),
      badge: 'Studio',
    },

    // External Tools
    {
      id: 'ext-leetcode',
      title: 'Launch LeetCode Daily Challenge',
      category: 'External Tools',
      icon: ExternalLink,
      action: () => window.open('https://leetcode.com', '_blank'),
      hint: 'leetcode.com',
    },
    {
      id: 'ext-github',
      title: 'Open GitHub Repositories',
      category: 'External Tools',
      icon: ExternalLink,
      action: () => window.open('https://github.com', '_blank'),
      hint: 'github.com',
    },
    {
      id: 'ext-arxiv',
      title: 'Browse arXiv Computer Science',
      category: 'External Tools',
      icon: ExternalLink,
      action: () => window.open('https://arxiv.org/corr', '_blank'),
      hint: 'arxiv.org',
    },
    {
      id: 'ext-vscode',
      title: 'Launch VS Code Web IDE',
      category: 'External Tools',
      icon: ExternalLink,
      action: () => window.open('https://vscode.dev', '_blank'),
      hint: 'vscode.dev',
    },
  ];

  const filteredCommands = allCommands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.hint?.toLowerCase().includes(q)
    );
  });

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#030d22]/95 border border-cyan-400/50 shadow-[0_0_50px_rgba(0,240,255,0.4)] overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-cyan-500/25 bg-[#05132d]/80">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 mr-3 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search modules, actions, shortcuts..."
            className="w-full bg-transparent text-sm text-white placeholder-cyan-300/40 focus:outline-none tracking-wide"
          />
          <div className="flex items-center gap-1.5 shrink-0 pl-2">
            <kbd className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 rounded-md">
              ESC
            </kbd>
          </div>
        </div>

        {/* Command Results */}
        <div className="max-h-[380px] overflow-y-auto custom-scrollbar p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching commands or actions found for "{query}".
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500/25 via-blue-600/20 to-transparent border border-cyan-400/50 text-white shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                          : 'bg-slate-800/60 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold tracking-wide text-white">
                          {cmd.title}
                        </span>
                        {cmd.badge && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-400/30">
                            {cmd.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {cmd.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {cmd.hint && (
                      <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                        {cmd.hint}
                      </kbd>
                    )}
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2.5 border-t border-cyan-500/20 bg-[#020716]/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">↵</kbd>
              Select
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10px]">
            <Sparkles className="w-3 h-3" />
            <span>DevOS Fast Transit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
