import * as React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';

/** A vertical band with consistent spacing and a centred container. */
export function Section({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return <section className={cn('section-pad', className)} {...props} />;
}

/** A section that owns its own container. */
export function SectionContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <Container className={cn('section-pad', className)} {...props} />;
}

/** Eyebrow, heading and optional description, aligned as one block. */
export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-h1 font-semibold">{title}</h2>
      {description ? (
        <p className="mt-3 text-body">{description}</p>
      ) : null}
    </div>
  );
}
