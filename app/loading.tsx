import { Container } from '@/components/ui/container';

export default function Loading() {
  return (
    <Container className="py-20">
      <div className="h-4 w-32 animate-pulse rounded bg-foreground/10" />
      <div className="mt-6 h-12 w-2/3 animate-pulse rounded bg-foreground/10" />
      <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-foreground/10" />
    </Container>
  );
}
