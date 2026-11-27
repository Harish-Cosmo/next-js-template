import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] max-w-xl flex-col items-start justify-center py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">
        404
      </p>
      <h1 className="mt-4 text-display font-semibold">Page not found.</h1>
      <p className="mt-3 text-body">
        The page you are looking for does not exist or has moved.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Go home</Link>
      </Button>
    </Container>
  );
}
