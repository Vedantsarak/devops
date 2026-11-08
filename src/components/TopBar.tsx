import React, { useState } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  Menu, 
  Command, 
  Database, 
  Layers, 
  LogIn, 
  User, 
  LogOut, 
  ShieldCheck, 
  ChevronDown 
} from 'lucide-react';
import { useSupabase } from '../context/SupabaseContext';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isLightMode: boolean;
  onToggleTheme: () => void;
  onOpenNotifications: () => void;
  hasUnreadNotifications: boolean;
  onQuickAction: (action: string) => void;
  onOpenCommandPalette: () => void;
  onToggleMobileMenu: () => void;
  onOpenAuthModal: () => void;
  onOpenWorkspaceModal: () => void;
  onOpenProfileModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  isLightMode,
  onToggleTheme,
  onOpenNotifications,
  hasUnreadNotifications,
  onQuickAction,
  onOpenCommandPalette,
  onToggleMobileMenu,
  onOpenAuthModal,
  onOpenWorkspaceModal,
  onOpenProfileModal,
}) => {
  const { user, profile, currentWorkspace, isConfigured, signOut } = useSupabase();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="relative w-full h-14 px-4 lg:px-6 flex items-center justify-between border-b border-cyan-500/15 bg-[#020716]/80 backdrop-blur-md z-30">
      {/* Left: Mobile Menu + Workspace Switcher */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
          className="lg:hidden p-2 rounded-xl text-cyan-300 hover:text-white hover:bg-cyan-950/40 border border-cyan-500/20"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Workspace Switcher Pill */}
        <button
          onClick={onOpenWorkspaceModal}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-xs text-white transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)] group"
          title="Switch DevOS Workspace"
        >
          <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[11px] font-bold text-white truncate max-w-[130px] leading-tight">
              {currentWorkspace?.name || 'Personal Command'}
            </div>
            <div className="text-[9px] text-cyan-400/80 font-mono leading-none">
              Workspace
            </div>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-cyan-300 transition-transform" />
        </button>
      </div>

      {/* Central Holographic Search Bar with ⌘K Command Palette Trigger */}
      <div className="relative flex-1 max-w-lg mx-2 md:mx-4">
        <div
          onClick={onOpenCommandPalette}
          className="relative flex items-center w-full rounded-full bg-[#05132d]/80 border border-cyan-400/40 hover:border-cyan-400 focus-within:border-cyan-300 shadow-[0_0_20px_rgba(0,220,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all px-3.5 py-1.5 cursor-pointer group"
        >
          <Search className="w-4 h-4 text-cyan-400 shrink-0 mr-2 drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
          <input
            type="text"
            readOnly
            value={searchQuery}
            placeholder="Search commands, modules, shortcuts (Press ⌘K)..."
            className="w-full bg-transparent text-xs md:text-sm text-white placeholder-cyan-300/50 focus:outline-none tracking-wide cursor-pointer"
          />

          {/* Command Key Shortcut Hint */}
          <div className="hidden sm:flex items-center gap-1 pl-2 shrink-0">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded shadow-sm flex items-center gap-0.5">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls: Theme Toggle, Notifications, Supabase Auth */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Supabase Status Pill */}
        <div 
          onClick={onOpenAuthModal}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[10px] text-cyan-300 hover:border-cyan-400 transition-colors cursor-pointer"
          title={isConfigured ? 'Connected to Supabase Live Project' : 'Supabase Engine Active (RLS Mode)'}
        >
          <Database className="w-3 h-3 text-emerald-400" />
          <span className="font-semibold">{isConfigured ? 'Supabase Cloud' : 'Supabase RLS'}</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-xl text-cyan-300 hover:text-white hover:bg-cyan-950/40 border border-cyan-500/20 transition-all hover:shadow-[0_0_12px_rgba(0,240,255,0.3)]"
          title={isLightMode ? 'Switch to Cyber Midnight Dark' : 'Switch to High-Contrast Light Mode'}
        >
          {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notification Bell with Badge */}
        <button
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="relative p-2 rounded-xl text-cyan-300 hover:text-white hover:bg-cyan-950/40 border border-cyan-500/20 transition-all hover:shadow-[0_0_12px_rgba(0,240,255,0.3)]"
        >
          <Bell className="w-4 h-4" />
          {hasUnreadNotifications && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_#ef4444]">
              1
            </span>
          )}
        </button>

        {/* User Auth Section */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-slate-900/60 border border-cyan-500/30 hover:border-cyan-400 transition-all"
            >
              <div className="text-right hidden sm:block">
                <div className="text-[11px] font-bold text-white truncate max-w-[100px]">
                  {profile?.full_name || user.email?.split('@')[0]}
                </div>
                <div className="text-[9px] text-cyan-400 truncate max-w-[100px]">
                  @{profile?.username || 'developer'}
                </div>
              </div>
              <div className="relative">
                <img
                  src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt="User Avatar"
                  className="w-7 h-7 rounded-lg object-cover border border-cyan-400"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#030d22] border border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.3)] p-1.5 z-50 animate-fadeIn">
                <div className="px-2.5 py-1.5 border-b border-cyan-500/15 mb-1">
                  <div className="text-xs font-bold text-white truncate">{profile?.full_name || user.email}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                </div>

                <button
                  onClick={() => {
                    onOpenProfileModal();
                    setShowUserDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => {
                    onOpenWorkspaceModal();
                    setShowUserDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Workspaces</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAuthModal();
                    setShowUserDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Switch Account</span>
                </button>

                <div className="border-t border-cyan-500/15 my-1" />

                <button
                  onClick={async () => {
                    setShowUserDropdown(false);
                    await signOut();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-300 hover:bg-rose-500/20 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:shadow-[0_0_15px_rgba(0,240,255,0.6)] transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
