import React from 'react';
import { cn } from '../../lib/utils';

export const Switch = React.forwardRef(({
  className,
  checked,
  onCheckedChange,
  disabled = false,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
      className={cn(
        'inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40',
        checked ? 'bg-primary border-primary' : 'bg-white/5 dark:bg-white/[0.03]',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform duration-300',
          checked ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  );
});

Switch.displayName = 'Switch';
