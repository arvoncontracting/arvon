import { arabicLockup, logoArtwork } from './logoArtwork';

type Tone = 'light-bg' | 'dark-bg' | 'mono-white';
export type LogoVariant = 'master' | 'arabic' | 'symbol';

interface LogoProps {
  variant?: LogoVariant;
  tone?: Tone;
  title?: string;
  className?: string;
}

const palette: Record<Tone, { accent: string; body: string; mark: string }> = {
  'light-bg': { accent: '#E65A1F', body: '#1F2326', mark: '#1F2326' },
  'dark-bg': { accent: '#E65A1F', body: '#FFFFFF', mark: '#FFFFFF' },
  'mono-white': { accent: '#FFFFFF', body: '#FFFFFF', mark: '#FFFFFF' },
};

const { symbol, standalone, wordEn, wordAr } = logoArtwork;

/** Board positions of the two master primitives, in 8x board pixels. */
const master = {
  symbol: { x: 944, y: 400 },
  word: { x: 288, y: 2016 },
  viewBox: '387 451 3932 2621',
};

const [lockupSymbol, lockupWord] = arabicLockup;
const fit = (ink: { x0: number; x1: number }, box: { x0: number; x1: number }) => (box.x1 - box.x0) / (ink.x1 - ink.x0);
const lockupSymbolScale = fit(standalone.ink, lockupSymbol);
const lockupWordScale = fit(wordAr.ink, lockupWord);

/**
 * ARVON logo, traced from the approved brand board and recomposed at the
 * positions measured on that board. Always scaled uniformly by the SVG viewBox.
 */
export function Logo({ variant = 'master', tone = 'light-bg', title, className }: LogoProps) {
  const colors = palette[tone];
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };

  if (variant === 'symbol') {
    const { x0, x1, y0, y1 } = standalone.ink;
    return (
      <svg className={className} viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`} {...a11y}>
        <path fill={colors.accent} fillRule="evenodd" d={standalone.orange} />
        <path fill={colors.body} fillRule="evenodd" d={standalone.dark} />
      </svg>
    );
  }

  if (variant === 'arabic') {
    return (
      <svg className={className} viewBox="44 40 1988 600" {...a11y}>
        <g transform={`translate(${lockupSymbol.x0 - standalone.ink.x0 * lockupSymbolScale} ${lockupSymbol.y0 - standalone.ink.y0 * lockupSymbolScale}) scale(${lockupSymbolScale})`}>
          <path fill={colors.accent} fillRule="evenodd" d={standalone.orange} />
          <path fill={colors.body} fillRule="evenodd" d={standalone.dark} />
        </g>
        <g transform={`translate(${lockupWord.x0 - wordAr.ink.x0 * lockupWordScale} ${lockupWord.y0 - wordAr.ink.y0 * lockupWordScale}) scale(${lockupWordScale})`}>
          <path fill={colors.body} fillRule="evenodd" d={wordAr.dark} />
        </g>
      </svg>
    );
  }

  return (
    <svg className={className} viewBox={master.viewBox} {...a11y}>
      <g data-logo-part="symbol" transform={`translate(${master.symbol.x} ${master.symbol.y})`}>
        <path data-logo-part="roof" fill={colors.accent} fillRule="evenodd" d={symbol.orange} />
        <path data-logo-part="pier" fill={colors.body} fillRule="evenodd" d={symbol.dark} />
      </g>
      <g data-logo-part="word" transform={`translate(${master.word.x} ${master.word.y})`}>
        <path fill={colors.body} fillRule="evenodd" d={wordEn.dark} />
        <path fill={colors.accent} fillRule="evenodd" d={wordEn.orange} />
      </g>
    </svg>
  );
}
