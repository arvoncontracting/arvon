import { useRef } from 'react';
import { content } from '../content';
import { SectionHeading } from '../components/SectionHeading';
import { SectionTransition } from '../components/SectionTransition';
import { useReveal } from '../hooks/useReveal';

const { about } = content;

export function AboutArvon() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="about" className="about" aria-labelledby="about-title">
      <div className="wrap about__grid">
        <div className="about__main">
          <SectionHeading id="about-title" eyebrow={about.eyebrow} title={about.title} />
          <p className="about__narrative" data-reveal>{about.narrative}</p>
          <div className="about__vision" data-reveal>
            <h3>{about.visionTitle}</h3>
            <p>{about.vision}</p>
          </div>
        </div>
        <aside className="about__side">
          <div data-reveal>
            <h3>{about.foundersTitle}</h3>
            <ul className="about__founders">
              {about.founders.map((founder) => (
                <li key={founder}>{founder}</li>
              ))}
            </ul>
          </div>
          <div data-reveal>
            <h3>{about.valuesTitle}</h3>
            <ul className="scope-list">
              {about.values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
      <SectionTransition to="paper" flip />
    </section>
  );
}
