import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerAction?: React.ReactNode;
  variant?: 'cyber' | 'subtle' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverGlow?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  headerAction,
  variant = 'cyber',
  padding = 'md',
  hoverGlow = true,
  className = '',
  onClick,
}) => {
  const variantStyles = {
    cyber: 'bg-[#030d22]/85 border-cyan-500/30 shadow-[0_0_20px_rgba(0,180,255,0.06)]',
    glass: 'bg-[#05132d]/60 backdrop-blur-xl border-cyan-400/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
    subtle: 'bg-slate-900/60 border-slate-800 shadow-sm',
    bordered: 'bg-transparent border-cyan-500/40',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 md:p-5',
    lg: 'p-6',
  };

  const hoverStyles = hoverGlow
    ? 'hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(0,220,255,0.18)] transition-all duration-300'
    : 'transition-all duration-200';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border backdrop-blur-md relative overflow-hidden ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {(title || description || headerAction) && (
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/15">
          <div>
            {title && (
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-slate-400 mt-0.5">{description}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
