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
        'flex h-10 w-full rounded-xl border border-[#e5e0f2] bg-white px-3.5 py-2 text-sm text-[#230d56] placeholder:text-[#8e7fc4]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#471b8e]/30 focus-visible:border-[#471b8e] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 shadow-sm',
        error && 'border-red-500/50 focus-visible:ring-red-500/20 focus-visible:border-red-500/50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';
