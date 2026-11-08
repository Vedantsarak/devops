import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  AlertCircle, 
  Database,
  ArrowRight,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useSupabase } from '../context/SupabaseContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  defaultTab = 'signin'
}) => {
  const { signIn, signUp, isLoadingAuth, authError, isConfigured } = useSupabase();
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    if (tab === 'signup') {
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }

      const res = await signUp(email, password, fullName || undefined, username || undefined);
      if (res.success) {
        if (res.needsConfirmation) {
          setSuccessMessage('Account registered in Supabase! If "Confirm email" is enabled in your project, check your inbox or toggle off "Confirm email" in Supabase Auth to sign in immediately.');
          setTab('signin');
        } else {
          setSuccessMessage('Account created successfully! Welcome to DevOS.');
          setTimeout(() => onClose(), 800);
        }
      } else {
        setLocalError(res.error || 'Failed to create account.');
      }
    } else {
      const res = await signIn(email, password);
      if (res.success) {
        setSuccessMessage('Signed in successfully.');
        setTimeout(() => onClose(), 600);
      } else {
        setLocalError(res.error || 'Invalid credentials.');
      }
    }
  };

  const handleQuickFill = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setTab('signin');
    setLocalError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#07132e] via-[#040c1e] to-[#020716] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]" />

        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                DevOS <span className="text-cyan-400">Supabase</span> Auth
              </h3>
              <div className="flex items-center gap-1 text-[10px] text-cyan-300/70">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{isConfigured ? 'Connected to Supabase Cloud' : 'Row Level Security Active'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close authentication modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1.5 m-4 bg-slate-900/80 rounded-xl border border-cyan-500/20">
          <button
            type="button"
            onClick={() => { setTab('signin'); setLocalError(null); }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === 'signin'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setLocalError(null); }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === 'signup'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-3.5">
          {/* Status Banners */}
          {(localError || authError) && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{localError || authError}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {tab === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-cyan-300/80 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-cyan-500/25 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-cyan-300/80 mb-1">
                  Username
                </label>
                <div className="relative">
                  <Sparkles className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. alex_cyber"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-cyan-500/25 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-cyan-300/80 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@devos.io"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-cyan-500/25 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-cyan-300/80 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-cyan-500/25 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {tab === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-cyan-300/80 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-cyan-500/25 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoadingAuth}
            className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoadingAuth ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <>
                <span>{tab === 'signin' ? 'Sign In to DevOS' : 'Create DevOS Identity'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Quick-Switch Demo Accounts for Multi-User Isolation Testing */}
          <div className="pt-3 border-t border-cyan-500/15">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3 h-3 text-cyan-400" />
              <span>Multi-User RLS Test Accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('alex.dev@example.com', 'password123')}
                className="p-2 text-left rounded-lg bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-400 text-slate-300 hover:text-white transition-all text-[11px]"
              >
                <div className="font-semibold text-cyan-300">User 1: Alex Mercer</div>
                <div className="text-[9px] text-slate-400 truncate">alex.dev@example.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('sarah.lead@example.com', 'password123')}
                className="p-2 text-left rounded-lg bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-400 text-slate-300 hover:text-white transition-all text-[11px]"
              >
                <div className="font-semibold text-purple-300">User 2: Sarah Connor</div>
                <div className="text-[9px] text-slate-400 truncate">sarah.lead@example.com</div>
              </button>
            </div>
            <p className="text-[9px] text-cyan-400/60 mt-1.5 text-center">
              Each user has their own private workspaces and tasks enforced by RLS.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
