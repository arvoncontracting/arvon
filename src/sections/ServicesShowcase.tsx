import { content } from '../content';
import { Bidi } from '../components/Bidi';
import { Icon } from '../components/Icon';
import { Latin } from '../components/Latin';
import { SectionHeading } from '../components/SectionHeading';
import { serviceNumber } from '../components/ServiceDetail';

const { services } = content;

export function ServicesShowcase() {
  return (
    <section id="services" className="showcase" aria-labelledby="services-title">
      <div className="wrap">
        <SectionHeading id="services-title" eyebrow={services.eyebrow} title={services.title} body={services.body} />
        <ol className="showcase__list">
          {services.items.map((item) => (
            <li key={item.id} data-reveal>
              <a href={`#service-${item.id}`}>
                <Latin className="showcase__number">{serviceNumber(item)}</Latin>
                <span className="showcase__title"><Bidi text={item.title} /></span>
                <Icon name="arrow" size={18} />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
