export type NavModule = 
  | 'home' 
  | 'coding' 
  | 'dsa' 
  | 'learn' 
  | 'intelligence' 
  | 'opportunities' 
  | 'calendar' 
  | 'launcher'
  | 'research' 
  | 'vault' 
  | 'analytics' 
  | 'settings';

export interface TaskPriority {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  description?: string;
  createdAt?: string;
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  category: 'hackathon' | 'contest' | 'internship' | 'project';
  dateStr: string;
  daysRemaining: number;
  badgeColor: 'red' | 'blue' | 'purple' | 'amber';
  link?: string;
}

export interface DsaProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  status: 'Solved' | 'Attempted' | 'Todo';
  notes?: string;
  solution?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  url?: string;
}

export interface TechNewsItem {
  id: string;
  title: string;
  source: string;
  category: 'AI Research' | 'Engineering' | 'Tools' | 'Startups';
  date: string;
  summary: string;
  url: string;
  readTime: string;
  tags: string[];
}

export interface OpportunityItem {
  id: string;
  title: string;
  type: 'Hackathon' | 'Internship' | 'Competition' | 'Conference';
  organization: string;
  deadline: string;
  daysLeft: number;
  prize?: string;
  location: string;
  eligibility: string;
  tags: string[];
  link: string;
  saved?: boolean;
}

export interface AgentType {
  id: string;
  name: string;
  role: string;
  icon: string;
  description: string;
  capabilities: string[];
  systemPrompt: string;
}

export interface SnippetNote {
  id: string;
  title: string;
  language: string;
  code: string;
  category: string;
  tags: string[];
  updatedAt: string;
}

export interface LauncherShortcut {
  id: string;
  title: string;
  category: 'Coding & DSA' | 'Research & Papers' | 'Tools & Docs' | 'Community & Media';
  url: string;
  icon: string;
  description: string;
  isCustom?: boolean;
}
