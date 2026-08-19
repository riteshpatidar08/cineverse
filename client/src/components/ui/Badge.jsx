import React from 'react';
import { cn } from '../../lib/utils';

export const Badge = ({
  className,
  variant = 'default',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 backdrop-blur-md';

  const variants = {
    default: 'bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 text-text-h shadow-sm',
    primary: 'bg-primary/10 border-primary/20 text-primary shadow-primary/5 shadow-sm',
    secondary: 'bg-secondary/10 border-secondary/20 text-secondary shadow-secondary/5 shadow-sm',
    destructive: 'bg-red-500/10 border-red-500/20 text-red-400 dark:text-red-300 shadow-red-500/5 shadow-sm',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
};
