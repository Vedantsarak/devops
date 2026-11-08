import React, { useState } from 'react';
import {
  Rocket,
  Search,
  Plus,
  ExternalLink,
  Code2,
  Trophy,
  GitBranch,
  Share2,
  BookOpen,
  GraduationCap,
  HelpCircle,
  Video,
  Terminal,
  FileText,
  Globe,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { LauncherShortcut } from '../../types/devos';
import { filterShortcuts } from '../../utils/devos-logic';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';

interface AppLauncherModuleProps {
  shortcuts: LauncherShortcut[];
  onAddShortcut: (sc: Omit<LauncherShortcut, 'id'>) => void;
  onDeleteShortcut?: (id: string) => void;
}

export const AppLauncherModule: React.FC<AppLauncherModuleProps> = ({
  shortcuts,
  onAddShortcut,
  onDeleteShortcut,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New shortcut form state
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<LauncherShortcut['category']>('Coding & DSA');
  const [newDescription, setNewDescription] = useState('');

  const categories = [
    'all',
    'Coding & DSA',
    'Research & Papers',
    'Tools & Docs',
    'Community & Media',
  ];

  const filtered = filterShortcuts(shortcuts, searchQuery, selectedCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return Code2;
      case 'Trophy':
        return Trophy;
      case 'GitBranch':
        return GitBranch;
      case 'Share2':
        return Share2;
      case 'BookOpen':
        return BookOpen;
      case 'GraduationCap':
        return GraduationCap;
      case 'HelpCircle':
        return HelpCircle;
      case 'Video':
        return Video;
      case 'Terminal':
        return Terminal;
      case 'FileText':
        return FileText;
      default:
        return Globe;
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    onAddShortcut({
      title: newTitle.trim(),
      url: formattedUrl,
      category: newCategory,
      description: newDescription.trim() || 'Custom developer workspace bookmark',
      icon: 'Globe',
      isCustom: true,
    });

    setNewTitle('');
    setNewUrl('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4 max-w-7xl mx-auto">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#030d22]/85 border border-cyan-500/25 backdrop-blur-md shadow-[0_0_25px_rgba(0,180,255,0.08)]">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
              Application Launcher
              <Badge variant="cyan" size="sm">
                Fast Transit
              </Badge>
            </h2>
            <p className="text-xs text-cyan-200/70 mt-0.5">
              Instant launchpad for core engineering platforms, research repositories, and developer tools
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="shadow-[0_0_20px_rgba(0,240,255,0.4)]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Custom Shortcut</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#030d22]/60 border border-cyan-500/20 backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shortcuts (e.g., LeetCode, GitHub, arXiv)..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.5)] font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'All Shortcuts' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Shortcuts Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Rocket}
            title="No Shortcuts Found"
            description={
              searchQuery
                ? `No tools or websites matched your search for "${searchQuery}".`
                : 'No shortcuts available in this category.'
            }
            actionLabel="Add Custom Shortcut"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
            {filtered.map((item) => {
              const IconComponent = getIcon(item.icon);
              return (
                <Card
                  key={item.id}
                  variant="cyber"
                  padding="md"
                  className="flex flex-col justify-between group hover:border-cyan-400/80"
                >
                  <div>
                    {/* Header: Icon, Category Badge, Delete/Link */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 group-hover:bg-cyan-500/25 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="cyan" size="sm">
                          {item.category}
                        </Badge>
                        {item.isCustom && onDeleteShortcut && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteShortcut(item.id);
                            }}
                            title="Delete custom shortcut"
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      {item.title}
                      {item.isCustom && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30 uppercase">
                          Custom
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Launch Link Button */}
                  <div className="pt-4 mt-4 border-t border-cyan-500/15 flex items-center justify-between">
                    <span className="text-[10px] text-cyan-400/70 font-mono truncate max-w-[200px]">
                      {item.url.replace(/^https?:\/\//, '')}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-bold transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)] group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    >
                      <span>Launch</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Custom Shortcut Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={
          <>
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Add Custom Developer Shortcut
          </>
        }
        description="Pin any web tool, documentation, or repository to your DevOS launcher deck."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              Platform / Tool Name *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Hugging Face Models"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              Destination URL *
            </label>
            <input
              type="text"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://huggingface.co/models"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Coding & DSA">Coding & DSA</option>
              <option value="Research & Papers">Research & Papers</option>
              <option value="Tools & Docs">Tools & Docs</option>
              <option value="Community & Media">Community & Media</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              Description (optional)
            </label>
            <textarea
              rows={2}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Brief description of how you use this platform..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 custom-scrollbar"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Shortcut
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
