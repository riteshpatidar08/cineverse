import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({
  className,
  type = 'text',
  error = false,
  ...props
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg glass border-white/10 dark:border-white/5 px-3 py-1.5 text-sm text-text-h placeholder:text-text/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/45 focus-visible:border-primary/45 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40',
        error && 'border-red-500/50 focus-visible:ring-red-500/20 focus-visible:border-red-500/50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';
