import { useRef } from 'react';
import { content } from '../content';
import { Icon } from '../components/Icon';
import { Logo } from '../components/Logo';
import { Picture } from '../components/Picture';
import { SectionTransition } from '../components/SectionTransition';
import { useScrollScene } from '../hooks/useScrollScene';
import { gsap } from '../utils/gsap';
import { whatsappUrl } from '../utils/links';

const { hero, company } = content;

export function HeroExperience() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, () => {
    const scrollTrigger = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero__media picture', { yPercent: 9, ease: 'none', scrollTrigger });
    gsap.to('.hero__content', { yPercent: -10, ease: 'none', scrollTrigger });
  });

  return (
    <section ref={ref} id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <Picture
          image="amman-skyline"
          alt={hero.imageAlt}
          sizes="(max-aspect-ratio: 3/2) 155vh, 100vw"
          priority
        />
        <div className="hero__scrim" />
        <div className="hero__intro-scrim" />
      </div>

      <div className="hero__content">
        <Logo tone="dark-bg" title={company.nameLatin} className="hero__logo" />
        <p className="hero__brand hero__reveal">
          <span>{hero.brand}</span>
          <span className="hero__brand-rule" aria-hidden="true" />
          <span lang="en" dir="ltr" className="latin">ARVON</span>
          <small>{hero.descriptor}</small>
        </p>
        <h1 id="hero-title" className="hero__reveal">{hero.title}</h1>
        <p className="hero__support hero__reveal">{hero.support}</p>
        <div className="hero__actions hero__reveal">
          <a className="button button--primary" href="#services">
            {hero.primaryCta}
            <Icon name="arrow" size={20} />
          </a>
          <a className="button button--on-dark" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" />
            {hero.whatsappCta}
          </a>
        </div>
      </div>

      <ul className="hero__pillars hero__reveal">
        {hero.pillars.map((pillar) => (
          <li key={pillar.href}>
            <a href={pillar.href}>{pillar.label}</a>
          </li>
        ))}
      </ul>
      <SectionTransition to="white" />
    </section>
  );
}
