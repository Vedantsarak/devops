export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  headline?: string;
  streak_days?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at?: string;
}

export interface DbTask {
  id: string;
  user_id: string;
  workspace_id?: string | null;
  title: string;
  description?: string | null;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status?: 'pending' | 'in_progress' | 'completed';
  completed: boolean;
  deadline?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
  created_at?: string;
}

export interface AuthSession {
  access_token: string;
  user: AuthUser;
  expires_at?: number;
}
