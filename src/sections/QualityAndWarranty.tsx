import { useRef } from 'react';
import { content } from '../content';
import { Latin } from '../components/Latin';
import { SectionHeading } from '../components/SectionHeading';
import { SectionTransition } from '../components/SectionTransition';
import { WarrantyCertificate } from '../components/WarrantyCertificate';
import { useReveal } from '../hooks/useReveal';
import { useScrollScene } from '../hooks/useScrollScene';
import { gsap } from '../utils/gsap';

const { quality } = content;

export function QualityAndWarranty() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  useScrollScene(ref, () => {
    gsap.fromTo(
      '.certificate__sheet',
      { rotate: -5, y: 50 },
      { rotate: 0, y: 0, ease: 'none', scrollTrigger: { trigger: '.certificate', start: 'top 95%', end: 'top 45%', scrub: 0.5 } },
    );
  });

  return (
    <section ref={ref} id="quality" className="quality" aria-labelledby="quality-title">
      <div className="wrap quality__grid">
        <div>
          <SectionHeading
            id="quality-title"
            eyebrow={quality.eyebrow}
            title={<>{quality.title} <span className="heading-divider">|</span> <Latin>{quality.titleLatin}</Latin></>}
            body={quality.body}
          />
          <ol className="quality__list">
            {quality.principles.map((principle, index) => (
              <li key={principle.title} data-reveal>
                <Latin className="quality__number">{String(index + 1).padStart(2, '0')}</Latin>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <WarrantyCertificate />
      </div>
      <SectionTransition to="charcoal" />
    </section>
  );
}
