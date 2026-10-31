import { useRef } from 'react';
import { content } from '../content';
import { Picture } from '../components/Picture';
import { SectionHeading } from '../components/SectionHeading';
import { ServiceDetail, ServicePlate } from '../components/ServiceDetail';
import { SectionTransition } from '../components/SectionTransition';
import { useReveal } from '../hooks/useReveal';
import { useScrollScene } from '../hooks/useScrollScene';
import { gsap, ScrollTrigger } from '../utils/gsap';

const { services, waterproofing } = content;
const systems = services.items.filter((item) => item.group === 'waterproofing');

export function WaterproofingSystems() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  // Each text panel promotes its plate on the sticky stage. CSS drives the wipe,
  // so the stage stays correct when scrolling back up.
  useScrollScene(ref, ({ isDesktop }) => {
    if (!isDesktop) return;
    const plates = gsap.utils.toArray<HTMLElement>('.stage__plate');
    const ticks = gsap.utils.toArray<HTMLElement>('.stage__tick');
    const activate = (index: number) => {
      plates.forEach((plate, i) => plate.classList.toggle('is-active', i <= index));
      ticks.forEach((tick, i) => tick.classList.toggle('is-active', i === index));
    };
    activate(0);
    gsap.utils.toArray<HTMLElement>('.systems__list .service').forEach((panel, index) => {
      ScrollTrigger.create({
        trigger: panel,
        start: 'top 60%',
        end: 'bottom 60%',
        onToggle: (self) => {
          if (self.isActive) activate(index);
        },
      });
    });
    return undefined;
  });

  return (
    <section ref={ref} id="waterproofing" className="systems" aria-labelledby="waterproofing-title">
      <div className="wrap">
        <SectionHeading id="waterproofing-title" eyebrow={waterproofing.eyebrow} title={waterproofing.title} body={waterproofing.body} />
        <div className="systems__layout">
          <div className="stage" aria-hidden="true">
            <div className="stage__frame">
              {systems.map((service, index) => (
                <div key={service.id} className="stage__plate" style={{ zIndex: index + 1 }}>
                  {service.image ? (
                    <Picture image={service.image.id} alt="" sizes="48vw" />
                  ) : (
                    <ServicePlate service={service} index={services.items.indexOf(service) + 1} />
                  )}
                </div>
              ))}
            </div>
            <ol className="stage__ticks">
              {systems.map((service) => (
                <li key={service.id} className="stage__tick" />
              ))}
            </ol>
          </div>
          <div className="systems__list">
            {systems.map((service) => (
              <ServiceDetail
                key={service.id}
                service={service}
                index={services.items.indexOf(service) + 1}
                figure="narrow-only"
                sizes="100vw"
              />
            ))}
          </div>
        </div>
      </div>
      <SectionTransition to="charcoal" flip />
    </section>
  );
}
