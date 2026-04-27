import type { SVGProps } from 'react';

export type IconName =
  | 'lens'
  | 'filter'
  | 'plus'
  | 'swap'
  | 'chevron-right'
  | 'chevron-left'
  | 'check'
  | 'upload'
  | 'download'
  | 'alert'
  | 'more'
  | 'copy'
  | 'notebook';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name' | 'stroke' | 'strokeWidth'> & {
  name: IconName;
  size?: number;
  stroke?: number;
};

export function Icon({ name, size = 20, stroke = 1.75, ...rest }: IconProps) {
  const common = {
    ...rest,
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'lens':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
        </svg>
      );
    case 'filter':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M5 9h14M5 15h14" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case 'swap':
      return (
        <svg {...common}>
          <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
        </svg>
      );
    case 'chevron-right':
      return (
        <svg {...common}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );
    case 'chevron-left':
      return (
        <svg {...common}>
          <path d="m15 6-6 6 6 6" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="m5 12 5 5 9-11" />
        </svg>
      );
    case 'upload':
      return (
        <svg {...common}>
          <path d="M12 17V5M7 10l5-5 5 5M4 19h16" />
        </svg>
      );
    case 'download':
      return (
        <svg {...common}>
          <path d="M12 5v12M7 12l5 5 5-5M4 19h16" />
        </svg>
      );
    case 'alert':
      return (
        <svg {...common}>
          <path d="M12 3 2 20h20L12 3Z" />
          <path d="M12 10v4M12 17.5v.01" />
        </svg>
      );
    case 'more':
      return (
        <svg {...common}>
          <circle cx="5" cy="12" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
        </svg>
      );
    case 'copy':
      return (
        <svg {...common}>
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
        </svg>
      );
    case 'notebook':
      return (
        <svg {...common}>
          <rect x="6" y="4" width="14" height="16" rx="1.2" />
          <path d="M9 4v16" />
          <path d="M7 6.5c0 1 2 1 2 0M7 11c0 1 2 1 2 0M7 15.5c0 1 2 1 2 0" />
          <path d="M4 6h3M4 10.5h3M4 15h3" />
          <path d="M12 9h5M12 13h5" />
          <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
