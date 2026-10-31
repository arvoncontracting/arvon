/**
 * Layout of the approved lockups, measured on the brand board in 8x board pixels.
 * Paths live in a single sprite (build/htmlPlugin.ts); these only place them.
 */
export const logoGeometry = {
  /** Stacked English master logo. */
  master: {
    viewBox: '387 451 3932 2621',
    symbol: 'translate(944 400)',
    word: 'translate(288 2016)',
  },
  /** Horizontal English arrangement from lockup 06, for the navigation bar. */
  horizontal: {
    viewBox: '64 58 1862 414',
    symbol: 'translate(27.700 41.900) scale(0.5264)',
    word: 'translate(762.400 153) scale(0.2887)',
  },
} as const;
