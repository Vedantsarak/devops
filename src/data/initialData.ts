import { 
  TaskPriority, 
  UpcomingDeadline, 
  DsaProblem, 
  TechNewsItem, 
  OpportunityItem, 
  AgentType, 
  SnippetNote,
  LauncherShortcut
} from '../types/devos';

export const INITIAL_PRIORITIES: TaskPriority[] = [
  {
    id: 'p1',
    title: 'Solve 3 DSA problems',
    category: 'DSA Arena',
    completed: true,
    priority: 'high',
    dueDate: '2025-04-26',
  },
  {
    id: 'p2',
    title: 'Complete React course',
    category: 'Learning Academy',
    completed: true,
    priority: 'medium',
    dueDate: '2025-04-26',
  },
  {
    id: 'p3',
    title: 'Build personal project',
    category: 'Coding Studio',
    completed: false,
    priority: 'high',
    dueDate: '2025-04-27',
  },
  {
    id: 'p4',
    title: 'Review project PR',
    category: 'Engineering',
    completed: false,
    priority: 'medium',
    dueDate: '2025-04-28',
  },
];

export const INITIAL_DEADLINES: UpcomingDeadline[] = [
  {
    id: 'd1',
    title: 'Hackathon 2025',
    category: 'hackathon',
    dateStr: 'Apr 30, 2025',
    daysRemaining: 2,
    badgeColor: 'red',
    link: '#hackathon',
  },
  {
    id: 'd2',
    title: 'DSA Contest',
    category: 'contest',
    dateStr: 'May 10, 2025',
    daysRemaining: 12,
    badgeColor: 'blue',
    link: '#dsa-contest',
  },
  {
    id: 'd3',
    title: 'Internship Application',
    category: 'internship',
    dateStr: 'May 15, 2025',
    daysRemaining: 17,
    badgeColor: 'blue',
    link: '#internship-app',
  },
];

export const INITIAL_DSA_PROBLEMS: DsaProblem[] = [
  {
    id: 'dsa-1',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    status: 'Solved',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: 'Used a hash map to store complements in a single pass.',
    solution: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    url: 'https://leetcode.com/problems/two-sum/',
  },
  {
    id: 'dsa-2',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    status: 'Solved',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: 'Classic stack matching bracket pairs. Check empty at end.',
    solution: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const ch of s) {
    if (ch in map) {
      if (stack.pop() !== map[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
    url: 'https://leetcode.com/problems/valid-parentheses/',
  },
  {
    id: 'dsa-3',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    category: 'Linked List',
    status: 'Solved',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(1)',
    notes: 'Dummy head pointer pointer traversal.',
    url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
  },
  {
    id: 'dsa-4',
    title: '3Sum',
    difficulty: 'Medium',
    category: 'Two Pointers',
    status: 'Solved',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
    notes: 'Sort array first. Fix one element, run two pointers for remaining two. Skip duplicates carefully.',
    solution: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const res: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        res.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return res;
}`,
    url: 'https://leetcode.com/problems/3sum/',
  },
  {
    id: 'dsa-5',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    status: 'Solved',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
    notes: 'Expand around center approach for odd and even length centers.',
    url: 'https://leetcode.com/problems/longest-palindromic-substring/',
  },
  {
    id: 'dsa-6',
    title: 'Course Schedule (Topological Sort)',
    difficulty: 'Medium',
    category: 'Graphs',
    status: 'Solved',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    notes: "Kahn's BFS in-degree algorithm to detect graph cycles.",
    url: 'https://leetcode.com/problems/course-schedule/',
  },
  {
    id: 'dsa-7',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: 'Two Pointers',
    status: 'Solved',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: 'Keep track of leftMax and rightMax, advance the pointer with smaller bound.',
    url: 'https://leetcode.com/problems/trapping-rain-water/',
  },
  {
    id: 'dsa-8',
    title: 'Word Ladder II',
    difficulty: 'Hard',
    category: 'Graphs & BFS',
    status: 'Attempted',
    timeComplexity: 'O(N * M^2)',
    spaceComplexity: 'O(N * M)',
    notes: 'Bidirectional BFS followed by DFS backtracking to construct shortest transformation sequences.',
    url: 'https://leetcode.com/problems/word-ladder-ii/',
  },
  {
    id: 'dsa-9',
    title: 'LRU Cache Design',
    difficulty: 'Medium',
    category: 'System Design / Data Structures',
    status: 'Solved',
    timeComplexity: 'O(1) get & put',
    spaceComplexity: 'O(capacity)',
    notes: 'Hash map combined with doubly linked list to achieve O(1) eviction and lookup.',
    url: 'https://leetcode.com/problems/lru-cache/',
  },
  {
    id: 'dsa-10',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    category: 'Binary Search',
    status: 'Attempted',
    timeComplexity: 'O(log(min(m, n)))',
    spaceComplexity: 'O(1)',
    notes: 'Binary search partition on smaller array. Balance left and right halves.',
    url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
  },
];

export const INITIAL_TECH_NEWS: TechNewsItem[] = [
  {
    id: 'news-1',
    title: 'DeepSeek-V3 & Next-Gen MoE Architecture Breakthroughs',
    source: 'ArXiv & Tech AI',
    category: 'AI Research',
    date: 'Apr 25, 2025',
    summary: 'Multi-head Latent Attention (MLA) and Auxiliary-loss-free load balancing dramatically reduce memory footprint and latency in production training.',
    url: 'https://arxiv.org',
    readTime: '6 min read',
    tags: ['Transformers', 'MoE', 'Deep Learning'],
  },
  {
    id: 'news-2',
    title: 'TypeScript 5.8 Introduces Granular Return Type Checks',
    source: 'Microsoft TypeScript Blog',
    category: 'Tools',
    date: 'Apr 24, 2025',
    summary: 'New checks prevent conditional return type mismatches and optimize compilation passes by up to 18% in monorepos.',
    url: 'https://devblogs.microsoft.com/typescript/',
    readTime: '4 min read',
    tags: ['TypeScript', 'JavaScript', 'Tooling'],
  },
  {
    id: 'news-3',
    title: 'WebAssembly GC and High-Performance Compute on Edge Nodes',
    source: 'ACM Queue',
    category: 'Engineering',
    date: 'Apr 22, 2025',
    summary: 'Edge execution environments report 3x lower cold start latency with native WasmGC garbage collection support in Chromium and V8.',
    url: 'https://queue.acm.org',
    readTime: '7 min read',
    tags: ['WebAssembly', 'Performance', 'Systems'],
  },
  {
    id: 'news-4',
    title: 'PostgreSQL 17 Vector Search Performance Benchmarks',
    source: 'Postgres Engineering',
    category: 'Engineering',
    date: 'Apr 20, 2025',
    summary: 'Native HNSW index parallelism improvements yield 4.2x QPS acceleration for high-dimensional embedding retrievals.',
    url: 'https://postgresql.org',
    readTime: '5 min read',
    tags: ['Database', 'Postgres', 'Vector AI'],
  },
];

export const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp-1',
    title: 'Global AI & Autonomous Agent Hackathon 2025',
    type: 'Hackathon',
    organization: 'Hugging Face & Anthropic',
    deadline: '2025-04-30',
    daysLeft: 2,
    prize: '$75,000 Cash + Cloud Credits',
    location: 'Virtual / Global',
    eligibility: 'Open to all developers worldwide',
    tags: ['Multi-Agent', 'LLMs', 'Open Source'],
    link: 'https://devpost.com',
    saved: true,
  },
  {
    id: 'opp-2',
    title: 'Codeforces Global Round 29 - Div 1 + Div 2',
    type: 'Competition',
    organization: 'Codeforces',
    deadline: '2025-05-10',
    daysLeft: 12,
    prize: 'Rating Badges & Swag Pack',
    location: 'Online Contest (2.5 hrs)',
    eligibility: 'All rated participants',
    tags: ['Competitive Programming', 'Algorithms', 'C++'],
    link: 'https://codeforces.com',
    saved: true,
  },
  {
    id: 'opp-3',
    title: 'Google Software Engineering Internship - Summer 2026',
    type: 'Internship',
    organization: 'Google',
    deadline: '2025-05-15',
    daysLeft: 17,
    prize: 'Competitive Stipend + Relocation',
    location: 'Mountain View, CA / Remote options',
    eligibility: 'B.Tech/MS Computer Science graduating 2026/2027',
    tags: ['Systems', 'Distributed Computing', 'SWE'],
    link: 'https://careers.google.com',
    saved: true,
  },
  {
    id: 'opp-4',
    title: 'ICLR 2025 Workshop on Efficient Reasoning',
    type: 'Conference',
    organization: 'ICLR',
    deadline: '2025-05-28',
    daysLeft: 30,
    prize: 'Paper Publication & Travel Grant',
    location: 'Singapore & Virtual',
    eligibility: 'Researchers, graduate students & engineers',
    tags: ['Research', 'Machine Learning', 'Reasoning'],
    link: 'https://iclr.cc',
    saved: false,
  },
];

export const INITIAL_AGENTS: AgentType[] = [
  {
    id: 'agent-research',
    name: 'Research Agent',
    role: 'Deep Computer Science & Literature Synthesis',
    icon: 'Atom',
    description: 'Scours technical papers, arXiv releases, and architectural RFCs to answer complex systems questions with citations.',
    capabilities: ['Paper breakdown', 'Math proof analysis', 'Citation extraction', 'State-of-art summaries'],
    systemPrompt: 'You are the DevOS Research Agent. Provide deep, accurate computer science analysis with academic rigor.',
  },
  {
    id: 'agent-coding',
    name: 'Coding Agent',
    role: 'Full-Stack Architecture & Refactoring',
    icon: 'Code',
    description: 'Generates idiomatic TypeScript, Rust, C++, and Go code. Conducts security audits and optimizes algorithms.',
    capabilities: ['Unit test generation', 'Refactoring', 'Bug diagnosis', 'System design'],
    systemPrompt: 'You are the DevOS Coding Agent. Produce clean, efficient, production-ready code with complete explanations.',
  },
  {
    id: 'agent-learning',
    name: 'Learning Agent',
    role: 'Personalized DSA & Computer Science Tutor',
    icon: 'GraduationCap',
    description: 'Creates customized step-by-step study paths, explains complex algorithmic invariants with visual analogies.',
    capabilities: ['Spaced repetition', 'Intuition building', 'Mock interviews', 'Complexity analysis'],
    systemPrompt: 'You are the DevOS Learning Agent. Guide the developer with Socratic inquiry and deep intuition.',
  },
  {
    id: 'agent-opportunity',
    name: 'Opportunity Discovery Agent',
    role: 'Hackathons, Internships & Grants Scout',
    icon: 'Briefcase',
    description: 'Scans platforms for high-value engineering opportunities, tracks deadlines, and provides portfolio matching.',
    capabilities: ['Deadline tracking', 'Resume matching', 'Application strategy', 'Grant discovery'],
    systemPrompt: 'You are the DevOS Opportunity Agent. Help the developer find career-defining opportunities.',
  },
  {
    id: 'agent-news',
    name: 'Tech Intelligence Agent',
    role: 'Curated Software & AI Signal Filter',
    icon: 'Crosshair',
    description: 'Filters out noise and synthesizes the top 1% most impactful engineering breakthroughs daily.',
    capabilities: ['Relevance scoring', 'Changelog diffs', 'Breaking release alerts', 'Executive summaries'],
    systemPrompt: 'You are the DevOS Tech Intelligence Agent. Deliver high-signal software engineering updates.',
  },
  {
    id: 'agent-career',
    name: 'Career & LinkedIn Agent',
    role: 'Thought Leadership & Engineering Impact',
    icon: 'TrendingUp',
    description: 'Crafts insightful technical posts, project launch announcements, and weekly engineering retrospectives.',
    capabilities: ['Technical copywriting', 'Project showcases', 'Key learnings summaries', 'Visual hook framing'],
    systemPrompt: 'You are the DevOS Career Agent. Transform technical accomplishments into compelling thought leadership.',
  },
];

export const INITIAL_SNIPPETS: SnippetNote[] = [
  {
    id: 'snip-1',
    title: 'Three.js PMREM Studio Environment Generator',
    language: 'typescript',
    category: 'Graphics / 3D',
    tags: ['threejs', 'pbr', 'webgl'],
    updatedAt: '2025-04-25',
    code: `import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function setupStudioLighting(renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  pmremGenerator.dispose();
}`,
  },
  {
    id: 'snip-2',
    title: 'TypeScript Type-Safe Result Monad',
    language: 'typescript',
    category: 'Design Patterns',
    tags: ['functional', 'patterns', 'error-handling'],
    updatedAt: '2025-04-20',
    code: `export type Result<T, E = Error> = 
  | { success: true; data: T } 
  | { success: false; error: E };

export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}`,
  },
  {
    id: 'snip-3',
    title: 'Concurrent Rate Limiter (Token Bucket Algorithm)',
    language: 'typescript',
    category: 'Distributed Systems',
    tags: ['concurrency', 'algorithms', 'backend'],
    updatedAt: '2025-04-18',
    code: `export class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(private capacity: number, private refillRatePerSec: number) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  take(): boolean {
    const now = Date.now();
    const elapsedSec = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillRatePerSec);
    this.lastRefill = now;

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}`,
  },
];

export const INITIAL_LAUNCHER_SHORTCUTS: LauncherShortcut[] = [
  {
    id: 'sc-leetcode',
    title: 'LeetCode',
    category: 'Coding & DSA',
    url: 'https://leetcode.com',
    icon: 'Code',
    description: 'Daily algorithms, contest ratings, and problem vault',
  },
  {
    id: 'sc-codeforces',
    title: 'Codeforces',
    category: 'Coding & DSA',
    url: 'https://codeforces.com',
    icon: 'Trophy',
    description: 'Competitive programming rounds and rating tracking',
  },
  {
    id: 'sc-github',
    title: 'GitHub',
    category: 'Tools & Docs',
    url: 'https://github.com',
    icon: 'GitBranch',
    description: 'Repository management, pull requests, and CI/CD actions',
  },
  {
    id: 'sc-linkedin',
    title: 'LinkedIn',
    category: 'Community & Media',
    url: 'https://linkedin.com',
    icon: 'Share2',
    description: 'Engineering network, technical posts, and career milestones',
  },
  {
    id: 'sc-arxiv',
    title: 'arXiv Computer Science',
    category: 'Research & Papers',
    url: 'https://arxiv.org/corr',
    icon: 'BookOpen',
    description: 'Preprints on AI, systems, distributed compute, and cryptography',
  },
  {
    id: 'sc-scholar',
    title: 'Google Scholar',
    category: 'Research & Papers',
    url: 'https://scholar.google.com',
    icon: 'GraduationCap',
    description: 'Academic citations, author profiles, and research publications',
  },
  {
    id: 'sc-stackoverflow',
    title: 'Stack Overflow',
    category: 'Community & Media',
    url: 'https://stackoverflow.com',
    icon: 'HelpCircle',
    description: 'Developer Q&A, debugging insights, and architecture answers',
  },
  {
    id: 'sc-youtube',
    title: 'YouTube Tech & Lectures',
    category: 'Community & Media',
    url: 'https://youtube.com',
    icon: 'Video',
    description: 'MIT OpenCourseWare, Stanford CS, and deep-dive engineering channels',
  },
  {
    id: 'sc-vscode',
    title: 'VS Code Web',
    category: 'Tools & Docs',
    url: 'https://vscode.dev',
    icon: 'Terminal',
    description: 'Browser-based Monaco code editor and remote workspace',
  },
  {
    id: 'sc-devdocs',
    title: 'DevDocs.io',
    category: 'Tools & Docs',
    url: 'https://devdocs.io',
    icon: 'FileText',
    description: 'Unified offline API documentation for TypeScript, C++, and Python',
  },
];
