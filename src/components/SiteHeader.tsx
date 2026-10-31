import { content } from '../content';
import { Icon } from './Icon';
import { Logo } from './Logo';

const { nav } = content;

/** Static markup; scroll state and the menu live in src/client/header.ts. */
export function SiteHeader() {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="site-header__logo" href="#top" aria-label={nav.home}>
            <Logo variant="horizontal" tone="dark-bg" className="site-header__mark" />
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
          <button type="button" className="icon-button site-header__toggle" aria-label={nav.menuOpen} aria-haspopup="dialog" aria-expanded="false">
            <Icon name="menu" size={26} />
          </button>
        </div>
        <div className="site-header__progress" aria-hidden="true" />
      </header>

      <dialog className="mobile-menu" aria-label={nav.menuTitle}>
        <div className="mobile-menu__head">
          <Logo variant="horizontal" tone="dark-bg" className="site-header__mark" />
          <button type="button" className="icon-button" aria-label={nav.menuClose} data-close>
            <Icon name="close" size={26} />
          </button>
        </div>
        <nav aria-label={nav.menuTitle}>
          <ul>
            {[...nav.items, { label: nav.contactCta, href: '#contact' }].map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </>
  );
}
