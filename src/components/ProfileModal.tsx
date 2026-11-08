import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Sparkles, 
  Calendar, 
  Flame, 
  ShieldCheck, 
  Save, 
  CheckCircle2,
  Database,
  LogOut
} from 'lucide-react';
import { useSupabase } from '../context/SupabaseContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onOpenAuth }) => {
  const { user, profile, updateProfile, signOut, isConfigured } = useSupabase();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [headline, setHeadline] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
      setHeadline(profile.headline || '');
      setAvatarUrl(profile.avatar_url || '');
    } else if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setUsername(user.user_metadata?.username || '');
    }
  }, [profile, user]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);
    try {
      const ok = await updateProfile({
        full_name: fullName,
        username,
        headline,
        avatar_url: avatarUrl,
      });
      if (ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#07132e] via-[#040c1e] to-[#020716] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Developer Identity & Profile
              </h3>
              <p className="text-[10px] text-cyan-300/70 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Supabase Profile Record</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close profile modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 custom-scrollbar">
          {/* Identity Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={fullName || 'User Avatar'}
                  className="w-12 h-12 rounded-xl object-cover border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{fullName || 'DevOS Pioneer'}</h4>
                  <span className="text-[10px] text-cyan-300 font-mono">@{username || 'developer'}</span>
                </div>
                <p className="text-[11px] text-slate-300">{headline || 'Full-Stack Autonomous Engineer'}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-cyan-400" />
                    {user?.email}
                  </span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <Flame className="w-3 h-3 text-amber-400" />
                    {profile?.streak_days ?? 47}d Streak
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSave} className="space-y-3.5">
            {success && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Profile synchronized to Supabase database successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-cyan-300/80 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-cyan-500/25 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-cyan-300/80 mb-1">
                  Username Handle
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-cyan-500/25 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cyan-300/80 mb-1">
                Headline / Bio
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Systems Architect | Distributed Systems | C++"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-cyan-500/25 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cyan-300/80 mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-cyan-500/25 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Protected by Supabase Row Level Security</span>
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
