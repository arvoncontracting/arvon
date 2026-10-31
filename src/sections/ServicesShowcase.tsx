import { useRef } from 'react';
import { content, type ServiceGroup } from '../content';
import { Icon } from '../components/Icon';
import { Latin } from '../components/Latin';
import { SectionHeading } from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';

const { services } = content;
const groupOrder: ServiceGroup[] = ['waterproofing', 'asphalt', 'concrete'];

export function ServicesShowcase() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="services" className="showcase" aria-labelledby="services-title">
      <div className="wrap">
        <SectionHeading id="services-title" eyebrow={services.eyebrow} title={services.title} body={services.body} />
        <div className="showcase__groups">
          {groupOrder.map((group) => (
            <div key={group} className={`showcase__group showcase__group--${group}`} data-reveal>
              <h3>{services.groups[group]}</h3>
              <ol>
                {services.items
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <li key={item.id}>
                      <a href={`#service-${item.id}`}>
                        <Latin className="showcase__number">
                          {String(services.items.indexOf(item) + 1).padStart(2, '0')}
                        </Latin>
                        <span>{item.title}</span>
                        <Icon name="arrow" size={18} />
                      </a>
                    </li>
                  ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
