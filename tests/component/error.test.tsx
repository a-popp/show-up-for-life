import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorPage from '@/app/error';

describe('ErrorPage', () => {
  it('sets a descriptive title and focuses the error heading', () => {
    render(<ErrorPage error={new Error('test')} reset={vi.fn()} />);

    expect(document.title).toBe('Something went wrong | Show Up For Life');
    expect(
      screen.getByRole('heading', { name: 'Something went wrong', level: 1 }),
    ).toHaveFocus();
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument();
  });
});
