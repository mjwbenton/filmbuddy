import type { HTMLAttributes, ReactNode } from 'react';

type PillVariant = 'default' | 'accent' | 'yellow' | 'ghost';

type PillProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: PillVariant;
  children: ReactNode;
};

export function Pill({ variant = 'default', className, children, ...rest }: PillProps) {
  return (
    <span
      className={['pill', variant !== 'default' && variant, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </span>
  );
}
