import type { RefObject } from 'react';
import { gsap } from '../utils/gsap';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export interface SceneEnv {
  /** Wide layout where pinned and sticky choreography is enabled. */
  isDesktop: boolean;
}

/**
 * Runs a scroll choreography scoped to one section. Animations are only ever
 * "from" states, so disabled motion or a failed script leaves content visible.
 * Everything is reverted on unmount and when the breakpoint changes.
 */
export function useScrollScene(scope: RefObject<HTMLElement | null>, setup: (env: SceneEnv) => void) {
  useIsomorphicLayoutEffect(() => {
    if (!scope.current) return;
    const mm = gsap.matchMedia(scope.current);
    mm.add(
      {
        desktop: '(min-width: 1024px)',
        mobile: '(max-width: 1023.98px)',
        motion: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const { desktop, motion } = context.conditions as Record<string, boolean>;
        if (motion) setup({ isDesktop: desktop });
      },
    );
    return () => mm.revert();
    // Scenes are static choreography: they run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
