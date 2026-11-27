import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * The page's horizontal rhythm. Change the max width here once, not in
 * every section.
 */
export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-6xl page-pad', className)}
      {...props}
    />
  );
}
