import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  selected?: boolean;
  children: ReactNode;
};

export function Chip({ selected = false, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={['chip', selected && 'selected', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
