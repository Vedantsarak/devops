import React from 'react';

export type BadgeVariant = 'cyan' | 'emerald' | 'rose' | 'amber' | 'purple' | 'slate';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'sm',
  dot = false,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, { badge: string; dot: string }> = {
    cyan: {
      badge: 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.25)]',
      dot: 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]',
    },
    emerald: {
      badge: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.25)]',
      dot: 'bg-emerald-400 shadow-[0_0_6px_#34d399]',
    },
    rose: {
      badge: 'bg-rose-500/15 border-rose-400/40 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.25)]',
      dot: 'bg-rose-400 shadow-[0_0_6px_#f43f5e]',
    },
    amber: {
      badge: 'bg-amber-500/15 border-amber-400/40 text-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.25)]',
      dot: 'bg-amber-400 shadow-[0_0_6px_#fbbf24]',
    },
    purple: {
      badge: 'bg-purple-500/15 border-purple-400/40 text-purple-300 shadow-[0_0_8px_rgba(192,132,252,0.25)]',
      dot: 'bg-purple-400 shadow-[0_0_6px_#c084fc]',
    },
    slate: {
      badge: 'bg-slate-800/60 border-slate-700 text-slate-300',
      dot: 'bg-slate-400',
    },
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-bold',
  };

  const currentVariant = variantStyles[variant] || variantStyles.cyan;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-mono ${currentVariant.badge} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentVariant.dot}`} />}
      {children}
    </span>
  );
};
