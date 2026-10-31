import { useRef } from 'react';
import { content } from '../content';
import { Latin } from '../components/Latin';
import { SectionHeading } from '../components/SectionHeading';
import { SectionTransition } from '../components/SectionTransition';
import { useReveal } from '../hooks/useReveal';
import { useScrollScene } from '../hooks/useScrollScene';
import { gsap } from '../utils/gsap';

const { experience } = content;

export function ExperienceSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  useScrollScene(ref, () => {
    gsap.utils.toArray<HTMLElement>('.experience__item').forEach((item) => {
      gsap.from(item.querySelector('.experience__rule'), {
        scaleX: 0,
        duration: 0.9,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none reverse' },
      });
      gsap.from(item.querySelector('.experience__name > span'), {
        yPercent: 110,
        duration: 0.8,
        ease: 'power4.out',
        scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none reverse' },
      });
    });
  });

  return (
    <section ref={ref} id="experience" className="experience" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHeading
          id="experience-title"
          eyebrow={experience.eyebrow}
          title={<>{experience.title} <span className="heading-divider">|</span> <Latin>{experience.titleLatin}</Latin></>}
          body={experience.body}
        />
        <ol className="experience__list">
          {experience.records.map((record, index) => (
            <li key={record.name} className="experience__item">
              <span className="experience__rule" aria-hidden="true" />
              <Latin className="experience__number">{String(index + 1).padStart(2, '0')}</Latin>
              <p className="experience__name"><span>{record.name}</span></p>
              {(record.year || record.scope) && (
                <p className="experience__meta">{[record.year, record.scope].filter(Boolean).join(' · ')}</p>
              )}
              {record.image && <img src={record.image.src} alt={record.image.alt} loading="lazy" />}
            </li>
          ))}
        </ol>
      </div>
      <SectionTransition to="white" flip />
    </section>
  );
}
