import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('skeleton rounded-md bg-[var(--color-surface-raised)]', className)}
      {...props}
    />
  );
}

export { Skeleton };
