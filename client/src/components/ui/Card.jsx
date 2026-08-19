import React from 'react';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'glass rounded-2xl p-6 text-text border-white/20 dark:border-white/10 relative overflow-hidden transition-all duration-300 hover:shadow-2xl dark:hover:shadow-primary/5',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight text-text-h', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-text/75 dark:text-text/70', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = ({ className, ...props }) => (
  <div className={cn('pt-2 pb-2', className)} {...props} />
);
CardContent.displayName = 'CardContent';

export const CardFooter = ({ className, ...props }) => (
  <div className={cn('flex items-center pt-4 border-t border-white/10 dark:border-white/5 mt-4', className)} {...props} />
);
CardFooter.displayName = 'CardFooter';
