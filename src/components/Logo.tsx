import { logoGeometry } from '../data/logoGeometry';

export type LogoTone = 'light-bg' | 'dark-bg';

interface LogoProps {
  variant?: 'master' | 'horizontal';
  tone?: LogoTone;
  title?: string;
  className?: string;
}

/**
 * Official English logo, traced from the approved brand board. Paths come from
 * the page's single sprite, and the viewBox guarantees uniform scaling.
 */
export function Logo({ variant = 'master', tone = 'light-bg', title, className = '' }: LogoProps) {
  const a11y = title ? ({ role: 'img', 'aria-label': title } as const) : ({ 'aria-hidden': true } as const);
  const { viewBox, symbol, word } = logoGeometry[variant];
  const suffix = variant === 'horizontal' ? '-s' : '';

  return (
    <svg className={`logo logo--${tone} ${className}`} viewBox={viewBox} {...a11y}>
      <g transform={symbol}>
        <use href={`#lg-roof${suffix}`} />
        <use href={`#lg-pier${suffix}`} />
      </g>
      <g transform={word}>
        <use href="#lg-word" />
        <use href="#lg-word-mark" />
      </g>
    </svg>
  );
}
