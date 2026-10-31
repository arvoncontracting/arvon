import { useEffect, useRef, useState } from 'react';
import { content } from '../content';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { gsap } from '../utils/gsap';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';

const { nav } = content;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const tween = gsap.fromTo(
      progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (menuOpen && !menu.open) menu.showModal();
    if (!menuOpen && menu.open) menu.close();
  }, [menuOpen]);

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="site-header__inner">
          <a className="site-header__logo" href="#top" aria-label={nav.home}>
            <Logo variant="arabic" tone="dark-bg" className="site-header__mark" />
          </a>
          <nav className="site-header__nav" aria-label={nav.menuTitle}>
            <ul>
              {nav.items.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="button button--primary button--small site-header__cta" href="#contact">
            {nav.contactCta}
          </a>
          <button
            type="button"
            className="icon-button site-header__toggle"
            aria-label={nav.menuOpen}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Icon name="menu" size={26} />
          </button>
        </div>
        <div ref={progressRef} className="site-header__progress" aria-hidden="true" />
      </header>

      <dialog ref={menuRef} className="mobile-menu" aria-label={nav.menuTitle} onClose={() => setMenuOpen(false)}>
        <div className="mobile-menu__head">
          <Logo variant="arabic" tone="dark-bg" className="site-header__mark" />
          <button type="button" className="icon-button" aria-label={nav.menuClose} onClick={() => setMenuOpen(false)}>
            <Icon name="close" size={26} />
          </button>
        </div>
        <nav aria-label={nav.menuTitle}>
          <ul>
            {[...nav.items, { label: nav.contactCta, href: '#contact' }].map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </>
  );
}
