type Surface = 'white' | 'paper' | 'charcoal' | 'sand';

/**
 * Roof-pitch edge that closes a section in the colour of the next one.
 * Scroll raises it from flat to full pitch, see useEdgeTransitions.
 */
export function SectionTransition({ to, flip = false }: { to: Surface; flip?: boolean }) {
  return <div className={`section-edge section-edge--${to}${flip ? ' section-edge--flip' : ''}`} data-edge aria-hidden="true" />;
}
