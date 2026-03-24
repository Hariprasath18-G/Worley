'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error.message);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <h2 className="text-xl font-semibold text-worley-text-primary">Something went wrong</h2>
      <p className="mt-2 text-sm text-worley-text-secondary">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-worley-border bg-transparent px-6 py-2.5 text-base font-medium text-worley-text-primary transition-all duration-200 hover:border-worley-orange"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-lg bg-worley-orange px-6 py-2.5 text-base font-medium text-white transition-all duration-200 hover:bg-worley-orange-hover"
        >
          Return to home
        </a>
      </div>
    </div>
  );
}
