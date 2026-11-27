'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = 'Something went wrong | Show Up For Life';
    headingRef.current?.focus();
  }, []);

  return (
    <section
      aria-labelledby="error-heading"
      className="rounded-lg border border-red-200 bg-white p-6"
    >
      <h1
        id="error-heading"
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-semibold text-red-900 focus:outline-none"
      >
        Something went wrong
      </h1>
      <p className="mt-2 text-slate-700">
        We could not load this page. You can try again. If it keeps happening,
        return home or try again later.
      </p>
      <Button type="button" onClick={reset} className="mt-4">
        Try again
      </Button>
    </section>
  );
}
