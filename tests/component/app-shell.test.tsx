import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppShell } from '@/components/layout/app-shell';

describe('AppShell', () => {
  it('renders semantic landmarks and a skip link', () => {
    render(
      <AppShell>
        <p>Shell content</p>
      </AppShell>,
    );

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Primary navigation' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('Shell content');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
