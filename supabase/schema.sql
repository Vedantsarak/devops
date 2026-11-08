-- ==============================================================================
-- DevOS Database Schema & Row Level Security (RLS)
-- Mirror of: supabase/migrations/20261108000000_init_devos_schema.sql
-- Compatibility: Supabase PostgreSQL (Postgres 15+)
-- Safety: Non-destructive (CREATE TABLE IF NOT EXISTS, DROP POLICY IF EXISTS)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Helper Functions: Timestamp Auto-Update Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ==============================================================================
-- 3. Tables & Relationships
-- ==============================================================================

-- 3.1 Profiles Table (Linked 1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.2 Workspaces Table (Multi-tenant environments)
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.3 Workspace Members Table (Many-to-Many User/Workspace membership)
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_workspace_member UNIQUE (workspace_id, user_id)
);

-- 3.4 Tasks Table (Workspace-scoped developer priorities and tracking)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'P1' CHECK (priority IN ('P0', 'P1', 'P2', 'P3')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  category TEXT NOT NULL DEFAULT 'Core',
  deadline TIMESTAMPTZ,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 4. Performance Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON public.workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_ws ON public.workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON public.tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON public.tasks(deadline);

-- ==============================================================================
-- 5. Updated_At Triggers
-- ==============================================================================
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_workspaces_updated_at ON public.workspaces;
CREATE TRIGGER trg_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_tasks_updated_at ON public.tasks;
CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 6. Helper Security Functions (Avoid recursive RLS in workspace_members)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_workspace_member(ws_id UUID, usr_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = ws_id AND user_id = usr_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_workspace_admin_or_owner(ws_id UUID, usr_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = ws_id AND user_id = usr_id AND role IN ('owner', 'admin')
  ) OR EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE id = ws_id AND owner_id = usr_id
  );
$$;

-- ==============================================================================
-- 7. Automated User Registration Trigger (auth.users -> profiles & initial workspace)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_ws_id UUID;
  user_display_name TEXT;
  extracted_username TEXT;
BEGIN
  -- Determine display name and username
  user_display_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );
  extracted_username := lower(regexp_replace(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g')) || '_' || substr(NEW.id::text, 1, 4);

  -- 1. Create Profile
  INSERT INTO public.profiles (id, email, full_name, username, avatar_url, bio)
  VALUES (
    NEW.id,
    NEW.email,
    user_display_name,
    extracted_username,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'DevOS Builder & Engineer'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;

  -- 2. Create Default Workspace
  INSERT INTO public.workspaces (name, slug, owner_id)
  VALUES (
    'Personal Lab',
    'personal-lab-' || substr(NEW.id::text, 1, 8),
    NEW.id
  )
  RETURNING id INTO default_ws_id;

  -- 3. Add User as Owner in workspace_members
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (default_ws_id, NEW.id, 'owner')
  ON CONFLICT (workspace_id, user_id) DO NOTHING;

  -- 4. Seed Initial Getting Started Task
  INSERT INTO public.tasks (workspace_id, user_id, title, description, priority, status, category, completed)
  VALUES (
    default_ws_id,
    NEW.id,
    'Welcome to DevOS Workspace',
    'Your isolated Supabase cloud workspace is ready with Row Level Security enabled.',
    'P1',
    'todo',
    'Architecture',
    false
  );

  RETURN NEW;
END;
$$;

-- Trigger attached to Supabase auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 8. Row Level Security (RLS) Activation
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 9. Row Level Security Policies
-- ==============================================================================

-- 9.1 Profiles Policies
DROP POLICY IF EXISTS "Profiles are readable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are readable by authenticated users"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 9.2 Workspaces Policies
DROP POLICY IF EXISTS "Workspaces viewable by members" ON public.workspaces;
CREATE POLICY "Workspaces viewable by members"
  ON public.workspaces
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    public.is_workspace_member(id, auth.uid())
  );

DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
CREATE POLICY "Users can create workspaces"
  ON public.workspaces
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Workspace owners can update workspaces" ON public.workspaces;
CREATE POLICY "Workspace owners can update workspaces"
  ON public.workspaces
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid() OR public.is_workspace_admin_or_owner(id, auth.uid()))
  WITH CHECK (owner_id = auth.uid() OR public.is_workspace_admin_or_owner(id, auth.uid()));

DROP POLICY IF EXISTS "Workspace owners can delete workspaces" ON public.workspaces;
CREATE POLICY "Workspace owners can delete workspaces"
  ON public.workspaces
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- 9.3 Workspace Members Policies
DROP POLICY IF EXISTS "Members can view membership" ON public.workspace_members;
CREATE POLICY "Members can view membership"
  ON public.workspace_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    public.is_workspace_member(workspace_id, auth.uid())
  );

DROP POLICY IF EXISTS "Workspace owners or self can add members" ON public.workspace_members;
CREATE POLICY "Workspace owners or self can add members"
  ON public.workspace_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR
    public.is_workspace_admin_or_owner(workspace_id, auth.uid())
  );

DROP POLICY IF EXISTS "Members can leave or admins can remove" ON public.workspace_members;
CREATE POLICY "Members can leave or admins can remove"
  ON public.workspace_members
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    public.is_workspace_admin_or_owner(workspace_id, auth.uid())
  );

-- 9.4 Tasks Policies
DROP POLICY IF EXISTS "Tasks viewable by workspace members" ON public.tasks;
CREATE POLICY "Tasks viewable by workspace members"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    public.is_workspace_member(workspace_id, auth.uid())
  );

DROP POLICY IF EXISTS "Members can create tasks in workspace" ON public.tasks;
CREATE POLICY "Members can create tasks in workspace"
  ON public.tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    (
      public.is_workspace_member(workspace_id, auth.uid()) OR
      EXISTS (SELECT 1 FROM public.workspaces WHERE id = workspace_id AND owner_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Task owners or workspace admins can update tasks" ON public.tasks;
CREATE POLICY "Task owners or workspace admins can update tasks"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    public.is_workspace_admin_or_owner(workspace_id, auth.uid())
  )
  WITH CHECK (
    user_id = auth.uid() OR
    public.is_workspace_admin_or_owner(workspace_id, auth.uid())
  );

DROP POLICY IF EXISTS "Task owners or workspace admins can delete tasks" ON public.tasks;
CREATE POLICY "Task owners or workspace admins can delete tasks"
  ON public.tasks
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    public.is_workspace_admin_or_owner(workspace_id, auth.uid())
  );
