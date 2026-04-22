import type { SVGProps } from 'react';

export type IconName =
  | 'camera'
  | 'aperture'
  | 'film-frame'
  | 'lens'
  | 'filter'
  | 'film'
  | 'plus'
  | 'plus-sm'
  | 'swap'
  | 'note'
  | 'chevron-right'
  | 'chevron-left'
  | 'check'
  | 'x'
  | 'sparkles'
  | 'upload'
  | 'download'
  | 'clock'
  | 'alert'
  | 'sliders'
  | 'rotate'
  | 'more'
  | 'flag'
  | 'cloud'
  | 'copy';

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
    case 'camera':
      return (
        <svg {...common}>
          <path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      );
    case 'aperture':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v8l7 4M12 21v-8l-7-4M21 12h-8l-3.5 6.5M3 12h8l3.5-6.5" />
        </svg>
      );
    case 'film-frame':
      return (
        <svg {...common}>
          <rect x="4" y="7" width="16" height="10" rx="1.2" />
          <circle cx="7" cy="10" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="10.3" cy="10" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="13.7" cy="10" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="17" cy="10" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="7" cy="14" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="10.3" cy="14" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="13.7" cy="14" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="17" cy="14" r="0.7" fill="currentColor" stroke="none" />
        </svg>
      );
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
    case 'film':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 9h2M3 13h2M3 17h2M19 9h2M19 13h2M19 17h2M8 5v14M16 5v14" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case 'plus-sm':
      return (
        <svg {...common} viewBox="0 0 16 16">
          <path d="M8 3v10M3 8h10" />
        </svg>
      );
    case 'swap':
      return (
        <svg {...common}>
          <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
        </svg>
      );
    case 'note':
      return (
        <svg {...common}>
          <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
          <path d="M8 10h8M8 14h6" />
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
    case 'x':
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
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
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case 'alert':
      return (
        <svg {...common}>
          <path d="M12 3 2 20h20L12 3Z" />
          <path d="M12 10v4M12 17.5v.01" />
        </svg>
      );
    case 'sliders':
      return (
        <svg {...common}>
          <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
          <circle cx="16" cy="6" r="2" />
          <circle cx="10" cy="12" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );
    case 'rotate':
      return (
        <svg {...common}>
          <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
          <path d="M21 3v5h-5" />
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
    case 'flag':
      return (
        <svg {...common}>
          <path d="M5 3v18M5 5h12l-2 4 2 4H5" />
        </svg>
      );
    case 'cloud':
      return (
        <svg {...common}>
          <path d="M17 17H7a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 9.1a4 4 0 0 1-1 7.9Z" />
        </svg>
      );
    case 'copy':
      return (
        <svg {...common}>
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
        </svg>
      );
  }
}
