import React from 'react';
import { Bell, Check, X, Award, Flame, Calendar } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onClear,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: 'Hackathon 2025 Registration Closing',
      time: '12m ago',
      desc: 'Global AI & Autonomous Agent Hackathon deadline is in 2 days. Complete your team submission.',
      icon: Award,
      color: 'text-rose-400 bg-rose-500/20 border-rose-400/40',
    },
    {
      id: 'n2',
      title: 'Learning Streak Preserved',
      time: '2h ago',
      desc: 'Congratulations! You reached Day 47 on your continuous algorithmic problem-solving streak.',
      icon: Flame,
      color: 'text-amber-400 bg-amber-500/20 border-amber-400/40',
    },
    {
      id: 'n3',
      title: 'Codeforces Global Round Announced',
      time: '1d ago',
      desc: 'Div 1 + Div 2 round scheduled for May 10, 2025. Add to your calendar.',
      icon: Calendar,
      color: 'text-cyan-400 bg-cyan-500/20 border-cyan-400/40',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl bg-[#030d22] border border-cyan-400/50 shadow-[0_0_40px_rgba(0,240,255,0.4)] p-4">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="text-xs text-cyan-400 hover:text-cyan-200"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className="p-3 rounded-xl bg-slate-900/70 border border-cyan-500/20 flex items-start gap-3"
              >
                <div className={`p-2 rounded-lg border shrink-0 ${n.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{n.title}</h4>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                    {n.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
