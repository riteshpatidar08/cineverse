import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export const Tooltip = ({
  children,
  content,
  position = 'top',
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-white/20 dark:border-t-white/10 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-white/20 dark:border-b-white/10 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-white/20 dark:border-l-white/10 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-white/20 dark:border-r-white/10 border-y-transparent border-l-transparent',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      {...props}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 glass rounded-lg px-2.5 py-1 text-xs font-medium text-text-h border-white/20 dark:border-white/10 shadow-lg whitespace-nowrap animate-fadeIn pointer-events-none',
            positionStyles[position],
            className
          )}
          role="tooltip"
        >
          {content}
          <span
            className={cn(
              'absolute border-[4px] border-solid',
              arrowStyles[position]
            )}
          />
        </div>
      )}
    </div>
  );
};
