import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthUser, AuthSession, UserProfile, Workspace, DbTask } from '../types/supabase';

// Isomorphic Environment variables (Client-side, anon key only)
const getEnvVar = (key: string): string | undefined => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.[key]) {
      return (import.meta as any).env[key];
    }
  } catch {
    // ignore
  }
  try {
    if (typeof process !== 'undefined' && process.env?.[key]) {
      return process.env[key];
    }
  } catch {
    // ignore
  }
  return undefined;
};

const rawSupabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const rawSupabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = Boolean(
  rawSupabaseUrl &&
  rawSupabaseAnonKey &&
  rawSupabaseUrl.startsWith('https://') &&
  !rawSupabaseUrl.includes('your-project-id')
);

// In-Memory & LocalStorage Simulated Supabase Store for Offline / Dev Sandbox
interface LocalStoreSchema {
  users: Array<{
    id: string;
    email: string;
    passwordHash: string;
    metadata: { full_name?: string; username?: string; avatar_url?: string };
    created_at: string;
  }>;
  profiles: UserProfile[];
  workspaces: Workspace[];
  tasks: DbTask[];
  currentSession: AuthSession | null;
}

const STORAGE_KEY = 'devos_supabase_db_v1';

// Seed demo users and data to demonstrate multi-user isolation out of the box
const DEFAULT_SEED_DATA: LocalStoreSchema = {
  users: [
    {
      id: 'usr-alex-001',
      email: 'alex.dev@example.com',
      passwordHash: 'password123',
      metadata: { full_name: 'Alex Mercer', username: 'alex_cyber', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      created_at: '2026-01-01T00:00:00Z',
    },
    {
      id: 'usr-sarah-002',
      email: 'sarah.lead@example.com',
      passwordHash: 'password123',
      metadata: { full_name: 'Sarah Connor', username: 'sarah_arch', avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
      created_at: '2026-01-02T00:00:00Z',
    },
  ],
  profiles: [
    {
      id: 'usr-alex-001',
      username: 'alex_cyber',
      full_name: 'Alex Mercer',
      headline: 'Autonomous Systems & Systems Architect',
      streak_days: 47,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
    {
      id: 'usr-sarah-002',
      username: 'sarah_arch',
      full_name: 'Sarah Connor',
      headline: 'Distributed Algorithms & Security Lead',
      streak_days: 62,
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      created_at: '2026-01-02T00:00:00Z',
      updated_at: '2026-01-02T00:00:00Z',
    },
  ],
  workspaces: [
    {
      id: 'ws-alex-primary',
      name: 'Cyber Core Command',
      slug: 'cyber-core',
      description: "Alex's primary command workspace",
      icon: 'Cpu',
      owner_id: 'usr-alex-001',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
    {
      id: 'ws-sarah-primary',
      name: 'Quantum Defense Hub',
      slug: 'quantum-defense',
      description: "Sarah's confidential security workspace",
      icon: 'Shield',
      owner_id: 'usr-sarah-002',
      created_at: '2026-01-02T00:00:00Z',
      updated_at: '2026-01-02T00:00:00Z',
    },
  ],
  tasks: [
    {
      id: 'task-alex-1',
      user_id: 'usr-alex-001',
      workspace_id: 'ws-alex-primary',
      title: 'Review LeetCode Dynamic Programming Patterns',
      category: 'DSA Arena',
      priority: 'high',
      status: 'pending',
      completed: false,
      deadline: '2026-11-12T00:00:00Z',
      created_at: '2026-11-01T00:00:00Z',
      updated_at: '2026-11-01T00:00:00Z',
    },
    {
      id: 'task-alex-2',
      user_id: 'usr-alex-001',
      workspace_id: 'ws-alex-primary',
      title: 'Deploy Three.js Holographic Planet Shader',
      category: 'Coding Studio',
      priority: 'medium',
      status: 'completed',
      completed: true,
      deadline: '2026-11-15T00:00:00Z',
      created_at: '2026-11-02T00:00:00Z',
      updated_at: '2026-11-03T00:00:00Z',
    },
    {
      id: 'task-sarah-1',
      user_id: 'usr-sarah-002',
      workspace_id: 'ws-sarah-primary',
      title: 'Audit Zero-Trust Row-Level-Security Boundary',
      category: 'Security',
      priority: 'high',
      status: 'pending',
      completed: false,
      deadline: '2026-11-10T00:00:00Z',
      created_at: '2026-11-01T00:00:00Z',
      updated_at: '2026-11-01T00:00:00Z',
    },
  ],
  currentSession: {
    access_token: 'mock-token-alex-001',
    user: {
      id: 'usr-alex-001',
      email: 'alex.dev@example.com',
      user_metadata: {
        full_name: 'Alex Mercer',
        username: 'alex_cyber',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
      created_at: '2026-01-01T00:00:00Z',
    },
  },
};

export class LocalSupabaseStorage {
  private static memoryStore: LocalStoreSchema = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));

  static getStore(): LocalStoreSchema {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        if (item) {
          return JSON.parse(item);
        }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
      } catch {
        // Fallback to memory
      }
    }
    return this.memoryStore;
  }

  static setStore(data: LocalStoreSchema) {
    this.memoryStore = data;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // Fallback to memory
      }
    }
  }

  static reset() {
    this.setStore(JSON.parse(JSON.stringify(DEFAULT_SEED_DATA)));
  }
}

// Subscription callbacks for auth state
type AuthStateCallback = (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED', session: AuthSession | null) => void;
const authListeners = new Set<AuthStateCallback>();

// Simulated Supabase Client conforming to the exact Supabase JS client signatures
class SimulatedSupabaseClient {
  public auth = {
    signUp: async ({ email, password, options }: { email: string; password: string; options?: { data?: { full_name?: string; username?: string; avatar_url?: string } } }) => {
      await new Promise((r) => setTimeout(r, 120));
      const store = LocalSupabaseStorage.getStore();
      const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return { data: { user: null, session: null }, error: new Error('User already registered with this email address.') };
      }

      if (!password || password.length < 6) {
        return { data: { user: null, session: null }, error: new Error('Password must be at least 6 characters long.') };
      }

      const userId = `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const metadata = options?.data || {};
      const full_name = metadata.full_name || email.split('@')[0];
      const username = metadata.username || email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');

      const newUser = {
        id: userId,
        email: email.toLowerCase(),
        passwordHash: password,
        metadata: { ...metadata, full_name, username },
        created_at: new Date().toISOString(),
      };

      // 1. Trigger handle_new_user behavior: Create profile
      const newProfile: UserProfile = {
        id: userId,
        username,
        full_name,
        headline: 'Autonomous DevOS Engineer',
        streak_days: 1,
        avatar_url: metadata.avatar_url || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 2. Trigger handle_new_user behavior: Create default workspace
      const newWorkspace: Workspace = {
        id: `ws-${userId}-${Date.now().toString(36)}`,
        name: 'Personal Command',
        slug: `${username}-command`,
        description: `${full_name}'s developer workspace`,
        icon: 'Terminal',
        owner_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const session: AuthSession = {
        access_token: `token-${userId}-${Date.now()}`,
        user: {
          id: userId,
          email: newUser.email,
          user_metadata: newUser.metadata,
          created_at: newUser.created_at,
        },
      };

      store.users.push(newUser);
      store.profiles.push(newProfile);
      store.workspaces.push(newWorkspace);
      store.currentSession = session;
      LocalSupabaseStorage.setStore(store);

      authListeners.forEach((cb) => cb('SIGNED_IN', session));
      return { data: { user: session.user, session }, error: null };
    },

    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      await new Promise((r) => setTimeout(r, 120));
      const store = LocalSupabaseStorage.getStore();
      const user = store.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
      );

      if (!user) {
        return { data: { user: null, session: null }, error: new Error('Invalid email or password.') };
      }

      const session: AuthSession = {
        access_token: `token-${user.id}-${Date.now()}`,
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.metadata,
          created_at: user.created_at,
        },
      };

      store.currentSession = session;
      LocalSupabaseStorage.setStore(store);

      authListeners.forEach((cb) => cb('SIGNED_IN', session));
      return { data: { user: session.user, session }, error: null };
    },

    signOut: async () => {
      await new Promise((r) => setTimeout(r, 50));
      const store = LocalSupabaseStorage.getStore();
      store.currentSession = null;
      LocalSupabaseStorage.setStore(store);

      authListeners.forEach((cb) => cb('SIGNED_OUT', null));
      return { error: null };
    },

    getSession: async () => {
      const store = LocalSupabaseStorage.getStore();
      return { data: { session: store.currentSession }, error: null };
    },

    getUser: async () => {
      const store = LocalSupabaseStorage.getStore();
      return { data: { user: store.currentSession?.user || null }, error: null };
    },

    onAuthStateChange: (callback: (event: string, session: AuthSession | null) => void) => {
      const listener: AuthStateCallback = (evt, session) => callback(evt, session);
      authListeners.add(listener);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authListeners.delete(listener);
            },
          },
        },
      };
    },

    updateUser: async ({ data }: { data: Partial<AuthUser['user_metadata']> }) => {
      const store = LocalSupabaseStorage.getStore();
      if (!store.currentSession) {
        return { data: { user: null }, error: new Error('Not authenticated') };
      }
      const user = store.users.find((u) => u.id === store.currentSession?.user.id);
      if (user) {
        user.metadata = { ...user.metadata, ...data };
        store.currentSession.user.user_metadata = user.metadata;
        LocalSupabaseStorage.setStore(store);
        authListeners.forEach((cb) => cb('USER_UPDATED', store.currentSession));
      }
      return { data: { user: store.currentSession.user }, error: null };
    },
  };

  // Table Query Builder with strict RLS Simulation
  public from(tableName: string) {
    const store = LocalSupabaseStorage.getStore();
    const currentUserId = store.currentSession?.user.id || null;

    return {
      select: (columns: string = '*') => {
        let results: any[] = [];

        // RLS Enforcement on SELECT
        if (tableName === 'profiles') {
          // Public profiles viewable by authenticated users
          results = [...store.profiles];
        } else if (tableName === 'workspaces') {
          // RLS: Users can only view workspaces they own
          results = currentUserId
            ? store.workspaces.filter((w) => w.owner_id === currentUserId)
            : [];
        } else if (tableName === 'tasks') {
          // RLS: Users can ONLY view their own tasks! Private records isolation.
          results = currentUserId
            ? store.tasks.filter((t) => t.user_id === currentUserId)
            : [];
        }

        const builder: any = {
          _data: results,
          eq: function (column: string, value: any) {
            this._data = this._data.filter((item: any) => item[column] === value);
            return this;
          },
          order: function (column: string, { ascending = true }: { ascending?: boolean } = {}) {
            this._data.sort((a: any, b: any) => {
              const valA = a[column] ?? '';
              const valB = b[column] ?? '';
              if (valA < valB) return ascending ? -1 : 1;
              if (valA > valB) return ascending ? 1 : -1;
              return 0;
            });
            return this;
          },
          single: async function () {
            await new Promise((r) => setTimeout(r, 20));
            return {
              data: this._data[0] || null,
              error: this._data.length === 0 ? new Error('No rows found') : null,
            };
          },
          then: function (resolve: (res: { data: any[] | null; error: Error | null }) => void) {
            Promise.resolve().then(() => resolve({ data: this._data, error: null }));
          },
        };

        return builder;
      },

      insert: (values: any | any[]) => {
        const rows = Array.isArray(values) ? values : [values];

        return {
          select: () => ({
            single: async () => {
              await new Promise((r) => setTimeout(r, 30));
              const currentStore = LocalSupabaseStorage.getStore();
              const uid = currentStore.currentSession?.user.id;

              if (!uid) {
                return { data: null, error: new Error('Unauthorized: Authentication required.') };
              }

              const row = rows[0];

              if (tableName === 'tasks') {
                // RLS: user_id MUST equal auth.uid()
                const taskId = row.id || `task-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
                const createdTask: DbTask = {
                  id: taskId,
                  user_id: uid,
                  workspace_id: row.workspace_id || null,
                  title: row.title || 'Untitled Task',
                  description: row.description || '',
                  category: row.category || 'General',
                  priority: row.priority || 'medium',
                  status: row.status || 'pending',
                  completed: Boolean(row.completed),
                  deadline: row.deadline || null,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
                currentStore.tasks.unshift(createdTask);
                LocalSupabaseStorage.setStore(currentStore);
                return { data: createdTask, error: null };
              }

              if (tableName === 'workspaces') {
                // RLS: owner_id MUST equal auth.uid()
                const wsId = row.id || `ws-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
                const createdWs: Workspace = {
                  id: wsId,
                  owner_id: uid,
                  name: row.name,
                  slug: row.slug || row.name.toLowerCase().replace(/\s+/g, '-'),
                  description: row.description || '',
                  icon: row.icon || 'Folder',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
                currentStore.workspaces.push(createdWs);
                LocalSupabaseStorage.setStore(currentStore);
                return { data: createdWs, error: null };
              }

              return { data: row, error: null };
            },
          }),
        };
      },

      update: (updates: any) => {
        return {
          eq: (column: string, value: any) => ({
            select: () => ({
              single: async () => {
                await new Promise((r) => setTimeout(r, 30));
                const currentStore = LocalSupabaseStorage.getStore();
                const uid = currentStore.currentSession?.user.id;

                if (!uid) {
                  return { data: null, error: new Error('Unauthorized: Authentication required.') };
                }

                if (tableName === 'tasks') {
                  const index = currentStore.tasks.findIndex((t) => t[column as keyof DbTask] === value);
                  if (index === -1) {
                    return { data: null, error: new Error('Task not found') };
                  }
                  // RLS: Only update if user owns it
                  if (currentStore.tasks[index].user_id !== uid) {
                    return { data: null, error: new Error('Forbidden: RLS violation. You cannot edit another user\'s task.') };
                  }
                  currentStore.tasks[index] = {
                    ...currentStore.tasks[index],
                    ...updates,
                    updated_at: new Date().toISOString(),
                  };
                  LocalSupabaseStorage.setStore(currentStore);
                  return { data: currentStore.tasks[index], error: null };
                }

                if (tableName === 'profiles') {
                  const index = currentStore.profiles.findIndex((p) => p[column as keyof UserProfile] === value);
                  if (index === -1) {
                    return { data: null, error: new Error('Profile not found') };
                  }
                  // RLS: Only update own profile
                  if (currentStore.profiles[index].id !== uid) {
                    return { data: null, error: new Error('Forbidden: RLS violation.') };
                  }
                  currentStore.profiles[index] = {
                    ...currentStore.profiles[index],
                    ...updates,
                    updated_at: new Date().toISOString(),
                  };
                  LocalSupabaseStorage.setStore(currentStore);
                  return { data: currentStore.profiles[index], error: null };
                }

                return { data: null, error: null };
              },
            }),
            then: async (resolve: (res: { data: any; error: Error | null }) => void) => {
              const currentStore = LocalSupabaseStorage.getStore();
              const uid = currentStore.currentSession?.user.id;
              if (tableName === 'tasks' && uid) {
                const target = currentStore.tasks.find((t) => t[column as keyof DbTask] === value);
                if (target && target.user_id === uid) {
                  Object.assign(target, updates, { updated_at: new Date().toISOString() });
                  LocalSupabaseStorage.setStore(currentStore);
                  resolve({ data: target, error: null });
                  return;
                }
              }
              resolve({ data: null, error: null });
            },
          }),
        };
      },

      delete: () => {
        return {
          eq: (column: string, value: any) => ({
            then: async (resolve: (res: { data: any; error: Error | null }) => void) => {
              await new Promise((r) => setTimeout(r, 30));
              const currentStore = LocalSupabaseStorage.getStore();
              const uid = currentStore.currentSession?.user.id;

              if (!uid) {
                resolve({ data: null, error: new Error('Unauthorized') });
                return;
              }

              if (tableName === 'tasks') {
                const task = currentStore.tasks.find((t) => t[column as keyof DbTask] === value);
                if (!task) {
                  resolve({ data: null, error: null });
                  return;
                }
                // RLS: Only delete if user_id === uid
                if (task.user_id !== uid) {
                  resolve({ data: null, error: new Error('Forbidden: RLS policy restricts deleting other users tasks.') });
                  return;
                }
                currentStore.tasks = currentStore.tasks.filter((t) => t[column as keyof DbTask] !== value);
                LocalSupabaseStorage.setStore(currentStore);
                resolve({ data: task, error: null });
                return;
              }

              if (tableName === 'workspaces') {
                const ws = currentStore.workspaces.find((w) => w[column as keyof Workspace] === value);
                if (!ws || ws.owner_id !== uid) {
                  resolve({ data: null, error: new Error('Forbidden: RLS violation') });
                  return;
                }
                currentStore.workspaces = currentStore.workspaces.filter((w) => w.id !== value);
                // Cascade tasks
                currentStore.tasks = currentStore.tasks.filter((t) => t.workspace_id !== value);
                LocalSupabaseStorage.setStore(currentStore);
                resolve({ data: ws, error: null });
                return;
              }

              resolve({ data: null, error: null });
            },
          }),
        };
      },
    };
  }
}

// Create either Real Supabase Client or Local Simulated Client
let supabaseInstance: any;

if (isSupabaseConfigured && rawSupabaseUrl && rawSupabaseAnonKey) {
  supabaseInstance = createClient<any>(rawSupabaseUrl, rawSupabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
} else {
  supabaseInstance = new SimulatedSupabaseClient();
}

export const supabase: any = supabaseInstance;
export const simulatedClient = new SimulatedSupabaseClient();
