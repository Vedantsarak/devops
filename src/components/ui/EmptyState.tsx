import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`w-full py-12 px-6 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-cyan-500/20 bg-[#030d22]/40 backdrop-blur-sm ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-3.5 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
        <Icon className="w-7 h-7 stroke-[1.8]" />
      </div>
      <h3 className="text-sm font-bold text-white tracking-wide mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
