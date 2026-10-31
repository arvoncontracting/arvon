import { gsap } from '../utils/gsap';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/** Raises every section edge from flat to its full pitch as it enters. */
export function useEdgeTransitions() {
  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('[data-edge]').forEach((edge) => {
        gsap.from(edge, {
          scaleY: 0,
          ease: 'none',
          scrollTrigger: { trigger: edge, start: 'top bottom', end: 'bottom 55%', scrub: 0.4 },
        });
      });
    });
    return () => mm.revert();
  }, []);
}
