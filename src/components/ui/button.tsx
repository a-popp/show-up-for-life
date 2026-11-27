import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'primary' | 'secondary';
}

const baseClasses =
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variantClasses = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-slate-900',
  secondary:
    'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-900',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, asChild = false, variant = 'primary', type, ...props },
    ref,
  ) => {
    const Component = asChild ? Slot : 'button';
    const classes = [baseClasses, variantClasses[variant], className]
      .filter(Boolean)
      .join(' ');

    return (
      <Component
        ref={ref}
        className={classes}
        type={asChild ? undefined : (type ?? 'button')}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
