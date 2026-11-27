import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('preserves its accessible name and forwards refs', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save changes</Button>);

    expect(
      screen.getByRole('button', { name: 'Save changes' }),
    ).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('invokes click handlers', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Continue</Button>);

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('can render as a child element', () => {
    render(
      <Button asChild>
        <a href="https://example.com">External reference</a>
      </Button>,
    );

    expect(
      screen.getByRole('link', { name: 'External reference' }),
    ).toBeInTheDocument();
  });
});
