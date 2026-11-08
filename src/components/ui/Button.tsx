import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs px-3.5 py-2 gap-2',
    lg: 'text-sm px-5 py-2.5 gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 hover:from-cyan-300 hover:to-blue-500 shadow-[0_0_15px_rgba(0,240,255,0.5)] hover:shadow-[0_0_20px_rgba(0,240,255,0.7)]',
    secondary: 'bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]',
    outline: 'bg-transparent border border-cyan-500/30 hover:border-cyan-400 text-slate-300 hover:text-white hover:bg-cyan-950/30',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50',
    danger: 'bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};
