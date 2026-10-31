import { useRef } from 'react';
import { content } from '../content';
import { useReveal } from '../hooks/useReveal';
import { useScrollScene } from '../hooks/useScrollScene';
import { gsap } from '../utils/gsap';

const { identity } = content;

export function EngineeringIdentity() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  useScrollScene(ref, ({ isDesktop }) => {
    const lines = gsap.utils.toArray<HTMLElement>('.identity__line > span');
    gsap.from(lines, {
      yPercent: 105,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '.identity__title', start: 'top 82%', toggleActions: 'play none none reverse' },
    });
    if (isDesktop) {
      gsap.to('.identity__plane--back', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: ref.current, scrub: true } });
      gsap.to('.identity__plane--front', { yPercent: -42, ease: 'none', scrollTrigger: { trigger: ref.current, scrub: true } });
    }
  });

  return (
    <section ref={ref} id="identity" className="identity" aria-labelledby="identity-title">
      <div className="identity__plane identity__plane--back" aria-hidden="true" />
      <div className="identity__plane identity__plane--front" aria-hidden="true" />
      <div className="wrap identity__grid">
        <p className="section-tab" data-reveal>{identity.eyebrow}</p>
        <h2 id="identity-title" className="identity__title">
          {identity.title.map((line) => (
            <span className="identity__line" key={line}>
              <span>{line}</span>
            </span>
          ))}
        </h2>
        <p className="identity__body" data-reveal>{identity.body}</p>
        <ul className="identity__pillars">
          {identity.pillars.map((pillar) => (
            <li key={pillar.title} data-reveal>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
