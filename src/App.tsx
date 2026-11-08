import React, { useState, useEffect } from 'react';
import { NavModule, UpcomingDeadline, DsaProblem, LauncherShortcut, TaskPriority } from './types/devos';
import { 
  INITIAL_DEADLINES, 
  INITIAL_DSA_PROBLEMS, 
  INITIAL_TECH_NEWS, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_AGENTS, 
  INITIAL_SNIPPETS,
  INITIAL_LAUNCHER_SHORTCUTS,
} from './data/initialData';
import { calculateOverallScore, calculateDsaProgress, calculateTaskCompletion } from './utils/devos-logic';

import { SupabaseProvider, useSupabase } from './context/SupabaseContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { MetricsCards } from './components/MetricsCards';
import { PrioritiesCard } from './components/PrioritiesCard';
import { DeadlinesCard } from './components/DeadlinesCard';
import { ClockWidget } from './components/ClockWidget';
import { AiAssistantPanel } from './components/AiAssistantPanel';
import { BottomDock } from './components/BottomDock';
import { HoloPlanet } from './components/3d/HoloPlanet';
import { UpgradeModal } from './components/UpgradeModal';
import { NotificationsModal } from './components/NotificationsModal';
import { CommandPalette } from './components/CommandPalette';
import { AuthModal } from './components/AuthModal';
import { WorkspaceModal } from './components/WorkspaceModal';
import { ProfileModal } from './components/ProfileModal';

// Modules
import { CodingStudioModule } from './components/modules/CodingStudioModule';
import { DsaArenaModule } from './components/modules/DsaArenaModule';
import { LearningAcademyModule } from './components/modules/LearningAcademyModule';
import { TechIntelligenceModule } from './components/modules/TechIntelligenceModule';
import { OpportunitiesModule } from './components/modules/OpportunitiesModule';
import { CalendarModule } from './components/modules/CalendarModule';
import { AppLauncherModule } from './components/modules/AppLauncherModule';
import { AiResearchLabModule } from './components/modules/AiResearchLabModule';
import { KnowledgeVaultModule } from './components/modules/KnowledgeVaultModule';
import { AnalyticsModule } from './components/modules/AnalyticsModule';
import { SettingsModule } from './components/modules/SettingsModule';

function DevOsDashboard() {
  const { 
    user, 
    profile, 
    tasks: supabaseTasks, 
    currentWorkspace, 
    createTask, 
    updateTask, 
    deleteTask,
    isLoadingAuth 
  } = useSupabase();

  const [currentModule, setCurrentModule] = useState<NavModule>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Persistent Theme State
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('devos-theme');
      return saved === 'light';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('devos-theme', isLightMode ? 'light' : 'dark');
      if (isLightMode) {
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.remove('light-mode');
      }
    } catch {
      // ignore
    }
  }, [isLightMode]);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Persistent Launcher Shortcuts State
  const [shortcuts, setShortcuts] = useState<LauncherShortcut[]>(() => {
    try {
      const saved = localStorage.getItem('devos-shortcuts');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_LAUNCHER_SHORTCUTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('devos-shortcuts', JSON.stringify(shortcuts));
    } catch {
      // ignore
    }
  }, [shortcuts]);

  const [deadlines] = useState<UpcomingDeadline[]>(INITIAL_DEADLINES);
  const [dsaProblems, setDsaProblems] = useState<DsaProblem[]>(INITIAL_DSA_PROBLEMS);
  const [news] = useState(INITIAL_TECH_NEWS);
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [agents] = useState(INITIAL_AGENTS);
  const [snippets, setSnippets] = useState(INITIAL_SNIPPETS);

  // Map Supabase Tasks to TaskPriority interface for full-app compatibility
  const priorities: TaskPriority[] = supabaseTasks.map((t) => ({
    id: t.id,
    title: t.title,
    category: t.category,
    completed: t.completed,
    priority: t.priority,
    dueDate: t.deadline ? t.deadline.split('T')[0] : '2026-11-15',
    description: t.description || undefined,
    createdAt: t.created_at,
  }));

  // Dynamic Statistics
  const dsaStats = calculateDsaProgress(dsaProblems);
  const taskStats = calculateTaskCompletion(priorities);
  const streakDays = profile?.streak_days ?? 47;
  const projectsCount = 12;
  const completedBonus = (taskStats.completed - 2) * 2;
  const overallScore = Math.min(100, Math.max(80, 96 + completedBonus));
  const dsaPercentage = 78;

  // Supabase Persistent Task Handlers
  const handleToggleTask = (id: string) => {
    const target = supabaseTasks.find((t) => t.id === id);
    if (target) {
      updateTask(id, { completed: !target.completed });
    }
  };

  const handleAddTask = (newTask: Omit<TaskPriority, 'id'>) => {
    createTask({
      title: newTask.title,
      category: newTask.category,
      priority: newTask.priority,
      deadline: newTask.dueDate,
      description: newTask.description,
    });
  };

  const handleEditTask = (updatedTask: TaskPriority) => {
    updateTask(updatedTask.id, {
      title: updatedTask.title,
      category: updatedTask.category,
      priority: updatedTask.priority,
      deadline: updatedTask.dueDate,
      description: updatedTask.description,
      completed: updatedTask.completed,
    });
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  // Shortcut Handlers
  const handleAddShortcut = (newSc: Omit<LauncherShortcut, 'id'>) => {
    const item: LauncherShortcut = {
      ...newSc,
      id: `sc-${Date.now()}`,
    };
    setShortcuts((prev) => [item, ...prev]);
  };

  const handleDeleteShortcut = (id: string) => {
    setShortcuts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateProblemStatus = (id: string, status: 'Solved' | 'Attempted' | 'Todo') => {
    setDsaProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const handleToggleSaveOpportunity = (id: string) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, saved: !o.saved } : o))
    );
  };

  const handleQuickAction = (action: string) => {
    if (action in {
      home: 1, coding: 1, dsa: 1, learn: 1, intelligence: 1,
      opportunities: 1, calendar: 1, launcher: 1, research: 1, vault: 1, analytics: 1, settings: 1
    }) {
      setCurrentModule(action as NavModule);
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col ${isLightMode ? 'bg-[#050e26] text-slate-100' : 'bg-[#020716] text-white'} relative selection:bg-cyan-500 selection:text-black`}>
      {/* Background Cybernetic Glow & Ambient Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/3 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-32 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/4 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[150px]" />

        {/* Cyber city grid lines on horizon */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 240, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Top Header Bar */}
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLightMode={isLightMode}
        onToggleTheme={() => setIsLightMode(!isLightMode)}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        hasUnreadNotifications={hasUnreadNotification}
        onQuickAction={handleQuickAction}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenWorkspaceModal={() => setShowWorkspaceModal(true)}
        onOpenProfileModal={() => setShowProfileModal(true)}
      />

      {/* App Body: Sidebar + Main Content Stage */}
      <div className="flex-1 flex overflow-hidden relative z-10 pb-20">
        {/* Left Sidebar */}
        <Sidebar
          currentModule={currentModule}
          onSelectModule={setCurrentModule}
          onUpgradeClick={() => setShowUpgradeModal(true)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenAuthModal={() => setShowAuthModal(true)}
          onOpenWorkspaceModal={() => setShowWorkspaceModal(true)}
          onOpenProfileModal={() => setShowProfileModal(true)}
        />

        {/* Main Stage */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative px-4 lg:px-6 py-2 flex flex-col justify-center">
          {currentModule === 'home' && (
            <div className="max-w-[1600px] w-full mx-auto my-auto space-y-3">
              {/* Welcome Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_10px_#22d3ee] shrink-0 mt-0.5" />
                  <div>
                    <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
                      Welcome back,{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-300 drop-shadow-[0_0_15px_rgba(232,121,249,0.8)]">
                        {profile?.full_name || (user ? user.email?.split('@')[0] : 'Developer')}!
                      </span>
                    </h1>
                    <p className="text-xs md:text-sm text-cyan-200/80 font-medium">
                      Active Workspace: <span className="text-cyan-300 font-bold">{currentWorkspace?.name || 'Personal Command'}</span> • Supabase RLS Synced
                    </p>
                  </div>
                </div>

                {!user && (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-semibold transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  >
                    Sign In for Cloud Sync
                  </button>
                )}
              </div>

              {/* 4 Top Metric Cards */}
              <MetricsCards
                projectsCount={projectsCount}
                streakDays={streakDays}
                dsaPercentage={dsaPercentage}
                overallScore={overallScore}
                onCardClick={handleQuickAction}
              />

              {/* Middle Section: Priorities & Deadlines + 3D Planet + AI Assistant */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center justify-center min-h-[520px] my-auto">
                {/* Left Flank: Today's Priorities & Upcoming Deadlines */}
                <div className="lg:col-span-3 space-y-3.5 z-20 self-center">
                  <PrioritiesCard
                    onViewAll={() => setCurrentModule('calendar')}
                    onOpenWorkspaceModal={() => setShowWorkspaceModal(true)}
                    onOpenAuthModal={() => setShowAuthModal(true)}
                  />
                  <DeadlinesCard
                    deadlines={deadlines}
                    onViewAll={() => setCurrentModule('opportunities')}
                    onSelectDeadline={() => setCurrentModule('opportunities')}
                  />
                </div>

                {/* Center Flank: Central 3D Holographic Planet */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center text-center relative min-h-[460px] md:min-h-[520px] self-center my-auto mx-auto w-full">
                  <HoloPlanet />
                </div>

                {/* Right Flank: Clock & AI Assistant Panel */}
                <div className="lg:col-span-3 space-y-3 z-20 self-center my-auto flex flex-col items-center justify-center text-center w-full">
                  <ClockWidget />
                  <AiAssistantPanel
                    onTriggerPrompt={(prompt) => {
                      if (prompt.toLowerCase().includes('coding')) setCurrentModule('coding');
                      else if (prompt.toLowerCase().includes('learning')) setCurrentModule('learn');
                      else if (prompt.toLowerCase().includes('opportunities')) setCurrentModule('opportunities');
                      else setCurrentModule('research');
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Module Views */}
          {currentModule === 'coding' && <CodingStudioModule />}
          {currentModule === 'dsa' && (
            <DsaArenaModule
              problems={dsaProblems}
              onUpdateProblemStatus={handleUpdateProblemStatus}
            />
          )}
          {currentModule === 'learn' && <LearningAcademyModule />}
          {currentModule === 'intelligence' && <TechIntelligenceModule news={news} />}
          {currentModule === 'opportunities' && (
            <OpportunitiesModule
              opportunities={opportunities}
              onToggleSave={handleToggleSaveOpportunity}
            />
          )}
          {currentModule === 'calendar' && (
            <CalendarModule
              tasks={priorities}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
          {currentModule === 'launcher' && (
            <AppLauncherModule
              shortcuts={shortcuts}
              onAddShortcut={handleAddShortcut}
              onDeleteShortcut={handleDeleteShortcut}
            />
          )}
          {currentModule === 'research' && <AiResearchLabModule agents={agents} />}
          {currentModule === 'vault' && (
            <KnowledgeVaultModule
              snippets={snippets}
              onAddSnippet={(s) => setSnippets((prev) => [s, ...prev])}
            />
          )}
          {currentModule === 'analytics' && <AnalyticsModule />}
          {currentModule === 'settings' && (
            <SettingsModule
              isLightMode={isLightMode}
              onToggleTheme={() => setIsLightMode(!isLightMode)}
              onOpenAuthModal={() => setShowAuthModal(true)}
              onOpenWorkspaceModal={() => setShowWorkspaceModal(true)}
              onOpenProfileModal={() => setShowProfileModal(true)}
            />
          )}
        </main>
      </div>

      {/* Floating Bottom Navigation Dock */}
      <BottomDock
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
      />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(mod) => {
          setCurrentModule(mod);
          setIsCommandPaletteOpen(false);
        }}
        onToggleTheme={() => setIsLightMode(!isLightMode)}
        isLightMode={isLightMode}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Workspace Switcher Modal */}
      <WorkspaceModal
        isOpen={showWorkspaceModal}
        onClose={() => setShowWorkspaceModal(false)}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onOpenAuth={() => {
          setShowProfileModal(false);
          setShowAuthModal(true);
        }}
      />

      {/* Pro Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        onClear={() => {
          setHasUnreadNotification(false);
          setShowNotificationsModal(false);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <SupabaseProvider>
      <DevOsDashboard />
    </SupabaseProvider>
  );
}
