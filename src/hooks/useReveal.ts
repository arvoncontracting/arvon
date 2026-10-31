import type { RefObject } from 'react';
import { gsap, REVEAL, ScrollTrigger } from '../utils/gsap';
import { useScrollScene } from './useScrollScene';

/** Fades up every [data-reveal] inside a section. Reversible when scrolling back. */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useScrollScene(scope, () => {
    const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    if (!items.length) return;
    gsap.set(items, { y: REVEAL.y, opacity: 0 });
    ScrollTrigger.batch(items, {
      start: 'top 92%',
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: REVEAL.duration, ease: REVEAL.ease, stagger: 0.07, overwrite: true }),
      onLeaveBack: (batch) => gsap.to(batch, { y: REVEAL.y, opacity: 0, duration: 0.3, overwrite: true }),
    });
  });
}
