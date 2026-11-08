import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Search,
  Filter,
  Edit2,
  Trash2,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { TaskPriority } from '../../types/devos';
import { filterTasks, calculateTaskCompletion } from '../../utils/devos-logic';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';

interface CalendarModuleProps {
  tasks: TaskPriority[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<TaskPriority, 'id'>) => void;
  onEditTask?: (task: TaskPriority) => void;
  onDeleteTask?: (id: string) => void;
}

export const CalendarModule: React.FC<CalendarModuleProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskPriority | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<number | null>(26); // Default 26 April 2025

  // Form states for Add Task
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('DSA Arena');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [newDueDate, setNewDueDate] = useState('2025-04-28');
  const [newDescription, setNewDescription] = useState('');

  // Form states for Edit Task
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('DSA Arena');
  const [editPriority, setEditPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [editDueDate, setEditDueDate] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // April 2025 calendar days (starts on Tuesday = index 2)
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  const stats = calculateTaskCompletion(tasks);
  const filteredTasks = filterTasks(tasks, {
    status: statusFilter,
    priority: priorityFilter,
    category: categoryFilter,
    search: searchQuery,
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      completed: false,
      dueDate: newDueDate,
      description: newDescription.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  const startEditing = (task: TaskPriority) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '2025-04-30');
    setEditDescription(task.description || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) return;

    if (onEditTask) {
      onEditTask({
        ...editingTask,
        title: editTitle.trim(),
        category: editCategory,
        priority: editPriority,
        dueDate: editDueDate,
        description: editDescription.trim() || undefined,
      });
    }
    setEditingTask(null);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#030d22]/85 border border-cyan-500/25 backdrop-blur-md shadow-[0_0_25px_rgba(0,180,255,0.08)]">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
              Calendar & Task Management
              <Badge variant="cyan" size="sm">
                Sprint Active
              </Badge>
            </h2>
            <p className="text-xs text-cyan-200/70 mt-0.5">
              Sprint priorities, deadline countdowns, and engineering milestones
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-[10px] text-cyan-300 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Supabase RLS Protected</span>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Task</span>
          </Button>
        </div>
      </div>

      {/* Grid: Interactive Calendar & Tasks Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Calendar View */}
        <div className="lg:col-span-6 p-4 md:p-5 rounded-2xl bg-[#030d22]/90 border border-cyan-500/30 flex flex-col backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">April 2025</h3>
            </div>
            <span className="text-xs font-semibold text-cyan-300 font-mono">
              Sprint Week 17
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 md:gap-2 text-center text-xs font-semibold text-cyan-300/70 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-1 font-mono uppercase text-[10px]">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 md:gap-2 flex-1">
            {/* Blank offset days for April 2025 (starts on Tuesday = index 2) */}
            <div className="p-2 rounded-xl bg-transparent" />
            <div className="p-2 rounded-xl bg-transparent" />

            {calendarDays.map((day) => {
              const isToday = day === 26;
              const isSelected = selectedDay === day;
              const hasDeadline = day === 30 || day === 28;
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`p-2 rounded-xl flex flex-col justify-between min-h-[58px] transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/30 border-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)] text-white'
                      : isToday
                      ? 'bg-blue-600/20 border-cyan-400/80 text-cyan-200 shadow-[0_0_10px_rgba(0,200,255,0.2)]'
                      : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold font-mono ${isToday ? 'text-cyan-300' : ''}`}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-[9px] px-1 rounded bg-cyan-400 text-slate-950 font-black">
                        TODAY
                      </span>
                    )}
                  </div>
                  {hasDeadline && (
                    <div className="flex items-center gap-1 self-end mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_#f43f5e]" />
                      <span className="text-[9px] text-rose-300 font-mono hidden sm:inline">Event</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Calendar Note */}
          <div className="mt-4 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next Major Milestone: <strong>Hackathon 2025</strong></span>
            </span>
            <Badge variant="rose" size="sm">
              Due Apr 30
            </Badge>
          </div>
        </div>

        {/* Tasks List with Comprehensive Controls */}
        <div className="lg:col-span-6 p-4 md:p-5 rounded-2xl bg-[#030d22]/90 border border-cyan-500/30 flex flex-col backdrop-blur-md overflow-hidden">
          {/* Header & Stats */}
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Sprint Task Backlog
              </h3>
              <p className="text-[11px] text-slate-400">
                Track, reprioritize, and log software tasks
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-cyan-300 font-mono font-bold">
                {stats.completed} / {stats.total} Completed ({Math.round(stats.ratio * 100)}%)
              </span>
              <div className="w-28 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden border border-cyan-500/30">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(stats.ratio * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="py-3 space-y-2 border-b border-cyan-500/15">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter tasks by name or description..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {/* Status Tabs */}
              <div className="flex items-center gap-1 bg-slate-900/60 p-0.5 rounded-lg border border-slate-800">
                {(['all', 'active', 'completed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-0.5 rounded text-[11px] capitalize transition-all ${
                      statusFilter === st
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-1 bg-slate-900/60 p-0.5 rounded-lg border border-slate-800">
                {(['all', 'high', 'medium', 'low'] as const).map((pr) => (
                  <button
                    key={pr}
                    onClick={() => setPriorityFilter(pr)}
                    className={`px-2 py-0.5 rounded text-[11px] capitalize transition-all ${
                      priorityFilter === pr
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Task List Items */}
          <div className="my-2 space-y-2 overflow-y-auto custom-scrollbar flex-1 pr-1">
            {filteredTasks.length === 0 ? (
              <EmptyState
                icon={CalendarIcon}
                title="No Tasks Found"
                description={
                  searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'No tasks match the active filters. Try clearing filters or search terms.'
                    : 'Your task list is clear! Click New Task to add priorities to your sprint.'
                }
                actionLabel="Create New Task"
                onAction={() => setShowAddModal(true)}
              />
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between group ${
                    task.completed
                      ? 'bg-slate-900/30 border-slate-800/80 text-slate-400'
                      : 'bg-slate-900/70 border-cyan-500/20 hover:border-cyan-400/50 shadow-sm'
                  }`}
                >
                  <div
                    onClick={() => onToggleTask(task.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1 mr-2"
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        task.completed
                          ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_8px_#34d399]'
                          : 'border-2 border-slate-600 hover:border-cyan-400'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div
                        className={`text-xs font-semibold ${
                          task.completed ? 'text-slate-500 line-through' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span className="text-cyan-400/80">{task.category}</span>
                        <span>•</span>
                        <span>Due {task.dueDate || 'Soon'}</span>
                        {task.description && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[140px] text-slate-400">
                              {task.description}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Priority Badge & Edit/Delete Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        task.priority === 'high'
                          ? 'rose'
                          : task.priority === 'medium'
                          ? 'amber'
                          : 'cyan'
                      }
                      size="sm"
                    >
                      {task.priority}
                    </Badge>

                    {/* Edit button */}
                    <button
                      onClick={() => startEditing(task)}
                      aria-label="Edit task"
                      className="p-1 rounded-lg text-slate-500 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                      title="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    {onDeleteTask && (
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        aria-label="Delete task"
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal: New Task */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={
          <>
            <Plus className="w-4 h-4 text-cyan-400" />
            Create New DevOS Task
          </>
        }
        description="Add an actionable development task, algorithm target, or project priority."
      >
        <form onSubmit={handleCreateTask} className="space-y-3.5 pt-1">
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Implement WebGPU Compute Pipeline"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="DSA Arena">DSA Arena</option>
                <option value="Coding Studio">Coding Studio</option>
                <option value="Learning Academy">Learning Academy</option>
                <option value="Engineering">Engineering</option>
                <option value="AI Research">AI Research</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              Description (optional)
            </label>
            <textarea
              rows={2}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Key specifications, milestones, or test criteria..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 custom-scrollbar"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Task */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title={
          <>
            <Edit2 className="w-4 h-4 text-cyan-400" />
            Edit Sprint Task
          </>
        }
        description="Update task details, schedule, or priority level."
      >
        <form onSubmit={handleSaveEdit} className="space-y-3.5 pt-1">
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Category
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="DSA Arena">DSA Arena</option>
                <option value="Coding Studio">Coding Studio</option>
                <option value="Learning Academy">Learning Academy</option>
                <option value="Engineering">Engineering</option>
                <option value="AI Research">AI Research</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Priority
              </label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 custom-scrollbar"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingTask(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
