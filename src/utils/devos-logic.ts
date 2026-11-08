import { DsaProblem, TaskPriority, LauncherShortcut } from '../types/devos';

/**
 * Calculates DSA statistics including percentage completed and difficulty breakdown.
 */
export function calculateDsaProgress(problems: DsaProblem[]): {
  total: number;
  solved: number;
  percentage: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
} {
  if (!problems || problems.length === 0) {
    return {
      total: 0,
      solved: 0,
      percentage: 0,
      easyCount: 0,
      mediumCount: 0,
      hardCount: 0,
    };
  }

  const total = problems.length;
  const solvedProblems = problems.filter((p) => p.status === 'Solved');
  const solved = solvedProblems.length;
  const percentage = Math.round((solved / total) * 100);

  const easyCount = solvedProblems.filter((p) => p.difficulty === 'Easy').length;
  const mediumCount = solvedProblems.filter((p) => p.difficulty === 'Medium').length;
  const hardCount = solvedProblems.filter((p) => p.difficulty === 'Hard').length;

  return {
    total,
    solved,
    percentage,
    easyCount,
    mediumCount,
    hardCount,
  };
}

/**
 * Calculates Overall Developer Score out of 100 based on weighted metrics.
 */
export function calculateOverallScore(
  streakDays: number,
  dsaPercentage: number,
  projectsCount: number,
  taskCompletionRatio: number
): number {
  const dsaScore = Math.min(100, dsaPercentage) * 0.4;
  const streakScore = Math.min(100, streakDays * 2) * 0.25;
  const projectScore = Math.min(100, projectsCount * 8) * 0.2;
  const taskScore = Math.min(100, taskCompletionRatio * 100) * 0.15;

  const total = Math.round(dsaScore + streakScore + projectScore + taskScore);
  return Math.min(100, Math.max(0, total));
}

/**
 * Calculates the number of days remaining until a deadline date string (YYYY-MM-DD).
 */
export function calculateDaysRemaining(targetDateStr: string, fromDateStr?: string): number {
  const from = fromDateStr ? new Date(fromDateStr) : new Date();
  const target = new Date(targetDateStr);
  
  from.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - from.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Filter an array of items by search query across multiple fields.
 */
export function filterItemsByQuery<T extends Record<string, any>>(
  items: T[],
  query: string,
  fields: (keyof T)[]
): T[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return items;

  return items.filter((item) => {
    return fields.some((field) => {
      const val = item[field];
      if (val === null || val === undefined) return false;
      if (typeof val === 'string') {
        return val.toLowerCase().includes(trimmed);
      }
      if (Array.isArray(val)) {
        return val.some((element: unknown) => String(element).toLowerCase().includes(trimmed));
      }
      return String(val).toLowerCase().includes(trimmed);
    });
  });
}

/**
 * Calculates task completion ratio.
 */
export function calculateTaskCompletion(tasks: TaskPriority[]): {
  total: number;
  completed: number;
  ratio: number;
} {
  if (!tasks || tasks.length === 0) {
    return { total: 0, completed: 0, ratio: 0 };
  }
  const completed = tasks.filter((t) => t.completed).length;
  return {
    total: tasks.length,
    completed,
    ratio: completed / tasks.length,
  };
}

/**
 * Filter and sort tasks based on status, category, and priority
 */
export function filterTasks(
  tasks: TaskPriority[],
  options: {
    status?: 'all' | 'active' | 'completed';
    category?: string;
    priority?: 'all' | 'high' | 'medium' | 'low';
    search?: string;
  }
): TaskPriority[] {
  return tasks.filter((task) => {
    if (options.status === 'active' && task.completed) return false;
    if (options.status === 'completed' && !task.completed) return false;
    if (options.category && options.category !== 'all' && task.category !== options.category) {
      return false;
    }
    if (options.priority && options.priority !== 'all' && task.priority !== options.priority) {
      return false;
    }
    if (options.search && options.search.trim()) {
      const q = options.search.trim().toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q) || false;
      const matchCat = task.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }
    return true;
  });
}

/**
 * Filter shortcuts by search query and category
 */
export function filterShortcuts(
  shortcuts: LauncherShortcut[],
  query: string,
  category: string = 'all'
): LauncherShortcut[] {
  const trimmed = query.trim().toLowerCase();
  return shortcuts.filter((sc) => {
    const matchCat = category === 'all' || sc.category === category;
    const matchQuery = !trimmed ||
      sc.title.toLowerCase().includes(trimmed) ||
      sc.description.toLowerCase().includes(trimmed) ||
      sc.url.toLowerCase().includes(trimmed);
    return matchCat && matchQuery;
  });
}
