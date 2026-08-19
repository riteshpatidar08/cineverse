import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export const Dialog = ({
  open,
  onOpenChange,
  children
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog content wrapper */}
      <div className="z-10 w-full max-w-lg transform scale-100 opacity-100 transition-all duration-300">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({
  className,
  children,
  onClose,
  ...props
}) => {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-6 border-white/20 dark:border-white/10 relative overflow-hidden shadow-2xl flex flex-col gap-4',
        className
      )}
      {...props}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-text/50 hover:text-text-h hover:bg-white/10 transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      )}
      {children}
    </div>
  );
};

export const DialogHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 text-left', className)} {...props} />
);

export const DialogTitle = ({ className, ...props }) => (
  <h3 className={cn('text-xl font-semibold leading-none tracking-tight text-text-h', className)} {...props} />
);

export const DialogDescription = ({ className, ...props }) => (
  <p className={cn('text-sm text-text/70', className)} {...props} />
);

export const DialogFooter = ({ className, ...props }) => (
  <div className={cn('flex justify-end gap-2 border-t border-white/10 dark:border-white/5 pt-4 mt-2', className)} {...props} />
);
