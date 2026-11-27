import Link from 'next/link';
import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to main content
      </a>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-lg font-semibold"
            aria-label="Show Up For Life home"
          >
            Show Up For Life
          </Link>
          <nav aria-label="Primary navigation">
            <ul className="flex items-center gap-4 text-sm">
              <li>
                <Link
                  className="inline-flex min-h-6 items-center rounded-sm px-2 py-1 text-slate-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                  href="/"
                >
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main
        id="main-content"
        className="mx-auto w-full max-w-5xl flex-1 px-4 py-8"
        tabIndex={-1}
      >
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-5xl px-4 py-4 text-sm text-slate-600">
          A privacy-respecting gathering coordination foundation.
        </div>
      </footer>
    </div>
  );
}
