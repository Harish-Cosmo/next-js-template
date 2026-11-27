'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] max-w-xl flex-col items-start justify-center py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">
        Something went wrong
      </p>
      <h1 className="mt-4 text-display font-semibold">We hit an error.</h1>
      <p className="mt-3 text-body">
        Try again. If the problem continues, check the server logs.
      </p>
      <Button className="mt-8" onClick={reset}>
        Try again
      </Button>
    </Container>
  );
}
