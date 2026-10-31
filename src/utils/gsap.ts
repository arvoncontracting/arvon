import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

/** Vertical rise used by every content reveal. */
export const REVEAL = { y: 26, opacity: 0, duration: 0.7, ease: 'power3.out' } as const;
