import { content } from '../content';
import { Icon } from '../components/Icon';
import { Picture } from '../components/Picture';
import { SectionTransition } from '../components/SectionTransition';
import { whatsappUrl } from '../utils/links';

const { hero } = content;

export function HeroExperience() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <Picture image="amman-skyline" alt={hero.imageAlt} sizes="(max-aspect-ratio: 3/2) 155vh, 100vw" priority />
        <div className="hero__scrim" />
      </div>

      <div className="hero__content">
        <p className="hero__brand">
          <span>{hero.brand}</span>
          <span className="hero__brand-rule" aria-hidden="true" />
          <span lang="en" dir="ltr" className="latin">ARVON</span>
          <small>{hero.descriptor}</small>
        </p>
        <h1 id="hero-title">{hero.title}</h1>
        <p className="hero__support">{hero.support}</p>
        <div className="hero__actions">
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

      <ul className="hero__pillars">
        {hero.pillars.map((pillar) => (
          <li key={pillar.href}>
            <a href={pillar.href}>{pillar.label}</a>
          </li>
        ))}
      </ul>
      <SectionTransition to="white" flip />
    </section>
  );
}
