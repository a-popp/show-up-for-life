import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFoundPage() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="rounded-lg border border-slate-200 bg-white p-6"
    >
      <h1 id="not-found-heading" className="text-2xl font-semibold">
        Page not found
      </h1>
      <p className="mt-2 text-slate-700">The requested page does not exist.</p>
      <Link
        className="mt-4 inline-flex min-h-6 items-center rounded-sm px-2 py-1 text-slate-900 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        href="/"
      >
        Return home
      </Link>
    </section>
  );
}
