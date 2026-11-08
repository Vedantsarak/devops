import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthUser, AuthSession, UserProfile, Workspace, DbTask } from '../types/supabase';

interface SupabaseContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  profile: UserProfile | null;
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
  tasks: DbTask[];
  isLoadingAuth: boolean;
  isLoadingTasks: boolean;
  authError: string | null;
  taskError: string | null;
  isConfigured: boolean;
  signUp: (email: string, password: string, fullName?: string, username?: string) => Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  createWorkspace: (name: string, description?: string, icon?: string) => Promise<Workspace | null>;
  createTask: (newTask: {
    title: string;
    category?: string;
    priority?: 'high' | 'medium' | 'low';
    deadline?: string;
    description?: string;
  }) => Promise<DbTask | null>;
  updateTask: (id: string, updates: Partial<DbTask>) => Promise<DbTask | null>;
  deleteTask: (id: string) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextValue | null>(null);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [tasks, setTasks] = useState<DbTask[]>([]);
  
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [taskError, setTaskError] = useState<string | null>(null);

  // Load User Profile
  const loadProfile = useCallback(async (userId: string, email?: string, name?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
      } else {
        // Fallback default profile if not found
        setProfile({
          id: userId,
          username: email?.split('@')[0] || 'developer',
          full_name: name || 'DevOS Pioneer',
          headline: 'Full-Stack Autonomous Engineer',
          streak_days: 47,
        });
      }
    } catch {
      // Graceful fallback
    }
  }, []);

  // Load Workspaces for the authenticated user
  const loadWorkspaces = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        setWorkspaces(data);
        setCurrentWorkspace((prev) => {
          if (prev && data.some((w: Workspace) => w.id === prev.id)) {
            return prev;
          }
          return data[0];
        });
      } else {
        // If no workspace exists yet, create default one
        const defaultWs: Workspace = {
          id: `ws-${userId}-primary`,
          name: 'Personal Command',
          slug: 'personal-command',
          description: 'Primary DevOS workspace',
          icon: 'Terminal',
          owner_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setWorkspaces([defaultWs]);
        setCurrentWorkspace(defaultWs);
      }
    } catch {
      // Graceful fallback
    }
  }, []);

  // Load Tasks for current workspace (or all user tasks)
  const loadTasks = useCallback(async (userId: string, workspaceId?: string | null) => {
    setIsLoadingTasks(true);
    setTaskError(null);
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }

      const { data, error } = await query;
      if (error) {
        setTaskError(error.message || 'Failed to fetch tasks');
      } else {
        setTasks(data || []);
      }
    } catch (err: any) {
      setTaskError(err.message || 'Unexpected error loading tasks');
    } finally {
      setIsLoadingTasks(false);
    }
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    if (!user) return;
    await Promise.all([
      loadProfile(user.id, user.email, user.user_metadata?.full_name),
      loadWorkspaces(user.id),
      loadTasks(user.id, currentWorkspace?.id),
    ]);
  }, [user, currentWorkspace?.id, loadProfile, loadWorkspaces, loadTasks]);

  // Initial Auth Session Check and Listener
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      setIsLoadingAuth(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (isMounted) {
          if (sessionData?.session) {
            const s = sessionData.session;
            setSession(s);
            setUser(s.user);
            await loadProfile(s.user.id, s.user.email, s.user.user_metadata?.full_name);
            await loadWorkspaces(s.user.id);
            await loadTasks(s.user.id);
          } else {
            setSession(null);
            setUser(null);
            setProfile(null);
            setWorkspaces([]);
            setTasks([]);
          }
        }
      } catch (err) {
        console.error('Error initializing Supabase session:', err);
      } finally {
        if (isMounted) setIsLoadingAuth(false);
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event: string, newSession: AuthSession | null) => {
        if (!isMounted) return;
        setSession(newSession);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          await loadProfile(newSession.user.id, newSession.user.email, newSession.user.user_metadata?.full_name);
          await loadWorkspaces(newSession.user.id);
          await loadTasks(newSession.user.id);
        } else {
          setProfile(null);
          setWorkspaces([]);
          setCurrentWorkspace(null);
          setTasks([]);
        }
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [loadProfile, loadWorkspaces, loadTasks]);

  // When current workspace changes, re-filter tasks
  useEffect(() => {
    if (user?.id && currentWorkspace?.id) {
      loadTasks(user.id, currentWorkspace.id);
    }
  }, [user?.id, currentWorkspace?.id, loadTasks]);

  // Sign In Handler
  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    setIsLoadingAuth(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }
      setSession(data.session);
      setUser(data.user);
      if (data.user) {
        await loadProfile(data.user.id);
        await loadWorkspaces(data.user.id);
        await loadTasks(data.user.id);
      }
      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Authentication failed.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Sign Up Handler
  const signUp = async (email: string, password: string, fullName?: string, username?: string) => {
    setAuthError(null);
    setIsLoadingAuth(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      const needsConfirmation = !data.session;
      setSession(data.session);
      setUser(data.user);
      if (data.user && data.session) {
        await loadProfile(data.user.id);
        await loadWorkspaces(data.user.id);
        await loadTasks(data.user.id);
      }
      return { success: true, needsConfirmation };
    } catch (err: any) {
      const msg = err.message || 'Registration failed.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Sign Out Handler
  const signOut = async () => {
    setIsLoadingAuth(true);
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setTasks([]);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Workspace Creation
  const createWorkspace = async (name: string, description?: string, icon?: string): Promise<Workspace | null> => {
    if (!user) return null;
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          name,
          slug: slug || 'workspace',
          description: description || '',
          icon: icon || 'Terminal',
          owner_id: user.id,
        })
        .select()
        .single();

      if (!error && data) {
        setWorkspaces((prev) => [...prev, data]);
        setCurrentWorkspace(data);
        return data;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Task Creation
  const createTask = async (newTask: {
    title: string;
    category?: string;
    priority?: 'high' | 'medium' | 'low';
    deadline?: string;
    description?: string;
  }): Promise<DbTask | null> => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          workspace_id: currentWorkspace?.id || null,
          title: newTask.title,
          category: newTask.category || 'General',
          priority: newTask.priority || 'medium',
          deadline: newTask.deadline || null,
          description: newTask.description || '',
          completed: false,
          status: 'pending',
        })
        .select()
        .single();

      if (!error && data) {
        setTasks((prev) => [data, ...prev]);
        return data;
      }
      return null;
    } catch (err: any) {
      setTaskError(err.message || 'Failed to create task');
      return null;
    }
  };

  // Task Update (Toggle completed, edit priority/title)
  const updateTask = async (id: string, updates: Partial<DbTask>): Promise<DbTask | null> => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
        return data;
      }
      return null;
    } catch (err: any) {
      setTaskError(err.message || 'Failed to update task');
      return null;
    }
  };

  // Task Deletion
  const deleteTask = async (id: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (!error) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Profile Update
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (!error && data) {
        setProfile(data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <SupabaseContext.Provider
      value={{
        user,
        session,
        profile,
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        tasks,
        isLoadingAuth,
        isLoadingTasks,
        authError,
        taskError,
        isConfigured: isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        createWorkspace,
        createTask,
        updateTask,
        deleteTask,
        updateProfile,
        refreshData,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
