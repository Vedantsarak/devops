import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDsaProgress,
  calculateOverallScore,
  calculateDaysRemaining,
  filterItemsByQuery,
  calculateTaskCompletion,
  filterTasks,
  filterShortcuts,
} from './devos-logic';
import { DsaProblem, TaskPriority, LauncherShortcut } from '../types/devos';

test('calculateDsaProgress correctly calculates percentage and difficulty counts', () => {
  const problems: DsaProblem[] = [
    { id: '1', title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', status: 'Solved' },
    { id: '2', title: '3Sum', difficulty: 'Medium', category: 'Arrays', status: 'Solved' },
    { id: '3', title: 'Trapping Rain Water', difficulty: 'Hard', category: 'Arrays', status: 'Solved' },
    { id: '4', title: 'LRU Cache', difficulty: 'Medium', category: 'Design', status: 'Attempted' },
  ];

  const result = calculateDsaProgress(problems);
  assert.equal(result.total, 4);
  assert.equal(result.solved, 3);
  assert.equal(result.percentage, 75);
  assert.equal(result.easyCount, 1);
  assert.equal(result.mediumCount, 1);
  assert.equal(result.hardCount, 1);
});

test('calculateOverallScore produces correct weighted score clamped 0-100', () => {
  const scoreHigh = calculateOverallScore(47, 78, 12, 0.5);
  assert.ok(scoreHigh >= 75 && scoreHigh <= 98, `Score ${scoreHigh} should be high`);
  assert.equal(calculateOverallScore(100, 100, 20, 1.0), 100);
  assert.equal(calculateOverallScore(0, 0, 0, 0), 0);
});

test('calculateDaysRemaining accurately measures day differences', () => {
  const fixedToday = '2025-04-26T00:00:00Z';
  const deadlineHackathon = '2025-04-30T00:00:00Z';
  assert.equal(calculateDaysRemaining(deadlineHackathon, fixedToday), 4);
});

test('filterTasks correctly filters by status, priority, and category', () => {
  const tasks: TaskPriority[] = [
    { id: '1', title: 'Task Alpha', category: 'DSA Arena', completed: true, priority: 'high' },
    { id: '2', title: 'Task Beta', category: 'Coding Studio', completed: false, priority: 'medium' },
    { id: '3', title: 'Task Gamma', category: 'DSA Arena', completed: false, priority: 'high' },
  ];

  // Active tasks only
  const active = filterTasks(tasks, { status: 'active' });
  assert.equal(active.length, 2);

  // Completed tasks only
  const completed = filterTasks(tasks, { status: 'completed' });
  assert.equal(completed.length, 1);
  assert.equal(completed[0].id, '1');

  // Filter by category
  const dsa = filterTasks(tasks, { category: 'DSA Arena' });
  assert.equal(dsa.length, 2);

  // Filter by priority
  const highPriority = filterTasks(tasks, { priority: 'high' });
  assert.equal(highPriority.length, 2);

  // Search keyword
  const searchBeta = filterTasks(tasks, { search: 'beta' });
  assert.equal(searchBeta.length, 1);
  assert.equal(searchBeta[0].title, 'Task Beta');
});

test('filterShortcuts filters shortcuts by query and category', () => {
  const shortcuts: LauncherShortcut[] = [
    { id: '1', title: 'LeetCode', category: 'Coding & DSA', url: 'https://leetcode.com', icon: 'Code', description: 'Practice DSA' },
    { id: '2', title: 'arXiv', category: 'Research & Papers', url: 'https://arxiv.org', icon: 'Book', description: 'Academic papers' },
    { id: '3', title: 'GitHub', category: 'Tools & Docs', url: 'https://github.com', icon: 'Git', description: 'Repositories' },
  ];

  const searchLeet = filterShortcuts(shortcuts, 'leet');
  assert.equal(searchLeet.length, 1);
  assert.equal(searchLeet[0].title, 'LeetCode');

  const catResearch = filterShortcuts(shortcuts, '', 'Research & Papers');
  assert.equal(catResearch.length, 1);
  assert.equal(catResearch[0].title, 'arXiv');
});

test('calculateTaskCompletion handles empty arrays and proportions', () => {
  assert.deepEqual(calculateTaskCompletion([]), { total: 0, completed: 0, ratio: 0 });

  const tasks: TaskPriority[] = [
    { id: '1', title: 'Task 1', category: 'General', completed: true, priority: 'medium' },
    { id: '2', title: 'Task 2', category: 'General', completed: true, priority: 'medium' },
    { id: '3', title: 'Task 3', category: 'General', completed: false, priority: 'high' },
    { id: '4', title: 'Task 4', category: 'General', completed: false, priority: 'low' },
  ];
  const stats = calculateTaskCompletion(tasks);
  assert.equal(stats.total, 4);
  assert.equal(stats.completed, 2);
  assert.equal(stats.ratio, 0.5);
});
