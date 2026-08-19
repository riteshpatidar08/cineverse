import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20 dark:border-white/10 glass',
      className
    )}
    {...props}
  />
));
Avatar.displayName = 'Avatar';

export const AvatarImage = React.forwardRef(({ className, src, alt, ...props }, ref) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) return null;

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...props}
    />
  );
});
AvatarImage.displayName = 'AvatarImage';

export const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent font-semibold text-sm',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = 'AvatarFallback';
