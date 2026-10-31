import { useRef } from 'react';
import { content } from '../content';
import { Picture } from '../components/Picture';
import { SectionHeading } from '../components/SectionHeading';
import { SectionTransition } from '../components/SectionTransition';
import { ServiceDetail } from '../components/ServiceDetail';
import { useReveal } from '../hooks/useReveal';
import { useScrollScene } from '../hooks/useScrollScene';
import { gsap } from '../utils/gsap';

const { concrete, services } = content;
const works = services.items.filter((item) => item.group === 'concrete');

export function ConcreteWorks() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  // Surfaces arrive on a slope and finish level, echoing screed and trowel work.
  useScrollScene(ref, () => {
    gsap.utils.toArray<HTMLElement>('.concrete__row').forEach((row) => {
      const scrollTrigger = { trigger: row, start: 'top 90%', end: 'top 35%', scrub: 0.5 };
      gsap.fromTo(
        row.querySelector('.concrete__figure'),
        { clipPath: 'polygon(0 16%, 100% 0, 100% 100%, 0 100%)' },
        { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', ease: 'none', scrollTrigger },
      );
      gsap.fromTo(row.querySelector('.concrete__level'), { rotate: -4 }, { rotate: 0, ease: 'none', scrollTrigger });
    });
  });

  return (
    <section ref={ref} id="concrete" className="concrete" aria-labelledby="concrete-title">
      <div className="wrap">
        <SectionHeading id="concrete-title" eyebrow={concrete.eyebrow} title={concrete.title} body={concrete.body} />
        {works.map((work) => (
          <div key={work.id} className="concrete__row">
            <div className="concrete__figure">
              {work.image && <Picture image={work.image.id} alt={work.image.alt} sizes="(min-width: 1024px) 58vw, 100vw" />}
              <span className="concrete__level" aria-hidden="true" />
            </div>
            <ServiceDetail service={work} index={services.items.indexOf(work) + 1} figure="none" />
          </div>
        ))}
      </div>
      <SectionTransition to="sand" />
    </section>
  );
}
