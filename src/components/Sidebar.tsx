import React from 'react';
import {
  Home,
  Code2,
  Trophy,
  GraduationCap,
  Crosshair,
  Briefcase,
  Calendar,
  Rocket,
  Atom,
  Database,
  BarChart2,
  Settings,
  ChevronRight,
  Crown,
  X,
  Layers,
  User,
  ShieldCheck,
  LogIn
} from 'lucide-react';
import { NavModule } from '../types/devos';
import { useSupabase } from '../context/SupabaseContext';

interface SidebarProps {
  currentModule: NavModule;
  onSelectModule: (module: NavModule) => void;
  onUpgradeClick: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenWorkspaceModal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenProfileModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  onUpgradeClick,
  isMobileOpen = false,
  onCloseMobile,
  onOpenWorkspaceModal,
  onOpenAuthModal,
  onOpenProfileModal,
}) => {
  const { user, profile, currentWorkspace } = useSupabase();

  const navItems = [
    { id: 'home' as NavModule, label: 'Home', icon: Home },
    { id: 'coding' as NavModule, label: 'Coding Studio', icon: Code2 },
    { id: 'dsa' as NavModule, label: 'DSA Arena', icon: Trophy },
    { id: 'learn' as NavModule, label: 'Learning Academy', icon: GraduationCap },
    { id: 'intelligence' as NavModule, label: 'Tech Intelligence', icon: Crosshair },
    { id: 'opportunities' as NavModule, label: 'Opportunities', icon: Briefcase },
    { id: 'calendar' as NavModule, label: 'Calendar & Tasks', icon: Calendar },
    { id: 'launcher' as NavModule, label: 'App Launcher', icon: Rocket },
    { id: 'research' as NavModule, label: 'AI Research Lab', icon: Atom },
    { id: 'vault' as NavModule, label: 'Knowledge Vault', icon: Database },
    { id: 'analytics' as NavModule, label: 'Analytics', icon: BarChart2 },
    { id: 'settings' as NavModule, label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id: NavModule) => {
    onSelectModule(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-[260px] shrink-0 h-full flex flex-col justify-between py-4 px-3 bg-[#030a1c]/95 lg:bg-[#030a1c]/80 backdrop-blur-xl border-r border-cyan-500/20 shadow-[10px_0_30px_rgba(0,180,255,0.06)] overflow-y-auto custom-scrollbar transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding Section */}
        <div>
          <div className="flex items-center justify-between px-1.5 py-1 mb-3">
            <div
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
              onClick={() => handleItemClick('home')}
            >
              {/* Holographic Glowing Delta Prism Logo */}
              <div className="relative w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 32 32"
                  className="w-5 h-5 fill-none stroke-cyan-400 stroke-2 filter drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                >
                  <polygon points="16,4 28,26 4,26" className="fill-cyan-500/30" />
                  <polygon
                    points="16,10 24,24 8,24"
                    className="stroke-sky-200 stroke-1 fill-cyan-400/50"
                  />
                  <circle cx="16" cy="18" r="2.5" className="fill-white" />
                </svg>
              </div>
              <div>
                <div
                  className="text-lg font-black tracking-wider text-white flex items-center gap-1.5 leading-none"
                  style={{ textShadow: '0 0 12px rgba(0,240,255,0.6)' }}
                >
                  DevOS
                </div>
                <div className="text-[9px] text-cyan-300/70 tracking-tight leading-tight mt-0.5">
                  Your Developer Universe
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                aria-label="Close sidebar navigation"
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Active Workspace Banner */}
          <div
            onClick={onOpenWorkspaceModal}
            className="mb-3 p-2 rounded-xl bg-slate-900/70 border border-cyan-500/25 hover:border-cyan-400 transition-all cursor-pointer group flex items-center justify-between"
            title="Click to switch workspace"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-white truncate">
                  {currentWorkspace?.name || 'Personal Command'}
                </div>
                <div className="text-[9px] text-cyan-400/80 truncate">
                  Isolated Workspace
                </div>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 group-hover:text-cyan-300 transition-colors shrink-0">
              Switch
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/30 via-blue-600/25 to-transparent text-white border-l-4 border-cyan-400 border-t border-b border-r border-cyan-400/40 shadow-[0_0_20px_rgba(0,220,255,0.25)]'
                      : 'text-slate-300 hover:text-white hover:bg-cyan-950/30 hover:border-cyan-500/20 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                          : 'text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-950/40'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="tracking-wide">{item.label}</span>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isActive
                        ? 'text-cyan-400 translate-x-0.5'
                        : 'text-slate-500 opacity-60 group-hover:opacity-100 group-hover:text-cyan-300'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-2.5 pt-2">
          {/* User Account / Auth Card */}
          {user ? (
            <div
              onClick={onOpenProfileModal}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="User Avatar"
                    className="w-7 h-7 rounded-lg object-cover border border-cyan-400"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </div>
                  <div className="text-[9px] text-cyan-300/70 truncate flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-cyan-400" />
                    <span>RLS Protected</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-transform" />
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,240,255,0.6)] transition-all"
            >
              <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Upgrade to Pro Card */}
          <div
            onClick={onUpgradeClick}
            className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/10 via-yellow-600/10 to-orange-500/5 border border-amber-400/30 hover:border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.1)] transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40">
                <Crown className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-200 tracking-wide">
                  Upgrade to Pro
                </div>
                <div className="text-[9px] text-amber-300/60">
                  Autonomous agents & compute
                </div>
              </div>
            </div>
            <ChevronRight className="w-3 h-3 text-amber-400/70 group-hover:text-amber-300 transition-transform" />
          </div>

          {/* System Status with ECG Pulse */}
          <div className="p-2 rounded-xl bg-[#020612]/70 border border-cyan-500/20 flex items-center justify-between">
            <div>
              <div className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                Supabase Engine
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <span className="text-[10px] font-medium text-emerald-300">
                  Online & Secured
                </span>
              </div>
            </div>
            {/* ECG Animated Heartbeat Line */}
            <div className="w-14 h-5 flex items-center overflow-hidden">
              <svg
                viewBox="0 0 80 30"
                className="w-full h-full stroke-cyan-400 fill-none stroke-[1.8] filter drop-shadow-[0_0_4px_rgba(0,240,255,0.7)]"
              >
                <path
                  d="M 0 15 L 20 15 L 25 15 L 30 5 L 36 25 L 42 8 L 47 18 L 52 15 L 80 15"
                  className="animate-ecg-pulse"
                />
              </svg>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
