import React from 'react';
import { cn } from '../../lib/utils';
import { Spinner } from './Spinner';

export const Button = React.forwardRef(({
  className,
  variant = 'glass',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/45 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] cursor-pointer';

  const variants = {
    glass: 'glass hover:bg-white/10 dark:hover:bg-white/15 text-text-h border-white/20 dark:border-white/10 shadow-lg',
    primary: 'glass bg-primary/20 hover:bg-primary/30 text-text-h border-primary/30 hover:border-primary/45 shadow-primary/5 shadow-md',
    secondary: 'glass bg-secondary/20 hover:bg-secondary/30 text-text-h border-secondary/30 hover:border-secondary/45 shadow-secondary/5 shadow-md',
    outline: 'bg-transparent border border-border text-text hover:glass hover:bg-white/5',
    ghost: 'bg-transparent text-text hover:glass hover:bg-white/5 border-transparent hover:border-white/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2 h-9',
    lg: 'px-6 py-2.5 text-base gap-2.5 h-11',
    icon: 'h-9 w-9 p-0',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && <Spinner size="sm" className="text-current" />}
      {!loading && children}
    </button>
  );
});

Button.displayName = 'Button';
