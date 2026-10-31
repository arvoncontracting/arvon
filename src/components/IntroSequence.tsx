import { useCallback, useEffect, useRef, useState } from 'react';
import { content } from '../content';
import { gsap } from '../utils/gsap';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { Logo } from './Logo';

const SEEN_KEY = 'arvon-intro-seen';
/** Slope of the brand symbol's roof stroke, in degrees from horizontal. */
const SYMBOL_SLOPE = 51.4;

const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage may be blocked; the intro then simply plays again on the next visit.
  }
};

/**
 * Welcome, logo, then two charcoal planes part along the symbol's slope to
 * reveal the real hero behind them. There is no second copy of the photograph.
 * Any scroll, key press or the skip button ends it at once.
 */
export function IntroSequence() {
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    timelineRef.current?.kill();
    markSeen();
    document.documentElement.removeAttribute('data-intro');
    window.dispatchEvent(new CustomEvent('arvon:intro-end'));
    setActive(false);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (document.documentElement.getAttribute('data-intro') === 'pending') setActive(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!active || !root) return;
    document.documentElement.setAttribute('data-intro', 'running');
    finishedRef.current = false;

    const q = gsap.utils.selector(root);
    const logo = q('.intro__logo')[0];
    const target = document.querySelector<HTMLElement>('.hero__logo');

    // Keep wall-clock timing: slow devices drop frames instead of waiting longer.
    gsap.ticker.lagSmoothing(0);
    const tl = gsap.timeline({ onComplete: finish });
    timelineRef.current = tl;

    gsap.set(q('[data-logo-part="word"]'), { clipPath: 'inset(0 100% 0 0)', autoAlpha: 0 });
    tl.from('.intro__welcome', { y: 22, opacity: 0, duration: 0.5, ease: 'power3.out' }, 0.05)
      .to('.intro__welcome', { y: -14, opacity: 0, duration: 0.24, ease: 'power2.in' }, 0.74)
      .set('.intro__logo', { autoAlpha: 1 }, 0.92)
      .from(q('[data-logo-part="roof"]'), { x: -420, y: 530, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.92)
      .from(q('[data-logo-part="pier"]'), { x: 340, y: 480, opacity: 0, duration: 0.6, ease: 'power3.out' }, 1)
      .set(q('[data-logo-part="word"]'), { autoAlpha: 1 }, 1.14)
      .to(q('[data-logo-part="word"]'), { clipPath: 'inset(0 0% 0 0)', duration: 0.42, ease: 'power2.inOut' }, 1.14)
      .to('.intro__plane--a', { yPercent: -100, duration: 0.74, ease: 'power3.inOut' }, 1.5)
      .to('.intro__plane--b', { yPercent: 100, duration: 0.74, ease: 'power3.inOut' }, 1.5)
      .to('.hero__intro-scrim', { opacity: 0, duration: 0.5, ease: 'power1.out' }, 2.15);

    if (target && logo) {
      const from = logo.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      tl.to(
        logo,
        {
          x: to.left + to.width / 2 - (from.left + from.width / 2),
          y: to.top + to.height / 2 - (from.top + from.height / 2),
          scale: to.width / from.width,
          duration: 0.6,
          ease: 'power3.inOut',
        },
        2.1,
      );
    }

    // Safety net so a stalled timeline can never leave the visitor behind the curtain.
    const failsafe = window.setTimeout(finish, 4000);
    return () => {
      window.clearTimeout(failsafe);
      tl.kill();
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [active, finish]);

  useEffect(() => {
    if (!active) return;
    const skip = () => finish();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' && event.key !== 'Shift') finish();
    };
    window.addEventListener('wheel', skip, { passive: true });
    window.addEventListener('touchmove', skip, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchmove', skip);
      window.removeEventListener('keydown', onKey);
    };
  }, [active, finish]);

  if (!active) return null;

  return (
    <div ref={rootRef} className="intro" role="presentation">
      <div className="intro__rig" aria-hidden="true" style={{ transform: `translate(-50%, -50%) rotate(${-SYMBOL_SLOPE}deg)` }}>
        <div className="intro__plane intro__plane--a" />
        <div className="intro__plane intro__plane--b" />
      </div>
      <p className="intro__welcome">{content.intro.welcome}</p>
      <div className="intro__logo" aria-hidden="true">
        <Logo tone="dark-bg" />
      </div>
      <button type="button" className="intro__skip" onClick={finish}>
        {content.intro.skip}
      </button>
    </div>
  );
}
