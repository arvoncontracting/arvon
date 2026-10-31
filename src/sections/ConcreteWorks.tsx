import { content } from '../content';
import { SectionHeading } from '../components/SectionHeading';
import { SectionTransition } from '../components/SectionTransition';
import { ServiceRow } from '../components/ServiceRow';

const { concrete, services } = content;
const works = services.items.filter((item) => item.group === 'concrete');

export function ConcreteWorks() {
  return (
    <section id="concrete" className="concrete" aria-labelledby="concrete-title">
      <div className="wrap">
        <SectionHeading id="concrete-title" eyebrow={concrete.eyebrow} title={concrete.title} body={concrete.body} />
        {works.map((work) => (
          <ServiceRow key={work.id} service={work} />
        ))}
      </div>
      <SectionTransition to="charcoal" />
    </section>
  );
}
