import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-6 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Glowing pulse ring */}
        <div
          className={`${sizeStyles[size]} rounded-full border-cyan-500/20 animate-ping absolute`}
        />
        {/* Spinning arc */}
        <div
          className={`${sizeStyles[size]} rounded-full border-cyan-400 border-t-transparent animate-spin shadow-[0_0_12px_rgba(0,240,255,0.6)]`}
        />
      </div>
      {message && (
        <span className="text-xs text-cyan-300 font-mono tracking-wide animate-pulse">
          {message}
        </span>
      )}
    </div>
  );
};
